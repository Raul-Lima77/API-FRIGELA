export interface ServicoCreateDto {
  nome: string
  descricao: string
  preco: number
  tempoEstimado: number
  idTecnico: string
}

export interface ServicoUpdateDto {
  nome?: string
  descricao?: string
  preco?: number
  tempoEstimado?: number
  idTecnico?: string
}

export interface ServicoResponseDto {
  id: string
  nome: string
  descricao: string
  preco: number
  tempoEstimado: number
  dataCadastro: Date
  idTecnico: string
}