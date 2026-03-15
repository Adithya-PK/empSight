export const ROW_H = 56
export const BUFFER = 5

export function calcViewport(scrollTop, containerH, total) {
  const visible = Math.ceil(containerH / ROW_H)
  const start = Math.max(0, Math.floor(scrollTop / ROW_H) - BUFFER)
  const end = Math.min(total, start + visible + BUFFER * 2)
  return { start, end, slideY: start * ROW_H, totalH: total * ROW_H }
}
