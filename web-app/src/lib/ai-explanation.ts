export interface CodeExplanation {
  summary: string
  functionality: string[]
  keyConcepts: Array<{
    name: string
    description: string
    importance: 'low' | 'medium' | 'high'
  }>
  algorithm?: {
    name: string
    description: string
    complexity: {
      time: string
      space: string
    }
    useCases: string[]
  }
  patterns: Array<{
    name: string
    description: string
    category: 'design' | 'architectural' | 'anti-pattern'
  }>
  dependencies: Array<{
    name: string
    purpose: string
    alternative?: string
  }>
  potentialIssues: Array<{
    type: 'security' | 'performance' | 'maintainability' | 'reliability'
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    suggestion: string
  }>
  improvements: Array<{
    type: 'performance' | 'readability' | 'maintainability' | 'security'
    description: string
    code?: string
    impact: 'low' | 'medium' | 'high'
  }>
  learningPoints: Array<{
    concept: string
    explanation: string
    examples: string[]
  }>
  relatedTopics: string[]
  documentation: {
    comments: string
    tests: string
    api: string
  }
}

export interface ExplanationOptions {
  language: string
  context?: string
  depth: 'basic' | 'intermediate' | 'advanced'
  focus?: 'overview' | 'algorithm' | 'patterns' | 'issues' | 'learning'
  includeExamples?: boolean
  targetAudience?: 'beginner' | 'intermediate' | 'expert'
}

export class AIExplanationService {
  static async explainCode(
    code: string,
    options: ExplanationOptions
  ): Promise<CodeExplanation> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const explanation = await this.generateExplanation(code, options)

    // Cache the explanation for future use
    this.cacheExplanation(code, options, explanation)

