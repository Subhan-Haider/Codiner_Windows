"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search,
  Filter,
  Star,
  Download,
  Heart,
  ShoppingCart,
  Crown,
  Code,
  Palette,
  Zap,
  Database,
  Smartphone,
  Globe,
  BarChart3,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
  Share,
  Bookmark,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Template {
  id: string
  name: string
  description: string
  category: string
  price: number
  rating: number
  downloads: number
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  tags: string[]
  previewImages: string[]
  features: string[]
  techStack: string[]
  lastUpdated: string
  version: string
  license: string
  isPremium: boolean
  isBookmarked: boolean
  reviews: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
}

const sampleTemplates: Template[] = [
  {
    id: '1',
    name: 'Modern SaaS Dashboard',
    description: 'Complete admin dashboard with analytics, user management, and real-time data visualization',
    category: 'Dashboard',
    price: 49,
    rating: 4.8,
    downloads: 1247,
    author: {
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      verified: true
    },
    tags: ['react', 'typescript', 'dashboard', 'analytics', 'admin'],
    previewImages: ['/templates/dashboard-1.jpg', '/templates/dashboard-2.jpg'],
    features: ['User Management', 'Analytics Charts', 'Real-time Updates', 'Dark Mode', 'Responsive Design'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Supabase'],
    lastUpdated: '2024-01-15',
    version: '2.1.0',
    license: 'MIT',
    isPremium: true,
    isBookmarked: false,
    reviews: 89,
    difficulty: 'intermediate',
    estimatedTime: '2 hours'
  },
  {
    id: '2',
    name: 'E-commerce Store',
    description: 'Full-featured online store with cart, checkout, and payment integration',
    category: 'E-commerce',
    price: 79,
    rating: 4.9,
    downloads: 2156,
    author: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      verified: true
    },
    tags: ['ecommerce', 'stripe', 'cart', 'checkout', 'shopify'],
    previewImages: ['/templates/ecommerce-1.jpg', '/templates/ecommerce-2.jpg'],
    features: ['Shopping Cart', 'Stripe Integration', 'Product Management', 'Order Tracking', 'Email Notifications'],
    techStack: ['Next.js', 'TypeScript', 'Stripe', 'Prisma', 'PostgreSQL'],
    lastUpdated: '2024-01-12',
    version: '3.0.2',
    license: 'MIT',
    isPremium: true,
    isBookmarked: true,
    reviews: 156,
    difficulty: 'advanced',
    estimatedTime: '4 hours'
  },
  {
    id: '3',
    name: 'Personal Portfolio',
    description: 'Stunning portfolio website with animations and modern design',
    category: 'Portfolio',
    price: 0,
    rating: 4.6,
    downloads: 3421,
    author: {
      name: 'Mike Rodriguez',
      avatar: '/avatars/mike.jpg',
      verified: false
    },
    tags: ['portfolio', 'animation', 'responsive', 'modern', 'freelancer'],
    previewImages: ['/templates/portfolio-1.jpg', '/templates/portfolio-2.jpg'],
    features: ['Smooth Animations', 'Project Showcase', 'Contact Form', 'Blog Integration', 'SEO Optimized'],
    techStack: ['React', 'Framer Motion', 'Tailwind CSS', 'Next.js'],
    lastUpdated: '2024-01-10',
    version: '1.4.1',
    license: 'MIT',
    isPremium: false,
    isBookmarked: false,
    reviews: 234,
    difficulty: 'beginner',
    estimatedTime: '1 hour'
  },
  {
    id: '4',
    name: 'Task Management App',
    description: 'Collaborative task manager with real-time updates and team features',
    category: 'Productivity',
    price: 39,
    rating: 4.7,
    downloads: 1876,
    author: {
      name: 'Emma Wilson',
      avatar: '/avatars/emma.jpg',
      verified: true
    },
    tags: ['tasks', 'collaboration', 'real-time', 'kanban', 'teams'],
    previewImages: ['/templates/tasks-1.jpg', '/templates/tasks-2.jpg'],
    features: ['Kanban Board', 'Real-time Collaboration', 'File Attachments', 'Due Dates', 'Team Management'],
    techStack: ['Vue.js', 'Socket.io', 'Express', 'MongoDB', 'Tailwind CSS'],
    lastUpdated: '2024-01-08',
    version: '2.3.1',
    license: 'MIT',
    isPremium: true,
    isBookmarked: false,
    reviews: 145,
    difficulty: 'intermediate',
    estimatedTime: '3 hours'
  },
  {
    id: '5',
    name: 'Blog Platform',
    description: 'Modern blog with markdown support, comments, and SEO optimization',
    category: 'CMS',
    price: 29,
    rating: 4.5,
    downloads: 1456,
    author: {
      name: 'David Kim',
      avatar: '/avatars/david.jpg',
      verified: false
    },
    tags: ['blog', 'markdown', 'seo', 'comments', 'cms'],
    previewImages: ['/templates/blog-1.jpg', '/templates/blog-2.jpg'],
    features: ['Markdown Editor', 'SEO Optimization', 'Comment System', 'Categories', 'RSS Feed'],
    techStack: ['Next.js', 'MDX', 'Vercel', 'Tailwind CSS', 'Supabase'],
    lastUpdated: '2024-01-05',
    version: '1.8.3',
    license: 'MIT',
    isPremium: true,
    isBookmarked: true,
    reviews: 98,
    difficulty: 'intermediate',
    estimatedTime: '2.5 hours'
  },
  {
    id: '6',
    name: 'Weather App',
    description: 'Beautiful weather application with location services and forecasts',
    category: 'Utility',
    price: 0,
    rating: 4.3,
    downloads: 2891,
    author: {
      name: 'Lisa Chen',
      avatar: '/avatars/lisa.jpg',
      verified: false
    },
    tags: ['weather', 'api', 'location', 'forecast', 'responsive'],
    previewImages: ['/templates/weather-1.jpg', '/templates/weather-2.jpg'],
    features: ['Location Detection', '7-Day Forecast', 'Weather Maps', 'Push Notifications', 'Offline Mode'],
    techStack: ['React', 'OpenWeather API', 'PWA', 'IndexedDB', 'Material-UI'],
    lastUpdated: '2024-01-03',
    version: '1.2.0',
    license: 'MIT',
    isPremium: false,
    isBookmarked: false,
    reviews: 167,
    difficulty: 'beginner',
    estimatedTime: '1.5 hours'
  }
]

