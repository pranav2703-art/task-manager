import React from 'react';
import { formatDate } from '../utils/time';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const tagClass = `tag tag-${(task.tag || 'General').replace('/', '\\/')}`;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '10px 12px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.1s',
        opacity: task.status === 'done' ? 0.72 : 1,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
      onClick={() => onEdit(task)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '5px' }}>
        <span style={{ fontSize: '13px', fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{task.title}</span>
        <span className={tagClass.replace('\\/', '/')} style={{ flexShrink: 0, fontSize: '10px', fontWeight: 500, borderRadius: '4px', padding: '2px 7px', whiteSpace: 'nowrap', background: getTagBg(task.tag), color: getTagColor(task.tag) }}>
          {task.tag}
        </span>
      </div>

      {task.description && (
        <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '6px', lineHeight: 1.4 }}>
          {task.description.length > 60 ? task.description.slice(0, 60) + '…' : task.description}
        </p>
      )}

      {task.progress > 0 && task.status !== 'done' && (
        <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', marginBottom: '7px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${task.progress}%`, background: task.progress >= 80 ? 'var(--green)' : 'var(--blue)', borderRadius: '2px', transition: 'width 0.3s' }} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {task.assignee && (
            <div className={`avatar color-${task.assignee.color || 'blue'}`} style={{ width: '22px', height: '22px', fontSize: '9px' }}>
              {task.assignee.initials}
            </div>
          )}
          {task.assignee && <span style={{ fontSize: '11px', color: 'var(--text-2)' }}>{task.assignee.name?.split(' ')[0]}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {task.dueDate && <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{formatDate(task.dueDate)}</span>}
          <div className={`priority-dot priority-${task.priority}`} />
          {task.status === 'done' && <span style={{ fontSize: '13px', color: 'var(--green)' }}>✓</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginTop: '8px', borderTop: '0.5px solid var(--border)', paddingTop: '7px' }}
        onClick={(e) => e.stopPropagation()}>
        {task.status !== 'backlog' && (
          <button className="btn" style={{ fontSize: '11px', padding: '3px 8px' }}
            onClick={() => onStatusChange(task, task.status === 'in-progress' ? 'backlog' : 'in-progress')}>
            ← Back
          </button>
        )}
        {task.status !== 'done' && (
          <button className="btn btn-primary" style={{ fontSize: '11px', padding: '3px 8px' }}
            onClick={() => onStatusChange(task, task.status === 'backlog' ? 'in-progress' : 'done')}>
            {task.status === 'backlog' ? 'Start →' : 'Done ✓'}
          </button>
        )}
        <button className="btn btn-danger" style={{ fontSize: '11px', padding: '3px 8px', marginLeft: 'auto' }}
          onClick={() => onDelete(task._id)}>
          ✕
        </button>
      </div>
    </div>
  );
}

function getTagBg(tag) {
  const map = { Backend: '#EAF3DE', Frontend: '#E6F1FB', Database: '#EAF3DE', DevOps: '#EEEDFE', 'UI/UX': '#E6F1FB', Security: '#FAECE7', Docs: '#EAF3DE', General: '#EEEDFE', Other: '#f0efe9' };
  return map[tag] || '#f0efe9';
}
function getTagColor(tag) {
  const map = { Backend: '#27500A', Frontend: '#0C447C', Database: '#27500A', DevOps: '#3C3489', 'UI/UX': '#0C447C', Security: '#712B13', Docs: '#27500A', General: '#3C3489', Other: '#6b6b65' };
  return map[tag] || '#6b6b65';
}
