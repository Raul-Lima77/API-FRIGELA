import { ClienteDao } from "../dao/clienteDao"
import { Cliente } from "../modelo/cliente"
import type { ClienteCreateDto, ClienteUpdateDto, ClienteResponseDto } from "../dto/clienteDto"

export class ClienteServico {
  private clienteDao: ClienteDao

  constructor() {
    this.clienteDao = new ClienteDao()
  }

  async criarCliente(dadosCliente: ClienteCreateDto): Promise<ClienteResponseDto> {
    // Validações
    if (!dadosCliente.nome || dadosCliente.nome.trim().length < 2) {
      throw new Error("Nome deve ter pelo menos 2 caracteres")
    }

    if (!dadosCliente.telefone || dadosCliente.telefone.trim().length < 10) {
      throw new Error("Telefone inválido")
    }

    // Verificar se telefone já existe
    const clienteExistente = await this.clienteDao.buscarPorTelefone(dadosCliente.telefone)
    if (clienteExistente) {
      throw new Error("Telefone já está em uso")
    }

    // Criar cliente usando o método build
    const cliente = Cliente.build(dadosCliente.nome, dadosCliente.telefone)
    const id = await this.clienteDao.criar(cliente)

    // Buscar cliente criado para retornar
    const clienteCriado = await this.clienteDao.buscarPorId(id)
    if (!clienteCriado) {
      throw new Error("Erro ao criar cliente")
    }

    return this.converterParaDto(clienteCriado)
  }

  async listarClientes(): Promise<ClienteResponseDto[]> {
    const clientes = await this.clienteDao.buscarTodos()
    return clientes.map((cliente) => this.converterParaDto(cliente))
  }

  async buscarClientePorId(id: string): Promise<ClienteResponseDto | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("ID inválido")
    }

    const cliente = await this.clienteDao.buscarPorId(id)
    return cliente ? this.converterParaDto(cliente) : null
  }

  async buscarClientePorTelefone(telefone: string): Promise<ClienteResponseDto | null> {
    if (!telefone || telefone.trim().length === 0) {
      throw new Error("Telefone inválido")
    }

    const cliente = await this.clienteDao.buscarPorTelefone(telefone)
    return cliente ? this.converterParaDto(cliente) : null
  }

  async atualizarCliente(id: string, dadosAtualizacao: ClienteUpdateDto): Promise<ClienteResponseDto | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("ID inválido")
    }

    let cliente = await this.clienteDao.buscarPorId(id)
    if (!cliente) {
      return null
    }

    // Validações e atualizações usando métodos imutáveis
    if (dadosAtualizacao.nome !== undefined) {
      if (dadosAtualizacao.nome.trim().length < 2) {
        throw new Error("Nome deve ter pelo menos 2 caracteres")
      }
      cliente = cliente.alterarNome(dadosAtualizacao.nome)
    }

    if (dadosAtualizacao.telefone !== undefined) {
      if (dadosAtualizacao.telefone.trim().length < 10) {
        throw new Error("Telefone inválido")
      }

      // Verificar se o novo telefone já está em uso por outro cliente
      const clienteComTelefone = await this.clienteDao.buscarPorTelefone(dadosAtualizacao.telefone)
      if (clienteComTelefone && clienteComTelefone.id !== id) {
        throw new Error("Telefone já está em uso")
      }

      cliente = cliente.alterarTelefone(dadosAtualizacao.telefone)
    }

    const atualizado = await this.clienteDao.atualizar(cliente)
    if (!atualizado) {
      throw new Error("Erro ao atualizar cliente")
    }

    const clienteAtualizado = await this.clienteDao.buscarPorId(id)
    return clienteAtualizado ? this.converterParaDto(clienteAtualizado) : null
  }

  async deletarCliente(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error("ID inválido")
    }

    const clienteExistente = await this.clienteDao.buscarPorId(id)
    if (!clienteExistente) {
      return false
    }

    return await this.clienteDao.deletar(id)
  }

  private converterParaDto(cliente: Cliente): ClienteResponseDto {
    return {
      id: cliente.id,
      nome: cliente.nome,
      telefone: cliente.telefone,
      dataCadastro: cliente.dataCadastro,
    }
  }
}