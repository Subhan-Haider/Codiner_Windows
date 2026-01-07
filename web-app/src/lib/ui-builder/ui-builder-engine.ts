import { v4 as uuidv4 } from 'uuid'

export interface ComponentProperty {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'array' | 'object'
  label: string
  value: any
  defaultValue: any
  options?: string[] // For select type
  description?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface UIComponent {
  id: string
  type: string
  name: string
  category: string
  icon: string
  description: string
  properties: ComponentProperty[]
  children?: UIComponent[]
  styles: Record<string, any>
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  parentId?: string
  isVisible: boolean
  isLocked: boolean
}

export interface CanvasState {
  components: UIComponent[]
  selectedComponentId: string | null
  draggedComponent: UIComponent | null
  canvasSize: {
    width: number
    height: number
  }
  zoom: number
  gridSize: number
  snapToGrid: boolean
}

export interface ComponentTemplate {
  id: string
  name: string
  category: string
  icon: string
  description: string
  defaultProps: Record<string, any>
  styles: Record<string, any>
  code: {
    html: string
    css: string
    js?: string
    react?: string
  }
}

export class UIBuilderEngine {
  private canvasState: CanvasState
  private componentLibrary: Map<string, ComponentTemplate>
  private history: CanvasState[] = []
  private historyIndex: number = -1
  private listeners: Set<(state: CanvasState) => void> = new Set()

  constructor() {
    this.canvasState = {
      components: [],
      selectedComponentId: null,
      draggedComponent: null,
      canvasSize: { width: 1200, height: 800 },
      zoom: 1,
      gridSize: 10,
      snapToGrid: true
    }

    this.initializeComponentLibrary()
  }

  private initializeComponentLibrary(): void {
    this.componentLibrary = new Map()

    // Layout Components
    this.addComponentTemplate({
      id: 'div',
      name: 'Container',
      category: 'Layout',
      icon: '📦',
      description: 'A flexible container for grouping elements',
      defaultProps: {
        className: '',
        style: {}
      },
      styles: {
        minHeight: '50px',
        border: '1px dashed #ccc',
        borderRadius: '4px'
      },
      code: {
        html: '<div class="container">Content</div>',
        css: '.container { /* styles */ }',
        react: '<div className="container">Content</div>'
      }
    })

    this.addComponentTemplate({
      id: 'flex',
      name: 'Flex Container',
      category: 'Layout',
      icon: '🔀',
      description: 'A flexbox container for flexible layouts',
      defaultProps: {
        className: 'flex',
        style: { display: 'flex' }
      },
      styles: {
        minHeight: '50px',
        border: '1px dashed #007acc',
        borderRadius: '4px'
      },
      code: {
        html: '<div class="flex-container">Items</div>',
        css: '.flex-container { display: flex; }',
        react: '<div className="flex">Items</div>'
      }
    })

    // Basic Components
    this.addComponentTemplate({
      id: 'button',
      name: 'Button',
      category: 'Basic',
      icon: '🔘',
      description: 'An interactive button component',
      defaultProps: {
        text: 'Button',
        variant: 'primary',
        size: 'medium',
        disabled: false,
        onClick: null
      },
      styles: {
        padding: '8px 16px',
        border: '1px solid #007acc',
        borderRadius: '4px',
        backgroundColor: '#007acc',
        color: 'white',
        cursor: 'pointer'
      },
      code: {
        html: '<button class="btn">Button</button>',
        css: '.btn { padding: 8px 16px; background: #007acc; color: white; border: none; border-radius: 4px; }',
        react: '<button className="btn">Button</button>'
      }
    })

    this.addComponentTemplate({
      id: 'input',
      name: 'Text Input',
      category: 'Form',
      icon: '📝',
      description: 'A text input field',
      defaultProps: {
        placeholder: 'Enter text...',
        type: 'text',
        value: '',
        disabled: false
      },
      styles: {
        padding: '8px 12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '200px'
      },
      code: {
        html: '<input type="text" placeholder="Enter text..." />',
        css: 'input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; }',
        react: '<input type="text" placeholder="Enter text..." />'
      }
    })

    this.addComponentTemplate({
      id: 'text',
      name: 'Text',
      category: 'Basic',
      icon: '📄',
      description: 'A text element',
      defaultProps: {
        content: 'Sample text',
        tag: 'p',
        style: {}
      },
      styles: {
        fontSize: '16px',
        color: '#333'
      },
      code: {
        html: '<p>Sample text</p>',
        css: 'p { font-size: 16px; color: #333; }',
        react: '<p>Sample text</p>'
      }
    })

    // Advanced Components
    this.addComponentTemplate({
      id: 'card',
      name: 'Card',
      category: 'Layout',
      icon: '🃏',
      description: 'A card component for displaying content',
      defaultProps: {
        title: 'Card Title',
        content: 'Card content goes here...',
        className: 'card'
      },
      styles: {
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      },
      code: {
        html: '<div class="card"><h3>Card Title</h3><p>Content</p></div>',
        css: '.card { border: 1px solid #e1e5e9; border-radius: 8px; padding: 16px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }',
        react: '<Card title="Card Title" content="Content" />'
      }
    })

    this.addComponentTemplate({
      id: 'image',
      name: 'Image',
      category: 'Media',
      icon: '🖼️',
      description: 'An image component',
      defaultProps: {
        src: 'https://via.placeholder.com/300x200',
        alt: 'Placeholder image',
        width: 300,
        height: 200
      },
      styles: {
        maxWidth: '100%',
        height: 'auto'
      },
      code: {
        html: '<img src="image.jpg" alt="Description" />',
        css: 'img { max-width: 100%; height: auto; }',
        react: '<img src="image.jpg" alt="Description" />'
      }
    })
  }

