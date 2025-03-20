'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-6">
      <h1 className="text-4xl font-bold mb-6 text-center">サムネイル制作アプリ</h1>
      
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
        <p className="text-lg mb-6 text-center">
          YouTubeやnoteのサムネイルを簡単に作成できるツールです。
          画像をアップロードして、テキストや効果を追加しましょう。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">YouTube</h2>
            <p className="mb-4">推奨サイズ: 1280 x 720 ピクセル</p>
            <Link 
              href="/editor?type=youtube" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              作成する
            </Link>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">note</h2>
            <p className="mb-4">推奨サイズ: 1280 x 670 ピクセル</p>
            <Link 
              href="/editor?type=note" 
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              作成する
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">特徴:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>ドラッグ＆ドロップで画像アップロード</li>
            <li>テキスト追加と編集</li>
            <li>フィルターとエフェクト</li>
            <li>テンプレート機能</li>
            <li>簡単サイズ調整</li>
            <li>ローカル保存</li>
          </ul>
        </div>
      </div>
    </div>
  )
}