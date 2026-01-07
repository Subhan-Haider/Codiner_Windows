"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Github,
  MessageSquare,
  Users,
  Star,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share,
  Bookmark,
  TrendingUp,
  Code,
  Palette,
  Zap,
  Search,
  Plus,
  Filter,
  Calendar,
  Award,
  Trophy,
  Target,
  Lightbulb,
  HelpCircle,
  FileText,
  Play,
  Download,
  Heart,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CommunityPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    username: string
  }
  category: 'question' | 'showcase' | 'tutorial' | 'discussion'
  tags: string[]
  upvotes: number
  downvotes: number
  comments: number
  views: number
  createdAt: string
  isPinned?: boolean
  attachments?: string[]
}

interface GitHubRepo {
  id: string
  name: string
  description: string
  owner: string
  stars: number
  forks: number
  language: string
  topics: string[]
  updatedAt: string
  url: string
}

const samplePosts: CommunityPost[] = [
  {
    id: '1',
    title: 'How to build a real-time chat app with Supabase?',
    content: 'I\'m trying to build a chat application using Codiner and Supabase. Has anyone done this before? What are the best practices for real-time messaging?',
    author: {
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      username: 'sarah_dev'
    },
    category: 'question',
    tags: ['supabase', 'realtime', 'chat', 'tutorial'],
    upvotes: 24,
    downvotes: 2,
    comments: 8,
    views: 156,
    createdAt: '2024-01-15T10:30:00Z',
    isPinned: true
  },
  {
    id: '2',
    title: 'My first Codiner app: Task management dashboard',
    content: 'Just finished building my first app with Codiner! It\'s a beautiful task management dashboard with drag-and-drop functionality. Here\'s what I learned...',
    author: {
      name: 'Alex Rodriguez',
      avatar: '/avatars/alex.jpg',
      username: 'alex_codes'
    },
    category: 'showcase',
    tags: ['showcase', 'dashboard', 'drag-drop', 'first-project'],
    upvotes: 42,
    downvotes: 0,
    comments: 15,
    views: 289,
    createdAt: '2024-01-14T15:20:00Z',
    attachments: ['dashboard-screenshot.png', 'task-app-demo.mp4']
  },
  {
    id: '3',
    title: 'Complete guide: From idea to deployed app in 30 minutes',
    content: 'Step-by-step tutorial on how to go from a simple idea to a fully deployed web application using Codiner\'s AI features...',
    author: {
      name: 'Maria Santos',
      avatar: '/avatars/maria.jpg',
      username: 'maria_teaches'
    },
    category: 'tutorial',
    tags: ['tutorial', 'beginners', 'deployment', 'guide'],
    upvotes: 67,
    downvotes: 1,
    comments: 23,
    views: 445,
    createdAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Should Codiner support more programming languages?',
    content: 'I love using Codiner for web development, but I\'m wondering if support for other languages like Python, Go, or Rust would be beneficial...',
    author: {
      name: 'David Kim',
      avatar: '/avatars/david.jpg',
      username: 'david_thinks'
    },
    category: 'discussion',
    tags: ['discussion', 'languages', 'python', 'rust', 'future'],
    upvotes: 18,
    downvotes: 5,
    comments: 31,
    views: 203,
    createdAt: '2024-01-12T14:45:00Z'
  }
]

const githubRepos: GitHubRepo[] = [
  {
    id: '1',
    name: 'codiner-templates',
    description: 'Official collection of Codiner templates and starter projects',
    owner: 'codiner',
    stars: 2340,
    forks: 456,
    language: 'JavaScript',
    topics: ['templates', 'starter', 'codiner'],
    updatedAt: '2024-01-15T08:30:00Z',
    url: 'https://github.com/codiner/templates'
  },
  {
    id: '2',
    name: 'awesome-codiner',
    description: 'A curated list of awesome things built with Codiner',
    owner: 'community',
    stars: 1876,
    forks: 234,
    language: 'Markdown',
    topics: ['awesome-list', 'community', 'examples'],
    updatedAt: '2024-01-14T16:20:00Z',
    url: 'https://github.com/community/awesome-codiner'
  },
  {
    id: '3',
    name: 'codiner-components',
    description: 'Reusable UI components library for Codiner projects',
    owner: 'ui-components',
    stars: 1456,
    forks: 189,
    language: 'TypeScript',
    topics: ['components', 'ui', 'library', 'react'],
    updatedAt: '2024-01-13T12:15:00Z',
    url: 'https://github.com/ui-components/codiner-components'
  }
]

