'use client'

import { useRef, useState } from 'react'
import { fabric } from 'fabric'
import { saveAs } from 'file-saver'

interface EditorToolbarProps {
  canvas: React.RefObject<fabric.Canvas>
}

export default function EditorToolbar({ canvas }: EditorToolbarProps) {
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