import React from 'react';

const SidePanel = ({
  sidePanelOpen,
  sidePanelRef,
  ehrOptions,
  selectedEhrInfo,
  handleEhrClick,
}) => {
  return (
    <div
      ref={sidePanelRef}
      style={{
        position: 'fixed',
        top: '0',
        left: sidePanelOpen ? '0' : '-350px',
        width: '250px',
        height: '100%',
        backgroundColor: '#0071E3',
        color: '#fff',
        transition: '0.3s',
        padding: '20px',
        zIndex: 999,
      }}
    >
      <h2>EHR Triggers</h2>
      {ehrOptions.map((ehrOption) => (
        <div key={ehrOption.value}>
          <button
            onClick={() => handleEhrClick(ehrOption)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              backgroundColor: '#fff',
              color: '#0071E3',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {ehrOption.label}
          </button>
          {selectedEhrInfo && selectedEhrInfo.value === ehrOption.value && (
            <div
              style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#ffffff',
                color: '#0071E3',
                borderRadius: '4px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h4>About {ehrOption.label}</h4>
              <p>{ehrOption.label} is an electronic health record system used for managing patient records and workflow processes.</p>
              <p><strong>Bot Start Time:</strong> {selectedEhrInfo.startTime}</p>
              <p><strong>Bot End Time:</strong> {selectedEhrInfo.endTime}</p>
              <p><strong>Total Execution Time:</strong> {selectedEhrInfo.totalTime}</p>
            </div>
          )}
        </div>
      ))}

      <a
        href="mailto:support@ehr.com"
        style={{
          display: 'block',
          marginTop: '20px',
          textDecoration: 'none',
          backgroundColor: '#ffffff',
          color: '#0071E3',
          padding: '10px',
          borderRadius: '4px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        Contact Us
      </a>
    </div>
  );
};

export default SidePanel;
