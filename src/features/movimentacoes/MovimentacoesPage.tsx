import { useMutation, useQuery } from '@tanstack/react-query'
import { registrarMovimentacao, topMovimentacoes } from './movimentacaoService'
import type { TipoMovimentacao } from '../../types/domain'
import { useState } from 'react'

export function MovimentacoesPage() {
  const [produtoId, setProdutoId] = useState<number>(0)
  const [quantidade, setQuantidade] = useState<number>(0)
  const [tipo, setTipo] = useState<TipoMovimentacao>('ENTRADA')

  const { data: top } = useQuery({ queryKey: ['top-mov'], queryFn: topMovimentacoes })

  const registrarMut = useMutation({
    mutationFn: () => registrarMovimentacao({ produtoId, quantidade, tipo }),
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Movimentações</h2>
      <div className="flex flex-wrap items-center gap-2">
        <input className="input" type="number" placeholder="produtoId" value={produtoId} onChange={(e) => setProdutoId(Number(e.target.value))} />
        <input className="input" type="number" placeholder="quantidade" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
        <select className="select" value={tipo} onChange={(e) => setTipo(e.target.value as TipoMovimentacao)}>
          <option value="ENTRADA">ENTRADA</option>
          <option value="SAIDA">SAIDA</option>
        </select>
        <button className="btn" onClick={() => registrarMut.mutate()} disabled={registrarMut.isPending}>Registrar</button>
      </div>
      {registrarMut.isSuccess && (
        <pre className="card overflow-auto">Resposta: {JSON.stringify(registrarMut.data, null, 2)}</pre>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Top entradas/saídas</h3>
        <pre className="card overflow-auto">{JSON.stringify(top, null, 2)}</pre>
      </div>
    </div>
  )
}