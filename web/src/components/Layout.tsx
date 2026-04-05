import { Link, useLocation, Outlet } from 'react-router-dom'
import { 
  LayoutDashboard, 
  MessageSquare, 
  Brain, 
  FolderOpen, 
  Settings,
  Activity
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Дашборд' },
  { path: '/sessions', icon: MessageSquare, label: 'Сессии' },
  { path: '/memory', icon: Brain, label: 'Память' },
  { path: '/files', icon: FolderOpen, label: 'Файлы' },
  { path: '/settings', icon: Settings, label: 'Настройки' },
]

export function Layout() {
  const location = useLocation()
  
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">◉</div>
            J.A.R.V.I.S.
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Activity size={14} />
            <span style={{ color: '#22c55e' }}>● Онлайн</span>
          </div>
          ai.ulanevg.ru
        </div>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
