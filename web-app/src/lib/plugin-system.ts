export interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  category: 'editor' | 'ai' | 'deployment' | 'theme' | 'integration' | 'utility'
  tags: string[]
  icon?: string
  homepage?: string
  repository?: string
  license: string
  price: number
  isInstalled: boolean
  isEnabled: boolean
  dependencies: string[]
  compatibility: {
    minVersion: string
    maxVersion?: string
  }
  hooks: PluginHooks
  settings?: PluginSetting[]
}

export interface PluginHooks {
  onEditorMount?: (editor: any) => void
  onCodeChange?: (code: string, language: string) => void
  onProjectCreate?: (project: any) => void
  onProjectSave?: (project: any) => void
  onExport?: (data: any, format: string) => any
  onImport?: (data: any, format: string) => any
  onThemeChange?: (theme: string) => void
  onUserAction?: (action: string, data: any) => void
  onAIRequest?: (prompt: string, model: string) => void
  onAIResponse?: (response: string, model: string) => void
  customHooks?: Record<string, Function>
}

export interface PluginSetting {
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea'
  default: any
  options?: { label: string; value: any }[]
  description?: string
  required?: boolean
}

export interface PluginContext {
  user: any
  project: any
  editor: any
  settings: Record<string, any>
  api: PluginAPI
}

export interface PluginAPI {
  // Editor API
  getCurrentCode: () => { html: string; css: string; js: string }
  setCode: (code: { html?: string; css?: string; js?: string }) => void
  getCursorPosition: () => { line: number; column: number }
  setCursorPosition: (position: { line: number; column: number }) => void

  // Project API
  getCurrentProject: () => any
  saveProject: (project: any) => Promise<void>
  createFile: (path: string, content: string) => Promise<void>
  readFile: (path: string) => Promise<string>
  deleteFile: (path: string) => Promise<void>

  // UI API
  showNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
  showDialog: (content: any, options?: any) => void
  addMenuItem: (menuId: string, item: any) => void
  addToolbarButton: (button: any) => void

  // Network API
  httpRequest: (url: string, options?: any) => Promise<any>
  socketConnect: (url: string) => any

  // Storage API
  setStorage: (key: string, value: any) => void
  getStorage: (key: string) => any
  removeStorage: (key: string) => void

  // AI API
  generateCode: (prompt: string, options?: any) => Promise<string>
  analyzeCode: (code: string, language: string) => Promise<any>

  // Events API
  on: (event: string, callback: Function) => void
  off: (event: string, callback: Function) => void
  emit: (event: string, data?: any) => void
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map()
  private activePlugins: Set<string> = new Set()
  private pluginContexts: Map<string, PluginContext> = new Map()
  private eventListeners: Map<string, Set<Function>> = new Map()

  constructor() {
    this.loadInstalledPlugins()
  }

