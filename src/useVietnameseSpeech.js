import { useCallback, useEffect, useRef, useState } from 'react'

export function useVietnameseSpeech(audioSource, enabled = true) {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [supported] = useState(() => typeof window !== 'undefined' && typeof window.Audio === 'function')
  const audioRef = useRef(null)

  useEffect(() => {
    if (!supported) return undefined
    setProgress(0)
    const audio = new Audio(audioSource)
    audio.preload = 'metadata'
    audioRef.current = audio

    const onPlaying = () => setStatus('speaking')
    const onTimeUpdate = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
    const onPause = () => {
      if (!audio.ended && audio.currentTime > 0) setStatus('paused')
    }
    const onEnded = () => { setStatus('idle'); setProgress(1) }
    const onError = () => setStatus('error')
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
    }
  }, [audioSource, supported])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      setProgress(0)
    }
    setStatus('idle')
  }, [])

  useEffect(() => { if (!enabled) stop() }, [enabled, stop])

  const speak = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !enabled) return
    try {
      audio.currentTime = 0
      setProgress(0)
      setStatus('loading')
      await audio.play()
    } catch {
      setStatus('error')
    }
  }, [enabled])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || audio.paused) return
    audio.pause()
  }, [])

  const resume = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !enabled) return
    try {
      setStatus('loading')
      await audio.play()
    } catch {
      setStatus('error')
    }
  }, [enabled])

  const seek = useCallback(fraction => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return false
    const next = Math.max(0, Math.min(1, fraction))
    audio.currentTime = next * audio.duration
    setProgress(next)
    return true
  }, [])

  return { status, supported, progress, speak, pause, resume, seek, stop }
}
