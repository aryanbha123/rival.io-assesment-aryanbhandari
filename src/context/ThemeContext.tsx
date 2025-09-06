// ThemeContext.tsx
import {
  createContext,
  useMemo,
  useState,
  useContext,
  type ReactNode,
  useEffect
} from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createAppTheme } from '../components/layout/Theme'

type ThemeMode = 'light' | 'dark'

interface ThemeContextProps {
  mode: ThemeMode
  toggleMode: () => void
}

const ThemeModeContext = createContext<ThemeContextProps | undefined>(undefined)

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext)
  if (!ctx)
    throw new Error('useThemeMode must be used within ThemeModeProvider')
  return ctx
}

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeMode | null
    if (stored) {
      setMode(stored)
    }
  }, []);

  const toggleMode = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