    return explanation
  }

  private static async generateExplanation(
    code: string,
    options: ExplanationOptions
  ): Promise<CodeExplanation> {
    const { language, depth, focus, targetAudience = 'intermediate' } = options

    // Analyze the code structure
    const analysis = this.analyzeCodeStructure(code, language)

    // Generate explanation based on analysis and options
    const explanation: CodeExplanation = {
      summary: this.generateSummary(analysis, options),
      functionality: this.extractFunctionality(analysis),
      keyConcepts: this.identifyKeyConcepts(analysis, language),
      patterns: this.detectPatterns(analysis, language),
      dependencies: this.analyzeDependencies(analysis, language),
      potentialIssues: this.identifyIssues(analysis, language),
      improvements: this.suggestImprovements(analysis, language),
      learningPoints: this.generateLearningPoints(analysis, targetAudience),
      relatedTopics: this.getRelatedTopics(analysis, language),
      documentation: this.generateDocumentation(analysis, language)
    }

    // Add algorithm analysis if applicable
    if (analysis.hasAlgorithm) {
      explanation.algorithm = this.analyzeAlgorithm(analysis, language)
    }

    // Filter based on focus if specified
    if (focus && focus !== 'overview') {
      return this.filterExplanationByFocus(explanation, focus)
    }

    return explanation
  }

  private static analyzeCodeStructure(code: string, language: string): any {
    // Basic code analysis - in a real implementation, this would use AST parsing
    const lines = code.split('\n')
    const functions = this.extractFunctions(code, language)
    const classes = this.extractClasses(code, language)
    const imports = this.extractImports(code, language)
    const comments = this.extractComments(code, language)
    const complexity = this.calculateComplexity(code, language)

    return {
      lines: lines.length,
      functions,
      classes,
      imports,
      comments,
      complexity,
      hasAlgorithm: this.detectAlgorithm(code, language),
      language,
      patterns: this.detectCodePatterns(code, language)
    }
  }

  private static extractFunctions(code: string, language: string): any[] {
    const functions = []

    switch (language) {
      case 'javascript':
      case 'typescript':
        const jsFunctions = code.match(/function\s+(\w+)\s*\([^)]*\)/g) || []
        const arrowFunctions = code.match(/const\s+(\w+)\s*=\s*(?:\([^)]*\)|[^\s=]+)\s*=>/g) || []
        functions.push(...jsFunctions.map(f => ({ name: f.match(/function\s+(\w+)/)?.[1], type: 'function' })))
        functions.push(...arrowFunctions.map(f => ({ name: f.match(/const\s+(\w+)/)?.[1], type: 'arrow' })))
        break

      case 'python':
        const pyFunctions = code.match(/def\s+(\w+)\s*\([^)]*\):/g) || []
        functions.push(...pyFunctions.map(f => ({ name: f.match(/def\s+(\w+)/)?.[1], type: 'function' })))
        break

      case 'java':
        const javaMethods = code.match(/(?:public|private|protected)?\s*\w+\s+(\w+)\s*\([^)]*\)/g) || []
        functions.push(...javaMethods.map(f => ({ name: f.match(/(?:public|private|protected)?\s*\w+\s+(\w+)/)?.[1], type: 'method' })))
        break
    }

    return functions.filter(f => f.name)
  }

  private static extractClasses(code: string, language: string): any[] {
    const classes = []

    switch (language) {
      case 'javascript':
      case 'typescript':
        const jsClasses = code.match(/class\s+(\w+)/g) || []
        classes.push(...jsClasses.map(c => ({ name: c.match(/class\s+(\w+)/)?.[1], type: 'class' })))
        break

      case 'python':
        const pyClasses = code.match(/class\s+(\w+)/g) || []
        classes.push(...pyClasses.map(c => ({ name: c.match(/class\s+(\w+)/)?.[1], type: 'class' })))
        break

      case 'java':
        const javaClasses = code.match(/class\s+(\w+)/g) || []
        classes.push(...javaClasses.map(c => ({ name: c.match(/class\s+(\w+)/)?.[1], type: 'class' })))
        break
    }

    return classes
  }

  private static extractImports(code: string, language: string): any[] {
    const imports = []

    switch (language) {
      case 'javascript':
      case 'typescript':
        const es6Imports = code.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g) || []
        const requireImports = code.match(/const\s+\w+\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g) || []
        imports.push(...es6Imports.map(i => ({ module: i.match(/from\s+['"]([^'"]+)['"]/)?.[1], type: 'es6' })))
        imports.push(...requireImports.map(i => ({ module: i.match(/require\s*\(\s*['"]([^'"]+)['"]/)?.[1], type: 'commonjs' })))
        break

      case 'python':
        const pyImports = code.match(/^(?:import\s+(\w+)|from\s+(\w+)\s+import)/gm) || []
        imports.push(...pyImports.map(i => ({ module: i.match(/(?:import\s+(\w+)|from\s+(\w+))/)?.[1], type: 'python' })))
        break

      case 'java':
        const javaImports = code.match(/^import\s+([^;]+)/gm) || []
        imports.push(...javaImports.map(i => ({ module: i.match(/import\s+([^;]+)/)?.[1], type: 'java' })))
        break
    }

    return imports.filter(i => i.module)
  }

  private static extractComments(code: string, language: string): any[] {
    const comments = []

    // Extract single-line comments
    const singleLineComments = code.match(/\/\/.*$/gm) || []
    comments.push(...singleLineComments.map(c => ({ text: c.substring(2).trim(), type: 'single' })))

    // Extract multi-line comments
    const multiLineComments = code.match(/\/\*[\s\S]*?\*\//g) || []
    comments.push(...multiLineComments.map(c => ({ text: c.replace(/\/\*|\*\//g, '').trim(), type: 'multi' })))

    return comments
  }

  private static calculateComplexity(code: string, language: string): any {
    const lines = code.split('\n').length
    const functions = this.extractFunctions(code, language).length
    const classes = this.extractClasses(code, language).length
    const conditionals = (code.match(/\b(if|else|switch|case|for|while|do)\b/g) || []).length
    const nesting = this.calculateNestingDepth(code)

    return {
      lines,
      functions,
      classes,
      conditionals,
      nesting,
      score: Math.min(10, Math.round((conditionals * 0.5 + nesting * 2 + functions * 0.3 + classes * 0.5)))
    }
  }

  private static calculateNestingDepth(code: string): number {
    let maxDepth = 0
    let currentDepth = 0

    for (const char of code) {
      if (char === '{' || char === '(') {
        currentDepth++
        maxDepth = Math.max(maxDepth, currentDepth)
      } else if (char === '}' || char === ')') {
        currentDepth = Math.max(0, currentDepth - 1)
      }
    }

    return maxDepth
  }

  private static detectAlgorithm(code: string, language: string): boolean {
    const algorithmPatterns = [
      /\b(sort|search|binary|quick|merge|bubble|insertion|selection)\b/i,
      /\b(graph|tree|linked|list|stack|queue|heap|hash)\b/i,
      /\b(dynamic|greedy|divide|conquer|backtrack|recursion)\b/i,
      /\b(fibonacci|factorial|prime|palindrome|gcd|lcm)\b/i
    ]

    return algorithmPatterns.some(pattern => pattern.test(code))
  }

  private static detectCodePatterns(code: string, language: string): any[] {
    const patterns = []

    // Singleton pattern
    if (code.includes('static instance') || code.includes('getInstance')) {
      patterns.push({ name: 'Singleton', category: 'design', confidence: 0.8 })
    }

    // Factory pattern
    if (code.includes('Factory') || /create\w*\(\)/.test(code)) {
      patterns.push({ name: 'Factory', category: 'design', confidence: 0.7 })
    }

    // Observer pattern
    if (code.includes('subscribe') || code.includes('observer') || code.includes('emit')) {
      patterns.push({ name: 'Observer', category: 'design', confidence: 0.6 })
    }

    // MVC pattern
    if (code.includes('Controller') && code.includes('Model') && code.includes('View')) {
      patterns.push({ name: 'MVC', category: 'architectural', confidence: 0.9 })
    }

    return patterns
  }

  private static generateSummary(analysis: any, options: ExplanationOptions): string {
    const { language, depth } = options

    let summary = `This is a ${language} code snippet with ${analysis.lines} lines`

    if (analysis.functions.length > 0) {
      summary += ` containing ${analysis.functions.length} function${analysis.functions.length !== 1 ? 's' : ''}`
    }

    if (analysis.classes.length > 0) {
      summary += ` and ${analysis.classes.length} class${analysis.classes.length !== 1 ? 'es' : ''}`
    }

    if (analysis.complexity.score > 5) {
      summary += `. The code has moderate to high complexity`
    } else {
      summary += `. The code has low complexity`
    }

    if (analysis.hasAlgorithm) {
      summary += ` and implements algorithmic logic`
    }

    if (depth === 'advanced') {
      summary += `. It follows ${language} best practices and demonstrates ${analysis.patterns.length > 0 ? analysis.patterns.length : 'several'} design patterns.`
    }

    return summary + '.'
  }

  private static extractFunctionality(analysis: any): string[] {
    const functionality = []

    if (analysis.functions.length > 0) {
      functionality.push(`Contains ${analysis.functions.length} function${analysis.functions.length !== 1 ? 's' : ''} for code organization`)
    }

    if (analysis.classes.length > 0) {
      functionality.push(`Defines ${analysis.classes.length} class${analysis.classes.length !== 1 ? 'es' : ''} for object-oriented programming`)
    }

    if (analysis.imports.length > 0) {
      functionality.push(`Imports ${analysis.imports.length} external module${analysis.imports.length !== 1 ? 's' : ''} for extended functionality`)
    }

    if (analysis.hasAlgorithm) {
      functionality.push('Implements algorithmic logic for problem-solving')
    }

    if (analysis.comments.length > 0) {
      functionality.push(`Includes ${analysis.comments.length} comment${analysis.comments.length !== 1 ? 's' : ''} for code documentation`)
    }

    return functionality
  }

  private static identifyKeyConcepts(analysis: any, language: string): CodeExplanation['keyConcepts'] {
    const concepts = []

    // Language-specific concepts
    switch (language) {
      case 'javascript':
      case 'typescript':
        concepts.push({
          name: 'Functions',
          description: 'Reusable blocks of code that perform specific tasks',
          importance: 'high'
        })
        if (analysis.classes.length > 0) {
          concepts.push({
            name: 'Classes',
            description: 'Blueprints for creating objects with properties and methods',
            importance: 'high'
          })
        }
        break

      case 'python':
        concepts.push({
          name: 'Functions',
          description: 'Defined using the def keyword, support default parameters',
          importance: 'high'
        })
        if (analysis.classes.length > 0) {
          concepts.push({
            name: 'Classes',
            description: 'Support inheritance and encapsulation',
            importance: 'medium'
          })
        }
        break

      case 'java':
        concepts.push({
          name: 'Classes',
          description: 'Fundamental building blocks with encapsulation',
          importance: 'high'
        })
        concepts.push({
          name: 'Methods',
          description: 'Functions defined within classes',
          importance: 'high'
        })
        concepts.push({
          name: 'Access Modifiers',
          description: 'Control visibility and accessibility (public, private, protected)',
          importance: 'medium'
        })
        break
    }

    // Common concepts
    if (analysis.imports.length > 0) {
      concepts.push({
        name: 'Modules/Imports',
        description: 'Reusing code from external libraries and files',
        importance: 'medium'
      })
    }

    return concepts
  }

  private static detectPatterns(analysis: any, language: string): CodeExplanation['patterns'] {
    const patterns = []

    analysis.patterns.forEach((pattern: any) => {
      patterns.push({
        name: pattern.name,
        description: `${pattern.name} design pattern ${pattern.category === 'design' ? 'for flexible code structure' : 'for application architecture'}`,
        category: pattern.category as 'design' | 'architectural' | 'anti-pattern'
      })
    })

    // Common patterns
    if (analysis.functions.length > 3) {
      patterns.push({
        name: 'Functional Decomposition',
        description: 'Breaking down complex problems into smaller, manageable functions',
        category: 'design'
      })
    }

    if (analysis.comments.length < analysis.functions.length * 0.5) {
      patterns.push({
        name: 'Insufficient Documentation',
        description: 'Code lacks adequate comments and documentation',
        category: 'anti-pattern'
      })
    }

    return patterns
  }

  private static analyzeDependencies(analysis: any, language: string): CodeExplanation['dependencies'] {
    const dependencies = []

    analysis.imports.forEach((imp: any) => {
      let purpose = 'Unknown functionality'
      let alternative = undefined

      // Analyze common libraries
      if (imp.module.includes('react')) {
        purpose = 'User interface library for building web applications'
        alternative = 'Vue.js or Angular'
      } else if (imp.module.includes('express')) {
        purpose = 'Web framework for Node.js applications'
        alternative = 'Fastify or Koa'
      } else if (imp.module.includes('axios')) {
        purpose = 'HTTP client for making API requests'
        alternative = 'Fetch API or node-fetch'
      } else if (imp.module.includes('lodash')) {
        purpose = 'Utility library for common programming tasks'
        alternative = 'Native JavaScript methods'
      } else if (imp.module.includes('moment')) {
        purpose = 'Date and time manipulation library'
        alternative = 'date-fns or native Date API'
      }

      dependencies.push({
        name: imp.module,
        purpose,
        alternative
      })
    })

    return dependencies
  }

  private static identifyIssues(analysis: any, language: string): CodeExplanation['potentialIssues'] {
    const issues = []

    // Complexity issues
    if (analysis.complexity.score > 7) {
      issues.push({
        type: 'maintainability',
        description: 'Code complexity is high, making it difficult to understand and maintain',
        severity: 'medium',
        suggestion: 'Consider breaking down complex functions into smaller, focused functions'
      })
    }

    // Documentation issues
    if (analysis.comments.length === 0) {
      issues.push({
        type: 'maintainability',
        description: 'Code lacks comments, reducing readability and maintainability',
        severity: 'low',
        suggestion: 'Add comments explaining the purpose and logic of functions and complex code blocks'
      })
    }

    // Security issues (basic checks)
    if (language === 'javascript' && /eval\s*\(/.test(analysis.code)) {
      issues.push({
        type: 'security',
        description: 'Use of eval() function poses security risks',
        severity: 'high',
        suggestion: 'Avoid using eval() as it can execute malicious code. Use safer alternatives.'
      })
    }

    // Performance issues
    if (analysis.complexity.nesting > 4) {
      issues.push({
        type: 'performance',
        description: 'Deep nesting may impact performance and readability',
        severity: 'low',
        suggestion: 'Consider flattening nested structures or using early returns'
      })
    }

    return issues
  }

  private static suggestImprovements(analysis: any, language: string): CodeExplanation['improvements'] {
    const improvements = []

    // Readability improvements
    if (analysis.comments.length < analysis.functions.length) {
      improvements.push({
        type: 'readability',
        description: 'Add JSDoc comments to functions for better documentation',
        code: '/**\n * Function description\n * @param {type} param - Parameter description\n * @returns {type} Return value description\n */',
        impact: 'medium'
      })
    }

    // Performance improvements
    if (analysis.complexity.conditionals > 10) {
      improvements.push({
        type: 'performance',
        description: 'Consider using object lookup tables instead of multiple if-else statements',
        impact: 'medium'
      })
    }

    // Maintainability improvements
    if (analysis.functions.length > 5 && analysis.classes.length === 0) {
      improvements.push({
        type: 'maintainability',
        description: 'Consider grouping related functions into a class or module',
        impact: 'medium'
      })
    }

    return improvements
  }

  private static analyzeAlgorithm(analysis: any, language: string): CodeExplanation['algorithm'] {
    // Basic algorithm detection and analysis
    let algorithmName = 'Unknown Algorithm'
    let description = 'This code implements algorithmic logic'
    let timeComplexity = 'O(n)'
    let spaceComplexity = 'O(1)'
    const useCases = ['General problem solving']

    // Try to identify specific algorithms
    const code = analysis.code.toLowerCase()

    if (code.includes('binary') && code.includes('search')) {
      algorithmName = 'Binary Search'
      description = 'Efficient search algorithm for sorted arrays'
      timeComplexity = 'O(log n)'
      spaceComplexity = 'O(1)'
      useCases = ['Searching sorted data', 'Database queries', 'Finding elements in collections']
    } else if (code.includes('quick') && code.includes('sort')) {
      algorithmName = 'Quick Sort'
      description = 'Fast sorting algorithm using divide and conquer'
      timeComplexity = 'O(n log n) average, O(n²) worst'
      spaceComplexity = 'O(log n)'
      useCases = ['Sorting large datasets', 'In-place sorting', 'General purpose sorting']
    } else if (code.includes('merge') && code.includes('sort')) {
      algorithmName = 'Merge Sort'
      description = 'Stable sorting algorithm with consistent performance'
      timeComplexity = 'O(n log n)'
      spaceComplexity = 'O(n)'
      useCases = ['Stable sorting requirements', 'External sorting', 'Linked list sorting']
    } else if (code.includes('fibonacci')) {
      algorithmName = 'Fibonacci Sequence'
      description = 'Generates numbers in the Fibonacci sequence'
      timeComplexity = 'O(2^n) naive, O(n) optimized'
      spaceComplexity = 'O(1) iterative, O(n) recursive'
      useCases = ['Mathematical computations', 'Algorithm demonstrations', 'Performance comparisons']
    }

    return {
      name: algorithmName,
      description,
      complexity: {
        time: timeComplexity,
        space: spaceComplexity
      },
      useCases
    }
  }

  private static generateLearningPoints(analysis: any, targetAudience: string): CodeExplanation['learningPoints'] {
    const learningPoints = []

    if (targetAudience === 'beginner') {
      learningPoints.push({
        concept: 'Code Structure',
        explanation: 'Code is organized into logical blocks with functions and classes',
        examples: [
          'Functions break down complex tasks into manageable pieces',
          'Classes group related data and behavior together',
          'Imports bring in external functionality'
        ]
      })

      learningPoints.push({
        concept: 'Variables and Data',
        explanation: 'Variables store data that the program works with',
        examples: [
          'Different data types (strings, numbers, objects)',
          'Variable naming conventions',
          'Scope and lifetime of variables'
        ]
      })
    } else if (targetAudience === 'intermediate') {
      learningPoints.push({
        concept: 'Code Organization',
        explanation: 'Well-structured code follows patterns and principles',
        examples: [
          'Separation of concerns',
          'Single responsibility principle',
          'DRY (Don\'t Repeat Yourself) principle'
        ]
      })

      learningPoints.push({
        concept: 'Error Handling',
        explanation: 'Programs should handle errors gracefully',
        examples: [
          'Try-catch blocks',
          'Input validation',
          'Meaningful error messages'
        ]
      })
    } else {
      learningPoints.push({
        concept: 'Advanced Patterns',
        explanation: 'Complex code uses design patterns and architectural principles',
        examples: [
          'Design patterns (Singleton, Factory, Observer)',
          'Architectural patterns (MVC, MVVM)',
          'Performance optimization techniques'
        ]
      })

      learningPoints.push({
        concept: 'Code Quality',
        explanation: 'High-quality code is maintainable, testable, and efficient',
        examples: [
          'Code metrics and complexity analysis',
          'Testing strategies and coverage',
          'Documentation and code comments'
        ]
      })
    }

    return learningPoints
  }

  private static getRelatedTopics(analysis: any, language: string): string[] {
    const topics = [language]

    if (analysis.hasAlgorithm) {
      topics.push('Algorithms', 'Data Structures')
    }

    if (analysis.classes.length > 0) {
      topics.push('Object-Oriented Programming')
    }

    if (analysis.imports.some((imp: any) => imp.module.includes('react'))) {
      topics.push('React', 'Frontend Development', 'Component Architecture')
    }

    if (analysis.imports.some((imp: any) => imp.module.includes('express'))) {
      topics.push('Backend Development', 'REST APIs', 'Server-side Programming')
    }

    if (language === 'javascript') {
      topics.push('ES6+', 'Async Programming', 'DOM Manipulation')
    } else if (language === 'python') {
      topics.push('PEP 8', 'List Comprehensions', 'Context Managers')
    } else if (language === 'java') {
      topics.push('JVM', 'Garbage Collection', 'Java Collections Framework')
    }

    return [...new Set(topics)]
  }

  private static generateDocumentation(analysis: any, language: string): CodeExplanation['documentation'] {
    const docComments = this.generateDocComments(analysis, language)
    const testExamples = this.generateTestExamples(analysis, language)
    const apiDocs = this.generateAPIDocs(analysis, language)

    return {
      comments: docComments,
      tests: testExamples,
      api: apiDocs
    }
  }

  private static generateDocComments(analysis: any, language: string): string {
    let comments = ''

    analysis.functions.forEach((func: any) => {
      switch (language) {
        case 'javascript':
        case 'typescript':
          comments += `/**\n * ${func.name} function\n * @description Performs a specific task\n */\n`
          break
        case 'python':
          comments += `"""\n${func.name} function\n\nPerforms a specific task\n"""\n`
          break
        case 'java':
          comments += `/**\n * ${func.name} method\n * Performs a specific task\n */\n`
          break
      }
    })

    return comments || 'Add documentation comments to explain the purpose and usage of functions and classes.'
  }

  private static generateTestExamples(analysis: any, language: string): string {
    let tests = ''

    switch (language) {
      case 'javascript':
        tests = `// Unit tests using Jest
describe('${analysis.functions[0]?.name || 'Function'}', () => {
  test('should work correctly', () => {
    expect(functionUnderTest()).toBe(expectedResult);
  });
});`
        break

      case 'python':
        tests = `# Unit tests using pytest
def test_function():
    assert function_under_test() == expected_result`
        break

      case 'java':
        tests = `// Unit tests using JUnit
@Test
public void testFunction() {
    assertEquals(expectedResult, functionUnderTest());
}`
        break
    }

    return tests || 'Add unit tests to verify functionality and prevent regressions.'
  }

  private static generateAPIDocs(analysis: any, language: string): string {
    let api = ''

    analysis.functions.forEach((func: any) => {
      api += `## ${func.name}\n\n**Parameters:** None\n\n**Returns:** Result of the operation\n\n**Example:**\n\`\`\`${language}\n${func.name}()\n\`\`\`\n\n`
    })

    return api || 'Document the API surface including parameters, return values, and usage examples.'
  }

  private static filterExplanationByFocus(
    explanation: CodeExplanation,
    focus: string
  ): CodeExplanation {
    switch (focus) {
      case 'algorithm':
        return {
          summary: explanation.summary,
          functionality: [],
          keyConcepts: [],
          algorithm: explanation.algorithm,
          patterns: [],
          dependencies: [],
          potentialIssues: [],
          improvements: [],
          learningPoints: [],
          relatedTopics: [],
          documentation: { comments: '', tests: '', api: '' }
        }

      case 'patterns':
        return {
          summary: explanation.summary,
          functionality: [],
          keyConcepts: [],
          patterns: explanation.patterns,
          dependencies: [],
          potentialIssues: [],
          improvements: [],
          learningPoints: [],
          relatedTopics: [],
          documentation: { comments: '', tests: '', api: '' }
        }

      case 'issues':
        return {
          summary: explanation.summary,
          functionality: [],
          keyConcepts: [],
          patterns: [],
          dependencies: [],
          potentialIssues: explanation.potentialIssues,
          improvements: explanation.improvements,
          learningPoints: [],
          relatedTopics: [],
          documentation: { comments: '', tests: '', api: '' }
        }

      case 'learning':
        return {
          summary: explanation.summary,
          functionality: [],
          keyConcepts: explanation.keyConcepts,
          patterns: [],
          dependencies: [],
          potentialIssues: [],
          improvements: [],
          learningPoints: explanation.learningPoints,
          relatedTopics: explanation.relatedTopics,
          documentation: explanation.documentation
        }

      default:
        return explanation
    }
  }

  private static cacheExplanation(
    code: string,
    options: ExplanationOptions,
    explanation: CodeExplanation
  ): void {
    // In a real implementation, this would cache explanations
    // to avoid re-processing the same code
    const cacheKey = `${options.language}-${options.depth}-${btoa(code.substring(0, 100))}`
    localStorage.setItem(`explanation-${cacheKey}`, JSON.stringify({
      explanation,
      timestamp: Date.now(),
      options
    }))
  }

  static getCachedExplanation(code: string, options: ExplanationOptions): CodeExplanation | null {
    const cacheKey = `${options.language}-${options.depth}-${btoa(code.substring(0, 100))}`
    const cached = localStorage.getItem(`explanation-${cacheKey}`)

    if (cached) {
      const { explanation, timestamp } = JSON.parse(cached)
      // Cache for 1 hour
      if (Date.now() - timestamp < 60 * 60 * 1000) {
        return explanation
      }
    }

    return null
  }
}
