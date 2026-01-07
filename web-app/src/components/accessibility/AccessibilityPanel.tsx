"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Eye,
  Volume2,
  Keyboard,
  Contrast,
  Type,
  SkipForward,
  Bell,
  CheckCircle,
  Settings,
  Info,
  AlertTriangle,
  Zap,
} from "lucide-react"
import { useAccessibility, type AccessibilityOptions } from "@/lib/accessibility/accessibility-manager"

export function AccessibilityPanel() {
  const {
    getOptions,
    updateOptions,
    toggleHighContrast,
    toggleReducedMotion,
    toggleLargeText,
    announce
  } = useAccessibility()

  const [options, setOptions] = useState<AccessibilityOptions>(getOptions())
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setOptions(getOptions())
  }, [getOptions])

  const handleOptionChange = (key: keyof AccessibilityOptions, value: boolean) => {
    const newOptions = { ...options, [key]: value }
    setOptions(newOptions)
    updateOptions(newOptions)

    // Announce the change
    const optionNames = {
      highContrast: 'High contrast',
      reducedMotion: 'Reduced motion',
      largeText: 'Large text',
      screenReaderOptimized: 'Screen reader optimization',
      keyboardNavigationOnly: 'Keyboard navigation only',
      focusVisible: 'Focus indicators',
      skipLinks: 'Skip links',
      announcements: 'Screen reader announcements'
    }

    announce(`${optionNames[key]} ${value ? 'enabled' : 'disabled'}`, 'polite')
  }

  const runAccessibilityCheck = () => {
    const issues = []

    // Check for missing alt text
    const images = document.querySelectorAll('img:not([alt])')
    if (images.length > 0) {
      issues.push(`${images.length} images missing alt text`)
    }

    // Check for missing labels
    const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]):not([placeholder])')
    if (unlabeledInputs.length > 0) {
      issues.push(`${unlabeledInputs.length} form inputs missing labels`)
    }

    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const levels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))
    const hierarchyIssues = levels.filter((level, index) => {
      if (index === 0) return false
      return level > levels[index - 1] + 1
    }).length

    if (hierarchyIssues > 0) {
      issues.push(`${hierarchyIssues} heading hierarchy issues`)
    }

    if (issues.length === 0) {
      announce('Accessibility check completed. No issues found.', 'polite')
    } else {
      announce(`Accessibility check found ${issues.length} issues: ${issues.join(', ')}`, 'assertive')
    }
  }

  const getComplianceLevel = () => {
    let score = 0
    const maxScore = 8

    if (options.highContrast) score++
    if (options.reducedMotion) score++
    if (options.largeText) score++
    if (options.screenReaderOptimized) score++
    if (options.keyboardNavigationOnly) score++
    if (options.focusVisible) score++
    if (options.skipLinks) score++
    if (options.announcements) score++

    const percentage = (score / maxScore) * 100

    if (percentage >= 80) return { level: 'AAA', color: 'text-green-600', bg: 'bg-green-100' }
    if (percentage >= 60) return { level: 'AA', color: 'text-blue-600', bg: 'bg-blue-100' }
    return { level: 'A', color: 'text-yellow-600', bg: 'bg-yellow-100' }
  }

  const compliance = getComplianceLevel()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
          <Eye className="w-4 h-4 mr-2" />
          Accessibility
          <Badge className={`ml-2 ${compliance.bg} ${compliance.color}`}>
            WCAG {compliance.level}
          </Badge>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Accessibility Settings
          </DialogTitle>
          <DialogDescription>
            Configure accessibility options to improve your experience with Codiner
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Compliance Status */}
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">WCAG Compliance Level</h4>
                  <p className="text-sm text-slate-600">
                    Current accessibility compliance status
                  </p>
                </div>
                <Badge className={`${compliance.bg} ${compliance.color} px-3 py-1`}>
                  WCAG {compliance.level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Visual Accessibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Visual Accessibility
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Contrast className="w-5 h-5 text-blue-500" />
                  <div>
                    <label className="font-medium">High Contrast</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Increase contrast between text and background
                    </p>
                  </div>
                </div>
                <Switch
                  checked={options.highContrast}
                  onCheckedChange={(checked) => handleOptionChange('highContrast', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Type className="w-5 h-5 text-green-500" />
                  <div>
                    <label className="font-medium">Large Text</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Increase font sizes throughout the application
                    </p>
                  </div>
                </div>
                <Switch
                  checked={options.largeText}
                  onCheckedChange={(checked) => handleOptionChange('largeText', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <div>
                    <label className="font-medium">Reduced Motion</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Minimize animations and transitions
                    </p>
                  </div>
                </div>
                <Switch
                  checked={options.reducedMotion}
                  onCheckedChange={(checked) => handleOptionChange('reducedMotion', checked)}
                />
              </div>
            </div>
          </div>

          {/* Navigation & Interaction */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Keyboard className="w-5 h-5 mr-2" />
              Navigation & Interaction
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Keyboard className="w-5 h-5 text-orange-500" />
                  <div>
                    <label className="font-medium">Keyboard Navigation Only</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Optimize interface for keyboard-only navigation
                    </p>
                  </div>
                </div>
                <Switch
                  checked={options.keyboardNavigationOnly}
                  onCheckedChange={(checked) => handleOptionChange('keyboardNavigationOnly', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-indigo-500" />
                  <div>
                    <label className="font-medium">Focus Indicators</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Show visible focus outlines for keyboard navigation
                    </p>
                  </div>
                </div>
                <Switch
                  checked={options.focusVisible}
                  onCheckedChange={(checked) => handleOptionChange('focusVisible', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <SkipForward className="w-5 h-5 text-teal-500" />
                  <div>
                    <label className="font-medium">Skip Links</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Show skip navigation links for screen readers
                    </p>
                  </div>
                </div>
                <Switch
                  checked={options.skipLinks}
                  onCheckedChange={(checked) => handleOptionChange('skipLinks', checked)}
                />
              </div>
            </div>
          </div>

          {/* Screen Reader Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Screen Reader Support
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-red-500" />
                  <div>
                    <label className="font-medium">Screen Reader Optimized</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Optimize content for screen reader accessibility
                    </p>
                  </div>
                </div>
                <Switch
                  checked={options.screenReaderOptimized}
                  onCheckedChange={(checked) => handleOptionChange('screenReaderOptimized', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-cyan-500" />
                  <div>
                    <label className="font-medium">Announcements</label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Enable screen reader announcements for status changes
                    </p>
                  </div>
                </div>
                <Switch
                  checked={options.announcements}
                  onCheckedChange={(checked) => handleOptionChange('announcements', checked)}
                />
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <Card className="bg-slate-50 dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">Ctrl+Alt+H</kbd>
                  <span className="ml-2">Toggle high contrast</span>
                </div>
                <div>
                  <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">Ctrl+Alt+M</kbd>
                  <span className="ml-2">Toggle reduced motion</span>
                </div>
                <div>
                  <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">Ctrl+Alt+L</kbd>
                  <span className="ml-2">Toggle large text</span>
                </div>
                <div>
                  <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">Tab</kbd>
                  <span className="ml-2">Navigate between elements</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Check */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Accessibility Check</CardTitle>
              <CardDescription>
                Run automated accessibility checks on the current page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runAccessibilityCheck} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Run Accessibility Check
              </Button>
            </CardContent>
          </Card>

          {/* Information */}
          <Card className="border-l-4 border-l-info">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">WCAG Compliance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Codiner follows WCAG 2.1 guidelines to ensure accessibility for all users.
                    These settings help customize the experience based on your needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
