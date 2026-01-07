"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Download,
  Eye,
  Zap,
  Code,
  Palette,
  Smartphone,
  Monitor,
  Wand2,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CloneResult {
  html: string
  css: string
  js: string
  assets: string[]
  metadata: {
    title: string
    description: string
    image: string
  }
}

export default function ClonePage() {
  const [url, setUrl] = useState("")
  const [isCloning, setIsCloning] = useState(false)
  const [cloneResult, setCloneResult] = useState<CloneResult | null>(null)
  const [activeTab, setActiveTab] = useState("preview")
  const { toast } = useToast()

  const handleClone = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a valid website URL to clone",
        variant: "destructive",
      })
      return
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive",
      })
      return
    }

    setIsCloning(true)

    try {
      // Simulate AI-powered website cloning
      await new Promise(resolve => setTimeout(resolve, 5000))

      // Mock clone result - in real implementation, this would call an AI service
      const mockResult: CloneResult = {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${url} - Cloned by Codiner</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }
        h1 {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .cta-button {
            background: white;
            color: #667eea;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            transition: transform 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to ${url}</h1>
        <p>This website has been cloned and enhanced by Codiner AI</p>
        <a href="#" class="cta-button">Get Started</a>
    </div>
</body>
</html>`,
        css: `/* Cloned and optimized styles */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #ffffff;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: var(--text-color);
  min-height: 100vh;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.hero-section {
  padding: 4rem 0;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 2rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .hero-section {
    padding: 2rem 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }
}`,
        js: `// Enhanced JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            this.innerHTML = '<span class="loading-spinner"></span> Loading...';
            this.style.pointerEvents = 'none';

            // Simulate loading
            setTimeout(() => {
                this.innerHTML = 'Success! 🎉';
                this.style.background = 'rgba(34, 197, 94, 0.2)';
                this.style.borderColor = 'rgba(34, 197, 94, 0.5)';
            }, 2000);
        });
    }

    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.container > *').forEach(section => {
        observer.observe(section);
    });

    // Add dynamic styling based on time
    const hour = new Date().getHours();
    const body = document.body;

    if (hour >= 6 && hour < 12) {
        body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (hour >= 12 && hour < 18) {
        body.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else {
        body.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = \`
    .loading-spinner {
        display: inline-block;
        width: 1em;
        height: 1em;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        margin-right: 0.5em;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
\`;
document.head.appendChild(style);

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(\`Page loaded in \${loadTime.toFixed(2)}ms\`);

    // Send analytics (mock)
    if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', JSON.stringify({
            url: window.location.href,
            loadTime: loadTime,
            userAgent: navigator.userAgent
        }));
    }
});`,
        assets: [
          "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
          "/images/hero-background.jpg",
          "/icons/favicon.ico"
        ],
        metadata: {
          title: `${url} - Cloned by Codiner AI`,
          description: `AI-powered clone of ${url} with enhanced features and modern design`,
          image: "/images/cloned-site-preview.png"
        }
      }

      setCloneResult(mockResult)
      toast({
        title: "🎉 Website Cloned Successfully!",
        description: "Your website has been analyzed and cloned with AI enhancements",
      })
    } catch (error) {
      toast({
        title: "❌ Cloning Failed",
        description: "Unable to clone the website. Please check the URL and try again.",
        variant: "destructive",
      })
    } finally {
      setIsCloning(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <Wand2 className="w-8 h-8 mr-3 text-purple-500" />
            Website Cloner
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            AI-powered website cloning with intelligent code generation
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Zap className="w-3 h-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      </div>

      {/* URL Input */}
      <Card className="card-hover glass border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gradient">Clone Any Website</CardTitle>
          <CardDescription className="text-base">
            Enter a website URL and let AI analyze, clone, and enhance it with modern features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 pr-4 h-14 text-lg input-focus border-2"
              />
            </div>
            <Button
              onClick={handleClone}
              disabled={isCloning}
              size="lg"
              className="btn-gradient shadow-xl h-14 px-8 text-lg font-semibold"
            >
              {isCloning ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Cloning...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Clone Website
                </>
              )}
            </Button>
          </div>

          {isCloning && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 rounded-full px-6 py-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-700 dark:text-blue-300">
                  AI is analyzing the website structure...
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clone Results */}
      {cloneResult && (
        <Card className="card-hover glass border-0 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-2xl text-gradient">
                  <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                  Clone Complete!
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Your website has been cloned with AI enhancements and modern optimizations
                </CardDescription>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="lg" className="border-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Eye className="h-5 w-5 mr-2" />
                  Live Preview
                </Button>
                <Button variant="outline" size="lg" className="border-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Download className="h-5 w-5 mr-2" />
                  Download Code
                </Button>
                <Button size="lg" className="btn-gradient shadow-lg">
                  <Code className="h-5 w-5 mr-2" />
                  Edit in IDE
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-12 bg-white/50 backdrop-blur-sm border border-white/20">
                <TabsTrigger value="preview" className="text-sm font-medium">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="html" className="text-sm font-medium">
                  <Code className="w-4 h-4 mr-2" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="css" className="text-sm font-medium">
                  <Palette className="w-4 h-4 mr-2" />
                  CSS
                </TabsTrigger>
                <TabsTrigger value="js" className="text-sm font-medium">
                  <Zap className="w-4 h-4 mr-2" />
                  JavaScript
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 border-b border-slate-200 dark:border-slate-600 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-sm text-slate-600 dark:text-slate-300 font-mono">
                        {cloneResult.metadata.title}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <iframe
                      srcDoc={cloneResult.html}
                      className="w-full h-80 border-0 rounded-lg"
                      title="Cloned Website Preview"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="html" className="mt-6">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4 z-10"
                    onClick={() => copyToClipboard(cloneResult.html)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <pre className="bg-slate-900 dark:bg-slate-800 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm max-h-96 overflow-y-auto border border-slate-700 shadow-inner">
                    <code dangerouslySetInnerHTML={{
                      __html: cloneResult.html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    }} />
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="css" className="mt-6">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4 z-10"
                    onClick={() => copyToClipboard(cloneResult.css)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <pre className="bg-slate-900 dark:bg-slate-800 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm max-h-96 overflow-y-auto border border-slate-700 shadow-inner font-mono">
                    <code>{cloneResult.css}</code>
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="js" className="mt-6">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4 z-10"
                    onClick={() => copyToClipboard(cloneResult.js)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <pre className="bg-slate-900 dark:bg-slate-800 text-slate-100 p-6 rounded-xl overflow-x-auto text-sm max-h-96 overflow-y-auto border border-slate-700 shadow-inner font-mono">
                    <code>{cloneResult.js}</code>
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Responsive Design</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Automatically optimized for all screen sizes and devices
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AI Enhanced</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Intelligent code improvements and modern best practices
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Live Preview</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              See your cloned website instantly with live updates
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
