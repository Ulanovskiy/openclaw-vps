import { useState } from 'react'
import { FolderOpen, FileText, Image, File, Download, Upload, Trash2 } from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'document' | 'image' | 'other'
  size: string
  modified: string
}

export function Files() {
  const [files] = useState<FileItem[]>([
    { id: '1', name: 'Проект_Джарвис_автоматизация.md', type: 'document', size: '10 KB', modified: '2024-03-29' },
    { id: '2', name: 'Витамины_расчет_бюджет.csv', type: 'document', size: '2 KB', modified: '2024-03-29' },
    { id: '3', name: 'Справка_экономические_эффекты.docx', type: 'document', size: '40 KB', modified: '2024-03-28' },
    { id: '4', name: 'diagram.png', type: 'image', size: '156 KB', modified: '2024-03-27' },
  ])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText size={20} color="#6366f1" />
      case 'image': return <Image size={20} color="#22c55e" />
      default: return <File size={20} color="#9090a0" />
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Файлы</h1>
        <p className="page-subtitle">Управление документами и загрузками</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Файлы рабочего пространства</h3>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary">
              <Upload size={16} />
              Загрузить
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {files.map(file => (
            <div 
              key={file.id}
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                border: '1px solid transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.border = '1px solid var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.border = '1px solid transparent'}
            >
              <div style={{ marginBottom: '16px' }}>
                {getFileIcon(file.type)}
              </div>
              
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '8px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {file.name}
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '12px', 
                color: 'var(--text-secondary)' 
              }}>
                <span>{file.size}</span>
                <span>{file.modified}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button style={{ 
                  padding: '6px', 
                  background: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}>
                  <Download size={16} />
                </button>
                <button style={{ 
                  padding: '6px', 
                  background: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: 'var(--error)'
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
