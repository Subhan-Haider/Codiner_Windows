"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  Zap,
  Check,
  Settings,
} from "lucide-react"
import { useTheme, type ThemeMode, type ThemeVariant } from "@/lib/theme/theme-manager"
import { ThemeCustomizer } from "./ThemeCustomizer"
import { useAccessibility } from "@/lib/accessibility/accessibility-manager"

export function ThemeToggle() {
  const { config, setMode, setVariant, toggleMode, isDark, isLight, getAvailableThemes } = useTheme()
  const { announce } = useAccessibility()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !config) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Monitor className="h-4 w-4" />
      </Button>
    )
  }

  const handleModeChange = (mode: ThemeMode) => {
    setMode(mode)
    const modeNames = {
      light: 'Light mode',
      dark: 'Dark mode',
      system: 'System preference'
    }
    announce(`${modeNames[mode]} activated`, 'polite')
  }

  const handleVariantChange = (variant: ThemeVariant) => {
    setVariant(variant)
    const variantNames = {
      default: 'Default theme',
      glassmorphism: 'Glassmorphism theme',
      minimal: 'Minimal theme',
      colorful: 'Colorful theme'
    }
    announce(`${variantNames[variant]} applied`, 'polite')
  }

  const getModeIcon = () => {
    switch (config.mode) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getModeLabel = () => {
    switch (config.mode) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      default:
        return 'System'
    }
  }

  const themes = getAvailableThemes()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {getModeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Theme Settings</span>
          <Badge variant="outline" className="text-xs">
            {getModeLabel()}
          </Badge>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Theme Mode Selection */}
        <div className="px-2 py-1.5">
          <div className="text-xs font-medium text-muted-foreground mb-2">Mode</div>
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant={config.mode === 'light' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('light')}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Sun className="h-4 w-4" />
              <span className="text-xs">Light</span>
            </Button>

            <Button
              variant={config.mode === 'dark' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('dark')}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Moon className="h-4 w-4" />
              <span className="text-xs">Dark</span>
            </Button>

            <Button
              variant={config.mode === 'system' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleModeChange('system')}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <Monitor className="h-4 w-4" />
              <span className="text-xs">Auto</span>
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Theme Variants */}
        <div className="px-2 py-1.5">
          <div className="text-xs font-medium text-muted-foreground mb-2">Style</div>
          <div className="space-y-1">
            {themes.map((theme) => (
              <Button
                key={theme.id}
                variant="ghost"
                size="sm"
                onClick={() => handleVariantChange(theme.variant)}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="text-sm">{theme.name}</span>
                </div>
                {config.variant === theme.variant && (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Animation Settings */}
        <div className="px-2 py-1.5">
          <div className="text-xs font-medium text-muted-foreground mb-2">Preferences</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Animations</span>
              </div>
              <Switch
                checked={config.animations}
                onCheckedChange={(checked) => {
                  // This would need to be implemented in the theme manager
                  console.log('Toggle animations:', checked)
                }}
                size="sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Transitions</span>
              </div>
              <Switch
                checked={config.transitions}
                onCheckedChange={(checked) => {
                  // This would need to be implemented in the theme manager
                  console.log('Toggle transitions:', checked)
                }}
                size="sm"
              />
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Quick Actions */}
        <div className="px-2 py-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMode}
            className="w-full justify-start"
          >
            <Monitor className="h-4 w-4 mr-2" />
            Toggle {isDark() ? 'Light' : 'Dark'} Mode
          </Button>
        </div>

        {/* Customizer */}
        <div className="px-2 py-1.5 border-t">
          <ThemeCustomizer />
        </div>

        {/* Current Status */}
        <div className="px-2 py-1.5 border-t">
          <div className="text-xs text-muted-foreground">
            Current: {getModeLabel()} mode with {config.variant} theme
            {isDark() && ' 🌙'}
            {isLight() && ' ☀️'}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Quick theme toggle button (just mode toggle)
export function QuickThemeToggle() {
  const { config, toggleMode, isDark } = useTheme()
  const { announce } = useAccessibility()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !config) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Monitor className="h-4 w-4" />
      </Button>
    )
  }

  const handleToggle = () => {
    toggleMode()
    announce(`${isDark() ? 'Light' : 'Dark'} mode activated`, 'polite')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      title={`Switch to ${isDark() ? 'light' : 'dark'} mode`}
    >
      {isDark() ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">
        Switch to {isDark() ? 'light' : 'dark'} mode
      </span>
    </Button>
  )
}
