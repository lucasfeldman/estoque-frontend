import { useQuery } from "@tanstack/react-query";
import {
  listaPrecos,
  balanco,
  abaixoMinimo,
  porCategoria,
} from "./relatorioService";
import { useState } from "react";
import { Link } from "react-router-dom";

type Aba = "lista-precos" | "balanco" | "abaixo-minimo" | "por-categoria";

export function RelatoriosPage() {
  const [aba, setAba] = useState<Aba>("lista-precos");

  const qLista = useQuery({
    queryKey: ["relatorios", "lista-precos"],
    queryFn: listaPrecos,
    enabled: aba === "lista-precos",
  });
  const qBalanco = useQuery<any, Error>({
    queryKey: ["relatorios", "balanco"],
    queryFn: balanco,
    enabled: aba === "balanco",
  });
  const qMinimo = useQuery({
    queryKey: ["relatorios", "abaixo-minimo"],
    queryFn: abaixoMinimo,
    enabled: aba === "abaixo-minimo",
  });
  const qCategoria = useQuery({
    queryKey: ["relatorios", "por-categoria"],
    queryFn: porCategoria,
    enabled: aba === "por-categoria",
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Relatórios</h2>
      </div>

      {/* Abas */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            aba === "lista-precos"
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
          onClick={() => setAba("lista-precos")}
        >
          Lista de preços
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            aba === "balanco"
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
          onClick={() => setAba("balanco")}
        >
          Balanço
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            aba === "abaixo-minimo"
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
          onClick={() => setAba("abaixo-minimo")}
        >
          Abaixo do mínimo
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            aba === "por-categoria"
              ? "bg-blue-600 text-white"
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
          onClick={() => setAba("por-categoria")}
        >
          Por categoria
        </button>
      </div>

      {/* Aba: Lista de preços */}
      {aba === "lista-precos" && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <h3 className="text-xl font-semibold text-white">
              Lista de preços
            </h3>
          </div>
          <div className="p-6">
            {qLista.isLoading && (
              <p className="text-sm text-blue-400">Carregando...</p>
            )}
            {qLista.error && (
              <p className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
                {String(qLista.error)}
              </p>
            )}
            {!qLista.isLoading && !qLista.error && (
              <div className="overflow-auto">
                <table className="min-w-full text-sm text-slate-200">
                  <thead className="bg-slate-900/40">
                    <tr>
                      <th className="text-right px-3 py-2">ID</th>
                      <th className="text-left px-3 py-2">Produto</th>
                      <th className="text-left px-3 py-2">Unidade</th>
                      <th className="text-left px-3 py-2">Categoria</th>
                      <th className="text-right px-3 py-2">Preço Unitário</th>
                      <th className="text-right px-3 py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(qLista.data ?? [])
                      .slice()
                      .sort((a: any, b: any) =>
                        String(a?.nome ?? "").localeCompare(
                          String(b?.nome ?? ""),
                          "pt-BR",
                          { sensitivity: "base" }
                        )
                      )
                      .map((item: any) => (
                        <tr
                          key={item.id}
                          className="border-t border-slate-700/50"
                        >
                          <td className="px-3 py-2 text-right">#{item.id}</td>
                          <td className="px-3 py-2">{item.nome}</td>
                          <td className="px-3 py-2">{item.unidade}</td>
                          <td className="px-3 py-2">
                            {item.categoria?.nome ?? item.categoria}
                          </td>
                          <td className="px-3 py-2 text-right">
                            R$ {Number(item.precoUnitario).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <Link
                              to={`/produtos/${item.id}`}
                              className="inline-block px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs transition-colors"
                            >
                              Ver produto →
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Aba: Balanço */}
      {aba === "balanco" && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <h3 className="text-xl font-semibold text-white">Balanço</h3>
          </div>
          <div className="p-6">
            {qBalanco.isLoading && (
              <p className="text-sm text-blue-400">Carregando...</p>
            )}
            {qBalanco.isError && (
              <p className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
                {String((qBalanco as any).error ?? "Erro")}
              </p>
            )}
            {!qBalanco.isLoading && !qBalanco.isError && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">
                      Total de Produtos
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {qBalanco.data?.itens?.length ?? 0}
                    </div>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Estoque Total</div>
                    <div className="text-2xl font-bold text-white">
                      {Number(
                        (qBalanco.data?.itens ?? []).reduce(
                          (acc: number, i: any) =>
                            acc + Number(i?.quantidade ?? 0),
                          0
                        )
                      ).toFixed(0)}
                    </div>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">
                      Valor Total (estimado)
                    </div>
                    <div className="text-2xl font-bold text-white">
                      R${" "}
                      {Number(
                        qBalanco.data?.valorTotalEstoque ??
                          (qBalanco.data?.itens ?? []).reduce(
                            (acc: number, i: any) =>
                              acc + Number(i?.valorTotalProduto ?? 0),
                            0
                          )
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white">
                    Balanço Físico/Financeiro
                  </h4>
                  {qBalanco.isLoading && (
                    <p className="text-sm text-blue-400 mt-2">
                      Carregando produtos...
                    </p>
                  )}
                  {qBalanco.isError && (
                    <p className="text-sm text-red-400 bg-red-900/20 p-2 rounded mt-2">
                      {String((qBalanco as any).error ?? "Erro")}
                    </p>
                  )}
                  {!qBalanco.isLoading && !qBalanco.isError && (
                    <div className="overflow-auto mt-2">
                      <table className="min-w-full text-sm text-slate-200">
                        <thead className="bg-slate-900/40">
                          <tr>
                            <th className="text-left px-3 py-2">Produto</th>
                            <th className="text-right px-3 py-2">Quantidade</th>
                            <th className="text-right px-3 py-2">
                              Preço Unitário
                            </th>
                            <th className="text-right px-3 py-2">
                              Valor Total (produto)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(qBalanco.data?.itens ?? [])
                            .slice()
                            .sort((a: any, b: any) =>
                              String(a?.nome ?? "").localeCompare(
                                String(b?.nome ?? ""),
                                "pt-BR",
                                { sensitivity: "base" }
                              )
                            )
                            .map((item: any) => {
                              const preco = Number(item.valorUnitario ?? 0);
                              const qtd = Number(item.quantidade ?? 0);
                              const totalProduto = Number(
                                item.valorTotalProduto ?? preco * qtd
                              );
                              return (
                                <tr
                                  key={item.id}
                                  className="border-t border-slate-700/50"
                                >
                                  <td className="px-3 py-2">{item.nome}</td>
                                  <td className="px-3 py-2 text-right">
                                    {qtd}
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    R$ {preco.toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    R$ {totalProduto.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                      <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4 mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Valor Total do Estoque
                        </div>
                        <div className="text-xl font-bold text-white">
                          {(() => {
                            const total = Number(
                              qBalanco.data?.valorTotalEstoque ??
                                (qBalanco.data?.itens ?? []).reduce(
                                  (acc: number, i: any) =>
                                    acc + Number(i?.valorTotalProduto ?? 0),
                                  0
                                )
                            );
                            return `R$ ${total.toFixed(2)}`;
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Aba: Abaixo do mínimo */}
      {aba === "abaixo-minimo" && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <h3 className="text-xl font-semibold text-white">
              Abaixo do mínimo
            </h3>
          </div>
          <div className="p-6">
            {qMinimo.isLoading && (
              <p className="text-sm text-blue-400">Carregando...</p>
            )}
            {qMinimo.error && (
              <p className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
                {String(qMinimo.error)}
              </p>
            )}
            {!qMinimo.isLoading && !qMinimo.error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(qMinimo.data ?? []).map((p: any) => (
                  <div
                    key={p.id}
                    className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4"
                  >
                    <div className="text-white font-semibold">{p.nome}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Estoque: {p.quantidade} • Mín: {p.quantidadeMinima}
                    </div>
                    <div className="mt-2">
                      <Link
                        to={`/produtos/${p.id}`}
                        className="inline-block px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs transition-colors"
                      >
                        Ver produto →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Aba: Por categoria */}
      {aba === "por-categoria" && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <h3 className="text-xl font-semibold text-white">Por categoria</h3>
          </div>
          <div className="p-6">
            {qCategoria.isLoading && (
              <p className="text-sm text-blue-400">Carregando...</p>
            )}
            {qCategoria.error && (
              <p className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
                {String(qCategoria.error)}
              </p>
            )}
            {!qCategoria.isLoading && !qCategoria.error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(qCategoria.data ?? []).map((c: any) => (
                  <div
                    key={c.id ?? c.nome}
                    className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4"
                  >
                    <div className="text-white font-semibold">
                      {c.nome ?? c.categoria}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Produtos: {c.totalProdutos ?? c.count}
                    </div>
                    {c.valorTotal !== undefined && (
                      <div className="text-sm text-gray-400">
                        Valor total: R$ {Number(c.valorTotal).toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
