import { useState } from 'react'
import { Brain, FileText, Calendar, Search, Plus } from 'lucide-react'

interface MemoryFile {
  id: string
  name: string
  type: 'daily' | 'longterm' | 'soul' | 'user'
  lastModified: string
  size: string
}

export function Memory() {
  const [files] = useState<MemoryFile[]>([
    { id: '1', name: '2026-03-30.md', type: 'daily', lastModified: '2024-03-30 19:18', size: '2.1 KB' },
    { id: '2', name: '2026-03-29.md', type: 'daily', lastModified: '2024-03-29 23:45', size: '5.4 KB' },
    { id: '3', name: 'MEMORY.md', type: 'longterm', lastModified: '2024-03-28 14:22', size: '12.3 KB' },
    { id: '4', name: 'SOUL.md', type: 'soul', lastModified: '2024-03-27 09:15', size: '3.8 KB' },
    { id: '5', name: 'USER.md', type: 'user', lastModified: '2024-03-26 18:30', size: '2.5 KB' },
  ])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return '#6366f1'
      case 'longterm': return '#22c55e'
      case 'soul': return '#a855f7'
      case 'user': return '#f59e0b'
      default: return '#9090a0'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'Ежедневная'
      case 'longterm': return 'Долгосрочная'
      case 'soul': return 'Личность'
      case 'user': return 'Пользователь'
      default: return type
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Память</h1>
        <p className="page-subtitle">Управление файлами памяти и контекстом</p>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Статистика памяти</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { label: 'Всего файлов', value: '156' },
              { label: 'Объём', value: '4.2 MB' },
              { label: 'Ежедневных', value: '45' },
              { label: 'Долгосрочных', value: '12' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Быстрые действия</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary">
              <Plus size={16} />
              Создать заметку
            </button>
            
            <button className="btn btn-secondary">
              <Search size={16} />
              Поиск по памяти
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Файлы памяти</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ padding: '8px 12px' }}>
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Файл</th>
                <th>Тип</th>
                <th>Изменён</th>
                <th>Размер</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={16} color={getTypeColor(file.type)} />
                      {file.name}
                    </div>
                  </td>
                  <td>
                    <span 
                      style={{ 
                        padding: '4px 12px', 
                        borderRadius: '12px', 
                        fontSize: '12px',
                        background: `${getTypeColor(file.type)}20`,
                        color: getTypeColor(file.type)
                      }}
                    >
                      {getTypeLabel(file.type)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      {file.lastModified}
                    </div>
                  </td>
                  <td>{file.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
