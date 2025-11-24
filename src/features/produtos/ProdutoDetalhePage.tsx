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
    onError: () => {},
  })

  if (!Number.isFinite(produtoId)) return <p className="text-red-400">ID inválido</p>
  if (isLoading) return <p>Carregando...</p>
  if (error) return <p className="text-red-400">{String(error)}</p>
  if (!data) return <p>Não encontrado</p>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Produto: {data.nome}
        <span className="ml-3 align-middle inline-flex items-center px-2 py-0.5 text-xs rounded-md border border-slate-600/50 text-gray-300 bg-slate-900/40">ID #{data.id}</span>
      </h2>
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
          <button
            className="btn bg-red-600 hover:bg-red-500 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => excluirMut.mutate()}
            disabled={excluirMut.isPending || (data.quantidade ?? 0) > 0}
            title={(data.quantidade ?? 0) > 0 ? 'Não é possível excluir um produto com movimentações/estoque > 0' : ''}
          >
            Excluir
          </button>
        </div>
        {excluirMut.error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-500/40 rounded p-2">
            {String(excluirMut.error)}
          </p>
        )}
      </div>
    </div>
  )
}
