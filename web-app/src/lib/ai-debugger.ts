export interface CodeIssue {
  id: string
  type: 'error' | 'warning' | 'info' | 'suggestion'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  line: number
  column: number
  code: string
  suggestion?: string
  fix?: {
    type: 'replace' | 'insert' | 'delete'
    range: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
    newText: string
  }
  tags: string[]
  category: 'syntax' | 'logic' | 'performance' | 'security' | 'best-practice' | 'compatibility'
}

export interface DebugReport {
  issues: CodeIssue[]
  summary: {
    totalIssues: number
    errors: number
    warnings: number
    suggestions: number
    score: number // 0-100 quality score
  }
  analysis: {
    complexity: number
    maintainability: number
    performance: number
    security: number
  }
  recommendations: string[]
}

export class AIDebugger {
  static async analyzeCode(
    code: string,
    language: 'javascript' | 'typescript' | 'html' | 'css' | 'python' | 'json',
    options: {
      strict?: boolean
      includePerformance?: boolean
      includeSecurity?: boolean
      framework?: string
    } = {}
  ): Promise<DebugReport> {
    const issues: CodeIssue[] = []

    // Run different analysis based on language
    switch (language) {
      case 'javascript':
      case 'typescript':
        issues.push(...await this.analyzeJavaScript(code, options))
        break
      case 'html':
        issues.push(...this.analyzeHTML(code))
        break
      case 'css':
        issues.push(...this.analyzeCSS(code))
        break
      case 'python':
        issues.push(...this.analyzePython(code))
        break
      case 'json':
        issues.push(...this.analyzeJSON(code))
        break
    }

    // Cross-language analysis
    issues.push(...this.analyzeGeneral(code, language))

    // Performance analysis
    if (options.includePerformance) {
      issues.push(...this.analyzePerformance(code, language))
    }

    // Security analysis
    if (options.includeSecurity) {
      issues.push(...this.analyzeSecurity(code, language))
    }

    // Calculate summary
    const summary = this.calculateSummary(issues)
    const analysis = this.calculateMetrics(code, language)
    const recommendations = this.generateRecommendations(issues, analysis)

    return {
      issues,
      summary,
      analysis,
      recommendations,
    }
  }

