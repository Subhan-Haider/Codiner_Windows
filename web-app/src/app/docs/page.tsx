"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BookOpen,
  Search,
  Play,
  Code,
  Zap,
  Database,
  Users,
  Settings,
  ChevronRight,
  FileText,
  Video,
  MessageSquare,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocSection {
  id: string
  title: string
  description: string
  icon: any
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeToRead: string
  category: string
  tags: string[]
  content?: string
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Codiner',
    description: 'Learn the basics of Codiner and build your first AI-powered application',
    icon: Play,
    difficulty: 'beginner',
    timeToRead: '10 min',
    category: 'Getting Started',
    tags: ['basics', 'tutorial', 'first-app'],
    content: `# Getting Started with Codiner

Welcome to Codiner! This guide will help you build your first AI-powered application in just a few minutes.

## What is Codiner?

Codiner is an AI-powered app builder that transforms natural language descriptions into production-ready code. No coding experience required!

## Your First App

Let's build a simple task management app:

1. **Describe your app**: "Create a task management app with a clean interface, drag-and-drop functionality, and local storage"

2. **AI generates code**: Codiner's AI analyzes your description and generates:
   - HTML structure
   - CSS styling
   - JavaScript functionality
   - Modern UI components

3. **Preview & edit**: See your app instantly and make adjustments using the live editor

4. **Export & deploy**: Download your code or deploy directly to hosting platforms

## Key Features

- **Natural Language Processing**: Describe what you want, get working code
- **Live Preview**: See changes instantly as you edit
- **Modern UI**: Beautiful, responsive designs out of the box
- **Export Options**: Download as ZIP, individual files, or deploy directly
- **Community Support**: Join thousands of builders worldwide

## Next Steps

- Explore the [AI Generator](/generate) to build more complex apps
- Check out [Templates](/templates) for pre-built solutions
- Join the [Community](/community) to learn from others
- Read advanced guides in the [Documentation](/docs) section

Ready to build something amazing? Let's get started! 🚀`
  },
  {
    id: 'ai-generator',
    title: 'AI App Generator Guide',
    description: 'Master the art of describing apps to get perfect AI-generated code',
    icon: Zap,
    difficulty: 'intermediate',
    timeToRead: '15 min',
    category: 'AI Features',
    tags: ['ai', 'prompts', 'generator'],
  },
  {
    id: 'code-editor',
    title: 'Using the Code Editor',
    description: 'Learn advanced editing features, live preview, and collaborative coding',
    icon: Code,
    difficulty: 'intermediate',
    timeToRead: '12 min',
    category: 'Tools',
    tags: ['editor', 'monaco', 'preview'],
  },
  {
    id: 'supabase-integration',
    title: 'Supabase Database Integration',
    description: 'Add authentication, real-time data, and serverless functions to your apps',
    icon: Database,
    difficulty: 'advanced',
    timeToRead: '20 min',
    category: 'Backend',
    tags: ['supabase', 'database', 'auth'],
  },
  {
    id: 'deployment-guide',
    title: 'Deploying Your Apps',
    description: 'Deploy to Vercel, Netlify, AWS, and other platforms with one click',
    icon: Settings,
    difficulty: 'intermediate',
    timeToRead: '8 min',
    category: 'Deployment',
    tags: ['vercel', 'netlify', 'aws', 'deployment'],
  },
  {
    id: 'api-reference',
    title: 'Codiner API Reference',
    description: 'Complete API documentation for programmatic access and integrations',
    icon: FileText,
    difficulty: 'advanced',
    timeToRead: '25 min',
    category: 'API',
    tags: ['api', 'reference', 'integration'],
  },
]

const categories = [
  { id: 'all', name: 'All Docs', count: docSections.length },
  { id: 'getting-started', name: 'Getting Started', count: 1 },
  { id: 'ai-features', name: 'AI Features', count: 1 },
  { id: 'tools', name: 'Tools & Editor', count: 1 },
  { id: 'backend', name: 'Backend & Database', count: 1 },
  { id: 'deployment', name: 'Deployment', count: 1 },
  { id: 'api', name: 'API & Integration', count: 1 },
]

