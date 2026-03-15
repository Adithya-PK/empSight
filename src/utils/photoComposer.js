export function composeAuditImage(photoCanvas, sigCanvas, w, h) {
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const ctx = out.getContext('2d')

  ctx.drawImage(photoCanvas, 0, 0, w, h)

  const bandH = h * 0.3
  const bandY = h - bandH
  ctx.fillStyle = 'rgba(250,248,243,0.75)'
  ctx.fillRect(0, bandY, w, bandH)
  ctx.drawImage(sigCanvas, 0, 0, sigCanvas.width, sigCanvas.height, 8, bandY + 4, w - 16, bandH - 8)

  ctx.fillStyle = 'rgba(45,106,79,0.8)'
  ctx.font = '11px Fira Code, monospace'
  ctx.fillText('empSight · verified', 12, bandY + 14)

  return out.toDataURL('image/png')
}