  private static async analyzeJavaScript(
    code: string,
    options: any
  ): Promise<CodeIssue[]> {
    const issues: CodeIssue[] = []
    const lines = code.split('\n')

    // Basic syntax and logic checks
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      // Check for console.log statements in production code
      if (line.includes('console.log') && !options.strict) {
        issues.push({
          id: `console-log-${lineNumber}`,
          type: 'warning',
          severity: 'low',
          title: 'Console.log statement found',
          description: 'Console.log statements should be removed in production code',
          line: lineNumber,
          column: line.indexOf('console.log') + 1,
          code: line.trim(),
          suggestion: 'Remove console.log statements or replace with proper logging',
          tags: ['console', 'debugging', 'production'],
          category: 'best-practice',
        })
      }

      // Check for undefined variables
      const varMatch = line.match(/\b(let|const|var)\s+(\w+)\s*=/)
      if (varMatch) {
        const varName = varMatch[2]
        // Check if variable is used before declaration (simplified check)
        const beforeDeclaration = lines.slice(0, i).join('\n')
        if (beforeDeclaration.includes(varName) && !beforeDeclaration.includes(`var ${varName}`) &&
            !beforeDeclaration.includes(`let ${varName}`) && !beforeDeclaration.includes(`const ${varName}`)) {
          issues.push({
            id: `undefined-var-${lineNumber}`,
            type: 'error',
            severity: 'high',
            title: 'Variable used before declaration',
            description: `Variable '${varName}' is used before it is declared`,
            line: lineNumber,
            column: line.indexOf(varName) + 1,
            code: line.trim(),
            suggestion: 'Move the variable declaration before its first use',
            tags: ['variable', 'scope', 'hoisting'],
            category: 'logic',
          })
        }
      }

      // Check for potential null/undefined access
      if (line.includes('?.') === false && /\w+\.\w+/.test(line)) {
        const propertyAccess = line.match(/(\w+)\.(\w+)/)
        if (propertyAccess) {
          issues.push({
            id: `null-access-${lineNumber}`,
            type: 'warning',
            severity: 'medium',
            title: 'Potential null/undefined access',
            description: `Property access without null checking: ${propertyAccess[0]}`,
            line: lineNumber,
            column: line.indexOf(propertyAccess[0]) + 1,
            code: line.trim(),
            suggestion: `Consider using optional chaining: ${propertyAccess[1]}?.${propertyAccess[2]}`,
            fix: {
              type: 'replace',
              range: {
                start: { line: lineNumber, column: line.indexOf(propertyAccess[0]) },
                end: { line: lineNumber, column: line.indexOf(propertyAccess[0]) + propertyAccess[0].length },
              },
              newText: `${propertyAccess[1]}?.${propertyAccess[2]}`,
            },
            tags: ['null', 'undefined', 'safety'],
            category: 'logic',
          })
        }
      }

      // Check for missing error handling in async functions
      if (line.includes('async') && !lines.slice(i).some(l => l.includes('try') || l.includes('catch'))) {
        issues.push({
          id: `async-error-${lineNumber}`,
          type: 'warning',
          severity: 'medium',
          title: 'Async function without error handling',
          description: 'Async functions should have proper error handling',
          line: lineNumber,
          column: line.indexOf('async') + 1,
          code: line.trim(),
          suggestion: 'Wrap async operations in try-catch blocks',
          tags: ['async', 'error-handling', 'promise'],
          category: 'best-practice',
        })
      }

      // Check for inefficient loops
      if (line.includes('for') && line.includes('.length')) {
        const loopMatch = line.match(/for\s*\(\s*let\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*\w+\.length/)
        if (loopMatch) {
          issues.push({
            id: `loop-efficiency-${lineNumber}`,
            type: 'suggestion',
            severity: 'low',
            title: 'Loop efficiency optimization',
            description: 'Cache array length outside the loop for better performance',
            line: lineNumber,
            column: line.indexOf('for') + 1,
            code: line.trim(),
            suggestion: 'Store array.length in a variable before the loop',
            tags: ['performance', 'loop', 'optimization'],
            category: 'performance',
          })
        }
      }
    }

    // Check for unused variables (simplified)
    const declaredVars = new Set()
    const usedVars = new Set()

    lines.forEach((line, index) => {
      const declareMatch = line.match(/\b(?:let|const|var|function)\s+(\w+)/)
      if (declareMatch) {
        declaredVars.add(declareMatch[1])
      }

      // Simple check for variable usage
      const usageMatches = line.match(/\b\w+\b/g) || []
      usageMatches.forEach(match => {
        if (declaredVars.has(match)) {
          usedVars.add(match)
        }
      })
    })

    declaredVars.forEach(varName => {
      if (!usedVars.has(varName as string) && !['console', 'window', 'document', 'alert'].includes(varName as string)) {
        issues.push({
          id: `unused-var-${varName}`,
          type: 'warning',
          severity: 'low',
          title: 'Unused variable',
          description: `Variable '${varName}' is declared but never used`,
          line: 1, // Would need more sophisticated tracking
          column: 1,
          code: `var ${varName}`,
          suggestion: 'Remove unused variable or use it in your code',
          tags: ['unused', 'variable', 'cleanup'],
          category: 'best-practice',
        })
      }
    })

    return issues
  }

