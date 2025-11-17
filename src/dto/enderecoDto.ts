export interface EnderecoCreateDto {
  idCliente: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  complemento?: string
}

export interface EnderecoUpdateDto {
  rua?: string
  numero?: string
  bairro?: string
  cidade?: string
  uf?: string
  cep?: string
  complemento?: string
}

export interface EnderecoResponseDto {
  id: string
  idCliente: string
  rua: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  complemento?: string
}
