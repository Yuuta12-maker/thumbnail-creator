'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useRef } from 'react'
import { Editor, EditorControls, EditorToolbar, TemplatePresets } from './components'

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
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {type === 'youtube' ? 'YouTube' : 'note'} サムネイル エディタ
        </h1>
        <p className="text-gray-600">
          サイズ: {canvasWidth} x {canvasHeight} ピクセル
        </p>
      </div>
      
      {/* エディターツールバー */}
      <EditorToolbar canvas={canvasRef} />
      
      {/* メインコンテンツエリア */}
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* キャンバスエリア */}
        <div className="md:w-2/3 lg:w-3/4">
          <div className="bg-white p-4 rounded-md shadow">
            <Editor 
              width={canvasWidth} 
              height={canvasHeight} 
              onObjectSelected={handleObjectSelected}
              setCanvasRef={setCanvasRef}
            />
          </div>
          
          {/* テンプレートは下部に移動 */}
          <div className="mt-6">
            <TemplatePresets 
              canvas={canvasRef}
              type={type}
            />
          </div>
        </div>
        
        {/* コントロールパネル */}
        <div className="md:w-1/3 lg:w-1/4">
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