  private addComponentTemplate(template: ComponentTemplate): void {
    this.componentLibrary.set(template.id, template)
  }

  // Component Management
  addComponent(templateId: string, position: { x: number; y: number }): UIComponent | null {
    const template = this.componentLibrary.get(templateId)
    if (!template) return null

    const component: UIComponent = {
      id: uuidv4(),
      type: template.id,
      name: template.name,
      category: template.category,
      icon: template.icon,
      description: template.description,
      properties: this.createPropertiesFromTemplate(template),
      children: [],
      styles: { ...template.styles },
      position: {
        x: position.x,
        y: position.y,
        width: 200,
        height: 50
      },
      isVisible: true,
      isLocked: false
    }

    this.saveToHistory()
    this.canvasState.components.push(component)
    this.notifyListeners()

    return component
  }

  private createPropertiesFromTemplate(template: ComponentTemplate): ComponentProperty[] {
    const properties: ComponentProperty[] = []

    // Convert template props to ComponentProperty format
    Object.entries(template.defaultProps).forEach(([key, value]) => {
      properties.push({
        id: uuidv4(),
        name: key,
        type: this.inferPropertyType(value),
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: value,
        defaultValue: value,
        description: `Configure the ${key} property`
      })
    })

    return properties
  }

  private inferPropertyType(value: any): ComponentProperty['type'] {
    if (typeof value === 'string') return 'string'
    if (typeof value === 'number') return 'number'
    if (typeof value === 'boolean') return 'boolean'
    if (Array.isArray(value)) return 'array'
    if (typeof value === 'object' && value !== null) return 'object'
    return 'string'
  }

  removeComponent(componentId: string): void {
    this.saveToHistory()
    this.canvasState.components = this.canvasState.components.filter(c => c.id !== componentId)

    if (this.canvasState.selectedComponentId === componentId) {
      this.canvasState.selectedComponentId = null
    }

    this.notifyListeners()
  }

  updateComponent(componentId: string, updates: Partial<UIComponent>): void {
    const component = this.canvasState.components.find(c => c.id === componentId)
    if (!component) return

    this.saveToHistory()
    Object.assign(component, updates)
    this.notifyListeners()
  }

  updateComponentProperty(componentId: string, propertyName: string, value: any): void {
    const component = this.canvasState.components.find(c => c.id === componentId)
    if (!component) return

    const property = component.properties.find(p => p.name === propertyName)
    if (!property) return

    this.saveToHistory()
    property.value = value
    this.notifyListeners()
  }

  selectComponent(componentId: string | null): void {
    this.canvasState.selectedComponentId = componentId
    this.notifyListeners()
  }

  moveComponent(componentId: string, newPosition: { x: number; y: number }): void {
    const component = this.canvasState.components.find(c => c.id === componentId)
    if (!component) return

    this.saveToHistory()

    if (this.canvasState.snapToGrid) {
      newPosition.x = Math.round(newPosition.x / this.canvasState.gridSize) * this.canvasState.gridSize
      newPosition.y = Math.round(newPosition.y / this.canvasState.gridSize) * this.canvasState.gridSize
    }

    component.position.x = newPosition.x
    component.position.y = newPosition.y
    this.notifyListeners()
  }

