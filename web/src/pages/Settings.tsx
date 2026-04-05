import { useState } from 'react'
import { Settings as SettingsIcon, Key, Bell, Shield, Database, RefreshCw, Save } from 'lucide-react'

export function Settings() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'Общие', icon: SettingsIcon },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'backup', label: 'Бэкап', icon: Database },
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Настройки</h1>
        <p className="page-subtitle">Конфигурация системы и интеграций</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        <div className="card" style={{ padding: '12px', height: 'fit-content' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="card">
          {activeTab === 'general' && (
            <div>
              <h3 className="card-title" style={{ marginBottom: '24px' }}>Общие настройки</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    Название ассистента
                  </label>
                  <input 
                    type="text" 
                    defaultValue="J.A.R.V.I.S."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    Язык по умолчанию
                  </label>
                  <select 
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    Часовой пояс
                  </label>
                  <select 
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Europe/Moscow">Europe/Moscow (UTC+3)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button className="btn btn-primary">
                    <Save size={16} />
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <h3 className="card-title" style={{ marginBottom: '24px' }}>API Keys</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { name: 'OpenAI API Key', placeholder: 'sk-...', mask: true },
                  { name: 'Telegram Bot Token', placeholder: '8347911945:...', mask: true },
                  { name: 'Tavily API Key', placeholder: 'tvly-...', mask: true },
                ].map(key => (
                  <div key={key.name}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                      {key.name}
                    </label>
                    <input 
                      type={key.mask ? "password" : "text"}
                      placeholder={key.placeholder}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button className="btn btn-primary">
                    <Save size={16} />
                    Сохранить ключи
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div>
              <h3 className="card-title" style={{ marginBottom: '24px' }}>Бэкап и восстановление</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
                  <h4 style={{ marginBottom: '12px' }}>Автоматический бэкап</h4>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Последний бэкап: 2024-03-30 03:00
                  </p>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary">
                      <RefreshCw size={16} />
                      Создать бэкап
                    </button>
                    
                    <button className="btn btn-secondary">
                      Настроить расписание
                    </button>
                  </div>
                </div>

                <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
                  <h4 style={{ marginBottom: '12px' }}>Восстановление</h4>
                  
                  <button className="btn btn-secondary">
                    <Upload size={16} />
                    Загрузить файл бэкапа
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="card-title" style={{ marginBottom: '24px' }}>Настройки уведомлений</h3>
              
              <p style={{ color: 'var(--text-secondary)' }}>
                Уведомления настроены через iPhone. Cron-задачи отключены для экономии API-лимитов.
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="card-title" style={{ marginBottom: '24px' }}>Безопасность</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span>SSL Certificate</span>
                    <span className="status status-online">● Действителен</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span>Firewall (UFW)</span>
                    <span className="status status-online">● Активен</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span>Fail2Ban</span>
                    <span className="status status-online">● Активен</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
