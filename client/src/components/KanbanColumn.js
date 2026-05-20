import React from 'react';
import TaskCard from './TaskCard';

const STATUS_CONFIG = {
  backlog: { label: 'Backlog', color: 'var(--text-3)' },
  'in-progress': { label: 'In Progress', color: 'var(--blue)' },
  done: { label: 'Done', color: 'var(--green)' },
};

export default function KanbanColumn({ status, tasks, onAddTask, onEdit, onDelete, onStatusChange }) {
  const config = STATUS_CONFIG[status];
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-lg)', padding: '12px', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: config.color }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-2)' }}>{config.label}</span>
          <span style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: '10px', padding: '1px 7px', fontSize: '11px', color: 'var(--text-2)' }}>
            {columnTasks.length}
          </span>
        </div>
        <button
          style={{ background: 'none', border: 'none', fontSize: '18px', color: 'var(--text-3)', lineHeight: 1, cursor: 'pointer', padding: '0 2px' }}
          onClick={() => onAddTask(status)}
          title="Add task"
        >+</button>
      </div>

      <div style={{ flex: 1 }}>
        {columnTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>

      <button
        style={{ width: '100%', border: '0.5px dashed var(--border-md)', borderRadius: 'var(--radius)', padding: '8px', fontSize: '12px', color: 'var(--text-3)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '4px', transition: 'all 0.15s' }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-2)'; e.currentTarget.style.color = 'var(--text-2)'; e.currentTarget.style.background = 'var(--surface)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-md)'; e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent'; }}
        onClick={() => onAddTask(status)}
      >
        + Add task
      </button>
    </div>
  );
}
