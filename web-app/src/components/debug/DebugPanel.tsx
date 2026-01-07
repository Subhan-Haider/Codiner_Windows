"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bug,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Zap,
  Shield,
  TrendingUp,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  X,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AIDebugger, type DebugReport, type CodeIssue } from "@/lib/ai-debugger"

interface DebugPanelProps {
  code: { html: string; css: string; js: string }
  onFixApply?: (fix: CodeIssue['fix'], language: 'html' | 'css' | 'js') => void
  className?: string
}

export function DebugPanel({ code, onFixApply, className = '' }: DebugPanelProps) {
  const [debugReport, setDebugReport] = useState<DebugReport | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<'html' | 'css' | 'js'>('js')
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const runAnalysis = async () => {
    setIsAnalyzing(true)

    try {
      // Analyze each language separately and combine results
      const jsReport = await AIDebugger.analyzeCode(code.js, 'javascript', {
        strict: false,
        includePerformance: true,
        includeSecurity: true,
      })

      const htmlReport = await AIDebugger.analyzeCode(code.html, 'html', {
        includePerformance: false,
        includeSecurity: true,
      })

      const cssReport = await AIDebugger.analyzeCode(code.css, 'css', {
        includePerformance: true,
        includeSecurity: false,
      })

      // Combine reports
      const combinedReport: DebugReport = {
        issues: [...jsReport.issues, ...htmlReport.issues, ...cssReport.issues],
        summary: {
          totalIssues: jsReport.summary.totalIssues + htmlReport.summary.totalIssues + cssReport.summary.totalIssues,
          errors: jsReport.summary.errors + htmlReport.summary.errors + cssReport.summary.errors,
          warnings: jsReport.summary.warnings + htmlReport.summary.warnings + cssReport.summary.warnings,
          suggestions: jsReport.summary.suggestions + htmlReport.summary.suggestions + cssReport.summary.suggestions,
          score: Math.round((jsReport.summary.score + htmlReport.summary.score + cssReport.summary.score) / 3),
        },
        analysis: {
          complexity: Math.max(jsReport.analysis.complexity, htmlReport.analysis.complexity, cssReport.analysis.complexity),
          maintainability: Math.min(jsReport.analysis.maintainability, htmlReport.analysis.maintainability, cssReport.analysis.maintainability),
          performance: Math.min(jsReport.analysis.performance, htmlReport.analysis.performance, cssReport.analysis.performance),
          security: Math.min(jsReport.analysis.security, htmlReport.analysis.security, cssReport.analysis.security),
        },
        recommendations: [...jsReport.recommendations, ...htmlReport.recommendations, ...cssReport.recommendations],
      }

      setDebugReport(combinedReport)

      toast({
        title: "Analysis Complete",
        description: `Found ${combinedReport.summary.totalIssues} issues with ${combinedReport.summary.score}% quality score`,
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleIssueExpansion = (issueId: string) => {
    const newExpanded = new Set(expandedIssues)
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId)
    } else {
      newExpanded.add(issueId)
    }
    setExpandedIssues(newExpanded)
  }

  const applyFix = (issue: CodeIssue) => {
    if (issue.fix && onFixApply) {
      // Determine language based on issue context
      let language: 'html' | 'css' | 'js' = 'js'
      if (issue.tags.includes('html')) language = 'html'
      else if (issue.tags.includes('css')) language = 'css'

      onFixApply(issue.fix, language)

      toast({
        title: "Fix Applied",
        description: `Applied fix for: ${issue.title}`,
      })
    }
  }

  const copyIssueDetails = (issue: CodeIssue) => {
    const details = `${issue.title}\n${issue.description}\n\nSuggestion: ${issue.suggestion}\n\nCode: ${issue.code}`
    navigator.clipboard.writeText(details)

    toast({
      title: "Copied to Clipboard",
      description: "Issue details copied",
    })
  }

  const getIssuesByLanguage = (language: string) => {
    if (!debugReport) return []
    return debugReport.issues.filter(issue =>
      (language === 'js' && (issue.tags.includes('javascript') || issue.tags.includes('js'))) ||
      (language === 'html' && issue.tags.includes('html')) ||
      (language === 'css' && issue.tags.includes('css')) ||
      (!issue.tags.includes('javascript') && !issue.tags.includes('html') && !issue.tags.includes('css'))
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20'
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Code Debugger</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Intelligent error detection & fixes</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {debugReport && (
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBg(debugReport.summary.score)} ${getScoreColor(debugReport.summary.score)}`}>
              {debugReport.summary.score}% Quality
            </div>
          )}

          <Button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analyze Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {debugReport ? (
          <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as 'html' | 'css' | 'js')}>
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-white/50 backdrop-blur-sm border border-white/20">
                <TabsTrigger value="html" className="text-sm font-medium">
                  HTML ({getIssuesByLanguage('html').length})
                </TabsTrigger>
                <TabsTrigger value="css" className="text-sm font-medium">
                  CSS ({getIssuesByLanguage('css').length})
                </TabsTrigger>
                <TabsTrigger value="js" className="text-sm font-medium">
                  JavaScript ({getIssuesByLanguage('js').length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="card-hover glass text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {debugReport.summary.totalIssues}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Issues</p>
                </CardContent>
              </Card>

              <Card className="card-hover glass text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {debugReport.summary.errors}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Errors</p>
                </CardContent>
              </Card>

              <Card className="card-hover glass text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {debugReport.summary.warnings}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Warnings</p>
                </CardContent>
              </Card>

              <Card className="card-hover glass text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {debugReport.summary.suggestions}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Suggestions</p>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Metrics */}
            <Card className="card-hover glass mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Code Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Complexity</span>
                      <span className="text-sm text-slate-600">{debugReport.analysis.complexity}/10</span>
                    </div>
                    <Progress value={debugReport.analysis.complexity * 10} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Maintainability</span>
                      <span className="text-sm text-slate-600">{debugReport.analysis.maintainability}/10</span>
                    </div>
                    <Progress value={debugReport.analysis.maintainability * 10} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Performance</span>
                      <span className="text-sm text-slate-600">{debugReport.analysis.performance}/10</span>
                    </div>
                    <Progress value={debugReport.analysis.performance * 10} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Security</span>
                      <span className="text-sm text-slate-600">{debugReport.analysis.security}/10</span>
                    </div>
                    <Progress value={debugReport.analysis.security * 10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            {debugReport.recommendations.length > 0 && (
              <Card className="card-hover glass mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {debugReport.recommendations.slice(0, 5).map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Issues List */}
            <TabsContent value={selectedLanguage} className="mt-0">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {getIssuesByLanguage(selectedLanguage).map((issue) => (
                    <Card key={issue.id} className="card-hover glass border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{AIDebugger.getTypeIcon(issue.type)}</span>
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {issue.title}
                              </h4>
                              <Badge className={`${AIDebugger.getSeverityColor(issue.severity)} bg-transparent border`}>
                                {issue.severity}
                              </Badge>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 mb-3">
                              {issue.description}
                            </p>

                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 mb-3 font-mono text-sm">
                              <div className="text-slate-500 dark:text-slate-400 mb-1">
                                Line {issue.line}, Column {issue.column}:
                              </div>
                              <code className="text-slate-900 dark:text-slate-100">
                                {issue.code}
                              </code>
                            </div>

                            {issue.suggestion && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                                <div className="flex items-center mb-1">
                                  <Lightbulb className="w-4 h-4 text-blue-600 mr-2" />
                                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    Suggestion
                                  </span>
                                </div>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                  {issue.suggestion}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center space-x-2">
                              {issue.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleIssueExpansion(issue.id)}
                              className="h-8 w-8 p-0"
                            >
                              {expandedIssues.has(issue.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyIssueDetails(issue)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>

                            {issue.fix && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => applyFix(issue)}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {expandedIssues.has(issue.id) && (
                          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              <strong>Category:</strong> {issue.category}<br/>
                              <strong>Impact:</strong> {issue.severity} severity<br/>
                              {issue.fix && (
                                <>
                                  <strong>Auto-fix available:</strong> Yes<br/>
                                  <strong>Fix type:</strong> {issue.fix.type}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {getIssuesByLanguage(selectedLanguage).length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        No Issues Found!
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Great job! Your {selectedLanguage.toUpperCase()} code looks clean.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : (
          /* Initial State */
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
              <Bug className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              AI-Powered Code Analysis
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get intelligent feedback on your code quality, performance, security, and best practices.
              Our AI analyzer will identify issues and suggest fixes to improve your code.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-semibold mb-2">Error Detection</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Catch syntax errors, logic bugs, and runtime issues
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold mb-2">Performance Analysis</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Identify bottlenecks and optimization opportunities
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Security Scan</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Detect vulnerabilities and security best practices
                </p>
              </div>
            </div>

            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              size="lg"
              className="btn-gradient shadow-xl px-8"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 w-5 mr-2 animate-spin" />
                  Analyzing Code...
                </>
              ) : (
                <>
                  <Bug className="w-5 w-5 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
