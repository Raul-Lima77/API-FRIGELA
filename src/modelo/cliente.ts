import { randomUUID } from "crypto"

export type ClienteProps = {
  id: string
  nome: string
  telefone: string
  dataCadastro: Date
}

export class Cliente {
  private constructor(readonly props: ClienteProps) {}

  public static build(nome: string, telefone: string) {
    const props: ClienteProps = {
      id: randomUUID(),
      nome,
      telefone,
      dataCadastro: new Date(),
    }

    return new Cliente(props)
  }

  public static construir(id: string, nome: string, telefone: string, dataCadastro: Date) {
    const props: ClienteProps = {
      id,
      nome,
      telefone,
      dataCadastro,
    }

    return new Cliente(props)
  }

  public alterarNome(novoNome: string): Cliente {
    const novasProps: ClienteProps = {
      ...this.props,
      nome: novoNome,
    }
    return new Cliente(novasProps)
  }

  public alterarTelefone(novoTelefone: string): Cliente {
    const novasProps: ClienteProps = {
      ...this.props,
      telefone: novoTelefone,
    }
    return new Cliente(novasProps)
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

  public get dataCadastro() {
    return this.props.dataCadastro
  }
}