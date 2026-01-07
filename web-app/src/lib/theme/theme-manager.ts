import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeVariant = 'default' | 'glassmorphism' | 'minimal' | 'colorful'

export interface ThemeColors {
  // Background colors
  background: string
  foreground: string
  card: string
  'card-foreground': string
  popover: string
  'popover-foreground': string

  // Primary colors
  primary: string
  'primary-foreground': string
  secondary: string
  'secondary-foreground': string
  muted: string
  'muted-foreground': string
  accent: string
  'accent-foreground': string

  // Interactive states
  destructive: string
  'destructive-foreground': string
  border: string
  input: string
  ring: string

  // Status colors
  success: string
  warning: string
  error: string
  info: string

  // Custom colors
  gradient: {
    primary: string
    secondary: string
    accent: string
  }
}

export interface Theme {
  id: string
  name: string
  mode: ThemeMode
  variant: ThemeVariant
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  fonts: {
    body: string
    heading: string
    mono: string
  }
  borderRadius: string
  animations: boolean
}

export interface ThemeConfig {
  mode: ThemeMode
  variant: ThemeVariant
  customTheme?: Partial<Theme>
  animations: boolean
  transitions: boolean
}

export class ThemeManager {
  private static instance: ThemeManager
  private config: ThemeConfig = {
    mode: 'system',
    variant: 'default',
    animations: true,
    transitions: true
  }

  private themes: Map<string, Theme> = new Map()
  private listeners: Set<(theme: Theme, config: ThemeConfig) => void> = new Set()

  constructor() {
    if (ThemeManager.instance) {
      return ThemeManager.instance
    }
    ThemeManager.instance = this
    this.initialize()
  }

  private initialize(): void {
    // Load saved configuration
    const saved = localStorage.getItem('theme-config')
    if (saved) {
      this.config = { ...this.config, ...JSON.parse(saved) }
    }

    // Initialize built-in themes
    this.initializeThemes()

    // Detect system preference
    this.detectSystemPreference()

    // Apply initial theme
    this.applyTheme()

    // Listen for system theme changes
    this.setupSystemThemeListener()
  }

  private initializeThemes(): void {
    // Default Light Theme
    const defaultLightTheme: Theme = {
      id: 'default-light',
      name: 'Default Light',
      mode: 'light',
      variant: 'default',
      fonts: {
        body: 'Inter, system-ui, sans-serif',
        heading: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, Monaco, Consolas, monospace'
      },
      borderRadius: '0.5rem',
      animations: true,
      colors: {
        light: {
          background: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 84% 4.9%)',
          card: 'hsl(0 0% 100%)',
          'card-foreground': 'hsl(222.2 84% 4.9%)',
          popover: 'hsl(0 0% 100%)',
          'popover-foreground': 'hsl(222.2 84% 4.9%)',
          primary: 'hsl(222.2 47.4% 11.2%)',
          'primary-foreground': 'hsl(210 40% 98%)',
          secondary: 'hsl(210 40% 96%)',
          'secondary-foreground': 'hsl(222.2 47.4% 11.2%)',
          muted: 'hsl(210 40% 96%)',
          'muted-foreground': 'hsl(215.4 16.3% 46.9%)',
          accent: 'hsl(210 40% 96%)',
          'accent-foreground': 'hsl(222.2 47.4% 11.2%)',
          destructive: 'hsl(0 84.2% 60.2%)',
          'destructive-foreground': 'hsl(210 40% 98%)',
          border: 'hsl(214.3 31.8% 91.4%)',
          input: 'hsl(214.3 31.8% 91.4%)',
          ring: 'hsl(222.2 84% 4.9%)',
          success: 'hsl(142.1 76.2% 36.3%)',
          warning: 'hsl(32.5 94.6% 43.7%)',
          error: 'hsl(0 84.2% 60.2%)',
          info: 'hsl(199.4 89.1% 48.3%)',
          gradient: {
            primary: 'linear-gradient(135deg, hsl(222.2 47.4% 11.2%) 0%, hsl(210 40% 98%) 100%)',
            secondary: 'linear-gradient(135deg, hsl(210 40% 96%) 0%, hsl(214.3 31.8% 91.4%) 100%)',
            accent: 'linear-gradient(135deg, hsl(199.4 89.1% 48.3%) 0%, hsl(142.1 76.2% 36.3%) 100%)'
          }
        },
        dark: {
          background: 'hsl(222.2 84% 4.9%)',
          foreground: 'hsl(210 40% 98%)',
          card: 'hsl(222.2 84% 4.9%)',
          'card-foreground': 'hsl(210 40% 98%)',
          popover: 'hsl(222.2 84% 4.9%)',
          'popover-foreground': 'hsl(210 40% 98%)',
          primary: 'hsl(210 40% 98%)',
          'primary-foreground': 'hsl(222.2 47.4% 11.2%)',
          secondary: 'hsl(217.2 32.6% 17.5%)',
          'secondary-foreground': 'hsl(210 40% 98%)',
          muted: 'hsl(217.2 32.6% 17.5%)',
          'muted-foreground': 'hsl(215 20.2% 65.1%)',
          accent: 'hsl(217.2 32.6% 17.5%)',
          'accent-foreground': 'hsl(210 40% 98%)',
          destructive: 'hsl(0 62.8% 30.6%)',
          'destructive-foreground': 'hsl(210 40% 98%)',
          border: 'hsl(217.2 32.6% 17.5%)',
          input: 'hsl(217.2 32.6% 17.5%)',
          ring: 'hsl(212.7 26.8% 83.9%)',
          success: 'hsl(142.1 70.6% 45.3%)',
          warning: 'hsl(32.5 94.6% 43.7%)',
          error: 'hsl(0 62.8% 30.6%)',
          info: 'hsl(199.4 89.1% 48.3%)',
          gradient: {
            primary: 'linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(222.2 84% 4.9%) 100%)',
            secondary: 'linear-gradient(135deg, hsl(217.2 32.6% 17.5%) 0%, hsl(222.2 84% 4.9%) 100%)',
            accent: 'linear-gradient(135deg, hsl(199.4 89.1% 48.3%) 0%, hsl(142.1 70.6% 45.3%) 100%)'
          }
        }
      }
    }

