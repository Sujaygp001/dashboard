import React from 'react';

const Clock = ({ istTime, utcTime }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        margin: '20px 0',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#0071E3',
          color: '#fff',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ margin: '0', fontSize: '1.5rem' }}>IST Time</h3>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '5px 0' }}>
          {istTime.toLocaleTimeString('en-US', { hour12: true })}
        </p>
      </div>
      <div
        style={{
          textAlign: 'center',
          backgroundColor: '#FF9500',
          color: '#fff',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ margin: '0', fontSize: '1.5rem' }}>UTC Time</h3>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '5px 0' }}>
          {utcTime.toLocaleTimeString('en-US', { hour12: true })}
        </p>
      </div>
    </div>
  );
};

export default Clock;
