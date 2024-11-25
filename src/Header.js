// src/Header.js
import React from 'react';
import Clock from './Clocks';

const Header = ({ sidePanelOpen, setSidePanelOpen, sidePanelRef }) => {
  return (
    <header className="header" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#0071E3', color: '#fff', padding: '10px' }}>
      <div className="header-content" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {!sidePanelOpen && (
          <button
            onClick={() => setSidePanelOpen(true)}
            className="hamburger-menu-button"
            style={{
              backgroundColor: '#fff',
              color: '#0071E3',
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            ☰
          </button>
        )}
        <h1 className="header-title" style={{ margin: '0 auto', textAlign: 'center', flex: 1 }}>
        Bot Success Rate Dashboard</h1>
        <div className="header-clocks" style={{ position: 'absolute', top: '10px', right: '20px' }}>
          <Clock istTime={new Date()} utcTime={new Date()} />
        </div>
      </div>
    </header>
  );
};

export default Header;