  // Plugin Discovery and Installation
  async discoverPlugins(): Promise<Plugin[]> {
    // Simulate plugin discovery from various sources
    return [
      {
        id: 'prettier-formatter',
        name: 'Prettier Code Formatter',
        version: '1.0.0',
        description: 'Automatically format your code with Prettier',
        author: 'Codiner Team',
        category: 'editor',
        tags: ['formatter', 'prettier', 'code-quality'],
        license: 'MIT',
        price: 0,
        isInstalled: false,
        isEnabled: false,
        dependencies: [],
        compatibility: { minVersion: '1.0.0' },
        hooks: {
          onCodeChange: (code: string, language: string) => {
            // Format code with Prettier
            return this.formatCode(code, language)
          }
        },
        settings: [
          {
            key: 'tabWidth',
            label: 'Tab Width',
            type: 'select',
            default: 2,
            options: [
              { label: '2 spaces', value: 2 },
              { label: '4 spaces', value: 4 }
            ]
          }
        ]
      },
      {
        id: 'github-integration',
        name: 'GitHub Integration',
        version: '2.1.0',
        description: 'Sync your projects with GitHub repositories',
        author: 'Codiner Team',
        category: 'integration',
        tags: ['github', 'git', 'version-control'],
        license: 'MIT',
        price: 0,
        isInstalled: true,
        isEnabled: true,
        dependencies: [],
        compatibility: { minVersion: '1.0.0' },
        hooks: {
          onProjectSave: (project: any) => {
            // Auto-commit to GitHub
            this.commitToGitHub(project)
          }
        }
      },
      {
        id: 'dark-theme-pro',
        name: 'Dark Theme Pro',
        version: '1.5.0',
        description: 'Advanced dark theme with multiple variants',
        author: 'Theme Masters',
        category: 'theme',
        tags: ['theme', 'dark-mode', 'customization'],
        license: 'MIT',
        price: 9.99,
        isInstalled: false,
        isEnabled: false,
        dependencies: [],
        compatibility: { minVersion: '1.0.0' },
        hooks: {
          onThemeChange: (theme: string) => {
            this.applyDarkTheme(theme)
          }
        },
        settings: [
          {
            key: 'variant',
            label: 'Theme Variant',
            type: 'select',
            default: 'default',
            options: [
              { label: 'Default Dark', value: 'default' },
              { label: 'Deep Ocean', value: 'ocean' },
              { label: 'Midnight Purple', value: 'purple' },
              { label: 'Forest Green', value: 'forest' }
            ]
          }
        ]
      },
      {
        id: 'ai-code-review',
        name: 'AI Code Review',
        version: '1.2.0',
        description: 'Get AI-powered code reviews and suggestions',
        author: 'AI Labs',
        category: 'ai',
        tags: ['ai', 'code-review', 'suggestions'],
        license: 'MIT',
        price: 19.99,
        isInstalled: false,
        isEnabled: false,
        dependencies: ['ai-debugger'],
        compatibility: { minVersion: '1.0.0' },
        hooks: {
          onCodeChange: async (code: string, language: string) => {
            const review = await this.performAICodeReview(code, language)
            return review
          }
        }
      },
      {
        id: 'deployment-manager',
        name: 'Deployment Manager',
        version: '3.0.0',
        description: 'Deploy to multiple platforms with one click',
        author: 'DevOps Team',
        category: 'deployment',
        tags: ['deployment', 'vercel', 'netlify', 'aws'],
        license: 'MIT',
        price: 29.99,
        isInstalled: false,
        isEnabled: false,
        dependencies: [],
        compatibility: { minVersion: '1.0.0' },
        hooks: {
          onProjectCreate: (project: any) => {
            this.setupDeployment(project)
          }
        },
        settings: [
          {
            key: 'defaultProvider',
            label: 'Default Provider',
            type: 'select',
            default: 'vercel',
            options: [
              { label: 'Vercel', value: 'vercel' },
              { label: 'Netlify', value: 'netlify' },
              { label: 'AWS Amplify', value: 'aws' },
              { label: 'GitHub Pages', value: 'github' }
            ]
          }
        ]
      },
      {
        id: 'collaboration-tools',
        name: 'Real-time Collaboration',
        version: '2.0.0',
        description: 'Collaborate with team members in real-time',
        author: 'Collaboration Inc',
        category: 'utility',
        tags: ['collaboration', 'real-time', 'teams'],
        license: 'MIT',
        price: 14.99,
        isInstalled: false,
        isEnabled: false,
        dependencies: [],
        compatibility: { minVersion: '1.0.0' },
        hooks: {
          onUserAction: (action: string, data: any) => {
            this.broadcastUserAction(action, data)
          }
        }
      }
    ]
  }

