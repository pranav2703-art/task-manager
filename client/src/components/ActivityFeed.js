import React from 'react';
import { timeAgo } from '../utils/time';

export default function ActivityFeed({ activities, connected }) {
  return (
    <div style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Live Activity</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-2)' }}>
          <div className="live-dot" style={{ background: connected ? 'var(--green)' : 'var(--text-3)' }} />
          {connected ? 'Socket.io connected' : 'Connecting…'}
        </div>
      </div>
      {activities.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--text-3)', textAlign: 'center', padding: '16px 0' }}>No activity yet</p>
      ) : (
        activities.slice(0, 8).map((a, i) => (
          <div key={a._id || i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', padding: '8px 0', borderBottom: i < Math.min(activities.length, 8) - 1 ? '0.5px solid var(--border)' : 'none' }}>
            {a.user ? (
              <div className={`avatar color-${a.user.color || 'blue'}`} style={{ width: '24px', height: '24px', fontSize: '9px', flexShrink: 0 }}>
                {a.user.initials}
              </div>
            ) : (
              <div className="avatar color-blue" style={{ width: '24px', height: '24px', fontSize: '9px', flexShrink: 0 }}>?</div>
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{a.user?.name?.split(' ')[0] || 'Someone'}</strong>
                {' '}{a.action}
                {a.taskTitle && <> — <em style={{ fontStyle: 'normal', color: 'var(--text)' }}>{a.taskTitle}</em></>}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{timeAgo(a.createdAt)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
