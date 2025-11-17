export interface ClienteCreateDto {
  nome: string
  telefone: string
}

export interface ClienteUpdateDto {
  nome?: string
  telefone?: string
}

export interface ClienteResponseDto {
  id: string
  nome: string
  telefone: string
  dataCadastro: Date
}
