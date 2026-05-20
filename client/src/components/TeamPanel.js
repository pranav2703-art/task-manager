import React from 'react';

export default function TeamPanel({ users, tasks }) {
  const getTaskCount = (userId) =>
    tasks.filter((t) => t.assignee?._id === userId && t.status !== 'done').length;

  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>Team</h3>
      {users.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '16px 0' }}>No members</p>
      ) : (
        users.map((u) => (
          <div key={u._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '0.5px solid var(--border)' }}
            className="team-member">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className={`avatar color-${u.color || 'blue'}`} style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                {u.initials}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500 }}>{u.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>{u.role}</p>
              </div>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-2)', background: 'var(--surface2)', borderRadius: '10px', padding: '2px 8px' }}>
              {getTaskCount(u._id)} active
            </span>
          </div>
        ))
      )}
    </div>
  );
}
