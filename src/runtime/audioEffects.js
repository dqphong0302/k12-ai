let audioCtx = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return null
  if (!audioCtx) {
    try {
      audioCtx = new AudioContextClass()
    } catch {
      audioCtx = null
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

export function playCorrectSound(enabled = true) {
  if (!enabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + index * 0.08)
      gain.gain.setValueAtTime(0, now + index * 0.08)
      gain.gain.linearRampToValueAtTime(0.12, now + index * 0.08 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + index * 0.08)
      osc.stop(now + index * 0.08 + 0.36)
    })
  } catch {
    // audio fallback silent
  }
}

export function playWrongSound(enabled = true) {
  if (!enabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(220, now) // A3
    osc.frequency.exponentialRampToValueAtTime(146.83, now + 0.22) // D3
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.1, now + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.26)
  } catch {
    // audio fallback silent
  }
}

export function playVictorySound(enabled = true) {
  if (!enabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    const now = ctx.currentTime
    const chord = [
      { freq: 523.25, delay: 0.0, dur: 0.2 }, // C5
      { freq: 659.25, delay: 0.1, dur: 0.2 }, // E5
      { freq: 783.99, delay: 0.2, dur: 0.2 }, // G5
      { freq: 1046.5, delay: 0.3, dur: 0.45 }, // C6
      { freq: 1318.5, delay: 0.45, dur: 0.6 }  // E6
    ]
    chord.forEach(({ freq, delay, dur }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + delay)
      gain.gain.setValueAtTime(0, now + delay)
      gain.gain.linearRampToValueAtTime(0.14, now + delay + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + delay)
      osc.stop(now + delay + dur + 0.05)
    })
  } catch {
    // audio fallback silent
  }
}

export function playPopSound(enabled = true) {
  if (!enabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.06)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.08)
  } catch {
    // audio fallback silent
  }
}
