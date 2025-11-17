import { TecnicoDao } from "../dao/tecnicoDao"
import { Tecnico } from "../modelo/tecnico"
import type {
  TecnicoCreateDto,
  TecnicoUpdateDto,
  TecnicoResponseDto,
  TecnicoLoginDto,
  TecnicoLoginResponseDto,
} from "../dto/tecnicoDto"
import bcrypt from "bcryptjs"

export class TecnicoServico {
  private tecnicoDao: TecnicoDao

  constructor() {
    this.tecnicoDao = new TecnicoDao()
  }

  async criarTecnico(dadosTecnico: TecnicoCreateDto): Promise<TecnicoResponseDto> {
    // Validações
    if (!dadosTecnico.nome || dadosTecnico.nome.trim().length < 2) {
      throw new Error("Nome deve ter pelo menos 2 caracteres")
    }

    if (!dadosTecnico.telefone || dadosTecnico.telefone.trim().length < 10) {
      throw new Error("Telefone inválido")
    }

    if (!dadosTecnico.email || !this.validarEmail(dadosTecnico.email)) {
      throw new Error("Email inválido")
    }

    if (!dadosTecnico.senha || dadosTecnico.senha.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres")
    }

    // Verificar se email já existe
    const tecnicoExistente = await this.tecnicoDao.buscarPorEmail(dadosTecnico.email)
    if (tecnicoExistente) {
      throw new Error("Email já está em uso")
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(dadosTecnico.senha, 10)

    // Criar técnico usando o método build
    const tecnico = Tecnico.build(dadosTecnico.nome, dadosTecnico.telefone, dadosTecnico.email, senhaHash)
    const id = await this.tecnicoDao.criar(tecnico)

    // Buscar técnico criado para retornar
    const tecnicoCriado = await this.tecnicoDao.buscarPorId(id)
    if (!tecnicoCriado) {
      throw new Error("Erro ao criar técnico")
    }

    return this.converterParaDto(tecnicoCriado)
  }

  async login(dadosLogin: TecnicoLoginDto): Promise<TecnicoLoginResponseDto> {
    // Validações
    if (!dadosLogin.email || !this.validarEmail(dadosLogin.email)) {
      return {
        sucesso: false,
        mensagem: "Email inválido",
      }
    }

    if (!dadosLogin.senha) {
      return {
        sucesso: false,
        mensagem: "Senha é obrigatória",
      }
    }

    // Buscar técnico por email
    const tecnico = await this.tecnicoDao.buscarPorEmail(dadosLogin.email)
    if (!tecnico) {
      return {
        sucesso: false,
        mensagem: "Email ou senha incorretos",
      }
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(dadosLogin.senha, tecnico.senha)
    if (!senhaValida) {
      return {
        sucesso: false,
        mensagem: "Email ou senha incorretos",
      }
    }

    return {
      sucesso: true,
      mensagem: "Login realizado com sucesso",
      tecnico: this.converterParaDto(tecnico),
    }
  }

  async listarTecnicos(): Promise<TecnicoResponseDto[]> {
    const tecnicos = await this.tecnicoDao.buscarTodos()
    return tecnicos.map((tecnico) => this.converterParaDto(tecnico))
  }

  async buscarTecnicoPorId(id: string): Promise<TecnicoResponseDto | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("ID inválido")
    }

    const tecnico = await this.tecnicoDao.buscarPorId(id)
    return tecnico ? this.converterParaDto(tecnico) : null
  }

  async atualizarTecnico(id: string, dadosAtualizacao: TecnicoUpdateDto): Promise<TecnicoResponseDto | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("ID inválido")
    }

    let tecnico = await this.tecnicoDao.buscarPorId(id)
    if (!tecnico) {
      return null
    }

    // Validações e atualizações usando métodos imutáveis
    if (dadosAtualizacao.nome !== undefined) {
      if (dadosAtualizacao.nome.trim().length < 2) {
        throw new Error("Nome deve ter pelo menos 2 caracteres")
      }
      tecnico = tecnico.alterarNome(dadosAtualizacao.nome)
    }

    if (dadosAtualizacao.telefone !== undefined) {
      if (dadosAtualizacao.telefone.trim().length < 10) {
        throw new Error("Telefone inválido")
      }
      tecnico = tecnico.alterarTelefone(dadosAtualizacao.telefone)
    }

    if (dadosAtualizacao.email !== undefined) {
      if (!this.validarEmail(dadosAtualizacao.email)) {
        throw new Error("Email inválido")
      }

      // Verificar se o novo email já está em uso por outro técnico
      const tecnicoComEmail = await this.tecnicoDao.buscarPorEmail(dadosAtualizacao.email)
      if (tecnicoComEmail && tecnicoComEmail.id !== id) {
        throw new Error("Email já está em uso")
      }

      tecnico = tecnico.alterarEmail(dadosAtualizacao.email)
    }

    if (dadosAtualizacao.senha !== undefined) {
      if (dadosAtualizacao.senha.length < 6) {
        throw new Error("Senha deve ter pelo menos 6 caracteres")
      }
      const senhaHash = await bcrypt.hash(dadosAtualizacao.senha, 10)
      tecnico = tecnico.alterarSenha(senhaHash)
    }

    const atualizado = await this.tecnicoDao.atualizar(tecnico)
    if (!atualizado) {
      throw new Error("Erro ao atualizar técnico")
    }

    const tecnicoAtualizado = await this.tecnicoDao.buscarPorId(id)
    return tecnicoAtualizado ? this.converterParaDto(tecnicoAtualizado) : null
  }

  async deletarTecnico(id: string): Promise<boolean> {
    if (!id || id.trim().length === 0) {
      throw new Error("ID inválido")
    }

    const tecnicoExistente = await this.tecnicoDao.buscarPorId(id)
    if (!tecnicoExistente) {
      return false
    }

    return await this.tecnicoDao.deletar(id)
  }

  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  private converterParaDto(tecnico: Tecnico): TecnicoResponseDto {
    return {
      id: tecnico.id,
      nome: tecnico.nome,
      telefone: tecnico.telefone,
      email: tecnico.email,
      dataCadastro: tecnico.dataCadastro,
    }
  }
}
