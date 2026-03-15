import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import DrawPad from '../components/DrawPad'
import { fetchStaff } from '../services/staffApi'
import { composeAuditImage } from '../utils/photoComposer'

const pKey = id => `es_photo_${id}`
const AUDIT_KEY = 'es_audit_img'
const STEPS = ['Capture', 'Sign', 'Result']

export default function StaffProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const snapRef = useRef(null)
  const padRef = useRef(null)
  const [camOn, setCamOn] = useState(false)
  const [camErr, setCamErr] = useState('')
  const [photo, setPhoto] = useState(() => localStorage.getItem(pKey(id)) ?? null)
  const [merged, setMerged] = useState(null)
  const [step, setStep] = useState(localStorage.getItem(pKey(id)) ? 1 : 0)

  useEffect(() => {
    fetchStaff()
      .then(rows => setPerson(rows.find(r => String(r.id) === String(id)) ?? rows[Number(id)] ?? null))
      .catch(() => setPerson(null))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => () => stopCam(), [])

  async function startCam() {
    setCamErr('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      setCamOn(true)
    } catch (e) { setCamErr(`Camera unavailable: ${e.message}`) }
  }

  function stopCam() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCamOn(false)
  }

  function snap() {
    const vid = videoRef.current, can = snapRef.current
    can.width = vid.videoWidth || 640
    can.height = vid.videoHeight || 480
    can.getContext('2d').drawImage(vid, 0, 0)
    const url = can.toDataURL('image/jpeg', 0.9)
    setPhoto(url)
    localStorage.setItem(pKey(id), url)
    stopCam()
    setStep(1)
  }

  function merge() {
    if (!padRef.current || padRef.current.isEmpty()) return alert('Please draw your signature first.')
    const can = snapRef.current
    const result = composeAuditImage(can, padRef.current.getCanvas(), can.width, can.height)
    setMerged(result)
    localStorage.setItem(AUDIT_KEY, result)
    setStep(2)
  }

  function reset() {
    setPhoto(null); setMerged(null)
    localStorage.removeItem(pKey(id)); localStorage.removeItem(AUDIT_KEY)
    padRef.current?.clear(); setStep(0)
  }

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex items-center gap-3 text-soft text-sm">
        <div className="w-5 h-5 border-2 border-[#2D6A4F]/30 border-t-[#2D6A4F] rounded-full animate-spin" />
        Loading…
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg">
      <TopBar />
      <main className="fade max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/list')}
          className="flex items-center gap-1.5 text-sm text-soft hover:text-[#2D6A4F] transition-colors mb-7">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path d="M10 12 6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to directory
        </button>

        {person ? (
          <div className="card p-6 mb-8 flex flex-wrap gap-5 items-start" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
            <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] border border-[#95D5B2] flex items-center justify-center shrink-0">
              <span className="font-head font-bold text-xl text-[#2D6A4F]">{String(person.name ?? 'E')[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-head text-2xl font-bold text-body">{person.name}</h1>
              <p className="text-soft text-sm mt-0.5 font-mono">{person.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[['City', person.city], ['Dept', person.department], ['Salary', `₹${Number(person.salary ?? 0).toLocaleString()}`], ['ID', `#${person.id}`]].map(([l, v]) => (
                  <div key={l} className="flex items-center gap-1.5 bg-paper border border-border rounded-lg px-3 py-1">
                    <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{l}</span>
                    <span className="text-xs font-medium text-body">{v ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-5 mb-8 text-soft text-sm">Employee #{id} not found</div>
        )}

        <div className="flex items-center gap-2 mb-7">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all
                ${step === i ? 'bg-[#D8F3DC] text-[#2D6A4F] border border-[#95D5B2]' : step > i ? 'text-[#52B788]' : 'text-muted'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border
                  ${step > i ? 'bg-[#2D6A4F] border-[#2D6A4F] text-white' : step === i ? 'border-[#2D6A4F] text-[#2D6A4F]' : 'border-border text-muted'}`}>
                  {step > i ? '✓' : i + 1}
                </span>
                {label}
              </div>
              {i < 2 && <div className="flex-1 h-px bg-border max-w-10" />}
            </React.Fragment>
          ))}
        </div>

        {step === 0 && (
          <div className="card p-6">
            <h2 className="font-head text-xl font-semibold text-body mb-4">Capture Photo</h2>
            {camErr && <p className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm mb-4">{camErr}</p>}
            <div className="relative bg-paper rounded-2xl overflow-hidden mb-5 aspect-video flex items-center justify-center border border-border">
              <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${camOn ? 'block' : 'hidden'}`} />
              {!camOn && (
                <div className="text-center text-muted">
                  <svg className="mx-auto mb-2 opacity-40" width="40" height="40" fill="none" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M9 7l1.5-3h3L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-sm">Camera inactive</p>
                </div>
              )}
            </div>
            <canvas ref={snapRef} className="hidden" />
            <div className="flex gap-3">
              {!camOn
                ? <button onClick={startCam} className="btn-primary">Start Camera</button>
                : <><button onClick={snap} className="btn-primary">Take Snapshot</button><button onClick={stopCam} className="btn-outline">Cancel</button></>
              }
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="card p-6">
            <h2 className="font-head text-xl font-semibold text-body mb-1">Draw Signature</h2>
            <p className="text-soft text-sm mb-5">Use mouse or finger to sign below</p>
            {photo && <img src={photo} alt="Captured" className="h-20 rounded-xl object-cover mb-5 border border-border" />}
            <DrawPad ref={padRef} width={700} height={160} />
            <div className="flex flex-wrap gap-3 mt-5">
              <button onClick={merge} className="btn-primary">Merge & Finish</button>
              <button onClick={() => padRef.current?.clear()} className="btn-outline">Clear</button>
              <button onClick={() => setStep(0)} className="btn-outline">Retake</button>
            </div>
          </div>
        )}

        {step === 2 && merged && (
          <div className="card p-6">
            <h2 className="font-head text-xl font-semibold text-body mb-4">Audit Image</h2>
            <img src={merged} alt="Audit" className="w-full max-w-lg rounded-2xl border border-border mb-6" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }} />
            <div className="flex gap-3">
              <a href={merged} download={`empsight_${id}_audit.png`} className="btn-primary">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1v8M4 6l3 3 3-3M2 10v1.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Download
              </a>
              <button onClick={reset} className="btn-outline">Start over</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
