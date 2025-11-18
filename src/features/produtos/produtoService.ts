import { api } from '../../lib/api'
import type { Produto } from '../../types/domain'

export async function listarProdutos(): Promise<Produto[]> {
  const { data } = await api.get('/produtos')
  return data
}

export async function buscarProduto(id: number): Promise<Produto> {
  const { data } = await api.get(`/produtos/${id}`)
  return data
}

export async function criarProduto(payload: Omit<Produto, 'id'>): Promise<Produto> {
  const { data } = await api.post('/produtos', payload)
  return data
}

export async function atualizarProduto(id: number, payload: Omit<Produto, 'id'>): Promise<Produto> {
  const { data } = await api.put(`/produtos/${id}`, payload)
  return data
}

export async function excluirProduto(id: number): Promise<void> {
  await api.delete(`/produtos/${id}`)
}

export async function reajustarPrecos(percentual: number): Promise<void> {
  await api.post(`/produtos/reajustar-precos`, null, { params: { percentual } })
}