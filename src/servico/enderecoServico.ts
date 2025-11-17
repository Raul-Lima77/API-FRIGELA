import { EnderecoDao } from "../dao/enderecoDao"
import { ClienteDao } from "../dao/clienteDao"
import { Endereco } from "../modelo/endereco"
import type { EnderecoCreateDto, EnderecoUpdateDto, EnderecoResponseDto } from "../dto/enderecoDto"

export class EnderecoServico {
  private enderecoDao: EnderecoDao
  private clienteDao: ClienteDao

  constructor() {
    this.enderecoDao = new EnderecoDao()
    this.clienteDao = new ClienteDao()
  }

  async criarEndereco(dadosEndereco: EnderecoCreateDto): Promise<EnderecoResponseDto> {
    // Validações
    if (!dadosEndereco.idCliente || dadosEndereco.idCliente.trim().length === 0) {
      throw new Error("ID do cliente é obrigatório")
    }

    // Verificar se cliente existe
    const clienteExistente = await this.clienteDao.buscarPorId(dadosEndereco.idCliente)
    if (!clienteExistente) {
      throw new Error("Cliente não encontrado")
    }

    if (!dadosEndereco.rua || dadosEndereco.rua.trim().length === 0) {
      throw new Error("Rua é obrigatória")
    }

    if (!dadosEndereco.numero || dadosEndereco.numero.trim().length === 0) {
      throw new Error("Número é obrigatório")
    }

    if (!dadosEndereco.bairro || dadosEndereco.bairro.trim().length === 0) {
      throw new Error("Bairro é obrigatório")
    }

    if (!dadosEndereco.cidade || dadosEndereco.cidade.trim().length === 0) {
      throw new Error("Cidade é obrigatória")
    }

    if (!dadosEndereco.uf || dadosEndereco.uf.trim().length !== 2) {
      throw new Error("UF deve ter 2 caracteres")
    }

    if (!dadosEndereco.cep || dadosEndereco.cep.trim().length === 0) {
      throw new Error("CEP é obrigatório")
    }

    // Criar endereço usando o método build
    const endereco = Endereco.build(
      dadosEndereco.idCliente,
      dadosEndereco.rua,
      dadosEndereco.numero,
      dadosEndereco.bairro,
      dadosEndereco.cidade,
      dadosEndereco.uf,
      dadosEndereco.cep,
      dadosEndereco.complemento,
    )

    const id = await this.enderecoDao.criar(endereco)

    // Buscar endereço criado para retornar
    const enderecoCriado = await this.enderecoDao.buscarPorId(id)
    if (!enderecoCriado) {
      throw new Error("Erro ao criar endereço")
    }

    return this.converterParaDto(enderecoCriado)
  }

  async listarEnderecos(): Promise<EnderecoResponseDto[]> {
    const enderecos = await this.enderecoDao.buscarTodos()
    return enderecos.map((endereco) => this.converterParaDto(endereco))
  }

  async buscarEnderecoPorId(id: string): Promise<EnderecoResponseDto | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("ID inválido")
    }

    const endereco = await this.enderecoDao.buscarPorId(id)
    return endereco ? this.converterParaDto(endereco) : null
  }

  async buscarEnderecosPorCliente(idCliente: string): Promise<EnderecoResponseDto[]> {
    if (!idCliente || idCliente.trim().length === 0) {
      throw new Error("ID do cliente inválido")
    }

    const enderecos = await this.enderecoDao.buscarPorCliente(idCliente)
    return enderecos.map((endereco) => this.converterParaDto(endereco))
  }

  async atualizarEndereco(id: string, dadosAtualizacao: EnderecoUpdateDto): Promise<EnderecoResponseDto | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("ID inválido")
    }

    let endereco = await this.enderecoDao.buscarPorId(id)
    if (!endereco) {
      return null
    }

    // Validações e atualizações usando métodos imutáveis
    if (dadosAtualizacao.rua !== undefined) {
      if (dadosAtualizacao.rua.trim().length === 0) {
        throw new Error("Rua não pode ser vazia")
      }
      endereco = endereco.alterarRua(dadosAtualizacao.rua)
    }

    if (dadosAtualizacao.numero !== undefined) {
      if (dadosAtualizacao.numero.trim().length === 0) {
        throw new Error("Número não pode ser vazio")
      }
      endereco = endereco.alterarNumero(dadosAtualizacao.numero)
    }

    if (dadosAtualizacao.bairro !== undefined) {
      if (dadosAtualizacao.bairro.trim().length === 0) {
        throw new Error("Bairro não pode ser vazio")
      }
      endereco = endereco.alterarBairro(dadosAtualizacao.bairro)
    }

    if (dadosAtualizacao.cidade !== undefined) {
      if (dadosAtualizacao.cidade.trim().length === 0) {
        throw new Error("Cidade não pode ser vazia")
      }
      endereco = endereco.alterarCidade(dadosAtualizacao.cidade)
    }

    if (dadosAtualizacao.uf !== undefined) {
      if (dadosAtualizacao.uf.trim().length !== 2) {
        throw new Error("UF deve ter 2 caracteres")
      }
      endereco = endereco.alterarUf(dadosAtualizacao.uf)
    }

    if (dadosAtualizacao.cep !== undefined) {
      if (dadosAtualizacao.cep.trim().length === 0) {
        throw new Error("CEP não pode ser vazio")
      }
      endereco = endereco.alterarCep(dadosAtualizacao.cep)
    }

    if (dadosAtualizacao.complemento !== undefined) {
      endereco = endereco.alterarComplemento(dadosAtualizacao.complemento)
    }

    const atualizado = await this.enderecoDao.atualizar(endereco)
    if (!atualizado) {
      throw new Error("Erro ao atualizar endereço")
    }

    const enderecoAtualizado = await this.enderecoDao.buscarPorId(id)
    return enderecoAtualizado ? this.converterParaDto(enderecoAtualizado) : null
  }

  async deletarEndereco(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error("ID inválido")
    }

    const enderecoExistente = await this.enderecoDao.buscarPorId(id)
    if (!enderecoExistente) {
      return false
    }

    return await this.enderecoDao.deletar(id)
  }

  private converterParaDto(endereco: Endereco): EnderecoResponseDto {
    return {
      id: endereco.id,
      idCliente: endereco.idCliente,
      rua: endereco.rua,
      numero: endereco.numero,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      uf: endereco.uf,
      cep: endereco.cep,
      complemento: endereco.complemento ?? "",
    }
  }
}
