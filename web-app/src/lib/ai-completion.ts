import { CompletionItem, CompletionItemKind, CompletionContext, Position } from 'monaco-editor'

export interface AICompletionOptions {
  language: 'javascript' | 'typescript' | 'html' | 'css' | 'python' | 'java' | 'cpp' | 'csharp'
  context: {
    beforeCursor: string
    afterCursor: string
    currentLine: string
    fileContent: string
    cursorPosition: Position
  }
  projectContext?: {
    framework?: 'react' | 'vue' | 'angular' | 'nextjs' | 'nuxt' | 'svelte'
    libraries?: string[]
    existingCode?: string[]
  }
}

export class AICompletionProvider {
  private static readonly COMPLETION_TRIGGERS = ['.', '(', '[', '{', '"', "'", '`', '/', '<', '@', '#']

  static isTriggerCharacter(char: string): boolean {
    return this.COMPLETION_TRIGGERS.includes(char)
  }

  static async getCompletions(options: AICompletionOptions): Promise<CompletionItem[]> {
    const { language, context, projectContext } = options

    // Get completions based on language and context
    const completions = await this.generateCompletions(language, context, projectContext)

    return completions.map((completion, index) => ({
      label: completion.label,
      kind: completion.kind,
      detail: completion.detail,
      documentation: completion.documentation,
      insertText: completion.insertText,
      sortText: index.toString().padStart(3, '0'),
      filterText: completion.filterText || completion.label,
      range: completion.range,
    }))
  }

  private static async generateCompletions(
    language: string,
    context: AICompletionOptions['context'],
    projectContext?: AICompletionOptions['projectContext']
  ): Promise<Array<{
    label: string
    kind: CompletionItemKind
    detail?: string
    documentation?: string
    insertText: string
    filterText?: string
    range?: any
  }>> {
    const completions: Array<{
      label: string
      kind: CompletionItemKind
      detail?: string
      documentation?: string
      insertText: string
      filterText?: string
    }> = []

    switch (language) {
      case 'javascript':
      case 'typescript':
        completions.push(...this.getJavaScriptCompletions(context, projectContext))
        break
      case 'html':
        completions.push(...this.getHTMLCompletions(context))
        break
      case 'css':
        completions.push(...this.getCSSCompletions(context))
        break
      case 'python':
        completions.push(...this.getPythonCompletions(context))
        break
    }

    // Add AI-powered completions based on context
    completions.push(...await this.getAICompletions(context, projectContext))

    return completions
  }

