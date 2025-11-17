import { randomUUID } from "crypto"

export type AgendamentoProps = {
  id: string
  idEndereco: string
  idTecnico: string
  idServico: string
  idCliente: string
  dataHora: Date
  statusAgendamento: string
  observacoes: string
  criadoEm: Date
}

export class Agendamento {
  private constructor(readonly props: AgendamentoProps) {}

  public static build(
    idEndereco: string,
    idTecnico: string,
    idServico: string,
    idCliente: string,
    dataHora: Date,
    observacoes: string = "",
  ) {
    const props: AgendamentoProps = {
      id: randomUUID(),
      idEndereco,
      idTecnico,
      idServico,
      idCliente,
      dataHora,
      statusAgendamento: "agendado",
      observacoes,
      criadoEm: new Date(),
    }

    return new Agendamento(props)
  }

  public static construir(
    id: string,
    idEndereco: string,
    idTecnico: string,
    idServico: string,
    idCliente: string,
    dataHora: Date,
    statusAgendamento: string,
    observacoes: string,
    criadoEm: Date,
  ) {
    const props: AgendamentoProps = {
      id,
      idEndereco,
      idTecnico,
      idServico,
      idCliente,
      dataHora,
      statusAgendamento,
      observacoes,
      criadoEm,
    }

    return new Agendamento(props)
  }

  public alterarDataHora(novaDataHora: Date): Agendamento {
    const novasProps: AgendamentoProps = {
      ...this.props,
      dataHora: novaDataHora,
    }
    return new Agendamento(novasProps)
  }

  public alterarStatus(novoStatus: string): Agendamento {
    const novasProps: AgendamentoProps = {
      ...this.props,
      statusAgendamento: novoStatus,
    }
    return new Agendamento(novasProps)
  }

  public alterarObservacoes(novasObservacoes: string): Agendamento {
    const novasProps: AgendamentoProps = {
      ...this.props,
      observacoes: novasObservacoes,
    }
    return new Agendamento(novasProps)
  }

  public get id() {
    return this.props.id
  }

  public get idEndereco() {
    return this.props.idEndereco
  }

  public get idTecnico() {
    return this.props.idTecnico
  }

  public get idServico() {
    return this.props.idServico
  }

  public get idCliente() {
    return this.props.idCliente
  }

  public get dataHora() {
    return this.props.dataHora
  }

  public get statusAgendamento() {
    return this.props.statusAgendamento
  }

  public get observacoes() {
    return this.props.observacoes
  }

  public get criadoEm() {
    return this.props.criadoEm
  }
}
