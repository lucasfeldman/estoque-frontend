import { Routes, Route, Navigate } from 'react-router-dom'
import { CategoriasPage } from '../features/categorias/CategoriasPage'
import { ProdutosPage } from '../features/produtos/ProdutosPage'
import { ProdutoDetalhePage } from '../features/produtos/ProdutoDetalhePage'
import { MovimentacoesPage } from '../features/movimentacoes/MovimentacoesPage'
import { RelatoriosPage } from '../features/relatorios/RelatoriosPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/produtos" replace />} />
      <Route path="/categorias" element={<CategoriasPage />} />
      <Route path="/produtos" element={<ProdutosPage />} />
      <Route path="/produtos/:id" element={<ProdutoDetalhePage />} />
      <Route path="/movimentacoes" element={<MovimentacoesPage />} />
      <Route path="/relatorios" element={<RelatoriosPage />} />
    </Routes>
  )
}