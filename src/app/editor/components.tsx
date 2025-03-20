'use client'

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { saveAs } from 'file-saver'

// Editor コンポーネント
export function Editor({
  width,
  height,
  onObjectSelected,
  setCanvasRef
}: {
  width: number
  height: number
  onObjectSelected: (obj: any) => void
  setCanvasRef: (ref: any) => void
}) {
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // キャンバスの初期化
  useEffect(() => {
    if (canvasEl.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasEl.current, {
        width,
        height,
        backgroundColor: '#ffffff',
      })
      
      setCanvas(fabricCanvas)
      setCanvasRef(fabricCanvas)
      setIsLoaded(true)
      
      // イベントリスナー設定
      fabricCanvas.on('selection:created', function(e) {
        onObjectSelected(fabricCanvas.getActiveObject())
      })
      
      fabricCanvas.on('selection:updated', function(e) {
        onObjectSelected(fabricCanvas.getActiveObject())
      })
      
      fabricCanvas.on('selection:cleared', function() {
        onObjectSelected(null)
      })
      
      // クリーンアップ関数
      return () => {
        fabricCanvas.dispose()
        setCanvas(null)
      }
    }
  }, [canvasEl])
  
  // サイズ変更時に調整
  useEffect(() => {
    if (canvas) {
      canvas.setWidth(width)
      canvas.setHeight(height)
      canvas.renderAll()
    }
  }, [width, height, canvas])
  
  return (
    <div className="relative editor-container overflow-auto">
      <div className="canvas-wrapper">
        <canvas ref={canvasEl} id="canvas"></canvas>
      </div>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
          <div className="text-gray-600">読み込み中...</div>
        </div>
      )}
    </div>
  )
}

