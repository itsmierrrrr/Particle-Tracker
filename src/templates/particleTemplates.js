const TAU = Math.PI * 2

function sphere(index, count, radius = 1) {
  const phi = Math.acos(1 - 2 * ((index + 0.5) / count)); const theta = TAU * index * 0.61803398875
  return [Math.sin(phi) * Math.cos(theta) * radius, Math.cos(phi) * radius, Math.sin(phi) * Math.sin(theta) * radius]
}

// Deterministic seeded random for consistent brain generation
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Create geometric lattice structure for neural rings
function createLatticeStructure(x, y, z, i, count) {
  // Create grid-like density pattern
  const gridX = Math.sin(x * 12.5) * 0.5 + 0.5
  const gridY = Math.sin(y * 12.5) * 0.5 + 0.5
  const gridZ = Math.sin(z * 12.5) * 0.5 + 0.5
  
  // Combine for lattice effect
  const lattice = gridX * gridY * gridZ
  
  return lattice
}

// Create concentric ring structure
function createRingStructure(x, y, z, layerIndex) {
  // Calculate distance from center
  const distFromCenter = Math.sqrt(x * x + y * y + z * z)
  
  // Create sharp ring patterns
  const ringThickness = 0.08
  const ringSize = 0.15 + layerIndex * 0.12
  
  // Distance to nearest ring
  const anglePattern = Math.atan2(Math.sqrt(x * x + z * z), y)
  const ringPattern = Math.abs(Math.sin(anglePattern * 8 + layerIndex * 0.5))
  
  return ringPattern
}

// Create structured neural network nodes
function createNeuralNode(x, y, z, i) {
  // Nodes arranged in geometric patterns
  const nodeSpacing = 0.2
  
  // Snap to nearest node position
  const nodeX = Math.round(x / nodeSpacing) * nodeSpacing
  const nodeY = Math.round(y / nodeSpacing) * nodeSpacing
  const nodeZ = Math.round(z / nodeSpacing) * nodeSpacing
  
  const distToNode = Math.sqrt(
    (x - nodeX) ** 2 + (y - nodeY) ** 2 + (z - nodeZ) ** 2
  )
  
  return Math.max(0, 1 - distToNode * 8)
}

