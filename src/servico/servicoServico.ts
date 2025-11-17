import { ServicoDao } from "../dao/servicoDao"
import Servico from "../modelo/servico";
import type { ServicoCreateDto, ServicoUpdateDto, ServicoResponseDto } from "../dto/servicoDto";

export class ServicoServico {
  private servicoDao: ServicoDao;

  constructor() {
    this.servicoDao = new ServicoDao();
  }

  async criarServico(dados: ServicoCreateDto): Promise<ServicoResponseDto> {
    const servico = Servico.build(
      dados.idTecnico,
      dados.nome,
      dados.descricao,
      dados.preco,
      dados.tempoEstimado
    );

    const id = await this.servicoDao.criar(servico);

    const criado = await this.servicoDao.buscarPorId(id);
    if (!criado) throw new Error("Erro ao criar serviço.");

    return this.converterParaDto(criado);
  }

  async listarServicos(): Promise<ServicoResponseDto[]> {
    const lista = await this.servicoDao.buscarTodos();
    return lista.map(s => this.converterParaDto(s));
  }

  async buscarServicoPorId(id: string): Promise<ServicoResponseDto | null> {
    const servico = await this.servicoDao.buscarPorId(id);
    return servico ? this.converterParaDto(servico) : null;
  }

  async atualizarServico(id: string, dados: ServicoUpdateDto): Promise<ServicoResponseDto | null> {
    const servico = await this.servicoDao.buscarPorId(id);
    if (!servico) return null;

    let atualizado = servico;

    if (dados.nome) atualizado = atualizado.alterarNome(dados.nome);
    if (dados.descricao) atualizado = atualizado.alterarDescricao(dados.descricao);
    if (dados.preco) atualizado = atualizado.alterarPreco(dados.preco);
    if (dados.tempoEstimado) atualizado = atualizado.alterarTempoEstimado(dados.tempoEstimado);

    await this.servicoDao.atualizar(atualizado);

    return this.converterParaDto(atualizado);
  }

  async deletarServico(id: string): Promise<boolean> {
    return await this.servicoDao.deletar(id);
  }

  private converterParaDto(servico: Servico): ServicoResponseDto {
    return {
      id: servico.id,
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco,
      tempoEstimado: servico.tempoEstimado,
      dataCadastro: servico.dataCadastro,
      idTecnico: servico.idTecnico
    };
  }
}