  private static analyzeHTML(code: string): CodeIssue[] {
    const issues: CodeIssue[] = []
    const lines = code.split('\n')

    // Check for missing alt attributes
    const imgRegex = /<img[^>]*>/gi
    let match
    while ((match = imgRegex.exec(code)) !== null) {
      const imgTag = match[0]
      if (!imgTag.includes('alt=')) {
        const lineNumber = code.substring(0, match.index).split('\n').length
        issues.push({
          id: `missing-alt-${lineNumber}`,
          type: 'warning',
          severity: 'medium',
          title: 'Missing alt attribute',
          description: 'Images should have alt attributes for accessibility',
          line: lineNumber,
          column: match.index - code.lastIndexOf('\n', match.index) + 1,
          code: imgTag,
          suggestion: 'Add alt="description of image" to the img tag',
          tags: ['accessibility', 'a11y', 'images'],
          category: 'best-practice',
        })
      }
    }

    // Check for missing DOCTYPE
    if (!code.trim().toLowerCase().startsWith('<!doctype')) {
      issues.push({
        id: 'missing-doctype',
        type: 'warning',
        severity: 'low',
        title: 'Missing DOCTYPE declaration',
        description: 'HTML documents should start with a DOCTYPE declaration',
        line: 1,
        column: 1,
        code: lines[0],
        suggestion: 'Add <!DOCTYPE html> at the beginning of your document',
        tags: ['html', 'doctype', 'standards'],
        category: 'best-practice',
      })
    }

    // Check for deprecated tags
    const deprecatedTags = ['center', 'font', 'strike', 'u', 'marquee']
    deprecatedTags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>`, 'gi')
      while ((match = regex.exec(code)) !== null) {
        const lineNumber = code.substring(0, match.index).split('\n').length
        issues.push({
          id: `deprecated-tag-${tag}-${lineNumber}`,
          type: 'warning',
          severity: 'low',
          title: `Deprecated HTML tag: <${tag}>`,
          description: `The <${tag}> tag is deprecated and should be replaced with CSS`,
          line: lineNumber,
          column: match.index - code.lastIndexOf('\n', match.index) + 1,
          code: match[0],
          suggestion: `Use CSS instead: text-align: center, font-family, text-decoration, etc.`,
          tags: ['deprecated', 'html', 'css'],
          category: 'compatibility',
        })
      }
    })

    return issues
  }

  private static analyzeCSS(code: string): CodeIssue[] {
    const issues: CodeIssue[] = []
    const lines = code.split('\n')

    // Check for !important overuse
    const importantCount = (code.match(/!important/g) || []).length
    if (importantCount > 5) {
      issues.push({
        id: 'important-overuse',
        type: 'warning',
        severity: 'medium',
        title: 'Overuse of !important',
        description: `Found ${importantCount} !important declarations, which can make CSS hard to maintain`,
        line: 1,
        column: 1,
        code: '!important',
        suggestion: 'Use more specific selectors instead of !important',
        tags: ['css', 'specificity', 'maintenance'],
        category: 'best-practice',
      })
    }

    // Check for universal selector
    if (code.includes('* {') || code.includes('*,') || code.includes('* ')) {
      const lineNumber = lines.findIndex(line => line.includes('*')) + 1
      issues.push({
        id: 'universal-selector',
        type: 'suggestion',
        severity: 'low',
        title: 'Universal selector usage',
        description: 'The universal selector (*) can impact performance',
        line: lineNumber,
        column: lines[lineNumber - 1].indexOf('*') + 1,
        code: lines[lineNumber - 1].trim(),
        suggestion: 'Use more specific selectors when possible',
        tags: ['css', 'performance', 'selectors'],
        category: 'performance',
      })
    }

    // Check for long selector chains
    const selectors = code.split('{').map(s => s.trim())
    selectors.forEach((selector, index) => {
      const depth = (selector.match(/(\s+|>|\+|~)/g) || []).length
      if (depth > 5) {
        issues.push({
          id: `deep-selector-${index}`,
          type: 'suggestion',
          severity: 'low',
          title: 'Deep selector chain',
          description: `Selector has ${depth} levels of specificity, consider simplifying`,
          line: index + 1,
          column: 1,
          code: selector,
          suggestion: 'Use classes or IDs to reduce selector complexity',
          tags: ['css', 'specificity', 'maintenance'],
          category: 'best-practice',
        })
      }
    })

    return issues
  }

  private static analyzePython(code: string): CodeIssue[] {
    const issues: CodeIssue[] = []
    const lines = code.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineNumber = i + 1

      // Check for print statements (similar to console.log)
      if (line.includes('print(') && !line.includes('# TODO') && !line.includes('# FIXME')) {
        issues.push({
          id: `python-print-${lineNumber}`,
          type: 'warning',
          severity: 'low',
          title: 'Print statement found',
          description: 'Print statements should be replaced with proper logging in production',
          line: lineNumber,
          column: line.indexOf('print(') + 1,
          code: line.trim(),
          suggestion: 'Use logging module instead of print statements',
          tags: ['python', 'logging', 'production'],
          category: 'best-practice',
        })
      }

      // Check for bare except clauses
      if (line.includes('except:') && !line.includes('Exception')) {
        issues.push({
          id: `bare-except-${lineNumber}`,
          type: 'warning',
          severity: 'high',
          title: 'Bare except clause',
          description: 'Bare except clauses can hide unexpected errors',
          line: lineNumber,
          column: line.indexOf('except') + 1,
          code: line.trim(),
          suggestion: 'Specify the exception type: except Exception as e:',
          tags: ['python', 'exception', 'error-handling'],
          category: 'best-practice',
        })
      }
    }

    return issues
  }

  private static analyzeJSON(code: string): CodeIssue[] {
    const issues: CodeIssue[] = []

    try {
      JSON.parse(code)
    } catch (error: any) {
      const match = error.message.match(/position (\d+)/)
      const position = match ? parseInt(match[1]) : 0
      const lines = code.substring(0, position).split('\n')
      const lineNumber = lines.length
      const column = lines[lines.length - 1].length + 1

      issues.push({
        id: 'json-syntax-error',
        type: 'error',
        severity: 'critical',
        title: 'JSON syntax error',
        description: error.message,
        line: lineNumber,
        column: column,
        code: lines[lines.length - 1] || '',
        suggestion: 'Check for missing commas, quotes, or brackets',
        tags: ['json', 'syntax', 'parsing'],
        category: 'syntax',
      })
    }

    return issues
  }

  private static analyzeGeneral(code: string, language: string): CodeIssue[] {
    const issues: CodeIssue[] = []

    // Check for very long lines
    const lines = code.split('\n')
    lines.forEach((line, index) => {
      if (line.length > 120) {
        issues.push({
          id: `long-line-${index + 1}`,
          type: 'suggestion',
          severity: 'low',
          title: 'Line too long',
          description: `Line ${index + 1} is ${line.length} characters long (recommended: <120)`,
          line: index + 1,
          column: 1,
          code: line.substring(0, 50) + '...',
          suggestion: 'Break long lines for better readability',
          tags: ['readability', 'formatting'],
          category: 'best-practice',
        })
      }
    })

    // Check for TODO comments
    const todoMatches = code.match(/\/\/\s*TODO|#\s*TODO|<!--\s*TODO/gi) || []
    if (todoMatches.length > 0) {
      issues.push({
        id: 'todo-comments',
        type: 'info',
        severity: 'low',
        title: 'TODO comments found',
        description: `Found ${todoMatches.length} TODO comment(s) that need attention`,
        line: 1,
        column: 1,
        code: 'TODO',
        suggestion: 'Address TODO comments or convert to proper issues',
        tags: ['todo', 'comments', 'maintenance'],
        category: 'best-practice',
      })
    }

    return issues
  }

  private static analyzePerformance(code: string, language: string): CodeIssue[] {
    const issues: CodeIssue[] = []

    // JavaScript-specific performance issues
    if (language === 'javascript' || language === 'typescript') {
      // Check for inefficient DOM queries in loops
      const lines = code.split('\n')
      let inLoop = false
      lines.forEach((line, index) => {
        if (line.includes('for') || line.includes('while') || line.includes('forEach')) {
          inLoop = true
        }

        if (inLoop && (line.includes('document.querySelector') || line.includes('document.getElementById'))) {
          issues.push({
            id: `dom-query-in-loop-${index + 1}`,
            type: 'warning',
            severity: 'high',
            title: 'DOM query inside loop',
            description: 'DOM queries inside loops can cause performance issues',
            line: index + 1,
            column: line.indexOf('document.') + 1,
            code: line.trim(),
            suggestion: 'Move DOM queries outside the loop or cache the results',
            tags: ['performance', 'dom', 'loops'],
            category: 'performance',
          })
        }

        if (line.includes('}') && inLoop) {
          inLoop = false
        }
      })

      // Check for large objects in memory
      if (code.includes('new Array(10000)') || code.includes('Array.from({length: 10000})')) {
        issues.push({
          id: 'large-array-creation',
          type: 'warning',
          severity: 'medium',
          title: 'Large array creation',
          description: 'Creating very large arrays can impact memory usage',
          line: 1,
          column: 1,
          code: 'new Array(10000)',
          suggestion: 'Consider using generators or pagination for large datasets',
          tags: ['performance', 'memory', 'arrays'],
          category: 'performance',
        })
      }
    }

    return issues
  }

  private static analyzeSecurity(code: string, language: string): CodeIssue[] {
    const issues: CodeIssue[] = []

    // Check for eval usage
    if (code.includes('eval(')) {
      const lineNumber = code.split('\n').findIndex(line => line.includes('eval(')) + 1
      issues.push({
        id: 'eval-usage',
        type: 'error',
        severity: 'critical',
        title: 'Use of eval() function',
        description: 'eval() can execute malicious code and should never be used',
        line: lineNumber,
        column: code.split('\n')[lineNumber - 1].indexOf('eval(') + 1,
        code: 'eval(...)',
        suggestion: 'Remove eval() usage and use safer alternatives',
        tags: ['security', 'eval', 'vulnerability'],
        category: 'security',
      })
    }

    // Check for innerHTML usage (XSS risk)
    if (code.includes('innerHTML') && language === 'javascript') {
      const lineNumber = code.split('\n').findIndex(line => line.includes('innerHTML')) + 1
      issues.push({
        id: 'innerhtml-usage',
        type: 'warning',
        severity: 'high',
        title: 'Use of innerHTML',
        description: 'innerHTML can be vulnerable to XSS attacks',
        line: lineNumber,
        column: code.split('\n')[lineNumber - 1].indexOf('innerHTML') + 1,
        code: '.innerHTML = ...',
        suggestion: 'Use textContent, innerText, or sanitize HTML input',
        tags: ['security', 'xss', 'html'],
        category: 'security',
      })
    }

    // Check for hardcoded secrets
    const secretPatterns = [
      /api[_-]?key\s*[:=]\s*['"][^'"]*['"]/i,
      /password\s*[:=]\s*['"][^'"]*['"]/i,
      /secret\s*[:=]\s*['"][^'"]*['"]/i,
      /token\s*[:=]\s*['"][^'"]*['"]/i,
    ]

    secretPatterns.forEach((pattern, index) => {
      if (pattern.test(code)) {
        const lineNumber = code.split('\n').findIndex(line => pattern.test(line)) + 1
        issues.push({
          id: `hardcoded-secret-${index}`,
          type: 'error',
          severity: 'critical',
          title: 'Hardcoded secret detected',
          description: 'API keys, passwords, or tokens should not be hardcoded',
          line: lineNumber,
          column: 1,
          code: 'api_key = "..."',
          suggestion: 'Use environment variables or secure credential storage',
          tags: ['security', 'credentials', 'hardcoded'],
          category: 'security',
        })
      }
    })

    return issues
  }

  private static calculateSummary(issues: CodeIssue[]): DebugReport['summary'] {
    const errors = issues.filter(i => i.type === 'error').length
    const warnings = issues.filter(i => i.type === 'warning').length
    const suggestions = issues.filter(i => i.type === 'suggestion' || i.type === 'info').length

    // Calculate quality score (0-100)
    const totalIssues = issues.length
    const score = Math.max(0, 100 - (errors * 10 + warnings * 3 + suggestions * 1))

    return {
      totalIssues,
      errors,
      warnings,
      suggestions,
      score: Math.round(score),
    }
  }

  private static calculateMetrics(code: string, language: string): DebugReport['analysis'] {
    // Simplified metrics calculation
    const lines = code.split('\n').length
    const complexity = Math.min(10, Math.floor(lines / 50) + (code.split(/if|for|while|function/).length - 1) / 5)
    const maintainability = Math.max(1, 10 - complexity)
    const performance = language === 'javascript' ? (code.includes('const') ? 8 : 6) : 7
    const security = code.includes('eval') || code.includes('innerHTML') ? 3 : 8

    return {
      complexity: Math.round(complexity),
      maintainability: Math.round(maintainability),
      performance: Math.round(performance),
      security: Math.round(security),
    }
  }

  private static generateRecommendations(issues: CodeIssue[], analysis: DebugReport['analysis']): string[] {
    const recommendations: string[] = []

    if (issues.filter(i => i.category === 'security').length > 0) {
      recommendations.push('Address security issues immediately - they pose serious risks to your application')
    }

    if (issues.filter(i => i.type === 'error').length > 0) {
      recommendations.push('Fix all errors before deploying to production')
    }

    if (analysis.complexity > 7) {
      recommendations.push('Consider breaking down complex functions into smaller, more manageable pieces')
    }

    if (analysis.maintainability < 5) {
      recommendations.push('Improve code maintainability by adding comments and better variable names')
    }

    if (issues.filter(i => i.category === 'performance').length > 2) {
      recommendations.push('Optimize performance by reducing DOM queries and improving algorithms')
    }

    if (recommendations.length === 0) {
      recommendations.push('Great job! Your code looks clean and well-structured')
    }

    return recommendations
  }

  static getSeverityColor(severity: CodeIssue['severity']): string {
    switch (severity) {
      case 'critical': return 'text-red-600 dark:text-red-400'
      case 'high': return 'text-orange-600 dark:text-orange-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-blue-600 dark:text-blue-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  static getTypeIcon(type: CodeIssue['type']): string {
    switch (type) {
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      case 'suggestion': return '💡'
      default: return '❓'
    }
  }
}
