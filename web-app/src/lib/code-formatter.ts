export interface FormatOptions {
  language: string
  indentStyle: 'space' | 'tab'
  indentSize: number
  maxLineLength: number
  trailingCommas: 'none' | 'es5' | 'all'
  quoteStyle: 'single' | 'double'
  semicolons: 'asi' | 'always' | 'never'
  bracketSpacing: boolean
  arrowParens: 'avoid' | 'always'
  endOfLine: 'lf' | 'crlf' | 'cr'
}

export interface FormatResult {
  formatted: string
  original: string
  changes: {
    linesChanged: number
    charactersAdded: number
    charactersRemoved: number
  }
  errors: string[]
}

export class CodeFormatter {
  private static readonly DEFAULT_OPTIONS: FormatOptions = {
    language: 'javascript',
    indentStyle: 'space',
    indentSize: 2,
    maxLineLength: 80,
    trailingCommas: 'es5',
    quoteStyle: 'single',
    semicolons: 'always',
    bracketSpacing: true,
    arrowParens: 'avoid',
    endOfLine: 'lf'
  }

  static async formatCode(
    code: string,
    options: Partial<FormatOptions> = {}
  ): Promise<FormatResult> {
    const config = { ...this.DEFAULT_OPTIONS, ...options }

    try {
      let formatted: string

      switch (config.language) {
        case 'javascript':
        case 'typescript':
          formatted = await this.formatJavaScript(code, config)
          break
        case 'python':
          formatted = await this.formatPython(code, config)
          break
        case 'java':
          formatted = await this.formatJava(code, config)
          break
        case 'csharp':
          formatted = await this.formatCSharp(code, config)
          break
        case 'php':
          formatted = await this.formatPHP(code, config)
          break
        case 'html':
          formatted = await this.formatHTML(code, config)
          break
        case 'css':
          formatted = await this.formatCSS(code, config)
          break
        case 'json':
          formatted = await this.formatJSON(code, config)
          break
        default:
          formatted = this.basicFormat(code, config)
      }

      const changes = this.calculateChanges(code, formatted)

      return {
        formatted,
        original: code,
        changes,
        errors: []
      }
    } catch (error: any) {
      return {
        formatted: code,
        original: code,
        changes: { linesChanged: 0, charactersAdded: 0, charactersRemoved: 0 },
        errors: [error.message || 'Formatting failed']
      }
    }
  }

  private static async formatJavaScript(code: string, options: FormatOptions): Promise<string> {
    // Simulate Prettier-like formatting
    let formatted = code

    // Fix indentation
    formatted = this.fixIndentation(formatted, options)

    // Fix quotes
    formatted = this.fixQuotes(formatted, options.quoteStyle)

    // Fix semicolons
    formatted = this.fixSemicolons(formatted, options.semicolons)

    // Fix trailing commas
    formatted = this.fixTrailingCommas(formatted, options.trailingCommas)

    // Fix bracket spacing
    formatted = this.fixBracketSpacing(formatted, options.bracketSpacing)

    // Fix arrow function parentheses
    formatted = this.fixArrowParens(formatted, options.arrowParens)

    // Fix line endings
    formatted = this.fixLineEndings(formatted, options.endOfLine)

    // Fix max line length
    formatted = this.fixMaxLineLength(formatted, options.maxLineLength)

    return formatted
  }

  private static async formatPython(code: string, options: FormatOptions): Promise<string> {
    let formatted = code

    // Python-specific formatting
    formatted = this.fixPythonIndentation(formatted)
    formatted = this.fixPythonQuotes(formatted, options.quoteStyle)
    formatted = this.fixPythonLineLength(formatted, options.maxLineLength)
    formatted = this.fixLineEndings(formatted, options.endOfLine)

    return formatted
  }

  private static async formatJava(code: string, options: FormatOptions): Promise<string> {
    let formatted = code

    // Java-specific formatting
    formatted = this.fixIndentation(formatted, options)
    formatted = this.fixJavaBraces(formatted)
    formatted = this.fixJavaImports(formatted)
    formatted = this.fixMaxLineLength(formatted, options.maxLineLength)
    formatted = this.fixLineEndings(formatted, options.endOfLine)

    return formatted
  }

