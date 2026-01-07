import { useEffect, useRef } from 'react'

export interface AccessibilityOptions {
  highContrast: boolean
  reducedMotion: boolean
  largeText: boolean
  screenReaderOptimized: boolean
  keyboardNavigationOnly: boolean
  focusVisible: boolean
  skipLinks: boolean
  announcements: boolean
}

export interface A11yAnnouncement {
  id: string
  message: string
  priority: 'polite' | 'assertive'
  timestamp: number
}

export class AccessibilityManager {
  private static instance: AccessibilityManager
  private options: AccessibilityOptions = {
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    screenReaderOptimized: false,
    keyboardNavigationOnly: false,
    focusVisible: true,
    skipLinks: true,
    announcements: true
  }

  private announcements: A11yAnnouncement[] = []
  private announcementContainer: HTMLElement | null = null
  private skipLinksContainer: HTMLElement | null = null

  constructor() {
    if (AccessibilityManager.instance) {
      return AccessibilityManager.instance
    }
    AccessibilityManager.instance = this
    this.initialize()
  }

  private initialize(): void {
    // Load preferences from localStorage
    const saved = localStorage.getItem('accessibility-preferences')
    if (saved) {
      this.options = { ...this.options, ...JSON.parse(saved) }
    }

    // Detect user preferences
    this.detectSystemPreferences()

    // Create accessibility containers
    this.createAnnouncementContainer()
    this.createSkipLinks()

    // Apply initial settings
    this.applyAccessibilitySettings()

    // Listen for keyboard navigation
    this.setupKeyboardNavigation()

    // Setup focus management
    this.setupFocusManagement()
  }

  private detectSystemPreferences(): void {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion && !localStorage.getItem('accessibility-preferences')) {
      this.options.reducedMotion = true
    }

    // Check for prefers-contrast
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    if (prefersHighContrast && !localStorage.getItem('accessibility-preferences')) {
      this.options.highContrast = true
    }

    // Check for screen reader usage (approximate detection)
    const screenReaderIndicators = [
      'NVDA',
      'JAWS',
      'VoiceOver',
      'TalkBack',
      'NV Access'
    ]

    const userAgent = navigator.userAgent
    const usingScreenReader = screenReaderIndicators.some(indicator =>
      userAgent.includes(indicator)
    )

