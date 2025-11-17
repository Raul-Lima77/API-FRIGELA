import { randomUUID } from "crypto"

export type TecnicoProps = {
  id: string
  nome: string
  telefone: string
  email: string
  senha: string
  dataCadastro: Date
}

export class Tecnico {
  private constructor(readonly props: TecnicoProps) {}

  public static build(nome: string, telefone: string, email: string, senha: string) {
    const props: TecnicoProps = {
      id: randomUUID(),
      nome,
      telefone,
      email,
      senha,
      dataCadastro: new Date(),
    }

    return new Tecnico(props)
  }

  public static construir(
    id: string,
    nome: string,
    telefone: string,
    email: string,
    senha: string,
    dataCadastro: Date,
  ) {
    const props: TecnicoProps = {
      id,
      nome,
      telefone,
      email,
      senha,
      dataCadastro,
    }

    return new Tecnico(props)
  }

  public alterarNome(novoNome: string): Tecnico {
    const novasProps: TecnicoProps = {
      ...this.props,
      nome: novoNome,
    }
    return new Tecnico(novasProps)
  }

  public alterarTelefone(novoTelefone: string): Tecnico {
    const novasProps: TecnicoProps = {
      ...this.props,
      telefone: novoTelefone,
    }
    return new Tecnico(novasProps)
  }

  public alterarEmail(novoEmail: string): Tecnico {
    const novasProps: TecnicoProps = {
      ...this.props,
      email: novoEmail,
    }
    return new Tecnico(novasProps)
  }

  public alterarSenha(novaSenha: string): Tecnico {
    const novasProps: TecnicoProps = {
      ...this.props,
      senha: novaSenha,
    }
    return new Tecnico(novasProps)
  }

  public get id() {
    return this.props.id
  }

  public get nome() {
    return this.props.nome
  }

  public get telefone() {
    return this.props.telefone
  }

  public get email() {
    return this.props.email
  }

  public get senha() {
    return this.props.senha
  }

  public get dataCadastro() {
    return this.props.dataCadastro
  }
}
