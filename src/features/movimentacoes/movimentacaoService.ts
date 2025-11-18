import { api } from '../../lib/api'
import type { TipoMovimentacao } from '../../types/domain'

export interface RegistroMovimentoPayload {
  produtoId: number
  quantidade: number
  tipo: TipoMovimentacao
}

export async function registrarMovimentacao(payload: RegistroMovimentoPayload): Promise<any> {
  const params = { produtoId: payload.produtoId, quantidade: payload.quantidade, tipo: payload.tipo }
  const { data } = await api.post('/movimentacoes', null, { params })
  return data
}

export async function topMovimentacoes(): Promise<any> {
  const { data } = await api.get('/movimentacoes/top')
  return data
}