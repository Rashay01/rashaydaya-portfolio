'use client'

import { useState } from 'react'
import { useDialogBehavior } from '@/lib/hooks/useDialogBehavior'
import { MermaidDiagram } from './MermaidDiagram'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.25

type Props = { title: string; definition: string; onClose: () => void }

export function DiagramZoomModal({ title, definition, onClose }: Props) {
  const [zoom, setZoom] = useState(1)
  const overlayRef = useDialogBehavior(true, onClose)

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
            onClick={() => setZoom(1)}
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
      <div className="flex-1 overflow-auto p-8">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-150">
          <MermaidDiagram definition={definition} />
        </div>
      </div>
    </div>
  )
}
