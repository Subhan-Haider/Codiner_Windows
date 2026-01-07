"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Book,
  Target,
  Zap,
  TrendingUp,
  Eye,
  MessageSquare,
  FileText,
  Settings,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AIExplanationService, type CodeExplanation, type ExplanationOptions } from "@/lib/ai-explanation"

interface CodeExplanationPanelProps {
  code: string
  language: string
  onExplanationGenerated?: (explanation: CodeExplanation) => void
  className?: string
}

export function CodeExplanationPanel({
  code,
  language,
  onExplanationGenerated,
  className = ''
}: CodeExplanationPanelProps) {
  const [explanation, setExplanation] = useState<CodeExplanation | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [options, setOptions] = useState<ExplanationOptions>({
    language,
    depth: 'intermediate',
    focus: 'overview',
    includeExamples: true,
    targetAudience: 'intermediate'
  })
  const { toast } = useToast()

  useEffect(() => {
    setOptions(prev => ({ ...prev, language }))
  }, [language])

  const generateExplanation = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please provide code to explain",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Check cache first
      let result = AIExplanationService.getCachedExplanation(code, options)

      if (!result) {
        result = await AIExplanationService.explainCode(code, options)
      }

      setExplanation(result)
      onExplanationGenerated?.(result)

      toast({
        title: "Explanation Generated",
        description: "AI has analyzed your code and provided insights",
      })
    } catch (error: any) {
      toast({
        title: "Explanation Failed",
        description: error.message || "Failed to generate code explanation",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-orange-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-orange-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Code Explanation</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Understand your code with AI-powered insights
            </p>
          </div>
        </div>

        <Button
          onClick={generateExplanation}
          disabled={isGenerating || !code.trim()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Explain Code
            </>
          )}
        </Button>
      </div>

      {/* Options */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Depth</label>
            <Select
              value={options.depth}
              onValueChange={(value: any) => setOptions(prev => ({ ...prev, depth: value }))}
            >
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Focus</label>
            <Select
              value={options.focus}
              onValueChange={(value: any) => setOptions(prev => ({ ...prev, focus: value }))}
            >
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="algorithm">Algorithm</SelectItem>
                <SelectItem value="patterns">Patterns</SelectItem>
                <SelectItem value="issues">Issues</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Audience</label>
            <Select
              value={options.targetAudience}
              onValueChange={(value: any) => setOptions(prev => ({ ...prev, targetAudience: value }))}
            >
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Language</label>
            <Select
              value={options.language}
              onValueChange={(value) => setOptions(prev => ({ ...prev, language: value }))}
            >
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
                <SelectItem value="php">PHP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Explanation Content */}
      {explanation ? (
        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="grid w-full grid-cols-6 h-12 bg-white/50 backdrop-blur-sm border-b border-white/20 mx-6 mt-4">
            <TabsTrigger value="overview" className="text-xs font-medium">
              <Eye className="w-4 h-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="concepts" className="text-xs font-medium">
              <Lightbulb className="w-4 h-4 mr-1" />
              Concepts
            </TabsTrigger>
            <TabsTrigger value="issues" className="text-xs font-medium">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="improvements" className="text-xs font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              Fixes
            </TabsTrigger>
            <TabsTrigger value="learning" className="text-xs font-medium">
              <Book className="w-4 h-4 mr-1" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="docs" className="text-xs font-medium">
              <FileText className="w-4 h-4 mr-1" />
              Docs
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-6">
            <div className="space-y-6">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-500" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-slate-300">{explanation.summary}</p>
                </CardContent>
              </Card>

              {/* Functionality */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-green-500" />
                    What This Code Does
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {explanation.functionality.map((func, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">{func}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Algorithm (if present) */}
              {explanation.algorithm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="w-5 h-5 mr-2 text-purple-500" />
                      Algorithm Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg">{explanation.algorithm.name}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{explanation.algorithm.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Time Complexity</h5>
                        <Badge variant="outline">{explanation.algorithm.complexity.time}</Badge>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Space Complexity</h5>
                        <Badge variant="outline">{explanation.algorithm.complexity.space}</Badge>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Use Cases</h5>
                      <div className="flex flex-wrap gap-2">
                        {explanation.algorithm.useCases.map((useCase, index) => (
                          <Badge key={index} variant="secondary">{useCase}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Patterns */}
              {explanation.patterns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Design Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {explanation.patterns.map((pattern, index) => (
                        <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{pattern.name}</h4>
                            <Badge variant="outline">{pattern.category}</Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{pattern.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Key Concepts Tab */}
          <TabsContent value="concepts" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Concepts</CardTitle>
                <CardDescription>
                  Important programming concepts used in this code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {explanation.keyConcepts.map((concept, index) => (
                    <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{concept.name}</h4>
                        <span className={`text-sm font-medium ${getImportanceColor(concept.importance)}`}>
                          {concept.importance} importance
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{concept.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="p-6">
            <div className="space-y-6">
              {/* Issues */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Potential Issues ({explanation.potentialIssues.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {explanation.potentialIssues.length > 0 ? (
                    <div className="space-y-4">
                      {explanation.potentialIssues.map((issue, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                              <span className="font-medium capitalize">{issue.type} Issue</span>
                            </div>
                            <Badge className="capitalize">{issue.severity}</Badge>
                          </div>
                          <p className="mb-2">{issue.description}</p>
                          <div className="text-sm">
                            <strong>Suggestion:</strong> {issue.suggestion}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                        No Issues Found!
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Your code looks clean and follows best practices.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dependencies */}
              {explanation.dependencies.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dependencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {explanation.dependencies.map((dep, index) => (
                        <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{dep.name}</h4>
                            <Badge variant="outline">External</Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{dep.purpose}</p>
                          {dep.alternative && (
                            <p className="text-sm text-slate-500">
                              <strong>Alternative:</strong> {dep.alternative}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Improvements Tab */}
          <TabsContent value="improvements" className="p-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Suggested Improvements ({explanation.improvements.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {explanation.improvements.length > 0 ? (
                  <div className="space-y-4">
                    {explanation.improvements.map((improvement, index) => (
                      <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold capitalize">{improvement.type} Improvement</h4>
                          <span className={`text-sm font-medium ${getImpactColor(improvement.impact)}`}>
                            {improvement.impact} impact
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 mb-3">{improvement.description}</p>
                        {improvement.code && (
                          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm font-mono">
                            <pre>{improvement.code}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                      Code Looks Good!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      No major improvements needed at this time.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="p-6">
            <div className="space-y-6">
              {/* Learning Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="w-5 h-5 mr-2 text-green-500" />
                    Learning Points ({explanation.learningPoints.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {explanation.learningPoints.map((point, index) => (
                      <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h4 className="font-semibold mb-2">{point.concept}</h4>
                        <p className="text-slate-700 dark:text-slate-300 mb-3">{point.explanation}</p>
                        <div className="space-y-1">
                          <h5 className="text-sm font-medium">Examples:</h5>
                          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            {point.examples.map((example, exIndex) => (
                              <li key={exIndex} className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Topics */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {explanation.relatedTopics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="docs" className="p-6">
            <div className="space-y-6">
              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Documentation Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <pre className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded">
                      {explanation.documentation.comments || 'No documentation comments generated.'}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Tests */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <pre className="text-sm font-mono bg-slate-100 dark:bg-slate-800 p-4 rounded">
                      {explanation.documentation.tests || 'No test examples generated.'}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* API Docs */}
              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: explanation.documentation.api.replace(/\n/g, '<br>')
                      }}
                    />
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        /* Empty State */
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              AI Code Explanation
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
              Click "Explain Code" to get AI-powered insights about your code structure,
              algorithms, patterns, and potential improvements.
            </p>
            <Button onClick={generateExplanation} disabled={!code.trim()}>
              <Brain className="w-4 h-4 mr-2" />
              Explain Code
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
