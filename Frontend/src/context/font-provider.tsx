import { createContext, useContext, useEffect, useState } from 'react'
import { fonts } from '@/config/fonts'

type Font = (typeof fonts)[number]

const FONT_COOKIE_NAME = 'font'

type FontContextType = {
  font: Font
  defaultFont: Font
  setFont: (font: Font) => void
  resetFont: () => void
}

const FontContext = createContext<FontContextType | null>(null)

export function FontProvider({ children }: { children: React.ReactNode }) {
  const defaultFont: Font = fonts[0]
  const [font, _setFont] = useState<Font>(() => {
    const savedFont = typeof window !== 'undefined' ? sessionStorage.getItem(FONT_COOKIE_NAME) : null
    return fonts.includes(savedFont as Font) ? (savedFont as Font) : defaultFont
  })

  useEffect(() => {
    const applyFont = (font: string) => {
      const root = document.documentElement
      root.classList.forEach((cls) => {
        if (cls.startsWith('font-')) root.classList.remove(cls)
      })
      root.classList.add(`font-${font}`)
    }

    applyFont(font)
  }, [font])

  const setFont = (font: Font) => {
    sessionStorage.setItem(FONT_COOKIE_NAME, font)
    _setFont(font)
  }

  const resetFont = () => {
    sessionStorage.removeItem(FONT_COOKIE_NAME)
    _setFont(defaultFont)
  }

  return (
    <FontContext value={{ font, defaultFont, setFont, resetFont }}>{children}</FontContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}
