import { NavLink } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <div>
      <header className="border-b border-gray-800">
        <nav className="container flex items-center gap-6 py-4">
          <NavLink to="/categorias" className={({ isActive }) => isActive ? 'nav-link font-semibold' : 'nav-link'}>Categorias</NavLink>
          <NavLink to="/produtos" className={({ isActive }) => isActive ? 'nav-link font-semibold' : 'nav-link'}>Produtos</NavLink>
          <NavLink to="/movimentacoes" className={({ isActive }) => isActive ? 'nav-link font-semibold' : 'nav-link'}>Movimentações</NavLink>
          <NavLink to="/relatorios" className={({ isActive }) => isActive ? 'nav-link font-semibold' : 'nav-link'}>Relatórios</NavLink>
        </nav>
      </header>
      <main className="container py-6">
        <AppRoutes />
      </main>
    </div>
  )
}