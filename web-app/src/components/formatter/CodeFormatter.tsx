"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wand2,
  Settings,
  Download,
  Copy,
  RotateCcw,
  Sparkles,
  Code,
  Palette,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { CodeFormatter, type FormatOptions, type FormatResult } from "@/lib/code-formatter"

interface CodeFormatterProps {
  code: string
  language: string
  onCodeChange?: (formattedCode: string) => void
  className?: string
}

export function CodeFormatterComponent({
  code,
  language,
  onCodeChange,
  className = ''
}: CodeFormatterProps) {
  const [formattedCode, setFormattedCode] = useState('')
  const [formatResult, setFormatResult] = useState<FormatResult | null>(null)
  const [isFormatting, setIsFormatting] = useState(false)
  const [options, setOptions] = useState<FormatOptions>({
    language,
    indentStyle: 'space',
    indentSize: 2,
    maxLineLength: 80,
    trailingCommas: 'es5',
    quoteStyle: 'single',
    semicolons: 'always',
    bracketSpacing: true,
    arrowParens: 'avoid',
    endOfLine: 'lf'
  })
  const { toast } = useToast()

  const formatCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please provide code to format",
        variant: "destructive",
      })
      return
    }

    setIsFormatting(true)

    try {
      const result = await CodeFormatter.formatCode(code, options)
      setFormattedCode(result.formatted)
      setFormatResult(result)

      if (result.errors.length === 0) {
        toast({
          title: "Code Formatted! ✨",
          description: `Made ${result.changes.charactersAdded + result.changes.charactersRemoved} changes`,
        })
      } else {
        toast({
          title: "Formatting Completed",
          description: "Code formatted with some warnings",
          variant: "default",
        })
      }
    } catch (error: any) {
      toast({
        title: "Formatting Failed",
        description: error.message || "Failed to format code",
        variant: "destructive",
      })
    } finally {
      setIsFormatting(false)
    }
  }

  const applyFormattedCode = () => {
    if (formattedCode && onCodeChange) {
      onCodeChange(formattedCode)
      toast({
        title: "Code Applied",
        description: "Formatted code has been applied to the editor",
      })
    }
  }

  const copyFormattedCode = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode)
      toast({
        title: "Code Copied",
        description: "Formatted code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  const loadPreset = (presetName: string) => {
    const preset = CodeFormatter.getPreset(presetName)
    setOptions(prev => ({ ...prev, ...preset }))
    toast({
      title: "Preset Loaded",
      description: `${presetName} preset has been applied`,
    })
  }

  const resetOptions = () => {
    setOptions({
      language,
      indentStyle: 'space',
      indentSize: 2,
      maxLineLength: 80,
      trailingCommas: 'es5',
      quoteStyle: 'single',
      semicolons: 'always',
      bracketSpacing: true,
      arrowParens: 'avoid',
      endOfLine: 'lf'
    })
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Code Formatter</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Automatically format and beautify your code
            </p>
          </div>
        </div>

        <Button
          onClick={formatCode}
          disabled={isFormatting || !code.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isFormatting ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Formatting...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Format Code
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="formatter" className="flex-1">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-white/50 backdrop-blur-sm border-b border-white/20 mx-6 mt-4">
          <TabsTrigger value="formatter" className="text-sm font-medium">
            <Code className="w-4 h-4 mr-2" />
            Format
          </TabsTrigger>
          <TabsTrigger value="options" className="text-sm font-medium">
            <Settings className="w-4 h-4 mr-2" />
            Options
          </TabsTrigger>
          <TabsTrigger value="result" className="text-sm font-medium">
            <FileText className="w-4 h-4 mr-2" />
            Result
          </TabsTrigger>
        </TabsList>

        {/* Formatter Tab */}
        <TabsContent value="formatter" className="p-6">
          <div className="space-y-6">
            {/* Presets */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Presets</CardTitle>
                <CardDescription>
                  Use popular formatting configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { name: 'prettier', label: 'Prettier', color: 'bg-pink-100 text-pink-800' },
                    { name: 'airbnb', label: 'Airbnb', color: 'bg-red-100 text-red-800' },
                    { name: 'google', label: 'Google', color: 'bg-blue-100 text-blue-800' },
                    { name: 'python-black', label: 'Black (Python)', color: 'bg-gray-100 text-gray-800' },
                    { name: 'java-google', label: 'Google Java', color: 'bg-green-100 text-green-800' }
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      onClick={() => loadPreset(preset.name)}
                      className="justify-start"
                    >
                      <Badge className={`mr-2 ${preset.color}`}>
                        {preset.label}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Input/Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Input Code</CardTitle>
                  <CardDescription>
                    Original code ({code.length} characters)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <pre className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                      {code || 'No code to format...'}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Formatted Code</CardTitle>
                  <CardDescription>
                    {formattedCode ? (
                      <>
                        Formatted code ({formattedCode.length} characters)
                        {formatResult && (
                          <span className="ml-2">
                            <Badge variant="outline" className="text-xs">
                              +{formatResult.changes.charactersAdded} -{formatResult.changes.charactersRemoved}
                            </Badge>
                          </span>
                        )}
                      </>
                    ) : (
                      'Formatted code will appear here'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <pre className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                      {formattedCode || 'Format code to see results...'}
                    </pre>
                  </ScrollArea>

                  {formattedCode && (
                    <div className="flex space-x-2 mt-4">
                      <Button onClick={applyFormattedCode} size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                      <Button variant="outline" onClick={copyFormattedCode} size="sm">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Options Tab */}
        <TabsContent value="options" className="p-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Formatting Options</CardTitle>
                <CardDescription>
                  Customize how your code is formatted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Indent Style</label>
                    <Select
                      value={options.indentStyle}
                      onValueChange={(value: 'space' | 'tab') => setOptions(prev => ({ ...prev, indentStyle: value }))}
                    >
                      <SelectContent>
                        <SelectItem value="space">Spaces</SelectItem>
                        <SelectItem value="tab">Tabs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Indent Size</label>
                    <Select
                      value={options.indentSize.toString()}
                      onValueChange={(value) => setOptions(prev => ({ ...prev, indentSize: parseInt(value) }))}
                    >
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Line Length</label>
                    <Select
                      value={options.maxLineLength.toString()}
                      onValueChange={(value) => setOptions(prev => ({ ...prev, maxLineLength: parseInt(value) }))}
                    >
                      <SelectContent>
                        <SelectItem value="80">80 characters</SelectItem>
                        <SelectItem value="100">100 characters</SelectItem>
                        <SelectItem value="120">120 characters</SelectItem>
                        <SelectItem value="150">150 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Quote Style</label>
                    <Select
                      value={options.quoteStyle}
                      onValueChange={(value: 'single' | 'double') => setOptions(prev => ({ ...prev, quoteStyle: value }))}
                    >
                      <SelectContent>
                        <SelectItem value="single">Single quotes</SelectItem>
                        <SelectItem value="double">Double quotes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(language === 'javascript' || language === 'typescript') && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Semicolons</label>
                        <Select
                          value={options.semicolons}
                          onValueChange={(value: 'asi' | 'always' | 'never') => setOptions(prev => ({ ...prev, semicolons: value }))}
                        >
                          <SelectContent>
                            <SelectItem value="always">Always</SelectItem>
                            <SelectItem value="asi">ASI (Automatic)</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Trailing Commas</label>
                        <Select
                          value={options.trailingCommas}
                          onValueChange={(value: 'none' | 'es5' | 'all') => setOptions(prev => ({ ...prev, trailingCommas: value }))}
                        >
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="es5">ES5</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="bracketSpacing"
                          checked={options.bracketSpacing}
                          onChange={(e) => setOptions(prev => ({ ...prev, bracketSpacing: e.target.checked }))}
                          className="rounded"
                        />
                        <label htmlFor="bracketSpacing" className="text-sm font-medium">
                          Bracket spacing
                        </label>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Arrow Parens</label>
                        <Select
                          value={options.arrowParens}
                          onValueChange={(value: 'avoid' | 'always') => setOptions(prev => ({ ...prev, arrowParens: value }))}
                        >
                          <SelectContent>
                            <SelectItem value="avoid">Avoid</SelectItem>
                            <SelectItem value="always">Always</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">Line Endings</label>
                    <Select
                      value={options.endOfLine}
                      onValueChange={(value: 'lf' | 'crlf' | 'cr') => setOptions(prev => ({ ...prev, endOfLine: value }))}
                    >
                      <SelectContent>
                        <SelectItem value="lf">LF (Unix)</SelectItem>
                        <SelectItem value="crlf">CRLF (Windows)</SelectItem>
                        <SelectItem value="cr">CR (Mac)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="outline" onClick={resetOptions}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Result Tab */}
        <TabsContent value="result" className="p-6">
          {formatResult ? (
            <div className="space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Formatting Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatResult.changes.charactersAdded}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Added</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {formatResult.changes.charactersRemoved}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Removed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatResult.changes.linesChanged}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Lines Changed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatResult.formatted.split('\n').length}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Lines</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Errors/Warnings */}
              {formatResult.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Issues Found ({formatResult.errors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {formatResult.errors.map((error, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                          <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="text-orange-800 dark:text-orange-200">{error}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success Message */}
              {formatResult.errors.length === 0 && formatResult.changes.charactersAdded + formatResult.changes.charactersRemoved > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
                        Code Successfully Formatted! ✨
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Your code has been formatted according to the selected style guide.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Changes */}
              {formatResult.changes.charactersAdded + formatResult.changes.charactersRemoved === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        Code Already Formatted
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Your code already follows the selected formatting rules.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Code className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No Formatting Results
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Format your code to see detailed results and statistics
                  </p>
                  <Button onClick={() => document.querySelector('[value="formatter"]')?.click()}>
                    Go to Formatter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