// EditorControls コンポーネント
export function EditorControls({
  canvas,
  selectedObject,
  type
}: {
  canvas: React.RefObject<fabric.Canvas>
  selectedObject: any
  type: string
}) {
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

// EditorToolbar コンポーネント
export function EditorToolbar({ canvas }: { canvas: React.RefObject<fabric.Canvas> }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  // 画像をアップロード
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    
    const file = e.target.files[0]
    const reader = new FileReader()
    
    setIsUploading(true)
    
    reader.onload = (event) => {
      if (!event.target || !event.target.result) return
      
      fabric.Image.fromURL(event.target.result.toString(), (img) => {
        if (canvas.current) {
          // キャンバスを元にリサイズ
          const canvasWidth = canvas.current.getWidth()
          const canvasHeight = canvas.current.getHeight()
          
          // 画像のアスペクト比を維持しながらリサイズ
          const scaleFactor = Math.min(
            canvasWidth / img.width!,
            canvasHeight / img.height!
          )
          
          img.scale(scaleFactor)
          img.set({
            left: (canvasWidth - img.width! * scaleFactor) / 2,
            top: (canvasHeight - img.height! * scaleFactor) / 2,
          })
          
          // 既存の画像をクリア
          canvas.current.getObjects().forEach((obj) => {
            if (obj.type === 'image') {
              canvas.current!.remove(obj)
            }
          })
          
          canvas.current.add(img)
          canvas.current.renderAll()
          canvas.current.setActiveObject(img)
        }
        setIsUploading(false)
      })
    }
    
    reader.readAsDataURL(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  // テキストを追加
  const addText = () => {
    if (canvas.current) {
      const text = new fabric.IText('テキストを入力', {
        left: 50,
        top: 50,
        fill: '#000000',
        fontFamily: 'Arial',
        fontSize: 40,
      })
      
      canvas.current.add(text)
      canvas.current.setActiveObject(text)
      canvas.current.renderAll()
    }
  }
  
  // 要素を削除
  const removeSelected = () => {
    if (canvas.current) {
      const activeObjects = canvas.current.getActiveObjects()
      if (activeObjects.length) {
        activeObjects.forEach((obj) => {
          canvas.current!.remove(obj)
        })
        
        canvas.current.discardActiveObject()
        canvas.current.renderAll()
      }
    }
  }
  
  // 画像を保存
  const saveImage = () => {
    if (canvas.current) {
      // キャンバスをデータURLに変換
      const dataURL = canvas.current.toDataURL({
        format: 'png',
        quality: 1,
      })
      
      // ファイルとして保存
      const fileName = `thumbnail-${new Date().getTime()}.png`
      saveAs(dataURL, fileName)
    }
  }
  
  return (
    <div className="bg-white p-4 rounded-md shadow flex flex-wrap gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        disabled={isUploading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        画像をアップロード
      </button>
      
      <button
        onClick={addText}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h12M9 3v18" />
        </svg>
        テキスト追加
      </button>
      
      <button
        onClick={removeSelected}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        削除
      </button>
      
      <button
        onClick={saveImage}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center ml-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        保存
      </button>
    </div>
  )
}

// TemplatePresets コンポーネント
export function TemplatePresets({ canvas, type }: { canvas: React.RefObject<fabric.Canvas>, type: string }) {
  // YouTubeテンプレート
  const youtubeTemplates = [
    {
      name: 'プレーン',
      preview: '/template-youtube-plain.png',
      apply: () => {
        if (canvas.current) {
          canvas.current.setBackgroundColor('#ffffff', canvas.current.renderAll.bind(canvas.current))
        }
      },
    },
    {
      name: 'タイトルとサブタイトル',
      preview: '/template-youtube-title.png',
      apply: () => {
        if (canvas.current) {
          // 背景設定
          canvas.current.setBackgroundColor('#1a365d', canvas.current.renderAll.bind(canvas.current))
          
          // タイトルテキスト
          const title = new fabric.IText('メインタイトル', {
            left: 640,
            top: 260,
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontSize: 72,
            fontWeight: 'bold',
            textAlign: 'center',
            originX: 'center',
          })
          
          // サブタイトル
          const subtitle = new fabric.IText('サブタイトル', {
            left: 640,
            top: 360,
            fill: '#f7fafc',
            fontFamily: 'Arial',
            fontSize: 48,
            originX: 'center',
          })
          
          // キャンバスをクリア
          canvas.current.clear()
          
          // オブジェクトを追加
          canvas.current.add(title, subtitle)
          canvas.current.renderAll()
        }
      },
    },
    {
      name: 'ハウツー',
      preview: '/template-youtube-howto.png',
      apply: () => {
        if (canvas.current) {
          // 背景設定
          canvas.current.setBackgroundColor('#e6f7ff', canvas.current.renderAll.bind(canvas.current))
          
          // テキスト背景の長方形
          const rect = new fabric.Rect({
            left: 640,
            top: 360,
            width: 1000,
            height: 150,
            fill: 'rgba(0, 102, 204, 0.8)',
            originX: 'center',
            originY: 'center',
          })
          
          // テキスト
          const text = new fabric.IText('ハウツー動画タイトル', {
            left: 640,
            top: 360,
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontSize: 64,
            fontWeight: 'bold',
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
          })
          
          // キャンバスをクリア
          canvas.current.clear()
          
          // オブジェクトを追加
          canvas.current.add(rect, text)
          canvas.current.renderAll()
        }
      },
    },
  ]
  
  // noteテンプレート
  const noteTemplates = [
    {
      name: 'プレーン',
      preview: '/template-note-plain.png',
      apply: () => {
        if (canvas.current) {
          canvas.current.setBackgroundColor('#ffffff', canvas.current.renderAll.bind(canvas.current))
        }
      },
    },
    {
      name: '記事タイトル',
      preview: '/template-note-article.png',
      apply: () => {
        if (canvas.current) {
          // 背景設定
          canvas.current.setBackgroundColor('#f0f9ff', canvas.current.renderAll.bind(canvas.current))
          
          // 背景矩形
          const rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: 1280,
            height: 670,
            fill: 'linear-gradient(to bottom, #f0f9ff, #e6f7ff)',
          })
          
          // タイトルテキスト
          const title = new fabric.IText('記事タイトルをここに入力', {
            left: 640,
            top: 335,
            fill: '#0c4a6e',
            fontFamily: 'Arial',
            fontSize: 64,
            fontWeight: 'bold',
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
          })
          
          // キャンバスをクリア
          canvas.current.clear()
          
          // オブジェクトを追加
          canvas.current.add(rect, title)
          canvas.current.renderAll()
        }
      },
    },
    {
      name: 'シンプルブラック',
      preview: '/template-note-dark.png',
      apply: () => {
        if (canvas.current) {
          // 背景設定
          canvas.current.setBackgroundColor('#000000', canvas.current.renderAll.bind(canvas.current))
          
          // タイトルテキスト
          const title = new fabric.IText('タイトル', {
            left: 640,
            top: 280,
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontSize: 72,
            fontWeight: 'bold',
            textAlign: 'center',
            originX: 'center',
          })
          
          // サブタイトル
          const subtitle = new fabric.IText('サブタイトル', {
            left: 640,
            top: 390,
            fill: '#e0e0e0',
            fontFamily: 'Arial',
            fontSize: 48,
            originX: 'center',
          })
          
          // キャンバスをクリア
          canvas.current.clear()
          
          // オブジェクトを追加
          canvas.current.add(title, subtitle)
          canvas.current.renderAll()
        }
      },
    },
  ]
  
  // 使用するテンプレートを選択
  const templates = type === 'youtube' ? youtubeTemplates : noteTemplates
  
  return (
    <div className="mt-8">
      <h3 className="font-bold text-lg mb-4">テンプレート</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={template.apply}
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-sm">{template.name}のプレビュー</div>
            </div>
            <div className="p-3 text-center">
              <h4 className="font-medium">{template.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}