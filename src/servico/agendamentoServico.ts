import { AgendamentoDao } from "../dao/agendamentoDao"
import { TecnicoDao } from "../dao/tecnicoDao"
import { ClienteDao } from "../dao/clienteDao"
import { ServicoDao } from "../dao/servicoDao"
import { EnderecoDao } from "../dao/enderecoDao"
import { Agendamento } from "../modelo/agendamento"
import type {
  AgendamentoCreateDto,
  AgendamentoUpdateDto,
  AgendamentoResponseDto,
  AgendamentoDetalhadoDto,
} from "../dto/agendamentoDto"

export class AgendamentoServico {
  private agendamentoDao: AgendamentoDao
  private tecnicoDao: TecnicoDao
  private clienteDao: ClienteDao
  private servicoDao: ServicoDao
  private enderecoDao: EnderecoDao

  constructor() {
    this.agendamentoDao = new AgendamentoDao()
    this.tecnicoDao = new TecnicoDao()
    this.clienteDao = new ClienteDao()
    this.servicoDao = new ServicoDao()
    this.enderecoDao = new EnderecoDao()
  }

  async cadastrar(dto: AgendamentoCreateDto): Promise<AgendamentoResponseDto> {
    // Validar se técnico existe
    const tecnico = await this.tecnicoDao.buscarPorId(dto.idTecnico)
    if (!tecnico) {
      throw new Error("Técnico não encontrado")
    }

    // Validar se cliente existe
    const cliente = await this.clienteDao.buscarPorId(dto.idCliente)
    if (!cliente) {
      throw new Error("Cliente não encontrado")
    }

    // Validar se serviço existe
    const servico = await this.servicoDao.buscarPorId(dto.idServico)
    if (!servico) {
      throw new Error("Serviço não encontrado")
    }

    // Validar se endereço existe e pertence ao cliente
    const endereco = await this.enderecoDao.buscarPorId(dto.idEndereco)
    if (!endereco) {
      throw new Error("Endereço não encontrado")
    }
    if (endereco.idCliente !== dto.idCliente) {
      throw new Error("Endereço não pertence ao cliente informado")
    }

    // Validar se a data é futura
    const dataAgendamento = new Date(dto.dataHora)
    if (dataAgendamento <= new Date()) {
      throw new Error("Data do agendamento deve ser no futuro")
    }

    // Verificar conflito de horário
    const conflito = await this.agendamentoDao.verificarConflitoHorario(dto.idTecnico, dataAgendamento)
    if (conflito) {
      throw new Error("Técnico já possui agendamento neste horário")
    }

    const agendamento = Agendamento.build(
      dto.idEndereco,
      dto.idTecnico,
      dto.idServico,
      dto.idCliente,
      dataAgendamento,
      dto.observacoes || "",
    )

    await this.agendamentoDao.criar(agendamento)
    return this.converterParaDto(agendamento)
  }

  async listarTodos(): Promise<AgendamentoResponseDto[]> {
    const agendamentos = await this.agendamentoDao.buscarTodos()
    return agendamentos.map((agendamento) => this.converterParaDto(agendamento))
  }

  async buscarPorId(id: string): Promise<AgendamentoResponseDto | null> {
    const agendamento = await this.agendamentoDao.buscarPorId(id)
    if (!agendamento) {
      return null
    }
    return this.converterParaDto(agendamento)
  }

  async buscarDetalhado(id: string): Promise<AgendamentoDetalhadoDto | null> {
    const linha = await this.agendamentoDao.buscarDetalhado(id)
    if (!linha) {
      return null
    }

    return {
      id: linha.id_agendamento,
      dataHora: new Date(linha.data_hora),
      statusAgendamento: linha.status_agendamento,
      observacoes: linha.observacoes,
      criadoEm: new Date(linha.criado_em),
      tecnico: {
        id: linha.id_tecnico,
        nome: linha.tecnico_nome,
        telefone: linha.tecnico_telefone,
        email: linha.tecnico_email,
      },
      cliente: {
        id: linha.id_cliente,
        nome: linha.cliente_nome,
        telefone: linha.cliente_telefone,
      },
      servico: {
        id: linha.id_servico,
        nome: linha.servico_nome,
        descricao: linha.servico_descricao,
        preco: linha.servico_preco,
        tempoEstimado: linha.servico_tempo,
      },
      endereco: {
        id: linha.id_endereco,
        rua: linha.rua,
        numero: linha.numero,
        bairro: linha.bairro,
        cidade: linha.cidade,
        uf: linha.uf,
        cep: linha.cep,
        complemento: linha.complemento,
      },
    }
  }

  async buscarPorTecnico(idTecnico: string): Promise<AgendamentoResponseDto[]> {
    const agendamentos = await this.agendamentoDao.buscarPorTecnico(idTecnico)
    return agendamentos.map((agendamento) => this.converterParaDto(agendamento))
  }

  async buscarPorCliente(idCliente: string): Promise<AgendamentoResponseDto[]> {
    const agendamentos = await this.agendamentoDao.buscarPorCliente(idCliente)
    return agendamentos.map((agendamento) => this.converterParaDto(agendamento))
  }

  async atualizar(id: string, dto: AgendamentoUpdateDto): Promise<AgendamentoResponseDto | null> {
    const agendamentoExistente = await this.agendamentoDao.buscarPorId(id)
    if (!agendamentoExistente) {
      return null
    }

    let agendamentoAtualizado = agendamentoExistente

    if (dto.dataHora) {
      const novaDataHora = new Date(dto.dataHora)
      if (novaDataHora <= new Date()) {
        throw new Error("Data do agendamento deve ser no futuro")
      }

      // Verificar conflito de horário ao atualizar
      const conflito = await this.agendamentoDao.verificarConflitoHorario(
        agendamentoExistente.idTecnico,
        novaDataHora,
        id,
      )
      if (conflito) {
        throw new Error("Técnico já possui agendamento neste horário")
      }

      agendamentoAtualizado = agendamentoAtualizado.alterarDataHora(novaDataHora)
    }

    if (dto.statusAgendamento) {
      const statusValidos = ["agendado", "confirmado", "em_andamento", "concluido", "cancelado"]
      if (!statusValidos.includes(dto.statusAgendamento)) {
        throw new Error("Status inválido")
      }
      agendamentoAtualizado = agendamentoAtualizado.alterarStatus(dto.statusAgendamento)
    }

    if (dto.observacoes !== undefined) {
      agendamentoAtualizado = agendamentoAtualizado.alterarObservacoes(dto.observacoes)
    }

    await this.agendamentoDao.atualizar(agendamentoAtualizado)
    return this.converterParaDto(agendamentoAtualizado)
  }

  async deletar(id: string): Promise<boolean> {
    return await this.agendamentoDao.deletar(id)
  }

  private converterParaDto(agendamento: Agendamento): AgendamentoResponseDto {
    return {
      id: agendamento.id,
      idEndereco: agendamento.idEndereco,
      idTecnico: agendamento.idTecnico,
      idServico: agendamento.idServico,
      idCliente: agendamento.idCliente,
      dataHora: agendamento.dataHora,
      statusAgendamento: agendamento.statusAgendamento,
      observacoes: agendamento.observacoes,
      criadoEm: agendamento.criadoEm,
    }
  }
}
