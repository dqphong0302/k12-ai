import { useCallback, useEffect, useRef, useState } from 'react'

export function useVietnameseSpeech(audioSource, enabled = true) {
  const [status, setStatus] = useState('idle')
  const [supported] = useState(() => typeof window !== 'undefined' && typeof window.Audio === 'function')
  const audioRef = useRef(null)

  useEffect(() => {
    if (!supported) return undefined
    const audio = new Audio(audioSource)
    audio.preload = 'metadata'
    audioRef.current = audio

    const onPlaying = () => setStatus('speaking')
    const onPause = () => {
      if (!audio.ended && audio.currentTime > 0) setStatus('paused')
    }
    const onEnded = () => setStatus('idle')
    const onError = () => setStatus('error')
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
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
    }
    setStatus('idle')
  }, [])

  useEffect(() => { if (!enabled) stop() }, [enabled, stop])

  const speak = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !enabled) return
    try {
      audio.currentTime = 0
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

  return { status, supported, speak, pause, resume, stop }
}