    // Glassmorphism Theme
    const glassmorphismTheme: Theme = {
      ...defaultLightTheme,
      id: 'glassmorphism',
      name: 'Glassmorphism',
      variant: 'glassmorphism',
      colors: {
        light: {
          ...defaultLightTheme.colors.light,
          card: 'hsla(0, 0%, 100%, 0.8)',
          popover: 'hsla(0, 0%, 100%, 0.8)',
          border: 'hsla(214.3, 31.8%, 91.4%, 0.5)',
        },
        dark: {
          ...defaultLightTheme.colors.dark,
          card: 'hsla(222.2, 84%, 4.9%, 0.8)',
          popover: 'hsla(222.2, 84%, 4.9%, 0.8)',
          border: 'hsla(217.2, 32.6%, 17.5%, 0.5)',
        }
      }
    }

    // Minimal Theme
    const minimalTheme: Theme = {
      ...defaultLightTheme,
      id: 'minimal',
      name: 'Minimal',
      variant: 'minimal',
      borderRadius: '0.25rem',
      colors: {
        light: {
          ...defaultLightTheme.colors.light,
          border: 'hsl(214.3 31.8% 91.4%)',
          background: 'hsl(0 0% 98%)',
        },
        dark: {
          ...defaultLightTheme.colors.dark,
          border: 'hsl(217.2 32.6% 17.5%)',
          background: 'hsl(222.2 84% 7.9%)',
        }
      }
    }

    // Colorful Theme
    const colorfulTheme: Theme = {
      ...defaultLightTheme,
      id: 'colorful',
      name: 'Colorful',
      variant: 'colorful',
      colors: {
        light: {
          ...defaultLightTheme.colors.light,
          primary: 'hsl(262.1 83.3% 57.8%)',
          secondary: 'hsl(199.4 89.1% 48.3%)',
          accent: 'hsl(142.1 76.2% 36.3%)',
        },
        dark: {
          ...defaultLightTheme.colors.dark,
          primary: 'hsl(263.4 70% 50.4%)',
          secondary: 'hsl(199.4 89.1% 48.3%)',
          accent: 'hsl(142.1 70.6% 45.3%)',
        }
      }
    }

