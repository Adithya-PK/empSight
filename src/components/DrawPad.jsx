import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const DrawPad = forwardRef(function DrawPad({ width = 640, height = 160, ink = '#2D6A4F' }, ref) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const prev = useRef({ x: 0, y: 0 })
  const [touched, setTouched] = useState(false)

  useImperativeHandle(ref, () => ({
    clear() { canvasRef.current?.getContext('2d').clearRect(0, 0, width, height); setTouched(false) },
    isEmpty: () => !touched,
    getCanvas: () => canvasRef.current,
  }))

  function getPos(e) {
    const c = canvasRef.current, r = c.getBoundingClientRect()
    const sx = c.width / r.width, sy = c.height / r.height
    if (e.touches) {
      const t = e.touches[0]
      return { x: (t.clientX - r.left) * sx, y: (t.clientY - r.top) * sy }
    }
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy }
  }

  function start(e) { e.preventDefault(); drawing.current = true; prev.current = getPos(e) }

  function move(e) {
    e.preventDefault()
    if (!drawing.current) return
    const ctx = canvasRef.current.getContext('2d')
    const p = getPos(e)
    ctx.beginPath(); ctx.moveTo(prev.current.x, prev.current.y); ctx.lineTo(p.x, p.y)
    ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.stroke()
    prev.current = p
    setTouched(true)
  }

  function end(e) { e?.preventDefault(); drawing.current = false }

  useEffect(() => {
    const c = canvasRef.current
    c.addEventListener('touchstart', start, { passive: false })
    c.addEventListener('touchmove', move, { passive: false })
    c.addEventListener('touchend', end, { passive: false })
    return () => {
      c.removeEventListener('touchstart', start)
      c.removeEventListener('touchmove', move)
      c.removeEventListener('touchend', end)
    }
  }, [])

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={width} height={height}
        className="sig w-full rounded-xl border-2 border-dashed border-[#E5DED0] bg-[#F5F0E8] block"
        style={{ touchAction: 'none' }}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end} />
      {!touched && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-muted pointer-events-none">
          Sign here
        </p>
      )}
    </div>
  )
})

export default DrawPad
