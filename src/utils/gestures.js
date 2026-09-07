const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, (a.z ?? 0) - (b.z ?? 0))

export function calculatePalmPosition(landmarks) {
  const palmLandmarks = [landmarks[0], landmarks[5], landmarks[9], landmarks[13], landmarks[17]]
  return palmLandmarks.reduce((center, landmark) => ({
    x: center.x + landmark.x / palmLandmarks.length,
    y: center.y + landmark.y / palmLandmarks.length,
    z: center.z + landmark.z / palmLandmarks.length,
  }), { x: 0, y: 0, z: 0 })
}

export function calculateHandDepth(landmarks) {
  return distance(landmarks[5], landmarks[17])
}

export function detectPinch(landmarks) {
  return distance(landmarks[4], landmarks[8]) < 0.07
}

export function detectOpenPalm(landmarks) {
  const palm = landmarks[0]
  const extended = [8, 12, 16, 20].filter((tip) => distance(landmarks[tip], palm) > 0.18)
  return extended.length >= 4 && !detectPinch(landmarks)
}
