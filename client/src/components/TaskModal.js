import React, { useState, useEffect } from 'react';

const TAGS = ['Backend', 'Frontend', 'Database', 'DevOps', 'UI/UX', 'Security', 'Docs', 'General', 'Other'];

export default function TaskModal({ task, users, projectId, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '', description: '', status: 'backlog',
    priority: 'medium', tag: 'General', dueDate: '',
    progress: 0, assignee: '', project: projectId,
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'backlog',
        priority: task.priority || 'medium',
        tag: task.tag || 'General',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        progress: task.progress || 0,
        assignee: task.assignee?._id || task.assignee || '',
        project: task.project || projectId,
      });
    }
  }, [task, projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, progress: Number(form.progress) });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ padding: '20px 24px', borderBottom: '0.5px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{task ? 'Edit Task' : 'New Task'}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-2)', lineHeight: 1 }}>×</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          <div className="form-group">
            <label>Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Task title..." required autoFocus />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="What needs to be done?" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="backlog">Backlog</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tag</label>
              <select name="tag" value={form.tag} onChange={handleChange}>
                {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assignee</label>
              <select name="assignee" value={form.assignee} onChange={handleChange}>
                <option value="">Unassigned</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Progress: {form.progress}%</label>
              <input type="range" name="progress" min="0" max="100" step="5" value={form.progress} onChange={handleChange} style={{ width: '100%', marginTop: '8px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
