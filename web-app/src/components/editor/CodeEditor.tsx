"use client"

import { useState, useEffect, useRef } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Play,
  Square,
  RotateCcw,
  Download,
  Upload,
  Settings,
  Zap,
  Eye,
  Code,
  Palette,
  Smartphone,
  Monitor,
  Tablet,
  Maximize2,
  Minimize2,
  Sparkles,
  Bug,
  GitBranch,
  Lightbulb,
  Scissors,
  Shuffle,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AICompletionProvider, type AICompletionOptions } from '@/lib/ai-completion'
import { DebugPanel } from '@/components/debug/DebugPanel'
import { GitPanel } from '@/components/git/GitPanel'
import { CollaborationOverlay } from '@/components/collaboration/CollaborationOverlay'
import { collaborationService, type CollaborationSession } from '@/lib/collaboration/collaboration-service'
import { CodeExplanationPanel } from '@/components/explanation/CodeExplanationPanel'
import { CodeFormatterComponent } from '@/components/formatter/CodeFormatter'
import { RefactoringPanel } from '@/components/refactoring/RefactoringPanel'

interface CodeEditorProps {
  initialCode?: {
    html: string
    css: string
    js: string
  }
  onCodeChange?: (code: { html: string; css: string; js: string }) => void
  height?: string
  className?: string
}

export function CodeEditor({
  initialCode = { html: '', css: '', js: '' },
  onCodeChange,
  height = '600px',
  className = ''
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'debug' | 'git' | 'explain' | 'format' | 'refactor'>('html')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true)
  const [collaborationSession, setCollaborationSession] = useState<CollaborationSession | null>(null)
  const [isCollaborating, setIsCollaborating] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { toast } = useToast()

  // Update preview when code changes
  useEffect(() => {
    updatePreview()
    onCodeChange?.(code)
  }, [code])

  const updatePreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        const combinedHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview - Codiner</title>
    <style>
        ${code.css}
        /* Codiner Live Preview Styles */
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }
        /* Hide any potential console errors in preview */
        .preview-error {
            display: none !important;
        }
    </style>
</head>
<body>
    ${code.html}

    <script>
        ${code.js}

        // Add error handling for preview
        window.addEventListener('error', function(e) {
            console.error('Preview Error:', e.error);
            // Could show error in UI here
        });

        // Prevent navigation in preview
        document.addEventListener('click', function(e) {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('http')) {
                e.preventDefault();
                console.log('External link blocked in preview:', target.href);
            }
        });
    </script>
