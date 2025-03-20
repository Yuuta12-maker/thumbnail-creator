'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm mb-4">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-blue-600 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ホームに戻る
            </Link>
          </div>
          
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">
              選択したモードに合わせたサイズでサムネイルを作成できます
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}