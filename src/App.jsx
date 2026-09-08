import { useCallback, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { ParticleBrain, PARTICLE_COUNT } from './components/ParticleBrain'
import { HandTracker } from './components/HandTracker'
import { HUD } from './components/HUD'
import { WebcamPreview } from './components/WebcamPreview'
import { ParticleControls } from './components/ParticleControls'
import './App.css'

function App() {
  const mouse = useRef({ x: 0, y: 0, wheel: 0 })
  const videoRef = useRef(null)
  const [hand, setHand] = useState(null)
  const [tracking, setTracking] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [cameraMessage, setCameraMessage] = useState('')
  const [cameraRetry, setCameraRetry] = useState(0)
  const [showCamera, setShowCamera] = useState(true)
  const [template, setTemplate] = useState('Brain')
  const [imageData, setImageData] = useState(null)
  const [palettes, setPalettes] = useState({ Brain: { main: '#ffa500', pulse: '#ffff00' }, DNA: { strandOne: '#00ffff', strandTwo: '#ff00ff', connector: '#ffffff' }, Saturn: { planet: '#ffaa00', ring: '#00ffff' }, Galaxy: { core: '#ffffff', outer: '#6633ff' }, Earth: { ocean: '#008cff', land: '#32cd32', atmosphere: '#bfefff' } })
  const [controlsMinimized, setControlsMinimized] = useState(false)
  const mode = hand?.pinch && !hand?.open ? 'GRAB' : 'IDLE'
  const onData = useCallback((data) => setHand(data), [])
  const onStatus = useCallback((status) => setTracking(status === 'ready'), [])
  const onError = useCallback((error) => { setCameraError(true); setCameraMessage(error?.message || 'MediaPipe could not process the camera feed.'); console.error('Hand tracking error:', error) }, [])
  return <main className="app-shell" onPointerMove={(event) => { mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 2; mouse.current.y = (event.clientY / window.innerHeight - 0.5) * 2 }} onWheel={(event) => { mouse.current.wheel = Math.max(-3, Math.min(3, mouse.current.wheel + event.deltaY * 0.002)) }}>
    <Canvas camera={{ position: [0, 0, 3.25], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={['#02070d']} /><ambientLight intensity={0.4} /><ParticleBrain hand={hand} mouse={mouse} template={template} palette={palettes[template]} imageData={imageData} /><EffectComposer><Bloom intensity={1.35} luminanceThreshold={0.1} mipmapBlur radius={0.8} /><Vignette darkness={0.65} offset={0.25} /></EffectComposer>
    </Canvas>
    <div className="scanlines" /><HUD tracking={tracking} mode={mode} particleCount={PARTICLE_COUNT} handPresent={Boolean(hand)} cameraError={cameraError} cameraMessage={cameraMessage} onRetryCamera={() => { setCameraError(false); setCameraMessage(''); setHand(null); setCameraRetry((value) => value + 1) }} />
    <WebcamPreview videoRef={videoRef} visible={showCamera} onToggle={() => setShowCamera((value) => !value)} tracking={tracking && Boolean(hand)} landmarks={hand?.landmarks} />
    <HandTracker videoRef={videoRef} retry={cameraRetry} onData={onData} onStatus={onStatus} onError={onError} />
    <ParticleControls template={template} onTemplateChange={setTemplate} palette={palettes[template]} onColorChange={(key, value) => setPalettes((current) => ({ ...current, [template]: { ...current[template], [key]: value } }))} onResetColors={() => { const defaults = { Brain: { main: '#ffa500', pulse: '#ffff00' }, DNA: { strandOne: '#00ffff', strandTwo: '#ff00ff', connector: '#ffffff' }, Saturn: { planet: '#ffaa00', ring: '#00ffff' }, Galaxy: { core: '#ffffff', outer: '#6633ff' }, Earth: { ocean: '#008cff', land: '#32cd32', atmosphere: '#bfefff' } }; setPalettes((current) => ({ ...current, [template]: defaults[template] })) }} minimized={controlsMinimized} onToggle={() => setControlsMinimized((value) => !value)} imageData={imageData} onImageLoad={setImageData} />
    <div className="footer-note">NEURAL FIELD / READY <span>●</span> 60 FPS TARGET</div>
  </main>
}

export default App
