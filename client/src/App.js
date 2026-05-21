import React, { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import KanbanColumn from './components/KanbanColumn';
import TaskModal from './components/TaskModal';
import ActivityFeed from './components/ActivityFeed';
import TeamPanel from './components/TeamPanel';
import {
  getTasks, createTask, updateTask, deleteTask,
  getProjects, getUsers, getActivities, seedData,
} from './utils/api';

const FILTERS = ['All', 'My Tasks', 'High Priority', 'Due Soon'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [modal, setModal] = useState(null); // null | { task?, defaultStatus? }
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  // Socket setup
  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('task_created', (task) => setTasks((prev) => [task, ...prev]));
    socket.on('task_updated', (task) => setTasks((prev) => prev.map((t) => t._id === task._id ? task : t)));
    socket.on('task_deleted', (id) => setTasks((prev) => prev.filter((t) => t._id !== id)));
    socket.on('activity_update', (activity) => setActivities((prev) => [activity, ...prev.slice(0, 19)]));
    return () => socket.disconnect();
  }, []);

  // Load data
  const loadData = useCallback(async (proj) => {
    if (!proj) return;
    setLoading(true);
    try {
      const [tasksRes, activitiesRes, usersRes] = await Promise.all([
        getTasks({ project: proj._id }),
        getActivities({ project: proj._id, limit: 20 }),
        getUsers(),
      ]);
      setTasks(tasksRes.data);
      setActivities(activitiesRes.data);
      setUsers(usersRes.data);
      socketRef.current?.emit('join_project', proj._id);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProjects().then((res) => {
      if (res.data.length > 0) {
        setProject(res.data[0]);
        loadData(res.data[0]);
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, [loadData]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedData();
      const res = await getProjects();
      setProject(res.data[0]);
      await loadData(res.data[0]);
    } finally {
      setSeeding(false);
    }
  };

  const handleSaveTask = async (formData) => {
    try {
      if (modal?.task?._id) {
        await updateTask(modal.task._id, formData);
      } else {
        await createTask({ ...formData, project: project._id });
      }
      setModal(null);
    } catch (err) {
      alert('Error saving task: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id);
  };

  const handleStatusChange = async (task, newStatus) => {
    await updateTask(task._id, { status: newStatus, progress: newStatus === 'done' ? 100 : task.progress });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'High Priority') return t.priority === 'high';
    if (activeFilter === 'Due Soon') return t.dueDate && new Date(t.dueDate) <= new Date(Date.now() + 3 * 86400000);
    return true;
  });

  // Stats
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
    high: tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length,
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid var(--border)', borderTopColor: 'var(--blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-2)', fontSize: '13px' }}>Loading…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!project) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Welcome to Task Manager</h2>
      <p style={{ color: 'var(--text-2)', fontSize: '14px' }}>No projects found. Load demo data to get started.</p>
      <button className="btn btn-primary" onClick={handleSeed} disabled={seeding}>
        {seeding ? 'Loading demo data…' : '🚀 Load Demo Data'}
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'var(--surface)', borderBottom: '0.5px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>⚡ Task Manager</span>
            <span style={{ background: 'var(--surface2)', border: '0.5px solid var(--border)', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', color: 'var(--text-2)' }}>
              {project.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-2)' }}>
              <div className="live-dot" style={{ background: connected ? 'var(--green)' : 'var(--text-3)' }} />
              {connected ? 'Live' : 'Offline'}
            </div>
            <button className="btn btn-primary" onClick={() => setModal({ defaultStatus: 'backlog' })}>
              + New Task
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Total Tasks', value: stats.total, sub: `${tasks.filter(t=>t.status==='backlog').length} in backlog` },
            { label: 'In Progress', value: stats.inProgress, color: 'var(--blue)', sub: `${tasks.filter(t=>t.status==='in-progress'&&t.dueDate&&new Date(t.dueDate)<new Date(Date.now()+86400000)).length} due today` },
            { label: 'Completed', value: stats.done, color: 'var(--green)', sub: `${tasks.length ? Math.round(stats.done / tasks.length * 100) : 0}% done` },
            { label: 'High Priority', value: stats.high, color: 'var(--red)', sub: 'active tasks' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '4px' }}>{s.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 600, color: s.color || 'var(--text)', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '3px' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-2)', marginRight: '2px' }}>View:</span>
          {FILTERS.map((f) => (
            <button key={f}
              style={{ border: '0.5px solid', borderColor: activeFilter === f ? 'var(--border-md)' : 'var(--border)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: activeFilter === f ? 600 : 400, color: activeFilter === f ? 'var(--text)' : 'var(--text-2)', background: activeFilter === f ? 'var(--surface)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}
              onClick={() => setActiveFilter(f)}
            >{f}</button>
          ))}
        </div>

        {/* Board */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          {['backlog', 'in-progress', 'done'].map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={filteredTasks}
              onAddTask={(s) => setModal({ defaultStatus: s })}
              onEdit={(task) => setModal({ task })}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {/* Bottom panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <ActivityFeed activities={activities} connected={connected} />
          <TeamPanel users={users} tasks={tasks} />
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal.task}
          users={users}
          projectId={project._id}
          onSave={handleSaveTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
