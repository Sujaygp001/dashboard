// src/Clocks.js
import React, { useEffect, useState } from 'react';

const Clock = () => {
  const [istTime, setIstTime] = useState(new Date());
  const [utcTime, setUtcTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setUtcTime(new Date(now.getTime() + 5.5 * 60 * 60 * 1000)); // Update IST time
      setIstTime(new Date(now.getTime())); // Update UTC time
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0', fontSize: '0.8rem', color: '#fff' }}>IST Time</h3>
        <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '2px 0', color: '#fff' }}>
          {istTime.toLocaleTimeString('en-US', { hour12: true })}
        </p>
      </div>
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0', fontSize: '0.8rem', color: '#fff' }}>UTC Time</h3>
        <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: '2px 0', color: '#fff' }}>
          {utcTime.toLocaleTimeString('en-US', { hour12: true })}
        </p>
      </div>
    </div>
  );
};

export default Clock;
