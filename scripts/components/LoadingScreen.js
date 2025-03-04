// LoadingScreen.js - Initial loading screen component
export const LoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--background-color)',
      zIndex: 1000
    }}>
      <div className="starfield"></div>
      
      <svg width="80" height="80" viewBox="0 0 24 24" className="spin">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#48a9f8" strokeWidth="1" />
        <circle cx="12" cy="12" r="3" fill="#48a9f8" />
        <ellipse cx="12" cy="12" rx="6" ry="2" fill="none" stroke="#48a9f8" strokeWidth="1" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="6" ry="2" fill="none" stroke="#48a9f8" strokeWidth="1" transform="rotate(-30 12 12)" />
      </svg>
      
      <h1 style={{ 
        color: 'var(--primary-color)', 
        marginTop: '20px', 
        fontFamily: 'var(--font-mono)' 
      }}>
        STELLAR EVOLUTION
      </h1>
      
      <p style={{ 
        color: 'var(--text-color)', 
        marginTop: '10px',
        fontFamily: 'var(--font-mono)',
        textAlign: 'center'
      }}>
        Initializing stellar civilization<span className="loading-dots"></span>
      </p>
    </div>
  );
};