export default function DocsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoc, setSelectedDoc] = useState<DocSection | null>(null)
  const { toast } = useToast()

  const filteredDocs = docSections.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category.toLowerCase().replace(' ', '-') === selectedCategory
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleDocSelect = (doc: DocSection) => {
    setSelectedDoc(doc)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-blue-500" />
            Documentation
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Comprehensive guides, tutorials, and API reference for Codiner
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <FileText className="w-3 h-3 mr-1" />
            {docSections.length} Guides
          </Badge>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            API Reference
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="card-hover glass">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 input-focus"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Cards */}
      {!selectedDoc && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover glass cursor-pointer group" onClick={() => handleDocSelect(docSections[0])}>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">Quick Start</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Build your first app in 5 minutes with our step-by-step guide
              </p>
              <Badge className="bg-blue-100 text-blue-800">Beginner Friendly</Badge>
            </CardContent>
          </Card>

          <Card className="card-hover glass cursor-pointer group" onClick={() => handleDocSelect(docSections[1])}>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">AI Mastery</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Learn to write perfect prompts for amazing AI-generated apps
              </p>
              <Badge className="bg-purple-100 text-purple-800">Pro Tips</Badge>
            </CardContent>
          </Card>

          <Card className="card-hover glass cursor-pointer group" onClick={() => handleDocSelect(docSections[5])}>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition-colors">API Docs</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Complete API reference for integrations and custom solutions
              </p>
              <Badge className="bg-green-100 text-green-800">Developer</Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documentation Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setSelectedDoc(null)
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      selectedCategory === category.id ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-r-2 border-blue-500' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {category.name}
                    <span className="float-right text-xs text-slate-500">({category.count})</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedDoc ? (
            /* Document Viewer */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedDoc(null)}
                  className="mb-4"
                >
                  ← Back to Docs
                </Button>
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(selectedDoc.difficulty)}>
                    {selectedDoc.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedDoc.timeToRead}
                  </Badge>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <selectedDoc.icon className="w-8 h-8 text-blue-500" />
                    <div>
                      <CardTitle className="text-2xl">{selectedDoc.title}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {selectedDoc.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedDoc.content ? (
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
                        {selectedDoc.content}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                        Documentation Coming Soon
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        We're working hard to bring you comprehensive documentation for this topic.
                      </p>
                      <Button>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Request This Guide
                      </Button>
                    </div>
                  )}

                  {/* Related Links */}
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="font-semibold mb-4">Related Topics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {docSections.filter(doc => doc.id !== selectedDoc.id).slice(0, 4).map((doc) => (
                        <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedDoc(doc)}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <doc.icon className="w-5 h-5 text-slate-400" />
                              <div>
                                <h5 className="font-medium text-sm">{doc.title}</h5>
                                <p className="text-xs text-slate-500">{doc.timeToRead} read</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Documentation Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDocs.map((doc) => {
                const IconComponent = doc.icon

                return (
                  <Card
                    key={doc.id}
                    className="card-hover glass cursor-pointer group"
                    onClick={() => handleDocSelect(doc)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            doc.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900' :
                            doc.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900' :
                            'bg-red-100 dark:bg-red-900'
                          }`}>
                            <IconComponent className={`w-6 h-6 ${
                              doc.difficulty === 'beginner' ? 'text-green-600 dark:text-green-400' :
                              doc.difficulty === 'intermediate' ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {doc.description}
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getDifficultyColor(doc.difficulty)}>
                            {doc.difficulty}
                          </Badge>
                          <span className="text-sm text-slate-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {doc.timeToRead}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      {!selectedDoc && (
        <Card className="card-hover glass mt-12">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Need Help?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our community and support team are here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-gradient">
                  <MessageSquare className="w-5 w-5 mr-2" />
                  Ask Community
                </Button>
                <Button variant="outline" size="lg">
                  <Video className="w-5 w-5 mr-2" />
                  Watch Tutorials
                </Button>
                <Button variant="outline" size="lg">
                  <FileText className="w-5 w-5 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