// Generate particles for holographic AI brain - geometric spherical structure
export function generateBrain(count, target, time = 0) {
  const innerRingCount = Math.floor(count * 0.35)
  const middleRingCount = Math.floor(count * 0.35)
  const outerRingCount = Math.floor(count * 0.20)
  const coreCount = count - innerRingCount - middleRingCount - outerRingCount
  
  let particleIndex = 0
  
  // Inner core - densest ring with structured lattice
  for (let i = 0; i < coreCount; i += 1) {
    const index = particleIndex * 3
    particleIndex += 1
    
    // Create tightly packed core structure
    const phi = Math.acos(1 - 2 * ((i + 0.5) / coreCount))
    const theta = TAU * i * 0.61803398875 + seededRandom(i * 2.7) * 0.3
    
    let radius = 0.15 + seededRandom(i * 3.2) * 0.08
    
    let x = Math.sin(phi) * Math.cos(theta) * radius
    let y = Math.cos(phi) * radius
    let z = Math.sin(phi) * Math.sin(theta) * radius
    
    // Add lattice structure detail
    const lattice = createLatticeStructure(x, y, z, i, coreCount)
    x += Math.sin(lattice * 12.5 + i * 0.0012) * 0.012
    y += Math.cos(lattice * 10.2 + i * 0.0015) * 0.010
    z += Math.sin(lattice * 14.7 + i * 0.0011) * 0.012
    
    // Geometric ring pattern
    const ring = createRingStructure(x, y, z, 0)
    x *= (0.95 + ring * 0.08)
    z *= (0.95 + ring * 0.08)
    
    // Subtle pulse from center
    const pulse = Math.sin(time * 1.3 + i * 0.015) * 0.015
    radius += pulse
    
    target[index] = x
    target[index + 1] = y
    target[index + 2] = z
  }
  
  // Inner ring - first geometric layer
  for (let i = 0; i < innerRingCount; i += 1) {
    const index = particleIndex * 3
    particleIndex += 1
    
    const phi = Math.acos(1 - 2 * ((i + 0.5) / innerRingCount))
    const theta = TAU * i * 0.61803398875 + seededRandom(i * 5.1) * 0.4
    
    let radius = 0.26 + seededRandom(i * 6.3) * 0.12
    
    let x = Math.sin(phi) * Math.cos(theta) * radius
    let y = Math.cos(phi) * radius
    let z = Math.sin(phi) * Math.sin(theta) * radius
    
    // Structured neural nodes
    const nodeInfluence = createNeuralNode(x, y, z, i)
    const nodeAmount = nodeInfluence * 0.08
    
    // Ring geometry
    const ring = createRingStructure(x, y, z, 1)
    const ringDef = Math.sin(ring * TAU) * 0.02
    
    x += ringDef + Math.sin(i * 0.017 + time * 0.6) * 0.018
    y += Math.cos(i * 0.019 + time * 0.5) * 0.015
    z += ringDef + Math.sin(i * 0.021 + time * 0.7) * 0.018
    
    // Lattice overlay
    const lattice = createLatticeStructure(x, y, z, i, innerRingCount)
    x += Math.sin(lattice * 15.2 + i * 0.0018) * 0.010
    z += Math.cos(lattice * 13.1 + i * 0.0016) * 0.010
    
    target[index] = x
    target[index + 1] = y
    target[index + 2] = z
  }
  
  // Middle ring - secondary geometric structure
  for (let i = 0; i < middleRingCount; i += 1) {
    const index = particleIndex * 3
    particleIndex += 1
    
    const phi = Math.acos(1 - 2 * ((i + 0.5) / middleRingCount))
    const theta = TAU * i * 0.61803398875 + seededRandom(i * 7.9) * 0.5
    
    let radius = 0.42 + seededRandom(i * 8.7) * 0.14
    
    let x = Math.sin(phi) * Math.cos(theta) * radius
    let y = Math.cos(phi) * radius
    let z = Math.sin(phi) * Math.sin(theta) * radius
    
    // Ring layer definition
    const ring = createRingStructure(x, y, z, 2)
    const ringWave = Math.sin(ring * TAU * 2) * 0.025
    
    x += ringWave + Math.sin(i * 0.013 + time * 0.35) * 0.022
    y += Math.cos(i * 0.015 + time * 0.42) * 0.018
    z += ringWave + Math.sin(i * 0.017 + time * 0.48) * 0.022
    
    // Lattice grid pattern
    const lattice = createLatticeStructure(x, y, z, i, middleRingCount)
    x += Math.sin(lattice * 12.8 + i * 0.0022) * 0.012
    z += Math.cos(lattice * 11.3 + i * 0.0020) * 0.012
    
    // Gentle breathing animation
    const breathing = Math.sin(time * 0.4 + i * 0.008) * 0.008
    x *= (1 + breathing * 0.1)
    z *= (1 + breathing * 0.1)
    
    target[index] = x
    target[index + 1] = y
    target[index + 2] = z
  }
  
  // Outer ring - outermost geometric shell
  for (let i = 0; i < outerRingCount; i += 1) {
    const index = particleIndex * 3
    particleIndex += 1
    
    const phi = Math.acos(1 - 2 * ((i + 0.5) / outerRingCount))
    const theta = TAU * i * 0.61803398875 + seededRandom(i * 11.2) * 0.6
    
    let radius = 0.62 + seededRandom(i * 12.4) * 0.16
    
    let x = Math.sin(phi) * Math.cos(theta) * radius
    let y = Math.cos(phi) * radius
    let z = Math.sin(phi) * Math.sin(theta) * radius
    
    // Outer ring structure
    const ring = createRingStructure(x, y, z, 3)
    const outerWave = Math.sin(ring * TAU * 3) * 0.03
    
    x += outerWave + Math.sin(i * 0.011 + time * 0.25) * 0.025
    y += Math.cos(i * 0.013 + time * 0.30) * 0.020
    z += outerWave + Math.sin(i * 0.015 + time * 0.35) * 0.025
    
    // Lattice grid
    const lattice = createLatticeStructure(x, y, z, i, outerRingCount)
    x += Math.sin(lattice * 11.5 + i * 0.0025) * 0.014
    z += Math.cos(lattice * 9.8 + i * 0.0023) * 0.014
    
    // Outer layer subtle pulsing
    const outerPulse = Math.sin(time * 0.3 + i * 0.006) * 0.012
    x *= (1 + outerPulse * 0.12)
    z *= (1 + outerPulse * 0.12)
    
    target[index] = x
    target[index + 1] = y
    target[index + 2] = z
  }
}