  private static async formatCSharp(code: string, options: FormatOptions): Promise<string> {
    let formatted = code

    // C#-specific formatting
    formatted = this.fixIndentation(formatted, options)
    formatted = this.fixCSharpBraces(formatted)
    formatted = this.fixCSharpUsing(formatted)
    formatted = this.fixMaxLineLength(formatted, options.maxLineLength)
    formatted = this.fixLineEndings(formatted, options.endOfLine)

    return formatted
  }

  private static async formatPHP(code: string, options: FormatOptions): Promise<string> {
    let formatted = code

    // PHP-specific formatting
    formatted = this.fixIndentation(formatted, options)
    formatted = this.fixPHPBraces(formatted)
    formatted = this.fixMaxLineLength(formatted, options.maxLineLength)
    formatted = this.fixLineEndings(formatted, options.endOfLine)

    return formatted
  }

  private static async formatHTML(code: string, options: FormatOptions): Promise<string> {
    let formatted = code

    // HTML-specific formatting
    formatted = this.fixHTMLIndentation(formatted, options)
    formatted = this.fixHTMLAttributes(formatted)
    formatted = this.fixMaxLineLength(formatted, options.maxLineLength)
    formatted = this.fixLineEndings(formatted, options.endOfLine)

    return formatted
  }

  private static async formatCSS(code: string, options: FormatOptions): Promise<string> {
    let formatted = code

    // CSS-specific formatting
    formatted = this.fixCSSIndentation(formatted, options)
    formatted = this.fixCSSBraces(formatted)
    formatted = this.fixCSSSemicolons(formatted)
    formatted = this.fixMaxLineLength(formatted, options.maxLineLength)
    formatted = this.fixLineEndings(formatted, options.endOfLine)

    return formatted
  }

  private static async formatJSON(code: string, options: FormatOptions): Promise<string> {
    try {
      const parsed = JSON.parse(code)
      return JSON.stringify(parsed, null, options.indentStyle === 'tab' ? '\t' : options.indentSize)
    } catch {
      return code
    }
  }

  private static basicFormat(code: string, options: FormatOptions): string {
    let formatted = code

    formatted = this.fixIndentation(formatted, options)
    formatted = this.fixMaxLineLength(formatted, options.maxLineLength)
    formatted = this.fixLineEndings(formatted, options.endOfLine)

    return formatted
  }