    if (usingScreenReader) {
      this.options.screenReaderOptimized = true
    }
  }

  private createAnnouncementContainer(): void {
    if (this.announcementContainer) return

    this.announcementContainer = document.createElement('div')
    this.announcementContainer.id = 'a11y-announcements'
    this.announcementContainer.setAttribute('aria-live', 'polite')
    this.announcementContainer.setAttribute('aria-atomic', 'true')
    this.announcementContainer.style.position = 'absolute'
    this.announcementContainer.style.left = '-10000px'
    this.announcementContainer.style.width = '1px'
    this.announcementContainer.style.height = '1px'
    this.announcementContainer.style.overflow = 'hidden'

    document.body.appendChild(this.announcementContainer)
  }

  private createSkipLinks(): void {
    if (!this.options.skipLinks || this.skipLinksContainer) return

    this.skipLinksContainer = document.createElement('div')
    this.skipLinksContainer.id = 'skip-links'
    this.skipLinksContainer.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
    `

    // Add CSS for skip links
    const style = document.createElement('style')
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
      }
      .skip-link:focus {
        top: 6px;
      }
    `
    document.head.appendChild(style)
    document.body.insertBefore(this.skipLinksContainer, document.body.firstChild)
  }

  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (event) => {
      // Handle keyboard navigation enhancements
      if (event.key === 'Tab') {
        this.options.focusVisible = true
        document.documentElement.classList.add('keyboard-navigation')
      }

      // Custom keyboard shortcuts for accessibility
      if (event.ctrlKey && event.altKey) {
        switch (event.key) {
          case 'h':
            event.preventDefault()
            this.toggleHighContrast()
            this.announce('High contrast mode toggled')
            break
          case 'm':
            event.preventDefault()
            this.toggleReducedMotion()
            this.announce('Reduced motion mode toggled')
            break
          case 'l':
            event.preventDefault()
            this.toggleLargeText()
            this.announce('Large text mode toggled')
            break
        }
      }
    })

    // Remove keyboard navigation class when mouse is used
    document.addEventListener('mousedown', () => {
      this.options.focusVisible = false
      document.documentElement.classList.remove('keyboard-navigation')
    })
  }

  private setupFocusManagement(): void {
    // Trap focus in modals and dialogs
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        // Close modals, menus, etc.
        const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]') as HTMLElement
        if (openModal) {
          const closeButton = openModal.querySelector('[data-close]') as HTMLElement
          if (closeButton) {
            closeButton.click()
          }
        }
      }

      if (event.key === 'Tab') {
        // Manage tab order and focus trapping
        const activeElement = document.activeElement
        const modal = activeElement?.closest('[role="dialog"]') as HTMLElement

        if (modal) {
          this.trapFocusInModal(modal, event)
        }
      }
    })
  }

  private trapFocusInModal(modal: HTMLElement, event: KeyboardEvent): void {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }

  private applyAccessibilitySettings(): void {
    const html = document.documentElement

    // Apply CSS classes based on accessibility options
    html.classList.toggle('high-contrast', this.options.highContrast)
    html.classList.toggle('reduced-motion', this.options.reducedMotion)
    html.classList.toggle('large-text', this.options.largeText)
    html.classList.toggle('screen-reader-optimized', this.options.screenReaderOptimized)
    html.classList.toggle('keyboard-only', this.options.keyboardNavigationOnly)
    html.classList.toggle('focus-visible', this.options.focusVisible)

    // Update ARIA attributes
    html.setAttribute('data-high-contrast', this.options.highContrast.toString())
    html.setAttribute('data-reduced-motion', this.options.reducedMotion.toString())

    // Save preferences
    localStorage.setItem('accessibility-preferences', JSON.stringify(this.options))
  }

  // Public API methods
  getOptions(): AccessibilityOptions {
    return { ...this.options }
  }

  updateOptions(newOptions: Partial<AccessibilityOptions>): void {
    this.options = { ...this.options, ...newOptions }
    this.applyAccessibilitySettings()
  }

  toggleHighContrast(): void {
    this.options.highContrast = !this.options.highContrast
    this.applyAccessibilitySettings()
  }

  toggleReducedMotion(): void {
    this.options.reducedMotion = !this.options.reducedMotion
    this.applyAccessibilitySettings()
  }

  toggleLargeText(): void {
    this.options.largeText = !this.options.largeText
    this.applyAccessibilitySettings()
  }

  toggleScreenReaderOptimized(): void {
    this.options.screenReaderOptimized = !this.options.screenReaderOptimized
    this.applyAccessibilitySettings()
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.options.announcements) return

    const announcement: A11yAnnouncement = {
      id: `announcement-${Date.now()}`,
      message,
      priority,
      timestamp: Date.now()
    }

    this.announcements.push(announcement)

    // Keep only recent announcements
    if (this.announcements.length > 10) {
      this.announcements = this.announcements.slice(-10)
    }

    // Update announcement container
    if (this.announcementContainer) {
      this.announcementContainer.setAttribute('aria-live', priority)
      this.announcementContainer.textContent = message
    }

    // Also announce to screen readers via title attribute (fallback)
    document.title = `${message} - ${document.title.split(' - ')[1] || document.title}`

    // Reset title after a delay
    setTimeout(() => {
      const originalTitle = document.title.split(' - ')[1] || document.title
      document.title = originalTitle
    }, 1000)
  }

  // Utility methods for components
  getAriaLabel(element: HTMLElement, defaultLabel?: string): string {
    return element.getAttribute('aria-label') ||
           element.getAttribute('aria-labelledby') ||
           element.textContent?.trim() ||
           defaultLabel ||
           ''
  }

  ensureHeadingHierarchy(container: HTMLElement): void {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0

    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level - lastLevel > 1) {
        // Fix heading hierarchy by adjusting level
        const newLevel = Math.min(lastLevel + 1, 6)
        const newTag = `h${newLevel}`
        const newElement = document.createElement(newTag)
        newElement.innerHTML = heading.innerHTML
        newElement.className = heading.className

        // Copy attributes
        Array.from(heading.attributes).forEach(attr => {
          newElement.setAttribute(attr.name, attr.value)
        })

        heading.parentNode?.replaceChild(newElement, heading)
      }
      lastLevel = level
    })
  }

  validateColorContrast(foreground: string, background: string): boolean {
    // Simple color contrast validation
    // In a real implementation, this would use proper color math
    return true // Placeholder
  }

  generateAltText(image: HTMLImageElement, context?: string): string {
    const src = image.src
    const filename = src.split('/').pop()?.split('.')[0] || ''

    if (image.alt) return image.alt

    // Generate descriptive alt text based on context and filename
    let alt = filename.replace(/[-_]/g, ' ')

    if (context) {
      alt = `${context}: ${alt}`
    }

    return alt
  }
}

// React hook for using accessibility manager
export function useAccessibility() {
  const managerRef = useRef<AccessibilityManager>()

  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = new AccessibilityManager()
    }
  }, [])

  return {
    announce: (message: string, priority?: 'polite' | 'assertive') =>
      managerRef.current?.announce(message, priority),
    getOptions: () => managerRef.current?.getOptions() || {} as AccessibilityOptions,
    updateOptions: (options: Partial<AccessibilityOptions>) =>
      managerRef.current?.updateOptions(options),
    toggleHighContrast: () => managerRef.current?.toggleHighContrast(),
    toggleReducedMotion: () => managerRef.current?.toggleReducedMotion(),
    toggleLargeText: () => managerRef.current?.toggleLargeText(),
    getAriaLabel: (element: HTMLElement, defaultLabel?: string) =>
      managerRef.current?.getAriaLabel(element, defaultLabel),
    ensureHeadingHierarchy: (container: HTMLElement) =>
      managerRef.current?.ensureHeadingHierarchy(container),
    generateAltText: (image: HTMLImageElement, context?: string) =>
      managerRef.current?.generateAltText(image, context)
  }
}

// Utility functions for accessibility
export const a11yUtils = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = 'a11y') =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,

  // Check if element is visible to screen readers
  isVisibleToScreenReader: (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element)
    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           element.getAttribute('aria-hidden') !== 'true'
  },

  // Get all focusable elements within a container
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    return Array.from(container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => a11yUtils.isVisibleToScreenReader(el as HTMLElement)) as HTMLElement[]
  },

  // Move focus to the first focusable element
  moveFocusToFirst: (container: HTMLElement): void => {
    const focusable = a11yUtils.getFocusableElements(container)
    if (focusable.length > 0) {
      focusable[0].focus()
    }
  },

  // Move focus to the last focusable element
  moveFocusToLast: (container: HTMLElement): void => {
    const focusable = a11yUtils.getFocusableElements(container)
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus()
    }
  }
}

export default AccessibilityManager