export function generateDNA(count, target, time = 0) {
  for (let i = 0; i < count; i += 1) { const group = i % 3; const t = (i / count) * 12 * Math.PI; const y = (i / count - 0.5) * 2.4; const radius = 0.48; const angle = t + time * 0.65; const index = i * 3; if (group === 2) { const connector = (i % 2) * Math.PI; target[index] = Math.cos(angle + connector) * radius * 0.5; target[index + 1] = y; target[index + 2] = Math.sin(angle + connector) * radius * 0.5 } else { const strand = group; target[index] = Math.cos(angle + strand * Math.PI) * radius; target[index + 1] = y; target[index + 2] = Math.sin(angle + strand * Math.PI) * radius } }
}

export function generateSaturn(count, target, time = 0) {
  for (let i = 0; i < count; i += 1) { const index = i * 3; if (i % 3 === 0) { const angle = (i / count) * count * 0.16 + time * 0.18; const radius = 1.3 + (i % 19) * 0.018; target[index] = Math.cos(angle) * radius; target[index + 1] = Math.sin(angle) * 0.12; target[index + 2] = Math.sin(angle) * radius } else { const [x, y, z] = sphere(i, count, 0.72 + Math.sin(time + i) * 0.015); target[index] = x; target[index + 1] = y; target[index + 2] = z } }
}

export function generateGalaxy(count, target, time = 0) {
  for (let i = 0; i < count; i += 1) { const arm = i % 5; const radius = 0.06 + ((i * 37) % count) / count * 1.5; const angle = radius * 5.5 + arm * TAU / 5 + time * (0.35 + (1 - radius / 1.6) * 0.7); const index = i * 3; target[index] = Math.cos(angle) * radius; target[index + 1] = Math.sin(i * 12.7 + time) * 0.05 * (radius + 0.2); target[index + 2] = Math.sin(angle) * radius }
}

export function generateBlackHole(count, target, time = 0) {
  for (let i = 0; i < count; i += 1) { const radius = 0.18 + ((i * 53) % count) / count * 1.45; const angle = i * 0.47 + time * (1.1 - radius * 0.35); const index = i * 3; target[index] = Math.cos(angle) * radius; target[index + 1] = (i % 7 - 3) * 0.018; target[index + 2] = Math.sin(angle) * radius }
}

export function generateVortex(count, target, time = 0) {
  for (let i = 0; i < count; i += 1) { const radius = 0.08 + ((i * 29) % count) / count * 1.5; const angle = i * 0.42 + radius * 6 - time * 0.9; const index = i * 3; target[index] = Math.cos(angle) * radius; target[index + 1] = Math.sin(angle * 1.7) * 0.3; target[index + 2] = Math.sin(angle) * radius }
}

export function generateExplosion(count, target, time = 0) {
  const cycle = (time % 3.4) / 3.4
  for (let i = 0; i < count; i += 1) { const [x, y, z] = sphere(i, count, 0.12 + cycle * (1.2 + (i % 11) * 0.03)); const index = i * 3; target[index] = x; target[index + 1] = y; target[index + 2] = z }
}

export function generateFlame(count, target, time = 0) {
  for (let i = 0; i < count; i += 1) { const rise = ((i / count + time * 0.18) % 1); const width = 0.1 + rise * 0.68; const angle = i * 2.4 + time * 1.2; const turbulence = 0.45 + (Math.sin(i * 4.17) + 1) * 0.275; const index = i * 3; target[index] = Math.cos(angle) * width * turbulence; target[index + 1] = -1.1 + rise * 2.2; target[index + 2] = Math.sin(angle) * width * turbulence }
}

export function generateFireworks(count, target, time = 0) {
  const cycle = (time % 4) / 4; const burst = Math.floor(time / 4) % 4
  for (let i = 0; i < count; i += 1) { const ray = (i + burst * 7) % 40; const angle = ray * TAU / 40; const radius = 0.08 + cycle * (1.3 + (i % 17) * 0.018); const index = i * 3; target[index] = Math.cos(angle) * radius; target[index + 1] = Math.sin(angle) * radius - cycle * cycle * 0.75; target[index + 2] = Math.sin(i * 1.7) * radius * 0.45 }
}

export function generateHeart(count, target, time = 0) {
  const beat = 1 + Math.sin(time * 4.2) * 0.045
  for (let i = 0; i < count; i += 1) { const angle = (i / count) * TAU; const depth = (i % 31) / 31 * 0.42 - 0.21; const scale = 0.78 * beat; const index = i * 3; target[index] = 16 * Math.sin(angle) ** 3 * 0.07 * scale; target[index + 1] = (13 * Math.cos(angle) - 5 * Math.cos(angle * 2) - 2 * Math.cos(angle * 3) - Math.cos(angle * 4)) * 0.07 * scale; target[index + 2] = depth }
}

