export interface TecnicoCreateDto {
  nome: string
  telefone: string
  email: string
  senha: string
}

export interface TecnicoUpdateDto {
  nome?: string
  telefone?: string
  email?: string
  senha?: string
}

export interface TecnicoResponseDto {
  id: string
  nome: string
  telefone: string
  email: string
  dataCadastro: Date
}

export interface TecnicoLoginDto {
  email: string
  senha: string
}

export interface TecnicoLoginResponseDto {
  sucesso: boolean
  mensagem: string
  tecnico?: TecnicoResponseDto
}
