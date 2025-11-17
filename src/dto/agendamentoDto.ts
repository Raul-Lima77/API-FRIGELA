export interface AgendamentoCreateDto {
  idEndereco: string
  idTecnico: string
  idServico: string
  idCliente: string
  dataHora: Date
  observacoes?: string
}

export interface AgendamentoUpdateDto {
  dataHora?: Date
  statusAgendamento?: string
  observacoes?: string
}

export interface AgendamentoResponseDto {
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

export interface AgendamentoDetalhadoDto {
  id: string
  dataHora: Date
  statusAgendamento: string
  observacoes: string
  criadoEm: Date
  tecnico: {
    id: string
    nome: string
    telefone: string
    email: string
  }
  cliente: {
    id: string
    nome: string
    telefone: string
  }
  servico: {
    id: string
    nome: string
    descricao: string
    preco: number
    tempoEstimado: number
  }
  endereco: {
    id: string
    rua: string
    numero: string
    bairro: string
    cidade: string
    uf: string
    cep: string
    complemento?: string
  }
}
