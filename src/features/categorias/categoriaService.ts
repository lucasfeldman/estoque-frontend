import { api } from '../../lib/api'
import type { Categoria } from '../../types/domain'

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/categorias')
  return data
}

export async function criarCategoria(payload: Omit<Categoria, 'id'>): Promise<Categoria> {
  const { data } = await api.post('/categorias', payload)
  return data
}

export async function atualizarCategoria(id: number, payload: Omit<Categoria, 'id'>): Promise<Categoria> {
  const { data } = await api.put(`/categorias/${id}`, payload)
  return data
}

export async function excluirCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`)
}