</body>
</html>`

        iframeDoc.open()
        iframeDoc.write(combinedHTML)
        iframeDoc.close()
      }
    }
  }

  const handleCodeChange = (value: string | undefined, language: 'html' | 'css' | 'js') => {
    const newCode = { ...code, [language]: value || '' }
    setCode(newCode)
  }

  const runCode = () => {
    setIsRunning(true)
    updatePreview()

    // Simulate running/compiling
    setTimeout(() => {
      setIsRunning(false)
      toast({
        title: "Code Executed",
        description: "Your code is now running in the preview pane",
      })
    }, 500)
  }

  const resetCode = () => {
    setCode(initialCode)
    toast({
      title: "Code Reset",
      description: "Code has been reset to initial state",
    })
  }

  const downloadCode = () => {
    const zip = new (window as any).JSZip()

    // Add files to zip
    zip.file('index.html', code.html)
    zip.file('styles.css', code.css)
    zip.file('script.js', code.js)

    // Generate and download zip
    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = 'codiner-project.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Download Complete",
        description: "Your code has been downloaded as a ZIP file",
      })
    })
  }

  const copyCode = async () => {
    const currentCode = code[activeTab]
    try {
      await navigator.clipboard.writeText(currentCode)
      toast({
        title: "Code Copied",
        description: `${activeTab.toUpperCase()} code copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      case 'desktop': return '100%'
      default: return '100%'
    }
  }

  const getEditorTheme = () => {
    return document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'
  }

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    if (aiSuggestionsEnabled) {
      // Register AI completion provider
      monaco.languages.registerCompletionItemProvider('javascript', {
        triggerCharacters: AICompletionProvider.getCompletionTriggerCharacters(),
        provideCompletionItems: async (model, position) => {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }

          const context: AICompletionOptions['context'] = {
            beforeCursor: model.getValueInRange({
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            }),
            afterCursor: model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: model.getLineCount(),
              endColumn: model.getLineMaxColumn(model.getLineCount()),
            }),
            currentLine: model.getLineContent(position.lineNumber),
            fileContent: model.getValue(),
            cursorPosition: position,
          }

          const completions = await AICompletionProvider.getCompletions({
            language: 'javascript',
            context,
            projectContext: {
              framework: 'react', // Could be detected from project
              libraries: ['react', 'react-dom'],
            },
          })

          return {
            suggestions: completions.map(completion => ({
              ...completion,
              range,
            })),
          }
        },
      })

      // Register for other languages
      monaco.languages.registerCompletionItemProvider('html', {
        triggerCharacters: ['<', '/', '"', "'"],
        provideCompletionItems: async (model, position) => {
          const context: AICompletionOptions['context'] = {
            beforeCursor: model.getValueInRange({
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            }),
            afterCursor: model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: model.getLineCount(),
              endColumn: model.getLineMaxColumn(model.getLineCount()),
            }),
            currentLine: model.getLineContent(position.lineNumber),
            fileContent: model.getValue(),
            cursorPosition: position,
          }

          const completions = await AICompletionProvider.getCompletions({
            language: 'html',
            context,
          })

          return {
            suggestions: completions,
          }
        },
      })

      monaco.languages.registerCompletionItemProvider('css', {
        triggerCharacters: [':', '-', ' '],
        provideCompletionItems: async (model, position) => {
          const context: AICompletionOptions['context'] = {
            beforeCursor: model.getValueInRange({
              startLineNumber: 1,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            }),
            afterCursor: model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: model.getLineCount(),
              endColumn: model.getLineMaxColumn(model.getLineCount()),
            }),
            currentLine: model.getLineContent(position.lineNumber),
            fileContent: model.getValue(),
            cursorPosition: position,
          }

          const completions = await AICompletionProvider.getCompletions({
            language: 'css',
            context,
          })

          return {
            suggestions: completions,
          }
        },
      })
    }

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      toast({
        title: "Code Saved",
        description: "Your code has been auto-saved",
      })
    })

    // Add hover provider for AI suggestions
    monaco.languages.registerHoverProvider('javascript', {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position)
        if (word) {
          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn
            ),
            contents: [
              { value: `**${word.word}**` },
              { value: 'AI-powered suggestions available. Type to see completions.' },
            ],
          }
        }
        return null
      },
    })
  }

  return (
    <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Code Editor</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Live Preview
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {/* Preview Mode Selector */}
          <div className="flex items-center space-x-1 bg-white dark:bg-slate-700 rounded-lg p-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="h-8 w-8 p-0"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
              className="h-8 w-8 p-0"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="h-8 w-8 p-0"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={`flex ${isFullscreen ? 'h-screen' : ''}`}>
        {/* Editor Panel */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'html' | 'css' | 'js' | 'debug' | 'git' | 'explain' | 'format' | 'refactor')}>
              <TabsList className="grid w-full grid-cols-8 h-9">
                <TabsTrigger value="html" className="text-xs">
                  <Code className="w-3 h-3 mr-1" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="text-xs">
                  <Palette className="w-3 h-3 mr-1" />
                  CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  JavaScript
                </TabsTrigger>
                <TabsTrigger value="debug" className="text-xs">
                  <Bug className="w-3 h-3 mr-1" />
                  Debug
                </TabsTrigger>
                <TabsTrigger value="git" className="text-xs">
                  <GitBranch className="w-3 h-3 mr-1" />
                  Git
                </TabsTrigger>
                <TabsTrigger value="explain" className="text-xs">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Explain
                </TabsTrigger>
                <TabsTrigger value="format" className="text-xs">
                  <Scissors className="w-3 h-3 mr-1" />
                  Format
                </TabsTrigger>
                <TabsTrigger value="refactor" className="text-xs">
                  <Shuffle className="w-3 h-3 mr-1" />
                  Refactor
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'html' | 'css' | 'js')}>
              <TabsList className="grid w-full grid-cols-3 h-9">
                <TabsTrigger value="html" className="text-xs">
                  <Code className="w-3 h-3 mr-1" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="text-xs">
                  <Palette className="w-3 h-3 mr-1" />
                  CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  JavaScript
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Button
                variant={aiSuggestionsEnabled ? "default" : "ghost"}
                size="sm"
                onClick={() => setAiSuggestionsEnabled(!aiSuggestionsEnabled)}
                className={`h-8 px-3 ${aiSuggestionsEnabled ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : ''}`}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                AI {aiSuggestionsEnabled ? 'On' : 'Off'}
              </Button>
              <Button variant="ghost" size="sm" onClick={copyCode} className="h-8 px-3">
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={resetCode} className="h-8 px-3">
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
              <Button variant="ghost" size="sm" onClick={runCode} disabled={isRunning} className="h-8 px-3">
                {isRunning ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1"></div>
                ) : (
                  <Play className="w-3 h-3 mr-1" />
                )}
                Run
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadCode} className="h-8 px-3">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Tabs value={activeTab} className="h-full">
              <TabsContent value="html" className="h-full m-0">
                <Editor
                  height="100%"
                  language="html"
                  value={code.html}
                  onChange={(value) => handleCodeChange(value, 'html')}
                  onMount={handleEditorDidMount}
                  theme={getEditorTheme()}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                    insertSpaces: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    quickSuggestions: {
                      other: aiSuggestionsEnabled,
                      comments: aiSuggestionsEnabled,
                      strings: aiSuggestionsEnabled,
                    },
                    suggestOnTriggerCharacters: aiSuggestionsEnabled,
                    acceptSuggestionOnEnter: 'on',
                    tabCompletion: 'on',
                  }}
                />
              </TabsContent>

              <TabsContent value="css" className="h-full m-0">
                <Editor
                  height="100%"
                  language="css"
                  value={code.css}
                  onChange={(value) => handleCodeChange(value, 'css')}
                  onMount={handleEditorDidMount}
                  theme={getEditorTheme()}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                    insertSpaces: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    quickSuggestions: {
                      other: aiSuggestionsEnabled,
                      comments: aiSuggestionsEnabled,
                      strings: aiSuggestionsEnabled,
                    },
                    suggestOnTriggerCharacters: aiSuggestionsEnabled,
                    acceptSuggestionOnEnter: 'on',
                    tabCompletion: 'on',
                  }}
                />
              </TabsContent>

              <TabsContent value="js" className="h-full m-0">
                <Editor
                  height="100%"
                  language="javascript"
                  value={code.js}
                  onChange={(value) => handleCodeChange(value, 'js')}
                  onMount={handleEditorDidMount}
                  theme={getEditorTheme()}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    tabSize: 2,
                    insertSpaces: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    quickSuggestions: {
                      other: aiSuggestionsEnabled,
                      comments: aiSuggestionsEnabled,
                      strings: aiSuggestionsEnabled,
                    },
                    parameterHints: {
                      enabled: true,
                    },
                    suggestOnTriggerCharacters: aiSuggestionsEnabled,
                    acceptSuggestionOnEnter: 'on',
                    tabCompletion: 'on',
                  }}
                />
              </TabsContent>
              <TabsContent value="debug" className="h-full m-0">
                <DebugPanel
                  code={code}
                  onFixApply={(fix, language) => {
                    // Apply fix to the code
                    if (fix.type === 'replace' && fix.newText) {
                      const currentCode = code[language]
                      const lines = currentCode.split('\n')
                      const startLine = fix.range.start.line - 1
                      const endLine = fix.range.end.line - 1

                      if (startLine === endLine) {
                        // Single line replacement
                        lines[startLine] = fix.newText
                      } else {
                        // Multi-line replacement
                        lines.splice(startLine, endLine - startLine + 1, fix.newText)
                      }

                      const newCode = { ...code, [language]: lines.join('\n') }
                      setCode(newCode)
                      onCodeChange?.(newCode)
                    }
                  }}
                />
              </TabsContent>

              <TabsContent value="git" className="h-full m-0">
                <GitPanel
                  projectId="current-project-id" // Would get from props/context
                  projectName="My Project"
                  className="h-full"
                />
              </TabsContent>

              <TabsContent value="explain" className="h-full m-0">
                <CodeExplanationPanel
                  code={code.html + code.css + code.js}
                  language="javascript"
                  className="h-full"
                />
              </TabsContent>

              <TabsContent value="format" className="h-full m-0">
                <CodeFormatterComponent
                  code={code.html + code.css + code.js}
                  language="javascript"
                  onCodeChange={(formattedCode) => {
                    // Apply formatted code back to the editor
                    // This would need to be implemented based on which tab is active
                    console.log('Formatted code:', formattedCode)
                  }}
                  className="h-full"
                />
              </TabsContent>

              <TabsContent value="refactor" className="h-full m-0">
                <RefactoringPanel
                  code={code.html + code.css + code.js}
                  language="javascript"
                  onCodeChange={(refactoredCode) => {
                    // Apply refactored code back to the editor
                    console.log('Refactored code:', refactoredCode)
                  }}
                  className="h-full"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="w-96 border-l border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-900 dark:text-white">Live Preview</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {previewMode}
            </Badge>
          </div>

          <div className="flex-1 p-4 bg-white dark:bg-slate-900 rounded-b-xl">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-2 mb-4 flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
              <iframe
                ref={iframeRef}
                className="w-full border-0"
                style={{
                  height: previewMode === 'mobile' ? '667px' : previewMode === 'tablet' ? '1024px' : '600px',
                  maxWidth: getPreviewWidth(),
                  margin: '0 auto',
                  display: 'block',
                }}
                title="Live Code Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Overlay */}
      <CollaborationOverlay
        session={collaborationSession}
        currentUserId="current-user-id" // Would get from auth
        onInviteUser={() => {
          // Handle inviting users to collaborate
          toast({
            title: "Invite Users",
            description: "Collaboration features coming soon!",
          })
        }}
        onStartCall={() => {
          // Handle starting video call
          toast({
            title: "Video Call",
            description: "Video calling features coming soon!",
          })
        }}
        className={isFullscreen ? 'top-20' : ''}
      />
    </div>
  )
}