  private static getJavaScriptCompletions(
    context: AICompletionOptions['context'],
    projectContext?: AICompletionOptions['projectContext']
  ): Array<{
    label: string
    kind: CompletionItemKind
    detail?: string
    documentation?: string
    insertText: string
  }> {
    const completions = [
      // JavaScript/TypeScript built-ins
      {
        label: 'console.log',
        kind: CompletionItemKind.Function,
        detail: 'Log to console',
        documentation: 'Outputs a message to the Web Console',
        insertText: 'console.log(${1:message})'
      },
      {
        label: 'setTimeout',
        kind: CompletionItemKind.Function,
        detail: 'Set timeout',
        documentation: 'Sets a timer which executes a function after the timer expires',
        insertText: 'setTimeout(${1:callback}, ${2:delay})'
      },
      {
        label: 'setInterval',
        kind: CompletionItemKind.Function,
        detail: 'Set interval',
        documentation: 'Repeatedly calls a function with a fixed time delay between each call',
        insertText: 'setInterval(${1:callback}, ${2:delay})'
      },
      {
        label: 'fetch',
        kind: CompletionItemKind.Function,
        detail: 'Fetch API',
        documentation: 'Fetch resources from the network',
        insertText: 'fetch(${1:url})\n\t.then(response => response.json())\n\t.then(data => {\n\t\t${2:// handle data}\n\t})\n\t.catch(error => {\n\t\tconsole.error(\'Error:\', error)\n\t})'
      },
      {
        label: 'async function',
        kind: CompletionItemKind.Keyword,
        detail: 'Async function declaration',
        documentation: 'Declare an asynchronous function',
        insertText: 'async function ${1:functionName}(${2:params}) {\n\t${3:// async code}\n}'
      },
      {
        label: 'try...catch',
        kind: CompletionItemKind.Keyword,
        detail: 'Try-catch block',
        documentation: 'Handle errors in code',
        insertText: 'try {\n\t${1:// code that may throw}\n} catch (${2:error}) {\n\tconsole.error(${2:error})\n}'
      }
    ]

    // React-specific completions
    if (projectContext?.framework === 'react') {
      completions.push(
        {
          label: 'useState',
          kind: CompletionItemKind.Function,
          detail: 'React useState hook',
          documentation: 'Manage local state in functional components',
          insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue})'
        },
        {
          label: 'useEffect',
          kind: CompletionItemKind.Function,
          detail: 'React useEffect hook',
          documentation: 'Perform side effects in functional components',
          insertText: 'useEffect(() => {\n\t${1:// effect code}\n\treturn () => {\n\t\t${2:// cleanup code}\n\t}\n}, [${3:dependencies}])'
        },
        {
          label: 'useCallback',
          kind: CompletionItemKind.Function,
          detail: 'React useCallback hook',
          documentation: 'Memoize functions to prevent unnecessary re-renders',
          insertText: 'const ${1:memoizedCallback} = useCallback(() => {\n\t${2:// callback code}\n}, [${3:dependencies}])'
        }
      )
    }

    // Filter based on context
    const beforeCursor = context.beforeCursor.toLowerCase()
    return completions.filter(completion => {
      const label = completion.label.toLowerCase()
      return label.includes(beforeCursor.slice(-10)) || // Last 10 chars
             beforeCursor.includes(label) ||
             this.isRelevantCompletion(completion, context)
    })
  }

  private static getHTMLCompletions(context: AICompletionOptions['context']): Array<{
    label: string
    kind: CompletionItemKind
    detail?: string
    documentation?: string
    insertText: string
  }> {
    return [
      {
        label: 'div',
        kind: CompletionItemKind.Class,
        detail: 'HTML div element',
        documentation: 'Generic container element',
        insertText: '<div class="${1:class}">\n\t${2:content}\n</div>'
      },
      {
        label: 'button',
        kind: CompletionItemKind.Class,
        detail: 'HTML button element',
        documentation: 'Clickable button element',
        insertText: '<button type="${1:button}" class="${2:class}" onclick="${3:handler}">\n\t${4:text}\n</button>'
      },
      {
        label: 'input',
        kind: CompletionItemKind.Class,
        detail: 'HTML input element',
        documentation: 'Input control',
        insertText: '<input type="${1:text}" id="${2:id}" name="${3:name}" class="${4:class}" placeholder="${5:placeholder}" />'
      },
      {
        label: 'form',
        kind: CompletionItemKind.Class,
        detail: 'HTML form element',
        documentation: 'Form container',
        insertText: '<form action="${1:action}" method="${2:post}">\n\t${3:form content}\n\t<button type="submit">Submit</button>\n</form>'
      },
      {
        label: 'img',
        kind: CompletionItemKind.Class,
        detail: 'HTML image element',
        documentation: 'Image embed',
        insertText: '<img src="${1:src}" alt="${2:description}" class="${3:class}" loading="lazy" />'
      }
    ]
  }

  private static getCSSCompletions(context: AICompletionOptions['context']): Array<{
    label: string
    kind: CompletionItemKind
    detail?: string
    documentation?: string
    insertText: string
  }> {
    return [
      {
        label: 'display: flex',
        kind: CompletionItemKind.Property,
        detail: 'CSS flexbox display',
        documentation: 'Enable flexbox layout',
        insertText: 'display: flex;\njustify-content: ${1:center};\nalign-items: ${2:center};'
      },
      {
        label: 'background: linear-gradient',
        kind: CompletionItemKind.Property,
        detail: 'CSS linear gradient',
        documentation: 'Create a linear gradient background',
        insertText: 'background: linear-gradient(${1:45deg}, ${2:#ff0000}, ${3:#0000ff});'
      },
      {
        label: 'border-radius',
        kind: CompletionItemKind.Property,
        detail: 'CSS border radius',
        documentation: 'Round the corners of an element',
        insertText: 'border-radius: ${1:8px};'
      },
      {
        label: 'box-shadow',
        kind: CompletionItemKind.Property,
        detail: 'CSS box shadow',
        documentation: 'Add shadow to an element',
        insertText: 'box-shadow: ${1:0 4px 6px -1px rgba(0, 0, 0, 0.1)};'
      },
      {
        label: 'transition',
        kind: CompletionItemKind.Property,
        detail: 'CSS transition',
        documentation: 'Animate property changes',
        insertText: 'transition: ${1:all} ${2:0.3s} ${3:ease};'
      }
    ]
  }

  private static getPythonCompletions(context: AICompletionOptions['context']): Array<{
    label: string
    kind: CompletionItemKind
    detail?: string
    documentation?: string
    insertText: string
  }> {
    return [
      {
        label: 'def function',
        kind: CompletionItemKind.Function,
        detail: 'Python function definition',
        documentation: 'Define a new function',
        insertText: 'def ${1:function_name}(${2:parameters}):\n\t"""${3:docstring}"""\n\t${4:pass}'
      },
      {
        label: 'if __name__ == "__main__"',
        kind: CompletionItemKind.Keyword,
        detail: 'Python main guard',
        documentation: 'Execute code only when run as main module',
        insertText: 'if __name__ == "__main__":\n\t${1:main()}'
      },
      {
        label: 'try...except',
        kind: CompletionItemKind.Keyword,
        detail: 'Python exception handling',
        documentation: 'Handle exceptions in code',
        insertText: 'try:\n\t${1:code}\nexcept ${2:Exception} as ${3:e}:\n\t${4:handle exception}'
      }
    ]
  }

  private static async getAICompletions(
    context: AICompletionOptions['context'],
    projectContext?: AICompletionOptions['projectContext']
  ): Promise<Array<{
    label: string
    kind: CompletionItemKind
    detail?: string
    documentation?: string
    insertText: string
  }>> {
    // Simulate AI-powered completions based on context
    const aiCompletions = []

    // Analyze current line and context for intelligent suggestions
    const currentLine = context.currentLine.trim()
    const beforeCursor = context.beforeCursor

    // Function completion based on patterns
    if (currentLine.startsWith('function') || currentLine.startsWith('const') && currentLine.includes('=')) {
      aiCompletions.push({
        label: 'Arrow Function',
        kind: CompletionItemKind.Function,
        detail: 'ES6 Arrow Function',
        documentation: 'Modern arrow function syntax',
        insertText: '(${1:params}) => {\n\t${2:// function body}\n}'
      })
    }

    // React component suggestions
    if (projectContext?.framework === 'react' && currentLine.includes('function') && currentLine.includes('Component')) {
      aiCompletions.push({
        label: 'React Component Boilerplate',
        kind: CompletionItemKind.Class,
        detail: 'Complete React component',
        documentation: 'Full React component with hooks and JSX',
        insertText: `import React, { useState, useEffect } from 'react'

export default function ${1:ComponentName}() {
\tconst [${2:state}, set${2/(.*)/${1:/capitalize}/}] = useState(${3:initialValue})

\tuseEffect(() => {
\t\t${4:// effect code}
\t}, [])

\treturn (
\t\t<div className="${5:container}">
\t\t\t<h2>${6:Hello World}</h2>
\t\t\t<p>${7:Component content}</p>
\t\t</div>
\t)
}`
      })
    }

    // HTML element completions
    if (beforeCursor.includes('<')) {
      aiCompletions.push({
        label: 'Complete HTML Structure',
        kind: CompletionItemKind.Class,
        detail: 'Full HTML document',
        documentation: 'Complete HTML5 document structure',
        insertText: `<!DOCTYPE html>
<html lang="en">
<head>
\t<meta charset="UTF-8">
\t<meta name="viewport" content="width=device-width, initial-scale=1.0">
\t<title>${1:Document Title}</title>
\t<link rel="stylesheet" href="${2:styles.css}">
</head>
<body>
\t${3:<!-- Content goes here -->}
\t<script src="${4:script.js}"></script>
</body>
</html>`
      })
    }

    return aiCompletions
  }

  private static isRelevantCompletion(
    completion: any,
    context: AICompletionOptions['context']
  ): boolean {
    const currentLine = context.currentLine.toLowerCase()
    const beforeCursor = context.beforeCursor.toLowerCase()

    // Check if completion is relevant based on current context
    if (completion.label.toLowerCase().includes('console') && currentLine.includes('log')) {
      return true
    }

    if (completion.label.toLowerCase().includes('fetch') && (currentLine.includes('http') || currentLine.includes('api'))) {
      return true
    }

    if (completion.label.toLowerCase().includes('async') && (beforeCursor.includes('function') || beforeCursor.includes('const'))) {
      return true
    }

    if (completion.label.toLowerCase().includes('try') && currentLine.includes('error')) {
      return true
    }

    return false
  }

  static getCompletionTriggerCharacters(): string[] {
    return this.COMPLETION_TRIGGERS
  }
}
