import { useEffect, useRef } from 'react'

const HAND_CONNECTIONS = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]]
const PALM_OVERLAY_OFFSET_X = 0.035
const PALM_OVERLAY_OFFSET_Y = 0.13

export function WebcamPreview({ videoRef, visible, onToggle, tracking, landmarks }) {
  const overlayRef = useRef(null)
  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    if (!landmarks?.length) return
    const width = canvas.width; const height = canvas.height
    context.strokeStyle = 'rgba(120, 230, 255, 0.7)'; context.lineWidth = 1.5; context.beginPath()
    HAND_CONNECTIONS.forEach(([from, to]) => { context.moveTo((landmarks[from].x - PALM_OVERLAY_OFFSET_X) * width, (landmarks[from].y - PALM_OVERLAY_OFFSET_Y) * height); context.lineTo((landmarks[to].x - PALM_OVERLAY_OFFSET_X) * width, (landmarks[to].y - PALM_OVERLAY_OFFSET_Y) * height) })
    context.stroke()
    landmarks.forEach((landmark, index) => { context.beginPath(); context.fillStyle = index === 0 ? '#ffffff' : '#79f3ff'; context.shadowColor = '#5ce6ff'; context.shadowBlur = 5; context.arc((landmark.x - PALM_OVERLAY_OFFSET_X) * width, (landmark.y - PALM_OVERLAY_OFFSET_Y) * height, index === 0 ? 2.4 : 1.9, 0, Math.PI * 2); context.fill() })
    context.shadowBlur = 0
  }, [landmarks])
  return (
    <div className={`webcam-wrap ${visible ? '' : 'is-hidden'}`}>
      <video ref={videoRef} className="webcam" autoPlay muted playsInline />
      <canvas ref={overlayRef} className="hand-overlay" width="640" height="480" aria-hidden="true" />
      {visible && <div className="webcam-label"><span className={tracking ? 'status-dot live' : 'status-dot'} /> LIVE FEED</div>}
      <button className="preview-toggle" onClick={onToggle} aria-label={visible ? 'Hide webcam preview' : 'Show webcam preview'}>{visible ? '◌' : '◉'}</button>
    </div>
  )
}
