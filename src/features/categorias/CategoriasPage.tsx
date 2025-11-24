import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarCategoria, listarCategorias } from './categoriaService'
import type { Categoria, Tamanho, Embalagem } from '../../types/domain'
import { useState } from 'react'

export function CategoriasPage() {
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: listarCategorias,
  })

  const [nome, setNome] = useState('')
  const [tamanho, setTamanho] = useState<Tamanho | ''>('')
  const [embalagem, setEmbalagem] = useState<Embalagem | ''>('')

  const criarMut = useMutation({
    mutationFn: () => criarCategoria({ nome, tamanho: tamanho as Tamanho, embalagem: embalagem as Embalagem }),
    onSuccess: () => {
      setNome('')
      qc.invalidateQueries({ queryKey: ['categorias'] })
    },
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Categorias</h2>
      {isLoading && <p>Carregando...</p>}
      {error && <p className="text-red-400">{String(error)}</p>}
      <div className="card">
        <ul className="space-y-2">
          {data?.map((c) => (
            <li key={c.id} className="flex items-center justify-between">
              <span className="font-medium">{c.nome}</span>
              <span className="text-sm text-gray-400">{c.tamanho} • {c.embalagem}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Criar categoria</h3>
        <div className="flex flex-wrap items-center gap-2">
          <input className="input" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <select className="select" value={tamanho} onChange={(e) => setTamanho(e.target.value as Tamanho)}>
            <option value="" disabled>Tamanho</option>
            <option value="PEQUENO">PEQUENO</option>
            <option value="MEDIO">MEDIO</option>
            <option value="GRANDE">GRANDE</option>
          </select>
          <select className="select" value={embalagem} onChange={(e) => setEmbalagem(e.target.value as Embalagem)}>
            <option value="" disabled>Material</option>
            <option value="PLASTICO">PLASTICO</option>
            <option value="LATA">LATA</option>
            <option value="VIDRO">VIDRO</option>
          </select>
          <button className="btn" onClick={() => criarMut.mutate()} disabled={criarMut.isPending || !nome || !tamanho || !embalagem}>Criar</button>
        </div>
        <div className="text-sm text-gray-400 mt-2">
          Preview: Tamanho {tamanho || '—'} • Material {embalagem || '—'}
        </div>
      </div>
    </div>
  )
}