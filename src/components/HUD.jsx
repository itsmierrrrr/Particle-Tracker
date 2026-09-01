export function HUD({ tracking, mode, particleCount, handPresent, cameraError, cameraMessage, onRetryCamera }) {
  return (
    <aside className="hud" aria-label="System status">
      <div className="hud-brand"><span className="brand-mark" /> NEURAL CORE <small>V.01</small></div>
      <div className="status-row"><span className={`status-dot ${handPresent ? 'live' : ''}`} /> HAND TRACKING: {cameraError ? 'UNAVAILABLE' : tracking ? 'ACTIVE' : 'SEARCHING'}</div>
      <div className="readout-grid">
        <div><span>MODE</span><strong>{mode}</strong></div>
        <div><span>PARTICLES</span><strong>{particleCount.toLocaleString()}</strong></div>
        <div><span>INPUT</span><strong>{cameraError ? 'MOUSE' : handPresent ? 'HAND' : 'MOUSE'}</strong></div>
      </div>
      <div className="gesture-line"><span className="gesture-icon">{mode === 'GRAB' ? '✦' : '○'}</span><span>{mode === 'GRAB' ? 'FIELD LOCKED' : 'PALM TO ENGAGE'}</span></div>
      {cameraError && <><p className="camera-error">{cameraMessage || 'Hand tracker unavailable. Mouse controls engaged.'}</p><button className="camera-retry" onClick={onRetryCamera}>RETRY CAMERA</button></>}
    </aside>
  )
}
