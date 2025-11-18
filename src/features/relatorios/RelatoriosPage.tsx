import { useQuery } from '@tanstack/react-query'
import { listaPrecos, balanco, abaixoMinimo, porCategoria } from './relatorioService'
import { useState } from 'react'

type Aba = 'lista-precos' | 'balanco' | 'abaixo-minimo' | 'por-categoria'

export function RelatoriosPage() {
  const [aba, setAba] = useState<Aba>('lista-precos')

  const qLista = useQuery({ queryKey: ['relatorios', 'lista-precos'], queryFn: listaPrecos, enabled: aba === 'lista-precos' })
  const qBalanco = useQuery({ queryKey: ['relatorios', 'balanco'], queryFn: balanco, enabled: aba === 'balanco' })
  const qMinimo = useQuery({ queryKey: ['relatorios', 'abaixo-minimo'], queryFn: abaixoMinimo, enabled: aba === 'abaixo-minimo' })
  const qCategoria = useQuery({ queryKey: ['relatorios', 'por-categoria'], queryFn: porCategoria, enabled: aba === 'por-categoria' })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Relatórios</h2>
      <div className="flex flex-wrap gap-2">
        <button className="btn" onClick={() => setAba('lista-precos')}>Lista de preços</button>
        <button className="btn" onClick={() => setAba('balanco')}>Balanço</button>
        <button className="btn" onClick={() => setAba('abaixo-minimo')}>Abaixo do mínimo</button>
        <button className="btn" onClick={() => setAba('por-categoria')}>Por categoria</button>
      </div>

      {aba === 'lista-precos' && <pre className="card overflow-auto">{JSON.stringify(qLista.data, null, 2)}</pre>}
      {aba === 'balanco' && <pre className="card overflow-auto">{JSON.stringify(qBalanco.data, null, 2)}</pre>}
      {aba === 'abaixo-minimo' && <pre className="card overflow-auto">{JSON.stringify(qMinimo.data, null, 2)}</pre>}
      {aba === 'por-categoria' && <pre className="card overflow-auto">{JSON.stringify(qCategoria.data, null, 2)}</pre>}
    </div>
  )
}