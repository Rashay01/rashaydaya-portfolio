'use client'

import { useRef, useState } from 'react'
import { useDialogBehavior } from '@/lib/hooks/useDialogBehavior'
import { MermaidDiagram } from './MermaidDiagram'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25

type Props = { title: string; definition: string; onClose: () => void }

function pinchDist(touches: React.TouchList) {
  const dx = touches[0].clientX - touches[1].clientX
  const dy = touches[0].clientY - touches[1].clientY
  return Math.sqrt(dx * dx + dy * dy)
}

export function DiagramZoomModal({ title, definition, onClose }: Props) {
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const overlayRef = useDialogBehavior(true, onClose)
  const lastTouch = useRef<{ x: number; y: number } | null>(null)
  const lastPinch = useRef<number | null>(null)

  function resetView() {
    setZoom(1)
    setPanX(0)
    setPanY(0)
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      lastPinch.current = null
      setDragging(true)
    } else if (e.touches.length === 2) {
      lastPinch.current = pinchDist(e.touches)
      lastTouch.current = null
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 1 && lastTouch.current) {
      const dx = e.touches[0].clientX - lastTouch.current.x
      const dy = e.touches[0].clientY - lastTouch.current.y
      setPanX((x) => x + dx)
      setPanY((y) => y + dy)
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    } else if (e.touches.length === 2 && lastPinch.current !== null) {
      const dist = pinchDist(e.touches)
      const ratio = dist / lastPinch.current
      setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * ratio)))
      lastPinch.current = dist
    }
  }

  function handleTouchEnd() {
    setDragging(false)
    lastTouch.current = null
    lastPinch.current = null
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title + ' diagram, expanded'}
      className="fixed inset-0 z-50 flex flex-col bg-obsidian/95 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-2 border-b border-ash/10 px-4 py-3 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-ash">{title}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
            aria-label="Zoom out"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-ash/15 text-satin hover:border-filament/60 hover:text-filament"
          >
            −
          </button>
          <span className="w-12 text-center font-mono text-xs text-ash">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
            aria-label="Zoom in"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-ash/15 text-satin hover:border-filament/60 hover:text-filament"
          >
            +
          </button>
          <button
            type="button"
            onClick={resetView}
            className="ml-1 min-h-11 rounded-sm border border-ash/15 px-3 font-mono text-[10px] uppercase tracking-widest text-ash hover:border-filament/60 hover:text-filament"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close diagram"
            className="ml-2 flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-ash/15 text-satin hover:border-filament/60 hover:text-filament"
          >
            ✕
          </button>
        </div>
      </div>
      {/* touch-action:none lets us handle pan/pinch without browser interference */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{ touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 flex items-center justify-center p-8"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transition: dragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <MermaidDiagram definition={definition} />
        </div>
      </div>
    </div>
  )
}
