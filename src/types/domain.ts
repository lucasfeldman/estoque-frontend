export type Tamanho = 'PEQUENO' | 'MEDIO' | 'GRANDE'
export type Embalagem = 'PLASTICO' | 'LATA' | 'PAPEL'

export interface Categoria {
  id: number
  nome: string
  tamanho: Tamanho
  embalagem: Embalagem
}

export interface Produto {
  id: number
  nome: string
  precoUnitario: number
  unidade: string
  quantidade: number
  quantidadeMinima: number
  quantidadeMaxima: number
  categoria: Categoria
}

export type TipoMovimentacao = 'ENTRADA' | 'SAIDA'