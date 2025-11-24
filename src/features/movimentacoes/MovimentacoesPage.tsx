import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  registrarMovimentacao as registrarMovimentacaoApi,
  topMovimentacoes as topMovimentacoesApi,
} from "./movimentacaoService";

type MovimentoListItem = {
  produtoId: number;
  quantidade: number;
  tipo: TipoMovimentacao;
  dataHora: string;
};

type TipoMovimentacao = "ENTRADA" | "SAIDA";

export function MovimentacoesPage() {
  const [produtoId, setProdutoId] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [tipo, setTipo] = useState<TipoMovimentacao>("ENTRADA");
  const [recentes, setRecentes] = useState<MovimentoListItem[]>([]);

  const { data: top, isLoading: topLoading } = useQuery({
    queryKey: ["top-mov"],
    queryFn: topMovimentacoesApi,
  });

  const registrarMut = useMutation({
    mutationFn: () => registrarMovimentacaoApi({ produtoId, quantidade, tipo }),
    onSuccess: () => {
      setProdutoId(0);
      setQuantidade(0);
      const item: MovimentoListItem = {
        produtoId,
        quantidade,
        tipo,
        dataHora: new Date().toISOString(),
      };
      setRecentes((prev) => [item, ...prev].slice(0, 10));
    },
  });

  const handleSubmit = () => {
    if (produtoId > 0 && quantidade > 0) {
      registrarMut.mutate();
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Movimentações</h2>
      </div>

      {/* Card de Registro */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Registrar Movimentação
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Produto ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                ID do Produto <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="number"
                min="1"
                placeholder="Digite o ID"
                value={produtoId || ""}
                onChange={(e) => setProdutoId(Number(e.target.value))}
              />
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                Quantidade <span className="text-red-400">*</span>
              </label>
              <input
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="number"
                min="1"
                placeholder="Digite a quantidade"
                value={quantidade || ""}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                Tipo de Movimentação
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoMovimentacao)}
              >
                <option value="ENTRADA" className="bg-slate-800">
                  Entrada
                </option>
                <option value="SAIDA" className="bg-slate-800">
                  Saída
                </option>
              </select>
            </div>
          </div>

          {/* Botão */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={
                registrarMut.isPending || produtoId <= 0 || quantidade <= 0
              }
            >
              {registrarMut.isPending
                ? "Registrando..."
                : "Registrar Movimentação"}
            </button>
          </div>

          {/* Mensagem de Sucesso */}
          {registrarMut.isSuccess && (
            <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-lg p-4">
              <p className="text-emerald-400 font-medium">
                ✓ Movimentação registrada com sucesso!
              </p>
            </div>
          )}

          {/* Mensagem de Erro */}
          {registrarMut.error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400">{String(registrarMut.error)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Entradas/Saídas */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Top Entradas/Saídas
        </h3>

        {topLoading && (
          <p className="text-gray-400">Carregando estatísticas...</p>
        )}

        {!topLoading && top && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Entrada */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/50 backdrop-blur-sm rounded-xl border border-emerald-700/50 p-6 hover:border-emerald-600/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-600/20 rounded-lg">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-emerald-400">
                  Top Entrada
                </h4>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Produto</span>
                  <span className="text-white font-semibold">
                    {top.topEntrada.produtoNome}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">ID</span>
                  <span className="text-gray-300">
                    #{top.topEntrada.produtoId}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-700/30">
                  <span className="text-gray-400 text-sm">
                    Total de Entradas
                  </span>
                  <span className="text-2xl font-bold text-emerald-400">
                    {top.topEntrada.quantidadeTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Saída */}
            <div className="bg-gradient-to-br from-orange-900/30 to-slate-800/50 backdrop-blur-sm rounded-xl border border-orange-700/50 p-6 hover:border-orange-600/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-600/20 rounded-lg">
                  <svg
                    className="w-6 h-6 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-orange-400">Top Saída</h4>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Produto</span>
                  <span className="text-white font-semibold">
                    {top.topSaida.produtoNome}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">ID</span>
                  <span className="text-gray-300">
                    #{top.topSaida.produtoId}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-orange-700/30">
                  <span className="text-gray-400 text-sm">Total de Saídas</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {top.topSaida.quantidadeTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Últimas movimentações */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h3 className="text-xl font-semibold text-white">
            Últimas movimentações
          </h3>
        </div>
        <div className="p-6">
          {recentes.length === 0 && (
            <p className="text-gray-400 text-sm">
              Nenhuma movimentação registrada nesta sessão.
            </p>
          )}
          {recentes.length > 0 && (
            <div className="overflow-auto">
              <table className="min-w-full text-sm text-slate-200">
                <thead className="bg-slate-900/40">
                  <tr>
                    <th className="text-left px-3 py-2">Data/Hora</th>
                    <th className="text-right px-3 py-2">Produto ID</th>
                    <th className="text-left px-3 py-2">Tipo</th>
                    <th className="text-right px-3 py-2">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {recentes.map((m, idx) => (
                    <tr
                      key={`${m.produtoId}-${m.dataHora}-${idx}`}
                      className="border-t border-slate-700/50"
                    >
                      <td className="px-3 py-2">
                        {new Date(m.dataHora).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-3 py-2 text-right">#{m.produtoId}</td>
                      <td className="px-3 py-2">
                        {m.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                      </td>
                      <td className="px-3 py-2 text-right">{m.quantidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
