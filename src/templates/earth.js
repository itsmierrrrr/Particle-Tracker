const TAU = Math.PI * 2

const continents = [
  { latitude: 0.55, longitude: -1.75, width: 0.55, height: 0.42 },
  { latitude: 0.1, longitude: -1.35, width: 0.34, height: 0.6 },
  { latitude: 0.78, longitude: -0.15, width: 0.24, height: 0.2 },
  { latitude: 0.15, longitude: 0.2, width: 0.5, height: 0.45 },
  { latitude: 0.58, longitude: 1.15, width: 1.05, height: 0.43 },
  { latitude: -0.48, longitude: 2.35, width: 0.35, height: 0.22 },
  { latitude: 1.12, longitude: -0.55, width: 0.32, height: 0.23 },
]

function angularLongitudeDistance(first, second) {
  const difference = Math.abs(first - second) % TAU
  return Math.min(difference, TAU - difference)
}

function isLand(latitude, longitude, index) {
  return continents.some((continent, continentIndex) => {
    const longitudeDistance = angularLongitudeDistance(longitude, continent.longitude)
    const latitudeDistance = Math.abs(latitude - continent.latitude)
    const shapeNoise = Math.sin(index * 0.71 + continentIndex * 4.2) * 0.035 + Math.sin(index * 0.19) * 0.025
    return (longitudeDistance / continent.width) ** 2 + (latitudeDistance / continent.height) ** 2 < 1 + shapeNoise
  })
}

export function getEarthGroup(index, count) {
  const y = 1 - 2 * ((index + 0.5) / count)
  const longitude = (index * 2.399963229728653) % TAU
  return isLand(Math.asin(y), longitude, index) ? 'land' : 'ocean'
}

export function generateEarth(count, target, groups, time = 0) {
  for (let i = 0; i < count; i += 1) {
    const y = 1 - 2 * ((i + 0.5) / count)
    const radius = Math.sqrt(Math.max(0, 1 - y * y))
    const longitude = (i * 2.399963229728653) % TAU
    const latitude = Math.asin(y)
    const land = isLand(latitude, longitude, i)
    const index = i * 3
    const surfaceOffset = land ? Math.sin(i * 0.43) * 0.012 : Math.sin(i * 0.27 + time) * 0.01
    const surfaceRadius = 1 + surfaceOffset
    target[index] = Math.cos(longitude) * radius * surfaceRadius
    target[index + 1] = y * surfaceRadius
    target[index + 2] = Math.sin(longitude) * radius * surfaceRadius
    groups[i] = land ? 'land' : 'ocean'
  }
}