  async installPlugin(pluginId: string): Promise<boolean> {
    try {
      const plugin = await this.getPluginDetails(pluginId)
      if (!plugin) return false

      // Check dependencies
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep) || !this.plugins.get(dep)?.isInstalled) {
          throw new Error(`Missing dependency: ${dep}`)
        }
      }

      // Check compatibility
      const currentVersion = '1.0.0' // Would get from app
      if (this.compareVersions(currentVersion, plugin.compatibility.minVersion) < 0) {
        throw new Error(`Plugin requires minimum version ${plugin.compatibility.minVersion}`)
      }

      if (plugin.compatibility.maxVersion &&
          this.compareVersions(currentVersion, plugin.compatibility.maxVersion) > 0) {
        throw new Error(`Plugin is not compatible with version ${currentVersion}`)
      }

      // Install plugin
      plugin.isInstalled = true
      this.plugins.set(pluginId, plugin)

      // Save to storage
      this.savePluginState()

      // Initialize plugin if it has hooks
      if (plugin.hooks) {
        this.initializePlugin(plugin)
      }

      return true
    } catch (error) {
      console.error('Failed to install plugin:', error)
      return false
    }
  }

  async uninstallPlugin(pluginId: string): Promise<boolean> {
    try {
      const plugin = this.plugins.get(pluginId)
      if (!plugin) return false

      // Disable first
      await this.disablePlugin(pluginId)

      // Remove from storage
      plugin.isInstalled = false
      this.plugins.delete(pluginId)
      this.savePluginState()

      return true
    } catch (error) {
      console.error('Failed to uninstall plugin:', error)
      return false
    }
  }

  async enablePlugin(pluginId: string): Promise<boolean> {
    try {
      const plugin = this.plugins.get(pluginId)
      if (!plugin || !plugin.isInstalled) return false

      plugin.isEnabled = true
      this.activePlugins.add(pluginId)
      this.savePluginState()

      // Initialize plugin context
      this.createPluginContext(plugin)

      return true
    } catch (error) {
      console.error('Failed to enable plugin:', error)
      return false
    }
  }

  async disablePlugin(pluginId: string): Promise<boolean> {
    try {
      const plugin = this.plugins.get(pluginId)
      if (!plugin) return false

      plugin.isEnabled = false
      this.activePlugins.delete(pluginId)
      this.pluginContexts.delete(pluginId)
      this.savePluginState()

      return true
    } catch (error) {
      console.error('Failed to disable plugin:', error)
      return false
    }
  }

  getInstalledPlugins(): Plugin[] {
    return Array.from(this.plugins.values()).filter(p => p.isInstalled)
  }

  getActivePlugins(): Plugin[] {
    return Array.from(this.activePlugins).map(id => this.plugins.get(id)!).filter(Boolean)
  }

  getPluginSettings(pluginId: string): Record<string, any> {
    const settings = localStorage.getItem(`plugin-settings-${pluginId}`)
    return settings ? JSON.parse(settings) : {}
  }

  updatePluginSettings(pluginId: string, settings: Record<string, any>): void {
    localStorage.setItem(`plugin-settings-${pluginId}`, JSON.stringify(settings))

    // Notify plugin of settings change
    const context = this.pluginContexts.get(pluginId)
    if (context) {
      context.settings = settings
    }
  }

  // Event system for plugins
  emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Plugin event error for ${event}:`, error)
        }
      })
    }

    // Also emit to active plugins
    this.activePlugins.forEach(pluginId => {
      const context = this.pluginContexts.get(pluginId)
      if (context && context.api.emit) {
        context.api.emit(event, data)
      }
    })
  }

  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  // Private methods
  private async getPluginDetails(pluginId: string): Promise<Plugin | null> {
    // Simulate fetching plugin details
    const allPlugins = await this.discoverPlugins()
    return allPlugins.find(p => p.id === pluginId) || null
  }

  private loadInstalledPlugins(): void {
    const installed = localStorage.getItem('installed-plugins')
    if (installed) {
      const pluginData = JSON.parse(installed)
      pluginData.forEach((plugin: Plugin) => {
        this.plugins.set(plugin.id, plugin)
        if (plugin.isEnabled) {
          this.activePlugins.add(plugin.id)
        }
      })
    }
  }

  private savePluginState(): void {
    const pluginData = Array.from(this.plugins.values())
    localStorage.setItem('installed-plugins', JSON.stringify(pluginData))
  }

  private initializePlugin(plugin: Plugin): void {
    // Create plugin context and API
    const context = this.createPluginContext(plugin)

    // Call initialization hooks
    if (plugin.hooks.onEditorMount && context.editor) {
      plugin.hooks.onEditorMount(context.editor)
    }
  }

  private createPluginContext(plugin: Plugin): PluginContext {
    const context: PluginContext = {
      user: null, // Would get from auth
      project: null, // Would get current project
      editor: null, // Would get editor instance
      settings: this.getPluginSettings(plugin.id),
      api: this.createPluginAPI(plugin.id)
    }

    this.pluginContexts.set(plugin.id, context)
    return context
  }

  private createPluginAPI(pluginId: string): PluginAPI {
    return {
      getCurrentCode: () => ({ html: '', css: '', js: '' }), // Would integrate with editor
      setCode: (code) => this.emit('code-changed', { pluginId, code }),
      getCursorPosition: () => ({ line: 0, column: 0 }),
      setCursorPosition: (position) => this.emit('cursor-moved', { pluginId, position }),
      getCurrentProject: () => ({}),
      saveProject: async (project) => this.emit('project-saved', { pluginId, project }),
      createFile: async (path, content) => this.emit('file-created', { pluginId, path, content }),
      readFile: async (path) => '',
      deleteFile: async (path) => this.emit('file-deleted', { pluginId, path }),
      showNotification: (message, type = 'info') => this.emit('notification', { pluginId, message, type }),
      showDialog: (content, options) => this.emit('dialog', { pluginId, content, options }),
      addMenuItem: (menuId, item) => this.emit('menu-item-added', { pluginId, menuId, item }),
      addToolbarButton: (button) => this.emit('toolbar-button-added', { pluginId, button }),
      httpRequest: async (url, options) => fetch(url, options),
      socketConnect: (url) => new WebSocket(url),
      setStorage: (key, value) => localStorage.setItem(`plugin-${pluginId}-${key}`, JSON.stringify(value)),
      getStorage: (key) => {
        const item = localStorage.getItem(`plugin-${pluginId}-${key}`)
        return item ? JSON.parse(item) : null
      },
      removeStorage: (key) => localStorage.removeItem(`plugin-${pluginId}-${key}`),
      generateCode: async (prompt, options) => this.emit('ai-generate', { pluginId, prompt, options }),
      analyzeCode: async (code, language) => this.emit('ai-analyze', { pluginId, code, language }),
      on: (event, callback) => this.on(event, callback),
      off: (event, callback) => this.off(event, callback),
      emit: (event, data) => this.emit(event, data)
    }
  }

  private compareVersions(version1: string, version2: string): number {
    const v1 = version1.split('.').map(Number)
    const v2 = version2.split('.').map(Number)

    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0
      const num2 = v2[i] || 0

      if (num1 > num2) return 1
      if (num1 < num2) return -1
    }

    return 0
  }

  // Plugin-specific implementations (simplified)
  private async formatCode(code: string, language: string): Promise<string> {
    // Simulate Prettier formatting
    return code.split('\n').map(line => line.trim()).join('\n')
  }

  private async commitToGitHub(project: any): Promise<void> {
    console.log('Committing to GitHub:', project)
  }

  private applyDarkTheme(variant: string): void {
    console.log('Applying dark theme:', variant)
  }

  private async performAICodeReview(code: string, language: string): Promise<any> {
    // Simulate AI code review
    return {
      suggestions: ['Consider using const instead of let', 'Add error handling'],
      score: 85
    }
  }

  private setupDeployment(project: any): void {
    console.log('Setting up deployment for:', project)
  }

  private broadcastUserAction(action: string, data: any): void {
    console.log('Broadcasting user action:', action, data)
  }
}

// Global plugin manager instance
export const pluginManager = new PluginManager()
