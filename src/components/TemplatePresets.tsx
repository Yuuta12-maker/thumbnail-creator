'use client'

import { fabric } from 'fabric'

interface TemplatePresetsProps {
  canvas: React.RefObject<fabric.Canvas>
  type: string
}

export default function TemplatePresets({ canvas, type }: TemplatePresetsProps) {
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