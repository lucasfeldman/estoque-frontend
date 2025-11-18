import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listarProdutos, reajustarPrecos, criarProduto } from './produtoService'
import type { Produto, Categoria } from '../../types/domain'
import { Link } from 'react-router-dom'
import { listarCategorias } from '../categorias/categoriaService'

export function ProdutosPage() {
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery<Produto[]>({
    queryKey: ['produtos'],
    queryFn: listarProdutos,
  })

  const qCategorias = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: listarCategorias,
  })

  const [openModal, setOpenModal] = React.useState(false)
  const [nome, setNome] = React.useState('')
  const [precoUnitario, setPrecoUnitario] = React.useState<number>(0)
  const [unidade, setUnidade] = React.useState('UN')
  const [quantidade, setQuantidade] = React.useState<number>(0)
  const [quantidadeMinima, setQuantidadeMinima] = React.useState<number>(0)
  const [quantidadeMaxima, setQuantidadeMaxima] = React.useState<number>(0)
  const [categoriaId, setCategoriaId] = React.useState<number | null>(null)

  const reajusteMut = useMutation({
    mutationFn: () => reajustarPrecos(10),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['produtos'] }),
  })

  const criarMut = useMutation({
    mutationFn: async () => {
      const categoria = qCategorias.data?.find((c) => c.id === categoriaId)
      if (!categoria) throw new Error('Selecione uma categoria')
      const payload = {
        nome,
        precoUnitario,
        unidade,
        quantidade,
        quantidadeMinima,
        quantidadeMaxima,
        categoria,
      }
      return criarProduto(payload)
    },
    onSuccess: () => {
      setOpenModal(false)
      setNome('')
      setPrecoUnitario(0)
      setUnidade('UN')
      setQuantidade(0)
      setQuantidadeMinima(0)
      setQuantidadeMaxima(0)
      setCategoriaId(null)
      qc.invalidateQueries({ queryKey: ['produtos'] })
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Produtos</h2>
        <div className="flex gap-2">
          <button className="btn" onClick={() => setOpenModal(true)}>Criar produto</button>
          <button className="btn" onClick={() => reajusteMut.mutate()} disabled={reajusteMut.isPending}>Reajustar 10%</button>
        </div>
      </div>
      {isLoading && <p>Carregando...</p>}
      {error && <p className="text-red-400">{String(error)}</p>}
      <div className="card">
        <ul className="space-y-3">
          {data?.map((p) => (
            <li key={p.id} className="flex items-center justify-between">
              <div>
                <span className="font-medium">{p.nome}</span>
                <span className="ml-2 text-sm text-gray-400">R$ {p.precoUnitario.toFixed(2)} • Qtde: {p.quantidade}</span>
              </div>
              <Link className="nav-link" to={`/produtos/${p.id}`}>Ver detalhe</Link>
            </li>
          ))}
        </ul>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="card w-full max-w-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Criar produto</h3>
              <button className="nav-link" onClick={() => setOpenModal(false)}>Fechar</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input className="input w-full" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Preço unitário</label>
                <input className="input w-full" type="number" step="0.01" value={precoUnitario} onChange={(e) => setPrecoUnitario(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Unidade</label>
                <input className="input w-full" value={unidade} onChange={(e) => setUnidade(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">Quantidade</label>
                <input className="input w-full" type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Quantidade mínima</label>
                <input className="input w-full" type="number" value={quantidadeMinima} onChange={(e) => setQuantidadeMinima(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Quantidade máxima</label>
                <input className="input w-full" type="number" value={quantidadeMaxima} onChange={(e) => setQuantidadeMaxima(Number(e.target.value))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Categoria</label>
                <select className="select w-full" value={categoriaId ?? ''} onChange={(e) => setCategoriaId(Number(e.target.value))}>
                  <option value="" disabled>Selecione...</option>
                  {qCategorias.data?.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
                {qCategorias.isLoading && <p className="text-sm text-gray-400 mt-1">Carregando categorias...</p>}
                {qCategorias.error && <p className="text-sm text-red-400 mt-1">{String(qCategorias.error)}</p>}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn" onClick={() => setOpenModal(false)}>Cancelar</button>
              <button
                className="btn"
                onClick={() => criarMut.mutate()}
                disabled={criarMut.isPending || !nome || !categoriaId}
              >
                {criarMut.isPending ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
            {criarMut.error && <p className="text-red-400 mt-2">{String(criarMut.error)}</p>}
          </div>
        </div>
      )}
    </div>
  )
}