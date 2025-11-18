import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { buscarProduto, atualizarProduto, excluirProduto } from './produtoService'
import type { Produto } from '../../types/domain'
import { useState, useEffect } from 'react'

export function ProdutoDetalhePage() {
  const { id } = useParams()
  const produtoId = Number(id)
  const qc = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery<Produto>({
    queryKey: ['produto', produtoId],
    queryFn: () => buscarProduto(produtoId),
    enabled: Number.isFinite(produtoId),
  })

  const [nome, setNome] = useState('')

  useEffect(() => {
    if (data) setNome(data.nome)
  }, [data])

  const salvarMut = useMutation({
    mutationFn: () => atualizarProduto(produtoId, { ...data!, nome }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['produto', produtoId] }),
  })

  const excluirMut = useMutation({
    mutationFn: () => excluirProduto(produtoId),
    onSuccess: () => navigate('/produtos'),
  })

  if (!Number.isFinite(produtoId)) return <p className="text-red-400">ID inválido</p>
  if (isLoading) return <p>Carregando...</p>
  if (error) return <p className="text-red-400">{String(error)}</p>
  if (!data) return <p>Não encontrado</p>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Produto: {data.nome}</h2>
      <div className="card space-y-1">
        <p>Preço: R$ {data.precoUnitario.toFixed(2)}</p>
        <p>Unidade: {data.unidade}</p>
        <p>Quantidade: {data.quantidade}</p>
        <p>Categoria: {data.categoria?.nome}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Editar</h3>
        <div className="flex items-center gap-2">
          <input className="input" value={nome} onChange={(e) => setNome(e.target.value)} />
          <button className="btn" onClick={() => salvarMut.mutate()} disabled={salvarMut.isPending}>Salvar</button>
          <button className="btn bg-red-600 hover:bg-red-500 focus:ring-red-400" onClick={() => excluirMut.mutate()} disabled={excluirMut.isPending}>Excluir</button>
        </div>
      </div>
    </div>
  )
}