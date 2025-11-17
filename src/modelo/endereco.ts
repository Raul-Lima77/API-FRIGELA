import { randomUUID } from "crypto"

export type EnderecoProps = {
  id: string
  idCliente: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  complemento?: string | undefined
}

export class Endereco {
  private constructor(readonly props: EnderecoProps) {}

  public static build(
    idCliente: string,
    rua: string,
    numero: string,
    bairro: string,
    cidade: string,
    uf: string,
    cep: string,
    complemento?: string,
  ) {
    const props: EnderecoProps = {
      id: randomUUID(),
      idCliente,
      rua,
      numero,
      bairro,
      cidade,
      uf,
      cep,
      complemento,
    }

    return new Endereco(props)
  }

  public static construir(
    id: string,
    idCliente: string,
    rua: string,
    numero: string,
    bairro: string,
    cidade: string,
    uf: string,
    cep: string,
    complemento?: string,
  ) {
    const props: EnderecoProps = {
      id,
      idCliente,
      rua,
      numero,
      bairro,
      cidade,
      uf,
      cep,
      complemento,
    }

    return new Endereco(props)
  }

  public alterarRua(novaRua: string): Endereco {
    const novasProps: EnderecoProps = {
      ...this.props,
      rua: novaRua,
    }
    return new Endereco(novasProps)
  }

  public alterarNumero(novoNumero: string): Endereco {
    const novasProps: EnderecoProps = {
      ...this.props,
      numero: novoNumero,
    }
    return new Endereco(novasProps)
  }

  public alterarBairro(novoBairro: string): Endereco {
    const novasProps: EnderecoProps = {
      ...this.props,
      bairro: novoBairro,
    }
    return new Endereco(novasProps)
  }

  public alterarCidade(novaCidade: string): Endereco {
    const novasProps: EnderecoProps = {
      ...this.props,
      cidade: novaCidade,
    }
    return new Endereco(novasProps)
  }

  public alterarUf(novaUf: string): Endereco {
    const novasProps: EnderecoProps = {
      ...this.props,
      uf: novaUf,
    }
    return new Endereco(novasProps)
  }

  public alterarCep(novoCep: string): Endereco {
    const novasProps: EnderecoProps = {
      ...this.props,
      cep: novoCep,
    }
    return new Endereco(novasProps)
  }

  public alterarComplemento(novoComplemento?: string): Endereco {
    const novasProps: EnderecoProps = {
      ...this.props,
      complemento: novoComplemento,
    }
    return new Endereco(novasProps)
  }

  public get id() {
    return this.props.id
  }

  public get idCliente() {
    return this.props.idCliente
  }

  public get rua() {
    return this.props.rua
  }

  public get numero() {
    return this.props.numero
  }

  public get bairro() {
    return this.props.bairro
  }

  public get cidade() {
    return this.props.cidade
  }

  public get uf() {
    return this.props.uf
  }

  public get cep() {
    return this.props.cep
  }

  public get complemento() {
    return this.props.complemento
  }
}
