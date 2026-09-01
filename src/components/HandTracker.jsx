import { useEffect, useRef } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'
import { calculateHandDepth, calculatePalmPosition, detectOpenPalm, detectPinch } from '../utils/gestures'

const MEDIAPIPE_WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm'
const HAND_MODEL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

export function HandTracker({ videoRef, onData, onStatus, onError, retry }) {
  const localVideo = useRef(null)
  const lastSent = useRef(0)
  useEffect(() => {
    let stream
    let landmarker
    let raf
    let stopped = false
    async function start() {
      try {
        onStatus?.('searching')
        const video = videoRef?.current || localVideo.current
        if (!video || !navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is not available in this browser.')
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: false })
        video.srcObject = stream
        await video.play()
        await new Promise((resolve) => { const waitForVideo = () => video.videoWidth > 0 ? resolve() : requestAnimationFrame(waitForVideo); waitForVideo() })
        const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM)
        landmarker = await HandLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: HAND_MODEL, delegate: 'CPU' }, runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: 0.3, minHandPresenceConfidence: 0.3, minTrackingConfidence: 0.3 })
        onStatus?.('ready')
        const detect = (time) => {
          if (stopped) return
          if (video.readyState >= 2 && time - lastSent.current > 33) {
            lastSent.current = time
            try {
              const result = landmarker.detectForVideo(video, Math.round(time))
              const landmarks = result.landmarks?.[0]
              if (landmarks?.length === 21) onData({ landmarks, position: calculatePalmPosition(landmarks), depth: calculateHandDepth(landmarks), pinch: detectPinch(landmarks), open: detectOpenPalm(landmarks) })
              else onData(null)
            } catch (error) {
              onError?.(error)
              onStatus?.('error')
            }
          }
          raf = requestAnimationFrame(detect)
        }
        raf = requestAnimationFrame(detect)
      } catch (error) {
        onError?.(error)
        onStatus?.('error')
      }
    }
    start()
    return () => { stopped = true; cancelAnimationFrame(raf); landmarker?.close(); stream?.getTracks().forEach((track) => track.stop()) }
  }, [onData, onError, onStatus, retry, videoRef])
  return videoRef ? null : <video ref={localVideo} className="tracking-video" autoPlay muted playsInline />
}
