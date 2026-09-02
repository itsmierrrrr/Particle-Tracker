import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { updateTemplate, generateBrain, generateImagePattern, extractImageColors, createImageSamples } from '../templates/particleTemplates'
import { generateEarth, getEarthGroup } from '../templates/earth'

export const PARTICLE_COUNT = 24000
const COUNT = PARTICLE_COUNT

function getParticleGroup(template, index) {
  if (template === 'Earth') return getEarthGroup(index, COUNT)
  if (template === 'DNA') return index % 3 === 2 ? 'connector' : index % 2 === 0 ? 'strandOne' : 'strandTwo'
  if (template === 'Saturn') return index % 3 === 0 ? 'ring' : 'planet'
  if (template === 'Galaxy') return index % 5 === 0 ? 'core' : 'outer'
  return index % 7 === 0 ? 'pulse' : 'main'
}

function makeBrainData(count) {
  const positions = new Float32Array(count * 3)
  const rest = new Float32Array(count * 3)
  const velocity = new Float32Array(count * 3)
  const seeds = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const targetColors = new Float32Array(count * 3)
  const brightnesses = new Float32Array(count)
  const groups = new Array(count)
  for (let i = 0; i < count; i += 1) {
    const phi = Math.acos(1 - 2 * ((i + 0.5) / count))
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const inner = i % 5 === 0
    const radius = inner ? 0.2 + Math.random() * 0.6 : 0.9 + Math.random() * 0.12
    const shellWobble = 1 + Math.sin(theta * 3.0 + phi * 7.0) * 0.035 + Math.sin(theta * 11.0) * 0.018
    const index = i * 3
    const x = Math.sin(phi) * Math.cos(theta) * radius * shellWobble
    const y = Math.cos(phi) * radius * shellWobble
    const z = Math.sin(phi) * Math.sin(theta) * radius * shellWobble
    positions[index] = rest[index] = x
    positions[index + 1] = rest[index + 1] = y
    positions[index + 2] = rest[index + 2] = z
    seeds[index] = Math.random() * 6.28; seeds[index + 1] = Math.random() * 6.28; seeds[index + 2] = Math.random() * 6.28
    const brightness = inner ? 1 : 0.62 + Math.random() * 0.3
    brightnesses[i] = brightness
    groups[i] = getParticleGroup('Brain', i)
    colors[index] = 0.3 * brightness; colors[index + 1] = 0.78 * brightness; colors[index + 2] = brightness
    targetColors[index] = colors[index]; targetColors[index + 1] = colors[index + 1]; targetColors[index + 2] = colors[index + 2]
  }
  return { positions, rest, targetRest: new Float32Array(rest), velocity, seeds, colors, targetColors, brightnesses, groups }
}

function makeParticleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64; canvas.height = 64
  const context = canvas.getContext('2d')
  const glow = context.createRadialGradient(32, 32, 1, 32, 32, 32)
  glow.addColorStop(0, 'rgba(255,255,255,1)'); glow.addColorStop(0.2, 'rgba(190,248,255,0.95)'); glow.addColorStop(0.5, 'rgba(87,211,238,0.42)'); glow.addColorStop(1, 'rgba(0,120,180,0)')
  context.fillStyle = glow; context.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