  // Formatting utilities
  private static fixIndentation(code: string, options: FormatOptions): string {
    const lines = code.split('\n')
    const indentString = options.indentStyle === 'tab' ? '\t' : ' '.repeat(options.indentSize)
    let indentLevel = 0

    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return ''

      // Decrease indent for closing braces/brackets
      if (trimmedLine.match(/^[\}\]\)]/)) {
        indentLevel = Math.max(0, indentLevel - 1)
      }

      const indentedLine = indentString.repeat(indentLevel) + trimmedLine

      // Increase indent for opening braces/brackets
      if (trimmedLine.match(/[\{\[\(]$/)) {
        indentLevel++
      }

      // Special handling for control structures
      if (trimmedLine.match(/\b(if|for|while|function|class|try)\b.*\{?$/)) {
        if (!trimmedLine.endsWith('{')) {
          indentLevel++
        }
      }

      return indentedLine
    })

    return formattedLines.join('\n')
  }

  private static fixPythonIndentation(code: string): string {
    const lines = code.split('\n')
    let indentLevel = 0

    const formattedLines = lines.map((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return ''

      // Decrease indent for dedented lines (Python uses colon and indentation)
      if (trimmedLine.match(/^(\w|\s)*:/) === null && indentLevel > 0) {
        // Check if this line should be dedented
        const prevLine = lines[lines.indexOf(line) - 1]
        if (prevLine && !prevLine.trim().endsWith(':')) {
          indentLevel = Math.max(0, indentLevel - 1)
        }
      }

      const indentedLine = '    '.repeat(indentLevel) + trimmedLine

      // Increase indent after lines ending with colon
      if (trimmedLine.endsWith(':')) {
        indentLevel++
      }

      return indentedLine
    })

    return formattedLines.join('\n')
  }

  private static fixQuotes(code: string, quoteStyle: 'single' | 'double'): string {
    // Simple quote fixing - in a real implementation, this would be more sophisticated
    if (quoteStyle === 'single') {
      return code.replace(/"([^"]*)"/g, "'$1'")
    } else {
      return code.replace(/'([^']*)'/g, '"$1"')
    }
  }

  private static fixPythonQuotes(code: string, quoteStyle: 'single' | 'double'): string {
    // Python prefers double quotes for docstrings, single for other strings
    return code
  }

  private static fixSemicolons(code: string, semicolons: 'asi' | 'always' | 'never'): string {
    const lines = code.split('\n')

    return lines.map(line => {
      const trimmed = line.trim()

      // Skip comments, strings, and lines that already have semicolons
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') ||
          trimmed.includes('"') || trimmed.includes("'") ||
          trimmed.endsWith(';') || trimmed.endsWith(',') ||
          trimmed.endsWith('{') || trimmed.endsWith('}')) {
        return line
      }

      // Add semicolon if needed
      if (semicolons === 'always' && trimmed && !trimmed.endsWith(':')) {
        return line + ';'
      }

      return line
    }).join('\n')
  }

  private static fixTrailingCommas(code: string, trailingCommas: 'none' | 'es5' | 'all'): string {
    // Simple trailing comma fixing
    if (trailingCommas === 'none') {
      return code.replace(/,(\s*[}\]])/g, '$1')
    }
    // For 'es5' and 'all', we'd need more sophisticated parsing
    return code
  }

  private static fixBracketSpacing(code: string, bracketSpacing: boolean): string {
    if (bracketSpacing) {
      return code
        .replace(/(\w+)\{/g, '$1 {')
        .replace(/(\w+)\(/g, '$1 (')
        .replace(/\{(\w)/g, '{ $1')
        .replace(/\((\w)/g, '( $1')
    } else {
      return code
        .replace(/(\w+)\s*\{/g, '$1{')
        .replace(/(\w+)\s*\(/g, '$1(')
        .replace(/\s*\{(\w)/g, '{$1')
        .replace(/\s*\((\w)/g, '($1')
    }
  }

  private static fixArrowParens(code: string, arrowParens: 'avoid' | 'always'): string {
    // Simple arrow function parentheses fixing
    if (arrowParens === 'avoid') {
      return code.replace(/\((\w+)\)\s*=>/g, '$1 =>')
    } else {
      return code.replace(/(\w+)\s*=>/g, '($1) =>')
    }
  }

  private static fixLineEndings(code: string, endOfLine: 'lf' | 'crlf' | 'cr'): string {
    const normalized = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

    switch (endOfLine) {
      case 'crlf':
        return normalized.replace(/\n/g, '\r\n')
      case 'cr':
        return normalized.replace(/\n/g, '\r')
      default:
        return normalized
    }
  }

  private static fixMaxLineLength(code: string, maxLength: number): string {
    const lines = code.split('\n')

    return lines.map(line => {
      if (line.length <= maxLength) return line

      // Simple line breaking - in a real implementation, this would be more sophisticated
      if (line.includes('&&') || line.includes('||')) {
        return line.replace(/(\s*&&\s*|\s*\|\|\s*)/g, '$1\n  ')
      }

      return line
    }).join('\n')
  }

  private static fixJavaBraces(code: string): string {
    // Java brace style formatting
    return code
      .replace(/(\w+)\s*\{\s*$/gm, '$1 {')
      .replace(/^\s*\}\s*$/gm, '}')
  }

  private static fixJavaImports(code: string): string {
    // Sort and format Java imports
    const importRegex = /^import\s+.*$/gm
    const imports = code.match(importRegex) || []

    if (imports.length === 0) return code

    const sortedImports = imports
      .sort()
      .join('\n')

    return code.replace(importRegex, '').replace(/^/, sortedImports + '\n\n')
  }

  private static fixCSharpBraces(code: string): string {
    // C# brace style formatting
    return code
  }

  private static fixCSharpUsing(code: string): string {
    // Sort and format C# using statements
    const usingRegex = /^using\s+.*$/gm
    const usings = code.match(usingRegex) || []

    if (usings.length === 0) return code

    const sortedUsings = usings
      .sort()
      .join('\n')

    return code.replace(usingRegex, '').replace(/^/, sortedUsings + '\n\n')
  }

  private static fixPHPBraces(code: string): string {
    // PHP brace style formatting
    return code
  }

  private static fixPythonLineLength(code: string, maxLength: number): string {
    // Python line length handling (different from other languages)
    return code
  }

  private static fixHTMLIndentation(code: string, options: FormatOptions): string {
    // HTML-specific indentation
    let indentLevel = 0
    const indentString = options.indentStyle === 'tab' ? '\t' : ' '.repeat(options.indentSize)

    return code
      .split('\n')
      .map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''

        // Decrease indent for closing tags
        if (trimmed.match(/^<\/\w+/)) {
          indentLevel = Math.max(0, indentLevel - 1)
        }

        const indentedLine = indentString.repeat(indentLevel) + trimmed

        // Increase indent for opening tags (that aren't self-closing)
        if (trimmed.match(/^<\w+[^>]*>$/) && !trimmed.match(/\/>$/)) {
          indentLevel++
        }

        return indentedLine
      })
      .join('\n')
  }

  private static fixHTMLAttributes(code: string): string {
    // Format HTML attributes
    return code
      .replace(/(\w+)=(['"])([^'"]*)\2/g, '$1="$3"') // Normalize quotes
      .replace(/\s+/g, ' ') // Normalize spacing
  }

  private static fixCSSIndentation(code: string, options: FormatOptions): string {
    // CSS-specific indentation
    return code
  }

  private static fixCSSBraces(code: string): string {
    // CSS brace formatting
    return code
      .replace(/(\w+)\s*\{/g, '$1 {')
      .replace(/\{\s*/g, '{\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*\}/g, '\n}')
  }

  private static fixCSSSemicolons(code: string): string {
    // Ensure semicolons in CSS
    return code.replace(/([^;])\s*$/gm, '$1;')
  }

  private static calculateChanges(original: string, formatted: string): FormatResult['changes'] {
    const originalLines = original.split('\n').length
    const formattedLines = formatted.split('\n').length
    const linesChanged = Math.abs(originalLines - formattedLines)

    const charactersAdded = Math.max(0, formatted.length - original.length)
    const charactersRemoved = Math.max(0, original.length - formatted.length)

    return {
      linesChanged,
      charactersAdded,
      charactersRemoved
    }
  }

  // Preset configurations
  static getPreset(name: string): Partial<FormatOptions> {
    const presets: Record<string, Partial<FormatOptions>> = {
      'prettier': {
        indentStyle: 'space',
        indentSize: 2,
        maxLineLength: 80,
        trailingCommas: 'es5',
        quoteStyle: 'single',
        semicolons: 'always',
        bracketSpacing: true,
        arrowParens: 'avoid',
        endOfLine: 'lf'
      },
      'airbnb': {
        indentStyle: 'space',
        indentSize: 2,
        maxLineLength: 100,
        trailingCommas: 'es5',
        quoteStyle: 'single',
        semicolons: 'always',
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'lf'
      },
      'google': {
        indentStyle: 'space',
        indentSize: 2,
        maxLineLength: 80,
        trailingCommas: 'none',
        quoteStyle: 'double',
        semicolons: 'always',
        bracketSpacing: false,
        arrowParens: 'always',
        endOfLine: 'lf'
      },
      'python-black': {
        indentStyle: 'space',
        indentSize: 4,
        maxLineLength: 88,
        endOfLine: 'lf'
      },
      'java-google': {
        indentStyle: 'space',
        indentSize: 2,
        maxLineLength: 100,
        endOfLine: 'lf'
      }
    }

    return presets[name] || {}
  }

  // Language-specific validation
  static validateCode(code: string, language: string): { valid: boolean; errors: string[] } {
    const errors: string[]

    try {
      switch (language) {
        case 'json':
          JSON.parse(code)
          errors = []
          break
        case 'javascript':
        case 'typescript':
          // Basic syntax check
          new Function(code.replace(/import|export/g, '//'))
          errors = []
          break
        default:
          errors = []
      }

      return { valid: errors.length === 0, errors }
    } catch (error: any) {
      return { valid: false, errors: [error.message] }
    }
  }
}