  resizeComponent(componentId: string, newSize: { width: number; height: number }): void {
    const component = this.canvasState.components.find(c => c.id === componentId)
    if (!component) return

    this.saveToHistory()
    component.position.width = Math.max(50, newSize.width)
    component.position.height = Math.max(30, newSize.height)
    this.notifyListeners()
  }

  // History Management
  private saveToHistory(): void {
    // Remove any history after current index
    this.history = this.history.slice(0, this.historyIndex + 1)

    // Add current state to history
    this.history.push(JSON.parse(JSON.stringify(this.canvasState)))

    // Limit history size
    if (this.history.length > 50) {
      this.history.shift()
    }

    this.historyIndex = this.history.length - 1
  }

  undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--
      this.canvasState = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
      this.notifyListeners()
    }
  }

  redo(): void {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++
      this.canvasState = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
      this.notifyListeners()
    }
  }

  canUndo(): boolean {
    return this.historyIndex > 0
  }

  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1
  }

  // Code Generation
  generateCode(format: 'html' | 'react' | 'vue' | 'angular' = 'react'): string {
    const components = this.getSortedComponents()

    switch (format) {
      case 'html':
        return this.generateHTML(components)
      case 'react':
        return this.generateReact(components)
      case 'vue':
        return this.generateVue(components)
      case 'angular':
        return this.generateAngular(components)
      default:
        return this.generateReact(components)
    }
  }

  private getSortedComponents(): UIComponent[] {
    // Sort components by position (top to bottom, left to right)
    return [...this.canvasState.components].sort((a, b) => {
      if (a.position.y !== b.position.y) {
        return a.position.y - b.position.y
      }
      return a.position.x - b.position.x
    })
  }

  private generateHTML(components: UIComponent[]): string {
    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Generated UI</title>\n  <style>\n    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }\n  </style>\n</head>\n<body>\n'

    let css = '  /* Generated styles */\n'

    components.forEach(component => {
      const styles = this.generateCSSStyles(component)
      css += `  #${component.id} { ${styles} }\n`

      switch (component.type) {
        case 'button':
          const text = component.properties.find(p => p.name === 'text')?.value || 'Button'
          html += `  <button id="${component.id}">${text}</button>\n`
          break
        case 'input':
          const placeholder = component.properties.find(p => p.name === 'placeholder')?.value || ''
          html += `  <input id="${component.id}" type="text" placeholder="${placeholder}" />\n`
          break
        case 'text':
          const content = component.properties.find(p => p.name === 'content')?.value || 'Text'
          const tag = component.properties.find(p => p.name === 'tag')?.value || 'p'
          html += `  <${tag} id="${component.id}">${content}</${tag}>\n`
          break
        case 'image':
          const src = component.properties.find(p => p.name === 'src')?.value || ''
          const alt = component.properties.find(p => p.name === 'alt')?.value || ''
          html += `  <img id="${component.id}" src="${src}" alt="${alt}" />\n`
          break
        default:
          html += `  <div id="${component.id}">Component</div>\n`
      }
    })

    html += '</body>\n</html>'
    css += '</style>\n'

    return html.replace('<style>\n    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }\n  </style>', `<style>\n    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }\n${css}</style>`)
  }

  private generateReact(components: UIComponent[]): string {
    let imports = "import React from 'react';\n\n"
    let componentCode = "function GeneratedComponent() {\n  return (\n    <div className=\"generated-ui\">\n"

    components.forEach(component => {
      const styles = this.generateInlineStyles(component)

      switch (component.type) {
        case 'button':
          const text = component.properties.find(p => p.name === 'text')?.value || 'Button'
          componentCode += `      <button style={${JSON.stringify(styles)}}>${text}</button>\n`
          break
        case 'input':
          const placeholder = component.properties.find(p => p.name === 'placeholder')?.value || ''
          componentCode += `      <input style={${JSON.stringify(styles)}} placeholder="${placeholder}" />\n`
          break
        case 'text':
          const content = component.properties.find(p => p.name === 'content')?.value || 'Text'
          const tag = component.properties.find(p => p.name === 'tag')?.value || 'p'
          componentCode += `      <${tag} style={${JSON.stringify(styles)}}>${content}</${tag}>\n`
          break
        case 'image':
          const src = component.properties.find(p => p.name === 'src')?.value || ''
          const alt = component.properties.find(p => p.name === 'alt')?.value || ''
          componentCode += `      <img style={${JSON.stringify(styles)}} src="${src}" alt="${alt}" />\n`
          break
        default:
          componentCode += `      <div style={${JSON.stringify(styles)}}>Component</div>\n`
      }
    })

    componentCode += "    </div>\n  );\n}\n\nexport default GeneratedComponent;"

    return imports + componentCode
  }

  private generateVue(components: UIComponent[]): string {
    let template = '<template>\n  <div class="generated-ui">\n'

    components.forEach(component => {
      const styles = this.generateInlineStyles(component)

      switch (component.type) {
        case 'button':
          const text = component.properties.find(p => p.name === 'text')?.value || 'Button'
          template += `    <button :style="${JSON.stringify(styles)}">${text}</button>\n`
          break
        case 'input':
          const placeholder = component.properties.find(p => p.name === 'placeholder')?.value || ''
          template += `    <input :style="${JSON.stringify(styles)}" placeholder="${placeholder}" />\n`
          break
        default:
          template += `    <div :style="${JSON.stringify(styles)}">Component</div>\n`
      }
    })

    template += '  </div>\n</template>\n\n<script>\nexport default {\n  name: "GeneratedComponent"\n}\n</script>'

    return template
  }

  private generateAngular(components: UIComponent[]): string {
    let template = '<div class="generated-ui">\n'

    components.forEach(component => {
      const styles = this.generateInlineStyles(component)

      switch (component.type) {
        case 'button':
          const text = component.properties.find(p => p.name === 'text')?.value || 'Button'
          template += `  <button [ngStyle]="${JSON.stringify(styles)}">${text}</button>\n`
          break
        case 'input':
          const placeholder = component.properties.find(p => p.name === 'placeholder')?.value || ''
          template += `  <input [ngStyle]="${JSON.stringify(styles)}" placeholder="${placeholder}" />\n`
          break
        default:
          template += `  <div [ngStyle]="${JSON.stringify(styles)}">Component</div>\n`
      }
    })

    template += '</div>'

    return template
  }

  private generateCSSStyles(component: UIComponent): string {
    const styles = { ...component.styles }

    // Add position styles
    styles.position = 'absolute'
    styles.left = `${component.position.x}px`
    styles.top = `${component.position.y}px`
    styles.width = `${component.position.width}px`
    styles.height = `${component.position.height}px`

    return Object.entries(styles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ')
  }

  private generateInlineStyles(component: UIComponent): Record<string, any> {
    const styles = { ...component.styles }

    // Add position styles
    styles.position = 'absolute'
    styles.left = `${component.position.x}px`
    styles.top = `${component.position.y}px`
    styles.width = `${component.position.width}px`
    styles.height = `${component.position.height}px`

    return styles
  }

  // Canvas Management
  setCanvasSize(size: { width: number; height: number }): void {
    this.canvasState.canvasSize = size
    this.notifyListeners()
  }

  setZoom(zoom: number): void {
    this.canvasState.zoom = Math.max(0.1, Math.min(2, zoom))
    this.notifyListeners()
  }

  setGridSize(size: number): void {
    this.canvasState.gridSize = Math.max(5, Math.min(50, size))
    this.notifyListeners()
  }

  toggleSnapToGrid(): void {
    this.canvasState.snapToGrid = !this.canvasState.snapToGrid
    this.notifyListeners()
  }

  // Component Library
  getComponentTemplates(): ComponentTemplate[] {
    return Array.from(this.componentLibrary.values())
  }

  getComponentTemplate(id: string): ComponentTemplate | undefined {
    return this.componentLibrary.get(id)
  }

  // State Management
  getState(): CanvasState {
    return { ...this.canvasState }
  }

  setState(state: CanvasState): void {
    this.saveToHistory()
    this.canvasState = { ...state }
    this.notifyListeners()
  }

  subscribe(listener: (state: CanvasState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.canvasState))
  }

  // Utility Methods
  exportProject(): string {
    return JSON.stringify({
      version: '1.0',
      canvas: this.canvasState,
      timestamp: new Date().toISOString()
    }, null, 2)
  }

  importProject(data: string): boolean {
    try {
      const project = JSON.parse(data)
      if (project.canvas) {
        this.setState(project.canvas)
        return true
      }
    } catch (error) {
      console.error('Failed to import project:', error)
    }
    return false
  }
}
