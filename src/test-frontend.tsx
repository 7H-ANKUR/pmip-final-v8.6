// Frontend Test Component to check for black screen issues
import React from 'react';

export function FrontendTest() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      color: '#000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>Frontend Test - No Black Screen</h1>
      <p>If you can see this, the frontend is working correctly.</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => alert('Button works!')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}