    this.themes.set('default', defaultLightTheme)
    this.themes.set('glassmorphism', glassmorphismTheme)
    this.themes.set('minimal', minimalTheme)
    this.themes.set('colorful', colorfulTheme)
  }

  private detectSystemPreference(): void {
    if (this.config.mode !== 'system') return

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersHighContrast) {
      this.config.variant = 'minimal'
    }

    if (prefersReducedMotion) {
      this.config.animations = false
      this.config.transitions = false
    }
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = () => {
      if (this.config.mode === 'system') {
        this.detectSystemPreference()
        this.applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    contrastQuery.addEventListener('change', handleChange)
    motionQuery.addEventListener('change', handleChange)
  }

  private applyTheme(): void {
    const html = document.documentElement
    const currentTheme = this.getCurrentTheme()

    if (!currentTheme) return

    // Remove previous theme classes
    html.className = html.className.replace(/theme-\w+/g, '').trim()

    // Add current theme class
    html.classList.add(`theme-${currentTheme.id}`)

    // Set CSS custom properties
    const colors = this.getResolvedColors()
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        html.style.setProperty(`--${key}`, value)
      }
    })

    // Set font variables
    html.style.setProperty('--font-body', currentTheme.fonts.body)
    html.style.setProperty('--font-heading', currentTheme.fonts.heading)
    html.style.setProperty('--font-mono', currentTheme.fonts.mono)

    // Set border radius
    html.style.setProperty('--radius', currentTheme.borderRadius)

    // Handle animations
    if (!this.config.animations) {
      html.style.setProperty('--animation-duration', '0s')
    }

    // Handle transitions
    if (!this.config.transitions) {
      html.style.setProperty('--transition-duration', '0s')
    }

    // Save configuration
    localStorage.setItem('theme-config', JSON.stringify(this.config))

    // Notify listeners
    this.listeners.forEach(listener => listener(currentTheme, this.config))
  }

  private getResolvedColors(): Record<string, string> {
    const theme = this.getCurrentTheme()
    if (!theme) return {}

    const mode = this.getResolvedMode()
    const colors = theme.colors[mode === 'dark' ? 'dark' : 'light']

    const resolved: Record<string, string> = {}

    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        resolved[key] = value
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          resolved[`${key}-${subKey}`] = subValue
        })
      }
    })

    return resolved
  }

  private getResolvedMode(): 'light' | 'dark' {
    if (this.config.mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return this.config.mode
  }

  // Public API methods
  getCurrentTheme(): Theme | null {
    return this.themes.get(this.config.variant) || this.themes.get('default') || null
  }

  getConfig(): ThemeConfig {
    return { ...this.config }
  }

  setMode(mode: ThemeMode): void {
    this.config.mode = mode
    this.applyTheme()
  }

  setVariant(variant: ThemeVariant): void {
    this.config.variant = variant
    this.applyTheme()
  }

  setAnimations(enabled: boolean): void {
    this.config.animations = enabled
    this.applyTheme()
  }

  setTransitions(enabled: boolean): void {
    this.config.transitions = enabled
    this.applyTheme()
  }

  toggleMode(): void {
    const currentMode = this.getResolvedMode()
    this.setMode(currentMode === 'dark' ? 'light' : 'dark')
  }

  getAvailableThemes(): Theme[] {
    return Array.from(this.themes.values())
  }

  addCustomTheme(theme: Theme): void {
    this.themes.set(theme.id, theme)
  }

  subscribe(listener: (theme: Theme, config: ThemeConfig) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Utility methods
  isDark(): boolean {
    return this.getResolvedMode() === 'dark'
  }

  isLight(): boolean {
    return this.getResolvedMode() === 'light'
  }

  getColorValue(colorKey: string): string {
    const colors = this.getResolvedColors()
    return colors[colorKey] || colorKey
  }
}

// React hook for using theme manager
export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null)
  const [config, setConfig] = useState<ThemeConfig | null>(null)

  useEffect(() => {
    const manager = new ThemeManager()

    const unsubscribe = manager.subscribe((newTheme, newConfig) => {
      setTheme(newTheme)
      setConfig(newConfig)
    })

    // Initial state
    setTheme(manager.getCurrentTheme())
    setConfig(manager.getConfig())

    return unsubscribe
  }, [])

  return {
    theme,
    config,
    setMode: (mode: ThemeMode) => new ThemeManager().setMode(mode),
    setVariant: (variant: ThemeVariant) => new ThemeManager().setVariant(variant),
    toggleMode: () => new ThemeManager().toggleMode(),
    setAnimations: (enabled: boolean) => new ThemeManager().setAnimations(enabled),
    setTransitions: (enabled: boolean) => new ThemeManager().setTransitions(enabled),
    isDark: () => new ThemeManager().isDark(),
    isLight: () => new ThemeManager().isLight(),
    getColorValue: (key: string) => new ThemeManager().getColorValue(key),
    getAvailableThemes: () => new ThemeManager().getAvailableThemes()
  }
}

export default ThemeManager