export function generateFlower(count, target, time = 0) {
  for (let i = 0; i < count; i += 1) { const angle = (i / count) * TAU * 7 + time * 0.16; const radius = 0.18 + 0.85 * Math.abs(Math.sin(angle * 2.5)); const index = i * 3; target[index] = Math.cos(angle) * radius; target[index + 1] = Math.sin(i * 0.37) * 0.2; target[index + 2] = Math.sin(angle) * radius }
}

// Extract dominant colors from image
export function extractImageColors(imageData) {
  const { canvas, ctx, width, height } = imageData
  const pixelCount = 100 // Sample 100 pixels
  const colorMap = {}
  
  for (let i = 0; i < pixelCount; i++) {
    const x = Math.floor(Math.random() * width)
    const y = Math.floor(Math.random() * height)
    const pixelData = ctx.getImageData(x, y, 1, 1).data
    const r = Math.round(pixelData[0] / 50) * 50
    const g = Math.round(pixelData[1] / 50) * 50
    const b = Math.round(pixelData[2] / 50) * 50
    const key = `${r},${g},${b}`
    colorMap[key] = (colorMap[key] || 0) + 1
  }
  
  // Get top 3 colors by frequency
  const colors = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number)
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    })
  
  return {
    primary: colors[0] || '#7ba8d1',
    secondary: colors[1] || '#5b88b2',
    tertiary: colors[2] || '#122c4f'
  }
}

export function createImageSamples(imageData, count) {
  const { ctx, width, height } = imageData
  const sourcePixels = ctx.getImageData(0, 0, width, height).data
  const aspectRatio = width / height
  const columns = Math.ceil(Math.sqrt(count * aspectRatio))
  const rows = Math.ceil(count / columns)
  const samples = new Array(count)

  for (let i = 0; i < count; i += 1) {
    const column = i % columns
    const row = Math.floor(i / columns)
    const x = Math.min(width - 1, Math.floor((column + 0.5) * width / columns))
    const y = Math.min(height - 1, Math.floor((row + 0.5) * height / rows))
    const pixelIndex = (y * width + x) * 4
    const red = sourcePixels[pixelIndex] / 255
    const green = sourcePixels[pixelIndex + 1] / 255
    const blue = sourcePixels[pixelIndex + 2] / 255
    const alpha = sourcePixels[pixelIndex + 3] / 255
    samples[i] = {
      x: (column / (columns - 1)) * 2 - 1,
      y: -((row / (rows - 1)) * 2 - 1),
      red,
      green,
      blue,
      brightness: (0.299 * red + 0.587 * green + 0.114 * blue) * alpha
    }
  }

  return samples
}

// Keep one particle per image cell so dark and fine details remain represented.
export function generateImagePattern(count, target, imageData, time = 0, colorTarget = null) {
  if (!imageData) {
    generateBrain(count, target, time)
    return
  }

  const samples = imageData.samples || createImageSamples(imageData, count)
  for (let i = 0; i < count; i++) {
    const index = i * 3
    const sample = samples[i % samples.length]
    const scale = 1.08 + Math.sin(time * 1.8) * 0.025
    target[index] = sample.x * scale
    target[index + 1] = sample.y * scale
    target[index + 2] = sample.brightness * 0.18 + Math.sin(time * 0.4 + i * 0.006) * 0.006
    if (colorTarget) {
      const glow = 0.55 + sample.brightness * 0.75
      colorTarget[index] = sample.red * glow
      colorTarget[index + 1] = sample.green * glow
      colorTarget[index + 2] = sample.blue * glow
    }
  }
}

export const TEMPLATE_GENERATORS = { Brain: generateBrain, DNA: generateDNA, Saturn: generateSaturn, Galaxy: generateGalaxy, 'Black Hole': generateBlackHole, Vortex: generateVortex, Explosion: generateExplosion, Flame: generateFlame, Fireworks: generateFireworks, Heart: generateHeart, Flower: generateFlower, Sphere: (count, target) => { for (let i = 0; i < count; i += 1) { const [x, y, z] = sphere(i, count); const index = i * 3; target[index] = x; target[index + 1] = y; target[index + 2] = z } } }

export function updateTemplate(name, count, target, time) { (TEMPLATE_GENERATORS[name] || generateBrain)(count, target, time) }
