'use client'

import { useState, useEffect } from 'react'
import { fabric } from 'fabric'

interface EditorControlsProps {
  canvas: React.RefObject<fabric.Canvas>
  selectedObject: any
  type: string
}

export default function EditorControls({
  canvas,
  selectedObject,
  type
}: EditorControlsProps) {
  const [textValue, setTextValue] = useState('')
  const [fontSize, setFontSize] = useState(40)
  const [fontColor, setFontColor] = useState('#000000')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  
  // テンプレートリスト
  const templates = [
    { name: 'シンプル（白）', bg: '#ffffff', textColor: '#000000' },
    { name: 'シンプル（黒）', bg: '#000000', textColor: '#ffffff' },
    { name: 'ブルー', bg: '#1e40af', textColor: '#ffffff' },
    { name: 'レッド', bg: '#b91c1c', textColor: '#ffffff' },
    { name: 'グリーン', bg: '#15803d', textColor: '#ffffff' },
  ]
  
  // フィルターリスト
  const filters = [
    { name: 'なし', value: 'none' },
    { name: 'グレースケール', value: 'greyscale' },
    { name: 'セピア', value: 'sepia' },
    { name: 'コントラスト+', value: 'contrast' },
    { name: 'ぼかし', value: 'blur' },
  ]
  
  // 選択されたオブジェクトが変更されたとき
  useEffect(() => {
    if (selectedObject) {
      // テキストオブジェクトの場合
      if (selectedObject.type === 'i-text' || selectedObject.type === 'text') {
        setTextValue(selectedObject.text || '')
        setFontSize(selectedObject.fontSize || 40)
        setFontColor(selectedObject.fill || '#000000')
      }
    }
  }, [selectedObject])
  
  // テキスト更新
  const updateText = (value: string) => {
    setTextValue(value)
    
    if (selectedObject && (selectedObject.type === 'i-text' || selectedObject.type === 'text')) {
      selectedObject.set('text', value)
      canvas.current?.renderAll()
    }
  }
  
  // フォントサイズ更新
  const updateFontSize = (value: number) => {
    setFontSize(value)
    
    if (selectedObject && (selectedObject.type === 'i-text' || selectedObject.type === 'text')) {
      selectedObject.set('fontSize', value)
      canvas.current?.renderAll()
    }
  }
  
  // フォント色更新
  const updateFontColor = (value: string) => {
    setFontColor(value)
    
    if (selectedObject && (selectedObject.type === 'i-text' || selectedObject.type === 'text')) {
      selectedObject.set('fill', value)
      canvas.current?.renderAll()
    }
  }
  
  // 背景色更新
  const updateBackgroundColor = (value: string) => {
    setBackgroundColor(value)
    
    if (canvas.current) {
      canvas.current.setBackgroundColor(value, canvas.current.renderAll.bind(canvas.current))
    }
  }
  
  // テンプレートを適用
  const applyTemplate = (template: { bg: string, textColor: string }) => {
    if (canvas.current) {
      // 背景色を設定
      canvas.current.setBackgroundColor(
        template.bg, 
        canvas.current.renderAll.bind(canvas.current)
      )
      setBackgroundColor(template.bg)
      
      // すべてのテキストオブジェクトの色を更新
      canvas.current.getObjects().forEach(obj => {
        if (obj.type === 'i-text' || obj.type === 'text') {
          obj.set('fill', template.textColor)
        }
      })
      
      // フォントカラーを更新
      setFontColor(template.textColor)
      
      canvas.current.renderAll()
    }
  }
  
  // フィルター適用
  const applyFilter = (filterName: string) => {
    if (canvas.current) {
      const imgObjects = canvas.current.getObjects().filter(
        obj => obj.type === 'image'
      ) as fabric.Image[]
      
      imgObjects.forEach(img => {
        img.filters = []
        
        if (filterName === 'greyscale') {
          img.filters.push(new fabric.Image.filters.Grayscale())
        } else if (filterName === 'sepia') {
          img.filters.push(new fabric.Image.filters.Sepia())
        } else if (filterName === 'contrast') {
          img.filters.push(new fabric.Image.filters.Contrast({ contrast: 0.25 }))
        } else if (filterName === 'blur') {
          img.filters.push(new fabric.Image.filters.Blur({ blur: 0.25 }))
        }
        
        img.applyFilters()
      })
      
      canvas.current.renderAll()
    }
  }
  
  return (
    <div className="bg-white rounded-md shadow p-4">
      <h3 className="font-bold text-lg mb-4">編集パネル</h3>
      
      {selectedObject && (selectedObject.type === 'i-text' || selectedObject.type === 'text') && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">テキスト編集</h4>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              テキスト
            </label>
            <textarea
              value={textValue}
              onChange={(e) => updateText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              フォントサイズ: {fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={fontSize}
              onChange={(e) => updateFontSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              フォント色
            </label>
            <div className="flex items-center">
              <input
                type="color"
                value={fontColor}
                onChange={(e) => updateFontColor(e.target.value)}
                className="w-8 h-8 mr-2"
              />
              <input
                type="text"
                value={fontColor}
                onChange={(e) => updateFontColor(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">背景色</h4>
        <div className="flex items-center">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => updateBackgroundColor(e.target.value)}
            className="w-8 h-8 mr-2"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => updateBackgroundColor(e.target.value)}
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">テンプレート</h4>
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => applyTemplate(template)}
              className="flex flex-col items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div 
                className="w-full h-10 mb-1 rounded-sm" 
                style={{ backgroundColor: template.bg }}
              />
              <span className="text-xs">{template.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-semibold mb-2">画像フィルター</h4>
        <div className="grid grid-cols-2 gap-2">
          {filters.map((filter, index) => (
            <button
              key={index}
              onClick={() => applyFilter(filter.value)}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">サイズプリセット</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (canvas.current) {
                canvas.current.setWidth(1280)
                canvas.current.setHeight(720)
                canvas.current.renderAll()
              }
            }}
            className={`p-2 border rounded-md hover:bg-gray-50 text-sm ${type === 'youtube' ? 'bg-blue-50 border-blue-200' : ''}`}
          >
            YouTube (1280×720)
          </button>
          <button
            onClick={() => {
              if (canvas.current) {
                canvas.current.setWidth(1280)
                canvas.current.setHeight(670)
                canvas.current.renderAll()
              }
            }}
            className={`p-2 border rounded-md hover:bg-gray-50 text-sm ${type === 'note' ? 'bg-green-50 border-green-200' : ''}`}
          >
            note (1280×670)
          </button>
        </div>
      </div>
    </div>
  )
}
