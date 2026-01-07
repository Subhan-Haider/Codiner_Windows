"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Code,
  Download,
  Copy,
  Play,
  Zap,
  Settings,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Palette,
  Database,
  Cloud,
  Smartphone,
  Globe,
  BarChart3,
  Users,
  GamepadIcon,
  Wrench,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MultiLanguageGenerator, type LanguageTemplate, type CodeTemplate, type GenerationOptions } from "@/lib/multi-language-generator"

const categoryIcons = {
  editor: Code,
  ai: Zap,
  deployment: Cloud,
  theme: Palette,
  integration: Wrench,
  utility: Settings,
}

export default function GeneratePage() {
  const [languages, setLanguages] = useState<LanguageTemplate[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    language: 'javascript',
    style: 'standard',
    testing: false,
    documentation: true
  })
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState<CodeTemplate | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const supportedLanguages = MultiLanguageGenerator.getSupportedLanguages()
    setLanguages(supportedLanguages)
    if (supportedLanguages.length > 0) {
      setSelectedLanguage(supportedLanguages[0].id)
    }
  }, [])

  useEffect(() => {
    if (selectedLanguage && selectedTemplate) {
      const template = MultiLanguageGenerator.getTemplate(
        languages.find(l => l.id === selectedLanguage)?.language || '',
        selectedTemplate
      )
      setSelectedTemplateDetails(template || null)
    }
  }, [selectedLanguage, selectedTemplate, languages])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please describe what you want to build",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const options: GenerationOptions = {
        ...generationOptions,
        language: languages.find(l => l.id === selectedLanguage)?.language || 'javascript',
        template: selectedTemplate || undefined,
        features: [], // Could be extracted from prompt
      }

      const code = await MultiLanguageGenerator.generateCode(prompt, options)
      setGeneratedCode(code)

      toast({
        title: "Code Generated!",
        description: "Your code has been generated successfully",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      toast({
        title: "Code Copied",
        description: "Code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `codiner-generated-code.${getFileExtension(generationOptions.language)}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Started",
      description: "Your code file has been downloaded",
    })
  }

  const getFileExtension = (language: string): string => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      csharp: 'cs',
      php: 'php',
      html: 'html',
      css: 'css'
    }
    return extensions[language as keyof typeof extensions] || 'txt'
  }

  const getCurrentLanguage = () => languages.find(l => l.id === selectedLanguage)
  const getCurrentTemplates = () => {
    const lang = getCurrentLanguage()
    return lang ? MultiLanguageGenerator.getTemplatesForLanguage(lang.language) : []
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <Zap className="w-8 h-8 mr-3 text-purple-500" />
            AI Code Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Generate production-ready code in multiple programming languages
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Code className="w-3 h-3 mr-1" />
            {languages.length} Languages
          </Badge>
          <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Settings className="h-4 w-4 mr-2" />
            Advanced
          </Button>
        </div>
      </div>

      {/* Language Selection */}
      <Card className="card-hover glass">
        <CardHeader>
          <CardTitle>Choose Your Language</CardTitle>
          <CardDescription>
            Select the programming language and framework for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {languages.map((language) => (
              <Card
                key={language.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedLanguage === language.id
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                onClick={() => setSelectedLanguage(language.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{language.icon}</div>
                  <h3 className="font-semibold text-sm">{language.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {language.complexity} • {language.popularity}% popularity
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {language.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1">
                        {feature.split(' ')[0]}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      {getCurrentLanguage() && (
        <Card className="card-hover glass">
          <CardHeader>
            <CardTitle>Choose a Template</CardTitle>
            <CardDescription>
              Start with a pre-built template or create from scratch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer transition-all ${
                  selectedTemplate === ''
                    ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                onClick={() => setSelectedTemplate('')}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold">Custom Generation</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Generate code from your description
                  </p>
                </CardContent>
              </Card>

              {getCurrentTemplates().map((template) => (
                <Card
                  key={template.name}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.name.toLowerCase().replace(/\s+/g, '-')
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setSelectedTemplate(template.name.toLowerCase().replace(/\s+/g, '-'))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{template.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {template.tags[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code Generation */}
      <Card className="card-hover glass">
        <CardHeader>
          <CardTitle>Describe Your Project</CardTitle>
          <CardDescription>
            Tell us what you want to build. Be specific about features, functionality, and requirements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`Example: "Create a REST API for a blog with user authentication, post management, and comments. Include input validation, error handling, and use ${getCurrentLanguage()?.name} with appropriate frameworks."`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="resize-none"
          />

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">Code Style</label>
                <Select
                  value={generationOptions.style}
                  onValueChange={(value: any) => setGenerationOptions(prev => ({ ...prev, style: value }))}
                >
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="testing"
                  checked={generationOptions.testing}
                  onChange={(e) => setGenerationOptions(prev => ({ ...prev, testing: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="testing" className="text-sm font-medium">Include Tests</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="documentation"
                  checked={generationOptions.documentation}
                  onChange={(e) => setGenerationOptions(prev => ({ ...prev, documentation: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="documentation" className="text-sm font-medium">Add Documentation</label>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              size="lg"
              className="btn-gradient"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Code...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Generate Code
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Code */}
      {generatedCode && (
        <Card className="card-hover glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Code</CardTitle>
                <CardDescription>
                  {selectedTemplateDetails ? selectedTemplateDetails.name : 'Custom generated code'} in {getCurrentLanguage()?.name}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadCode}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full rounded-md border border-slate-200 dark:border-slate-700">
              <pre className="p-4 text-sm font-mono bg-slate-50 dark:bg-slate-900">
                <code>{generatedCode}</code>
              </pre>
            </ScrollArea>

            {selectedTemplateDetails && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h4 className="font-semibold mb-2">Template Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span> {selectedTemplateDetails.category}
                  </div>
                  <div>
                    <span className="font-medium">Tags:</span> {selectedTemplateDetails.tags.join(', ')}
                  </div>
                  {selectedTemplateDetails.dependencies && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Dependencies:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTemplateDetails.dependencies.map((dep, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Template Details Dialog */}
      {selectedTemplateDetails && (
        <Dialog open={!!selectedTemplateDetails} onOpenChange={() => setSelectedTemplateDetails(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTemplateDetails.name}</DialogTitle>
              <DialogDescription>{selectedTemplateDetails.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedTemplateDetails.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTemplateDetails.dependencies && (
                <div>
                  <h4 className="font-semibold mb-2">Required Dependencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplateDetails.dependencies.map((dep, index) => (
                      <Badge key={index} variant="outline">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedTemplateDetails(null)}>
                  Close
                </Button>
                <Button onClick={handleGenerate}>
                  Use This Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
