import { useState } from 'react'
import { MessageSquare, Calendar, Clock, ArrowRight } from 'lucide-react'

interface Session {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  messageCount: number
  status: 'active' | 'completed' | 'archived'
}

export function Sessions() {
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      name: 'Планирование недели',
      lastMessage: 'Нужно обновить roadmap в Power BI...',
      timestamp: '2024-03-30 14:23',
      messageCount: 24,
      status: 'active'
    },
    {
      id: '2',
      name: 'Настройка VPS',
      lastMessage: 'Создаю файлы конфигурации...',
      timestamp: '2024-03-30 09:15',
      messageCount: 156,
      status: 'active'
    },
    {
      id: '3',
      name: 'Протокол витаминов',
      lastMessage: 'L-карнитин добавлен в список',
      timestamp: '2024-03-29 22:45',
      messageCount: 42,
      status: 'completed'
    },
  ])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Сессии</h1>
        <p className="page-subtitle">История разговоров и задач</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Все сессии</h3>
          <button className="btn btn-primary">
            <MessageSquare size={16} />
            Новая сессия
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Последнее сообщение</th>
                <th>Сообщений</th>
                <th>Обновлена</th>
                <th>Статус</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MessageSquare size={16} color="#6366f1" />
                      {session.name}
                    </div>
                  </td>
                  <td style={{ maxWidth: '300px', color: 'var(--text-secondary)' }}>
                    {session.lastMessage}
                  </td>
                  <td>{session.messageCount}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} />
                      {session.timestamp}
                    </div>
                  </td>
                  <td>
                    <span className={`status status-${session.status === 'active' ? 'online' : 'offline'}`}>
                      ● {session.status === 'active' ? 'Активна' : session.status === 'completed' ? 'Завершена' : 'Архив'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px' }}>
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
