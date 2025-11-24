import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listarProdutos,
  reajustarPrecos,
  criarProduto,
} from "./produtoService";
import type { Produto, Categoria } from "../../types/domain";
import { Link } from "react-router-dom";
import { listarCategorias } from "../categorias/categoriaService";

export function ProdutosPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<Produto[]>({
    queryKey: ["produtos"],
    queryFn: listarProdutos,
  });

  const qCategorias = useQuery<Categoria[]>({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [nome, setNome] = React.useState("");
  const [precoUnitario, setPrecoUnitario] = React.useState<number>(0);
  const [precoUnitarioStr, setPrecoUnitarioStr] = React.useState<string>("");
  const [unidade, setUnidade] = React.useState("UN");
  const [quantidade, setQuantidade] = React.useState<number>(0);
  const [quantidadeMinima, setQuantidadeMinima] = React.useState<number>(0);
  const [quantidadeMaxima, setQuantidadeMaxima] = React.useState<number>(0);
  const [categoriaId, setCategoriaId] = React.useState<number | null>(null);

  const formatCurrencyBRL = (n: number) =>
    n.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const parseCurrencyBRL = (s: string) => {
    const normalized = s
      .replace(/[^\d,\.]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const v = parseFloat(normalized);
    return isNaN(v) ? 0 : v;
  };

  React.useEffect(() => {
    if (openModal) {
      setPrecoUnitarioStr(formatCurrencyBRL(precoUnitario));
    }
  }, [openModal, precoUnitario]);

  const reajusteMut = useMutation({
    mutationFn: () => reajustarPrecos(10),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["produtos"] }),
  });

  const criarMut = useMutation({
    mutationFn: async () => {
      const categoria = qCategorias.data?.find((c) => c.id === categoriaId);
      if (!categoria) throw new Error("Selecione uma categoria");
      const payload = {
        nome,
        precoUnitario,
        unidade,
        quantidade,
        quantidadeMinima,
        quantidadeMaxima,
        categoria,
      };
      return criarProduto(payload);
    },
    onSuccess: () => {
      setOpenModal(false);
      setNome("");
      setPrecoUnitario(0);
      setPrecoUnitarioStr("");
      setUnidade("UN");
      setQuantidade(0);
      setQuantidadeMinima(0);
      setQuantidadeMaxima(0);
      setCategoriaId(null);
      qc.invalidateQueries({ queryKey: ["produtos"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    criarMut.mutate();
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Produtos</h2>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
            onClick={() => setOpenModal(true)}
          >
            + Novo Produto
          </button>
          <button
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => reajusteMut.mutate()}
            disabled={reajusteMut.isPending}
          >
            {reajusteMut.isPending ? "Reajustando..." : "Reajustar 10%"}
          </button>
        </div>
      </div>

      {isLoading && <p className="text-gray-400">Carregando produtos...</p>}
      {error && (
        <p className="text-red-400 bg-red-900/20 p-3 rounded-lg">
          {String(error)}
        </p>
      )}

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <ul className="divide-y divide-slate-700/50">
          {data?.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
            >
              <div>
                <span className="font-semibold text-white text-lg">
                  {p.nome}
                </span>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs rounded-md border border-slate-600/50 text-gray-300 bg-slate-900/40">#{p.id}</span>
                <div className="flex gap-4 mt-1 text-sm">
                  <span className="text-emerald-400">
                    R$ {p.precoUnitario.toFixed(2)}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-400">Estoque: {p.quantidade}</span>
                </div>
              </div>
              <Link
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                to={`/produtos/${p.id}`}
              >
                Ver Detalhes →
              </Link>
            </li>
          ))}
          {data?.length === 0 && (
            <li className="p-8 text-center text-gray-400">
              Nenhum produto cadastrado ainda
            </li>
          )}
        </ul>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h3 className="text-2xl font-bold text-white">
                Criar Novo Produto
              </h3>
              <button
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                onClick={() => setOpenModal(false)}
                type="button"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Nome e Preço */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                      Nome do Produto <span className="text-red-400">*</span>
                    </label>
                    <input
                      className="w-70 px-3 py-2 bg-slate-900/50 border border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="Ex: Notebook Dell"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                      Preço Unitário <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-400 font-medium text-sm">
                          R$
                        </span>
                      </div>
                      <input
                        className="w-62 pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        type="text"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={precoUnitarioStr}
                        onChange={(e) => {
                          const v = e.target.value;
                          setPrecoUnitarioStr(v);
                          setPrecoUnitario(parseCurrencyBRL(v));
                        }}
                        onBlur={() =>
                          setPrecoUnitarioStr(formatCurrencyBRL(precoUnitario))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Unidade e Quantidade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                      Unidade
                    </label>
                    <input
                      className="w-70 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="UN, KG, L..."
                      value={unidade}
                      onChange={(e) => setUnidade(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                      Quantidade em Estoque
                    </label>
                    <input
                      className="w-70 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      type="number"
                      step={1}
                      min="0"
                      placeholder="0"
                      value={quantidade}
                      onChange={(e) => setQuantidade(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Quantidade Mínima e Máxima */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                      Quantidade Mínima
                    </label>
                    <input
                      className="w-70 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      type="number"
                      step={1}
                      min="0"
                      placeholder="0"
                      value={quantidadeMinima}
                      onChange={(e) =>
                        setQuantidadeMinima(Number(e.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                      Quantidade Máxima
                    </label>
                    <input
                      className="w-70 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      type="number"
                      step={1}
                      min="0"
                      placeholder="0"
                      value={quantidadeMaxima}
                      onChange={(e) =>
                        setQuantidadeMaxima(Number(e.target.value))
                      }
                    />
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-1.5">
                    Categoria <span className="text-red-400">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-sm"
                    value={categoriaId ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCategoriaId(v ? Number(v) : null);
                    }}
                  >
                    <option value="" disabled className="bg-slate-800">
                      Selecione uma categoria...
                    </option>
                    {qCategorias.data?.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-800">
                        {c.nome}
                      </option>
                    ))}
                  </select>
                  {qCategorias.isLoading && (
                    <p className="text-sm text-blue-400 mt-1.5">
                      Carregando categorias...
                    </p>
                  )}
                  {qCategorias.error && (
                    <p className="text-sm text-red-400 bg-red-900/20 p-2 rounded mt-1.5">
                      {String(qCategorias.error)}
                    </p>
                  )}
                </div>

                {/* Error Message */}
                {criarMut.error && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400 text-sm">
                      {String(criarMut.error)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-slate-700/50 bg-slate-900/30">
              <button
                type="button"
                className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors text-sm"
                onClick={() => setOpenModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm"
                disabled={
                  criarMut.isPending ||
                  !nome.trim() ||
                  !categoriaId ||
                  precoUnitario <= 0
                }
              >
                {criarMut.isPending ? "Salvando..." : "Salvar Produto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
