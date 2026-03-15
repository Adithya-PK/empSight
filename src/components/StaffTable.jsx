import React, { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { calcViewport, ROW_H } from '../utils/scrollEngine'

const TABLE_H = 520

export default function StaffTable({ rows, columns }) {
  const navigate = useNavigate()
  const ref = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const onScroll = useCallback(() => setScrollTop(ref.current?.scrollTop ?? 0), [])
  const { start, end, slideY, totalH } = calcViewport(scrollTop, TABLE_H, rows.length)
  const visible = rows.slice(start, end)
  const cols = `repeat(${columns.length}, 1fr)`

  return (
    <div className="card overflow-hidden">
      <div className="grid bg-[#F5F0E8] border-b border-[#E5DED0] px-5 py-3" style={{ gridTemplateColumns: cols }}>
        {columns.map(c => (
          <span key={c.key} className="text-[11px] font-mono font-medium tracking-widest text-soft uppercase">{c.label}</span>
        ))}
      </div>

      <div ref={ref} onScroll={onScroll} className="overflow-y-auto relative" style={{ height: TABLE_H }}>
        <div style={{ height: totalH, position: 'relative' }}>
          <div style={{ transform: `translateY(${slideY}px)` }}>
            {visible.map((row, i) => {
              const key = row.id ?? (start + i)
              return (
                <div key={key} onClick={() => navigate(`/details/${key}`)}
                  className="grid items-center border-b border-[#E5DED0]/70 px-5 cursor-pointer hover:bg-[#F5F0E8]/80 transition-colors"
                  style={{ gridTemplateColumns: cols, height: ROW_H }}>
                  {columns.map(c => (
                    <span key={c.key} className="truncate pr-3 text-sm text-[#4A4A4A]">
                      {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between bg-[#F5F0E8] border-t border-[#E5DED0] px-5 py-2">
        <span className="text-xs font-mono text-muted">
          {rows.length ? `${start + 1}–${Math.min(end, rows.length)} of ${rows.length}` : '0 records'}
        </span>
        <span className="text-xs font-mono text-[#2D6A4F]">{visible.length} in DOM</span>
      </div>
    </div>
  )
}