const categories = [
  { id: 'all', name: 'All Templates', count: sampleTemplates.length },
  { id: 'dashboard', name: 'Dashboard', count: sampleTemplates.filter(t => t.category === 'Dashboard').length },
  { id: 'ecommerce', name: 'E-commerce', count: sampleTemplates.filter(t => t.category === 'E-commerce').length },
  { id: 'portfolio', name: 'Portfolio', count: sampleTemplates.filter(t => t.category === 'Portfolio').length },
  { id: 'productivity', name: 'Productivity', count: sampleTemplates.filter(t => t.category === 'Productivity').length },
  { id: 'cms', name: 'CMS & Blog', count: sampleTemplates.filter(t => t.category === 'CMS').length },
  { id: 'utility', name: 'Utility', count: sampleTemplates.filter(t => t.category === 'Utility').length },
]

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'premium'>('all')
  const { toast } = useToast()

  const filteredTemplates = sampleTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesPrice = priceFilter === 'all' ||
                        (priceFilter === 'free' && template.price === 0) ||
                        (priceFilter === 'premium' && template.price > 0)

    return matchesCategory && matchesSearch && matchesPrice
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads
      case 'rating':
        return b.rating - a.rating
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      default:
        return 0
    }
  })

  const handlePurchase = (template: Template) => {
    if (template.price === 0) {
      toast({
        title: "Template Downloaded!",
        description: `${template.name} has been added to your projects.`,
      })
    } else {
      toast({
        title: "Purchase Template",
        description: `Redirecting to purchase ${template.name} for $${template.price}`,
      })
    }
  }

  const handleBookmark = (templateId: string) => {
    toast({
      title: "Bookmarked!",
      description: "Template added to your bookmarks.",
    })
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
            <ShoppingCart className="w-8 h-8 mr-3 text-blue-500" />
            Template Marketplace
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Discover and purchase professional templates to accelerate your development
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <TrendingUp className="w-3 h-3 mr-1" />
            500+ Templates
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Sell Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Templates</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Downloads</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Creators</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">4.7</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="card-hover glass">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 input-focus"
              />
            </div>

            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 h-12">
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

              <Select value={priceFilter} onValueChange={(value: any) => setPriceFilter(value)}>
                <SelectTrigger className="w-32 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTemplates.map((template) => (
            <Card key={template.id} className="card-hover glass group overflow-hidden">
              {/* Preview Image */}
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  {template.isPremium && (
                    <Badge className="bg-yellow-500 text-black">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{template.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">{template.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                      {template.name}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBookmark(template.id)}
                    className="flex-shrink-0"
                  >
                    <Heart className={`w-4 h-4 ${template.isBookmarked ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {/* Author */}
                <div className="flex items-center space-x-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={template.author.avatar} alt={template.author.name} />
                    <AvatarFallback className="text-xs">{template.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{template.author.name}</span>
                  {template.author.verified && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      ✓
                    </Badge>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{template.reviews}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{template.estimatedTime}</span>
                    </div>
                  </div>
                  <span className="text-xs">v{template.version}</span>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {template.price === 0 ? (
                      <Badge className="bg-green-100 text-green-800">Free</Badge>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {template.price}
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => handlePurchase(template)}
                    size="sm"
                    className={template.price === 0 ? 'bg-green-600 hover:bg-green-700' : 'btn-gradient'}
                  >
                    {template.price === 0 ? (
                      <>
                        <Download className="w-4 h-4 mr-1" />
                        Get Free
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Buy Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {sortedTemplates.map((template) => (
            <Card key={template.id} className="card-hover glass">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  {/* Preview Image */}
                  <div className="w-24 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex-shrink-0" />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                          {template.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {template.isPremium && (
                          <Badge className="bg-yellow-500 text-black">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={template.author.avatar} alt={template.author.name} />
                          <AvatarFallback className="text-xs">{template.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{template.author.name}</span>
                        {template.author.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                      </div>

                      <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-current text-yellow-400" />
                          <span>{template.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{template.reviews}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{template.estimatedTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-500">v{template.version}</span>
                        <div className="flex items-center space-x-1">
                          {template.price === 0 ? (
                            <Badge className="bg-green-100 text-green-800">Free</Badge>
                          ) : (
                            <>
                              <DollarSign className="w-4 h-4 text-slate-400" />
                              <span className="text-lg font-bold text-slate-900 dark:text-white">
                                {template.price}
                              </span>
                            </>
                          )}
                        </div>
                        <Button
                          onClick={() => handlePurchase(template)}
                          size="sm"
                          className={template.price === 0 ? 'bg-green-600 hover:bg-green-700' : 'btn-gradient'}
                        >
                          {template.price === 0 ? 'Get Free' : 'Buy Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {sortedTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No templates found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Try adjusting your search criteria or browse all templates
          </p>
          <Button onClick={() => {
            setSearchQuery('')
            setSelectedCategory('all')
            setPriceFilter('all')
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-400">
          Want to sell your own templates?
          <Button variant="link" className="px-2">Apply to become a seller</Button>
        </p>
      </div>
    </div>
  )
}
