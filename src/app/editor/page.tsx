'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Editor from '../../../components/Editor'
import EditorControls from '../../../components/EditorControls'
import EditorToolbar from '../../../components/EditorToolbar'
import TemplatePresets from '../../../components/TemplatePresets'

export default function EditorPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'youtube'
  const [canvasWidth, setCanvasWidth] = useState(type === 'youtube' ? 1280 : 1280)
  const [canvasHeight, setCanvasHeight] = useState(type === 'youtube' ? 720 : 670)
  const [selectedObject, setSelectedObject] = useState<any>(null)
  const canvasRef = useRef<any>(null)
  
  const handleObjectSelected = (obj: any) => {
    setSelectedObject(obj)
  }
  
  const setCanvasRef = (ref: any) => {
    canvasRef.current = ref
  }
  
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          {type === 'youtube' ? 'YouTube' : 'note'} サムネイル エディタ
        </h1>
        <p className="text-gray-600">
          サイズ: {canvasWidth} x {canvasHeight} ピクセル
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <EditorToolbar canvas={canvasRef} />
          <div className="mt-4 bg-white p-4 rounded-md shadow">
            <Editor 
              width={canvasWidth} 
              height={canvasHeight} 
              onObjectSelected={handleObjectSelected}
              setCanvasRef={setCanvasRef}
            />
          </div>
          
          <TemplatePresets 
            canvas={canvasRef}
            type={type}
          />
        </div>
        
        <div className="lg:w-1/4">
          <EditorControls 
            canvas={canvasRef} 
            selectedObject={selectedObject} 
            type={type}
          />
        </div>
      </div>
    </div>
  )
}