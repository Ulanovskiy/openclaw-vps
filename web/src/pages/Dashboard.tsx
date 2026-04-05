import { useEffect, useState } from 'react'
import { 
  MessageSquare, 
  Clock, 
  Database, 
  Cpu,
  Activity,
  TrendingUp
} from 'lucide-react'

interface Stats {
  totalSessions: number
  activeSessions: number
  memoryFiles: number
  diskUsage: string
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    activeSessions: 0,
    memoryFiles: 0,
    diskUsage: '0 GB'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats from API
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // This would be replaced with actual API calls
      // const response = await fetch('/api/stats')
      // const data = await response.json()
      
      // Mock data for now
      setStats({
        totalSessions: 42,
        activeSessions: 3,
        memoryFiles: 156,
        diskUsage: '2.3 GB'
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Дашборд</h1>
        <p className="page-subtitle">Обзор системы и активности</p>
      </div>

      <div className="grid">
        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <MessageSquare size={24} color="#6366f1" />
              <div className="stat-value">{stats.totalSessions}</div>
              <div className="stat-label">Всего сессий</div>
            </div>
            <div className="stat-change positive">+12% <TrendingUp size={14} /></div>
          </div>
        </div>

        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Activity size={24} color="#22c55e" />
              <div className="stat-value">{stats.activeSessions}</div>
              <div className="stat-label">Активные сессии</div>
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Database size={24} color="#f59e0b" />
              <div className="stat-value">{stats.memoryFiles}</div>
              <div className="stat-label">Файлов памяти</div>
            </div>
          </div>
        </div>

        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Cpu size={24} color="#a855f7" />
              <div className="stat-value">{stats.diskUsage}</div>
              <div className="stat-label">Использование диска</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Быстрые действия</h3>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">
            <MessageSquare size={16} />
            Новая сессия
          </button>
          
          <button className="btn btn-secondary">
            <Clock size={16} />
            История
          </button>
          
          <button className="btn btn-secondary">
            <Database size={16} />
            Бэкап данных
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Статус системы</h3>
          <span className="status status-online">● Все системы работают</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { name: 'OpenClaw Gateway', status: 'online', latency: '12ms' },
            { name: 'PostgreSQL', status: 'online', latency: '8ms' },
            { name: 'Redis', status: 'online', latency: '3ms' },
            { name: 'Web UI', status: 'online', latency: '5ms' },
          ].map(service => (
            <div 
              key={service.name}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'var(--bg-tertiary)',
                borderRadius: '8px'
              }}
            >
              <span>{service.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {service.latency}
                </span>
                <span className="status status-online">● Онлайн</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