const categories = [
  { id: 'all', name: 'All Posts', icon: MessageSquare, count: 1247 },
  { id: 'question', name: 'Questions', icon: HelpCircle, count: 456 },
  { id: 'showcase', name: 'Showcase', icon: Trophy, count: 289 },
  { id: 'tutorial', name: 'Tutorials', icon: Lightbulb, count: 167 },
  { id: 'discussion', name: 'Discussions', icon: MessageCircle, count: 335 }
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('forum')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const { toast } = useToast()

  const filteredPosts = samplePosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
      case 'comments':
        return b.comments - a.comments
      case 'views':
        return b.views - a.views
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const handleVote = (postId: string, type: 'up' | 'down') => {
    toast({
      title: type === 'up' ? 'Upvoted!' : 'Downvoted',
      description: 'Thanks for your feedback!',
    })
  }

  const handleBookmark = (postId: string) => {
    toast({
      title: 'Bookmarked!',
      description: 'Post saved to your bookmarks.',
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'question': return HelpCircle
      case 'showcase': return Trophy
      case 'tutorial': return Lightbulb
      case 'discussion': return MessageCircle
      default: return MessageSquare
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'question': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'showcase': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'tutorial': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'discussion': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-500" />
            Community Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Connect, learn, and share with the Codiner community
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Users className="w-3 h-3 mr-1" />
            12,847 Members
          </Badge>
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">12,847</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Active Members</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 mb-2">3,421</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Posts This Month</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">89,432</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Views</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">247</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Online Now</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-white/50 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="forum" className="text-sm font-medium">
            <MessageSquare className="w-4 h-4 mr-2" />
            Forum
          </TabsTrigger>
          <TabsTrigger value="github" className="text-sm font-medium">
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-sm font-medium">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-sm font-medium">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Forum Tab */}
        <TabsContent value="forum" className="space-y-6">
          {/* Search and Filters */}
          <Card className="card-hover glass">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search posts, tags, or users..."
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
                        <div className="flex items-center">
                          <category.icon className="w-4 h-4 mr-2" />
                          {category.name} ({category.count})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-32 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="comments">Most Comments</SelectItem>
                    <SelectItem value="views">Most Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {sortedPosts.map((post) => {
              const CategoryIcon = getCategoryIcon(post.category)

              return (
                <Card key={post.id} className={`card-hover glass ${post.isPinned ? 'border-yellow-200 dark:border-yellow-800' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      {/* Voting */}
                      <div className="flex flex-col items-center space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, 'up')}
                          className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {post.upvotes - post.downvotes}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, 'down')}
                          className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <ThumbsUp className="h-4 w-4 rotate-180" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.isPinned && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              📌 Pinned
                            </Badge>
                          )}
                          <Badge className={getCategoryColor(post.category)}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {post.category}
                          </Badge>
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 hover:text-blue-600 cursor-pointer">
                          {post.title}
                        </h3>

                        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {post.content}
                        </p>

                        {/* Attachments */}
                        {post.attachments && post.attachments.length > 0 && (
                          <div className="flex items-center space-x-2 mb-4">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-500">
                              {post.attachments.length} attachment{post.attachments.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}

                        {/* Author and Meta */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={post.author.avatar} alt={post.author.name} />
                              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {post.author.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                @{post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBookmark(post.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Bookmark className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        </TabsContent>

        {/* GitHub Tab */}
        <TabsContent value="github" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-4">GitHub Community</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Explore amazing projects, templates, and resources built by the Codiner community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {githubRepos.map((repo) => (
              <Card key={repo.id} className="card-hover glass group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg hover:text-blue-600 cursor-pointer group-hover:text-blue-600 transition-colors">
                        {repo.name}
                      </CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        by {repo.owner}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{repo.stars.toLocaleString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {repo.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        repo.language === 'JavaScript' ? 'bg-yellow-500' :
                        repo.language === 'TypeScript' ? 'bg-blue-500' :
                        repo.language === 'Markdown' ? 'bg-gray-500' : 'bg-green-500'
                      }`}></div>
                      {repo.language}
                    </span>
                    <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Star className="w-4 h-4 mr-1" />
                      Star
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Github className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-4">Community Templates</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Browse and download templates created by the Codiner community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <Card key={i} className="card-hover glass group cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${
                    i % 4 === 0 ? 'from-blue-500 to-cyan-500' :
                    i % 4 === 1 ? 'from-green-500 to-emerald-500' :
                    i % 4 === 2 ? 'from-purple-500 to-pink-500' :
                    'from-orange-500 to-red-500'
                  } rounded-xl flex items-center justify-center`}>
                    {i % 4 === 0 ? <Code className="w-8 h-8 text-white" /> :
                     i % 4 === 1 ? <Palette className="w-8 h-8 text-white" /> :
                     i % 4 === 2 ? <Zap className="w-8 h-8 text-white" /> :
                     <FileText className="w-8 h-8 text-white" />}
                  </div>
                  <h4 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {['E-commerce Store', 'Admin Dashboard', 'Portfolio Site', 'Blog Template', 'SaaS Landing', 'Chat App', 'Task Manager', 'Analytics Board'][i]}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {['Modern online store', 'Admin panel template', 'Personal portfolio', 'Blog with CMS', 'SaaS landing page', 'Real-time chat', 'Project management', 'Data visualization'][i]}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>by @user{i + 1}</span>
                    <span>⭐ {(Math.random() * 500 + 50).toFixed(0)}</span>
                  </div>
                  <Button className="w-full" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-4">Community Leaderboard</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Top contributors and most active community members
            </p>
          </div>

          <div className="space-y-4">
            {[
              { rank: 1, name: 'Sarah Chen', points: 2847, avatar: '/avatars/sarah.jpg', badge: '🏆 Top Contributor' },
              { rank: 2, name: 'Alex Rodriguez', points: 2654, avatar: '/avatars/alex.jpg', badge: '🥈 Expert Builder' },
              { rank: 3, name: 'Maria Santos', points: 2431, avatar: '/avatars/maria.jpg', badge: '🥉 Community Guide' },
              { rank: 4, name: 'David Kim', points: 2289, avatar: '/avatars/david.jpg', badge: '💡 Innovator' },
              { rank: 5, name: 'Emma Wilson', points: 2156, avatar: '/avatars/emma.jpg', badge: '🚀 Early Adopter' },
            ].map((user) => (
              <Card key={user.rank} className="card-hover glass">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.rank === 1 ? '👑' : user.rank}
                    </div>

                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">{user.name}</h4>
                        <Badge variant="secondary" className="text-xs">{user.badge}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {user.points.toLocaleString()} contribution points
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        #{user.rank}
                      </div>
                      <div className="text-sm text-slate-500">
                        {user.points} pts
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