export function ParticleBrain({ hand, mouse, template = 'Brain', palette, imageData }) {
  const group = useRef(); const points = useRef()
  const data = useMemo(() => makeBrainData(COUNT), [])
  const geometry = useMemo(() => { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3)); geo.setAttribute('color', new THREE.BufferAttribute(data.colors, 3)); return geo }, [data])
  const texture = useMemo(() => makeParticleTexture(), [])
  const material = useMemo(() => new THREE.PointsMaterial({ size: 0.075, map: texture, vertexColors: true, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, sizeAttenuation: true, toneMapped: false }), [texture])
  const target = useMemo(() => ({ x: 0, y: 0, z: 3.25 }), [])
  const forcePoint = useMemo(() => new THREE.Vector3(), [])
  const imageDataRef = useRef(null)
  const imageColorsRef = useRef(null)
  
  useEffect(() => { 
    if (imageData) {
      const canvas = document.createElement('canvas')
      canvas.width = imageData.width
      canvas.height = imageData.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(imageData, 0, 0)
      imageDataRef.current = { canvas, ctx, width: imageData.width, height: imageData.height }
      imageDataRef.current.samples = createImageSamples(imageDataRef.current, COUNT)
      imageColorsRef.current = extractImageColors(imageDataRef.current)
    } else {
      imageDataRef.current = null
      imageColorsRef.current = null
    }
  }, [imageData])
  
  useEffect(() => { if (template === 'Brain' && !imageDataRef.current) data.targetRest.set(data.rest) }, [data, template])
  useEffect(() => { 
    const targetColors = data.targetColors
    for (let i = 0; i < COUNT; i += 1) { 
      const particleGroup = getParticleGroup(imageDataRef.current ? 'Image' : template, i)
      data.groups[i] = particleGroup
      
      let tint
      if (imageDataRef.current && imageColorsRef.current) {
        const colorList = [imageColorsRef.current.primary, imageColorsRef.current.secondary, imageColorsRef.current.tertiary]
        tint = new THREE.Color(colorList[i % 3])
      } else {
        tint = new THREE.Color(palette[particleGroup] || palette.main || '#00ffff')
      }
      
      const index = i * 3
      const brightness = data.brightnesses[i]
      targetColors[index] = tint.r * brightness
      targetColors[index + 1] = tint.g * brightness
      targetColors[index + 2] = tint.b * brightness 
    } 
  }, [data, palette, template, imageDataRef, imageColorsRef])
  useFrame((state, frameDelta) => {
    const object = points.current; if (!object) return
    const delta = Math.min(frameDelta, 0.033); const hasHand = Boolean(hand?.position)
    const isImageMode = Boolean(imageDataRef.current)
    
    target.x = hasHand ? (0.5 - hand.position.x) * (hand.pinch ? 2.8 : 2.35) : mouse.current.x * 0.3
    target.y = hasHand ? (hand.position.y - 0.5) * (hand.pinch ? 2.8 : 2.35) : mouse.current.y * 0.2
    const proximity = hasHand ? THREE.MathUtils.clamp((0.36 - hand.depth) / 0.28, 0, 1) : 0
    target.z = hasHand ? 5.2 - proximity * 3.9 : THREE.MathUtils.clamp(2.65 - mouse.current.wheel * 0.35, 2.2, 4.4)
    
    // Disable rotation in image mode
    if (isImageMode) {
      object.rotation.x = THREE.MathUtils.damp(object.rotation.x, 0, 6, delta)
      object.rotation.y = THREE.MathUtils.damp(object.rotation.y, 0, 6, delta)
    } else {
      object.rotation.x = THREE.MathUtils.damp(object.rotation.x, target.y, hasHand ? (hand.pinch ? 18 : 13) : 2, delta)
      object.rotation.y = THREE.MathUtils.damp(object.rotation.y, target.x + state.clock.elapsedTime * 0.035, hasHand ? (hand.pinch ? 18 : 13) : 1.2, delta)
    }
    
    object.position.z = THREE.MathUtils.damp(object.position.z, -target.z * 0.8, 6, delta)
    
    if (group.current) { 
      let scale
      if (isImageMode) {
        const zoomProgress = (state.clock.elapsedTime % 20) / 20
        const zoomAmount = zoomProgress <= 0.5 ? zoomProgress * 2 : (1 - zoomProgress) * 2
        scale = 1.5 + zoomAmount * 0.3
      } else {
        scale = hasHand ? 0.65 + proximity * 2.15 : 2.1
      }
      group.current.scale.x = THREE.MathUtils.damp(group.current.scale.x, scale, 6, delta)
      group.current.scale.y = group.current.scale.x
      group.current.scale.z = group.current.scale.x 
    }
    
    const array = geometry.attributes.position.array
    if (hasHand) forcePoint.set((0.5 - hand.position.x) * 2.8, (0.5 - hand.position.y) * 2, 0.4)
    const time = state.clock.elapsedTime
    if (imageDataRef.current) generateImagePattern(COUNT, data.targetRest, imageDataRef.current, time, data.targetColors)
    else if (template === 'Earth') generateEarth(COUNT, data.targetRest, data.groups, time)
    else if (template === 'Brain') generateBrain(COUNT, data.targetRest, time)
    else updateTemplate(template, COUNT, data.targetRest, time)
    for (let i = 0; i < COUNT; i += 1) {
      const index = i * 3; const dx = data.targetRest[index] - array[index]; const dy = data.targetRest[index + 1] - array[index + 1]; const dz = data.targetRest[index + 2] - array[index + 2]
      let pushX = 0; let pushY = 0; let pushZ = 0
      if (hasHand) { const hx = array[index] - forcePoint.x; const hy = array[index + 1] - forcePoint.y; const hz = array[index + 2] - forcePoint.z; const distSq = hx * hx + hy * hy + hz * hz; if (distSq < 0.8) { const strength = (0.8 - distSq) * (hand.pinch ? 1.35 : 1.05); pushX = hx * strength; pushY = hy * strength; pushZ = hz * strength } }
      data.velocity[index] += (dx * 7.5 + pushX) * delta; data.velocity[index + 1] += (dy * 7.5 + pushY) * delta; data.velocity[index + 2] += (dz * 7.5 + pushZ) * delta
      data.velocity[index] *= Math.exp(-7 * delta); data.velocity[index + 1] *= Math.exp(-7 * delta); data.velocity[index + 2] *= Math.exp(-7 * delta)
      array[index] += data.velocity[index] * delta + Math.sin(time * 0.7 + data.seeds[index]) * 0.0008; array[index + 1] += data.velocity[index + 1] * delta + Math.sin(time * 0.6 + data.seeds[index + 1]) * 0.0008; array[index + 2] += data.velocity[index + 2] * delta + Math.sin(time * 0.8 + data.seeds[index + 2]) * 0.0008
    }
    const colorArray = geometry.attributes.color.array
    for (let i = 0; i < COUNT * 3; i += 1) colorArray[i] += (data.targetColors[i] - colorArray[i]) * Math.min(1, delta * 7)
    geometry.attributes.position.needsUpdate = true; geometry.attributes.color.needsUpdate = true
  })
  return <group ref={group} scale={1.12}><points ref={points} geometry={geometry} material={material} frustumCulled={false} /></group>
}
