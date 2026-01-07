"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  TrendingUp,
  Shield,
  Code,
  Target,
  Clock,
  BarChart3,
  RefreshCw,
  Play,
  Settings,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AIRefactoringService, type RefactoringAnalysis, type RefactoringSuggestion, type RefactoringOptions } from "@/lib/ai-refactoring"

interface RefactoringPanelProps {
  code: string
  language: string
  onCodeChange?: (refactoredCode: string) => void
  className?: string
}

export function RefactoringPanel({
  code,
  language,
  onCodeChange,
  className = ''
}: RefactoringPanelProps) {
  const [analysis, setAnalysis] = useState<RefactoringAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([])
  const [options, setOptions] = useState<RefactoringOptions>({
    language,
    maxSuggestions: 10,
    includeExperimental: false,
    targetAudience: 'intermediate'
  })
  const [activeTab, setActiveTab] = useState('suggestions')
  const { toast } = useToast()

  useEffect(() => {
    setOptions(prev => ({ ...prev, language }))
  }, [language])

  const analyzeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please provide code to analyze",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysis(null)

    try {
      const result = await AIRefactoringService.analyzeCode(code, options)
      setAnalysis(result)

      if (result.suggestions.length > 0) {
        toast({
          title: "Analysis Complete! 🔍",
          description: `Found ${result.suggestions.length} refactoring suggestions`,
        })
      } else {
        toast({
          title: "Analysis Complete",
          description: "No refactoring suggestions found - your code looks good!",
        })
      }
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze code",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const applySuggestion = (suggestion: RefactoringSuggestion) => {
    if (!analysis) return

    try {
      const refactoredCode = AIRefactoringService.applySuggestion(code, suggestion)
      onCodeChange?.(refactoredCode)
      setAppliedSuggestions(prev => [...prev, suggestion.id])

      toast({
        title: "Suggestion Applied",
        description: `"${suggestion.title}" has been applied to your code`,
      })
    } catch (error) {
      toast({
        title: "Failed to Apply",
        description: "Could not apply this refactoring suggestion",
        variant: "destructive",
      })
    }
  }

  const applySelectedSuggestions = () => {
    if (!analysis || selectedSuggestions.length === 0) return

    const suggestionsToApply = analysis.suggestions.filter(s =>
      selectedSuggestions.includes(s.id)
    )

    try {
      const result = AIRefactoringService.applySuggestions(code, suggestionsToApply, { safe: true })

      if (result.applied.length > 0) {
        onCodeChange?.(result.code)
        setAppliedSuggestions(prev => [...prev, ...result.applied])

        toast({
          title: "Refactoring Complete",
          description: `Applied ${result.applied.length} suggestion${result.applied.length !== 1 ? 's' : ''}`,
        })

        if (result.skipped.length > 0) {
          toast({
            title: "Some Suggestions Skipped",
            description: `${result.skipped.length} suggestion${result.skipped.length !== 1 ? 's were' : ' was'} skipped for safety`,
            variant: "default",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Refactoring Failed",
        description: "Failed to apply selected suggestions",
        variant: "destructive",
      })
    }
  }

  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestions(prev =>
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="w-4 h-4" />
      case 'maintainability': return <Code className="w-4 h-4" />
      case 'readability': return <Eye className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      case 'architecture': return <BarChart3 className="w-4 h-4" />
      default: return <Lightbulb className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'quick': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'complex': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const filteredSuggestions = analysis?.suggestions.filter(suggestion => {
    if (options.focus && options.focus.length > 0) {
      return options.focus.includes(suggestion.category)
    }
    return true
  }) || []

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Refactoring</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get intelligent code improvement suggestions
            </p>
          </div>
        </div>

        <Button
          onClick={analyzeCode}
          disabled={isAnalyzing || !code.trim()}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4 mr-2" />
              Analyze Code
            </>
          )}
        </Button>
      </div>

      {/* Options */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          <div>
            <label className="text-sm font-medium mb-2 block">Max Suggestions</label>
            <Select
              value={options.maxSuggestions?.toString()}
              onValueChange={(value) => setOptions(prev => ({ ...prev, maxSuggestions: parseInt(value) }))}
            >
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
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

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setOptions(prev => ({ ...prev, focus: undefined }))}
              size="sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {analysis ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-white/50 backdrop-blur-sm border-b border-white/20 mx-6 mt-4">
            <TabsTrigger value="suggestions" className="text-sm font-medium">
              <Lightbulb className="w-4 h-4 mr-2" />
              Suggestions ({analysis.suggestions.length})
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-sm font-medium">
              <BarChart3 className="w-4 h-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="applied" className="text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-2" />
              Applied ({appliedSuggestions.length})
            </TabsTrigger>
          </TabsList>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions" className="p-6">
            {filteredSuggestions.length > 0 ? (
              <div className="space-y-6">
                {/* Bulk Actions */}
                {selectedSuggestions.length > 0 && (
                  <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {selectedSuggestions.length} suggestion{selectedSuggestions.length !== 1 ? 's' : ''} selected
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={applySelectedSuggestions}>
                            <Play className="w-4 h-4 mr-2" />
                            Apply Selected
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSuggestions([])}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Suggestions List */}
                <div className="space-y-4">
                  {filteredSuggestions.map((suggestion) => {
                    const isApplied = appliedSuggestions.includes(suggestion.id)
                    const isSelected = selectedSuggestions.includes(suggestion.id)

                    return (
                      <Card
                        key={suggestion.id}
                        className={`transition-all ${
                          isApplied
                            ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                            : isSelected
                            ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:shadow-md'
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              {getCategoryIcon(suggestion.category)}
                              <div>
                                <CardTitle className="text-lg flex items-center space-x-2">
                                  <span>{suggestion.title}</span>
                                  {isApplied && <CheckCircle className="w-4 h-4 text-green-600" />}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {suggestion.description}
                                </CardDescription>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(suggestion.priority)}>
                                {suggestion.priority}
                              </Badge>
                              <Badge variant="outline" className={getEffortColor(suggestion.effort)}>
                                {suggestion.effort}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-4">
                            {/* Before/After */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium mb-2 text-red-600">Before:</h5>
                                <ScrollArea className="h-24">
                                  <pre className="text-xs font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded text-red-800 dark:text-red-200 whitespace-pre-wrap">
                                    {suggestion.before}
                                  </pre>
                                </ScrollArea>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium mb-2 text-green-600">After:</h5>
                                <ScrollArea className="h-24">
                                  <pre className="text-xs font-mono bg-green-50 dark:bg-green-900/20 p-2 rounded text-green-800 dark:text-green-200 whitespace-pre-wrap">
                                    {suggestion.after}
                                  </pre>
                                </ScrollArea>
                              </div>
                            </div>

                            {/* Explanation */}
                            <div>
                              <h5 className="text-sm font-medium mb-2">Why this matters:</h5>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {suggestion.explanation}
                              </p>
                            </div>

                            {/* Benefits */}
                            <div>
                              <h5 className="text-sm font-medium mb-2">Benefits:</h5>
                              <div className="flex flex-wrap gap-1">
                                {suggestion.benefits.map((benefit, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Risks */}
                            {suggestion.risks && suggestion.risks.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-2 text-orange-600">Potential Risks:</h5>
                                <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                                  {suggestion.risks.map((risk, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                      <span>{risk}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                              <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center space-x-1">
                                  <Target className="w-3 h-3" />
                                  <span>{suggestion.impact} impact</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{suggestion.effort}</span>
                                </span>
                              </div>

                              <div className="flex space-x-2">
                                {!isApplied && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleSuggestion(suggestion.id)}
                                  >
                                    {isSelected ? 'Deselect' : 'Select'}
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  onClick={() => applySuggestion(suggestion)}
                                  disabled={isApplied}
                                  className={isApplied ? 'bg-green-600 hover:bg-green-700' : ''}
                                >
                                  {isApplied ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Applied
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4 mr-2" />
                                      Apply
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Suggestions Found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {options.focus
                    ? `No ${options.focus.join(', ')} suggestions found for this code.`
                    : 'Your code looks good! No refactoring suggestions available.'
                  }
                </p>
                {options.focus && (
                  <Button onClick={() => setOptions(prev => ({ ...prev, focus: undefined }))}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="p-6">
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="card-hover glass text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {analysis.summary.totalSuggestions}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Suggestions</p>
                  </CardContent>
                </Card>

                <Card className="card-hover glass text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {analysis.summary.byPriority.critical || 0}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Critical Issues</p>
                  </CardContent>
                </Card>

                <Card className="card-hover glass text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {analysis.metadata.complexity}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Complexity Score</p>
                  </CardContent>
                </Card>

                <Card className="card-hover glass text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {Math.round(analysis.metadata.analysisTime / 1000)}s
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Analysis Time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>
                    Breakdown of suggestions by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analysis.summary.byCategory).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(category)}
                          <span className="capitalize">{category}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Priority Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Priority Levels</CardTitle>
                  <CardDescription>
                    Distribution of suggestion priorities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analysis.summary.byPriority).map(([priority, count]) => (
                      <div key={priority} className="flex items-center justify-between">
                        <Badge className={`capitalize ${getPriorityColor(priority)}`}>
                          {priority}
                        </Badge>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          Effort Level: {analysis.summary.estimatedEffort}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {analysis.summary.estimatedEffort === 'Low'
                          ? 'Most suggestions can be applied quickly with minimal risk.'
                          : analysis.summary.estimatedEffort === 'Medium'
                          ? 'Suggestions require moderate effort and testing.'
                          : 'Complex refactoring needed - plan carefully and test thoroughly.'
                        }
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-900 dark:text-green-100">
                          Impact: {analysis.summary.potentialImpact}
                        </span>
                      </div>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        {analysis.summary.potentialImpact === 'High'
                          ? 'These improvements will significantly enhance code quality and performance.'
                          : analysis.summary.potentialImpact === 'Medium'
                          ? 'Moderate improvements to code quality and maintainability.'
                          : 'Minor improvements with limited impact on overall code quality.'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applied Tab */}
          <TabsContent value="applied" className="p-6">
            {appliedSuggestions.length > 0 ? (
              <div className="space-y-4">
                {appliedSuggestions.map((suggestionId) => {
                  const suggestion = analysis.suggestions.find(s => s.id === suggestionId)
                  if (!suggestion) return null

                  return (
                    <Card key={suggestionId} className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CardContent className="pt-4">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900 dark:text-green-100">
                              {suggestion.title}
                            </h4>
                            <p className="text-sm text-green-700 dark:text-green-200">
                              {suggestion.description}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Applied
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Suggestions Applied
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Applied refactoring suggestions will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        /* Empty State */
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Lightbulb className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              AI Code Refactoring
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
              Analyze your code with AI to get intelligent refactoring suggestions
              for better performance, maintainability, and readability.
            </p>
            <Button onClick={analyzeCode} disabled={!code.trim()}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Analyze Code
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
