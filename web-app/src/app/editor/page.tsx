"use client"

import { useState } from "react"
import { CodeEditor } from "@/components/editor/CodeEditor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Save,
  Share,
  Github,
  Download,
  Upload,
  FileText,
  Settings,
  Zap,
  Code,
  Palette,
  Play,
  Eye,
  Copy,
  RotateCcw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const defaultCode = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome App</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header class="hero">
            <h1>Welcome to Codiner</h1>
            <p>Build amazing apps with AI-powered tools</p>
            <button class="cta-button">Get Started</button>
        </header>

        <main class="features">
            <div class="feature-card">
                <h3>🚀 Fast Development</h3>
                <p>Build apps 10x faster with AI assistance</p>
            </div>
            <div class="feature-card">
                <h3>🎨 Beautiful Design</h3>
                <p>Modern, responsive designs out of the box</p>
            </div>
            <div class="feature-card">
                <h3>⚡ Real-time Preview</h3>
                <p>See changes instantly as you code</p>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
</body>
</html>`,
  css: `/* Modern CSS with Tailwind-like utilities */
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --accent: #f59e0b;
  --text: #1f2937;
  --background: #ffffff;
  --muted: #f3f4f6;
  --border: #e5e7eb;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  border-radius: 1rem;
  color: white;
  margin-bottom: 3rem;
  box-shadow: var(--shadow);
}

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero p {
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 1rem 2rem;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.cta-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: var(--background);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--primary);
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .hero {
    padding: 2rem 1rem;
  }

  .features {
    grid-template-columns: 1fr;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero, .features {
  animation: fadeIn 0.8s ease-out;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }

.feature-card {
  animation-fill-mode: both;
}`,
  js: `// Interactive JavaScript with modern features
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Codiner App Loaded Successfully!');

    // Enhanced CTA Button Functionality
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            // Trigger confetti animation
            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            // Show success message
            showNotification('🎉 Welcome to Codiner! Your journey starts now.', 'success');

            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Feature Card Interactions
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotate(1deg)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });

        // Add click handler
        card.addEventListener('click', function() {
            const titles = ['Fast Development', 'Beautiful Design', 'Real-time Preview'];
            showNotification(\`✨ \${titles[index]} - Coming soon!\`, 'info');
        });
    });

    // Dynamic Background Animation
    let hue = 0;
    setInterval(() => {
        hue = (hue + 0.5) % 360;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.background = \`linear-gradient(135deg, hsl(\${hue}, 70%, 60%) 0%, hsl(\${(hue + 60) % 360}, 70%, 60%) 100%)\`;
        }
    }, 50);

    // Scroll-based Animations
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
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search (placeholder)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showNotification('🔍 Search functionality coming soon!', 'info');
        }

        // Ctrl/Cmd + S for save (placeholder)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            showNotification('💾 Auto-save is always on!', 'success');
        }
    });

    // Performance Monitoring
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(\`📊 Page loaded in \${loadTime.toFixed(2)}ms\`);

        // Simulate analytics
        setTimeout(() => {
            console.log('📈 Analytics: User engaged with CTA button');
        }, 3000);
    });

    // Error Handling
    window.addEventListener('error', function(e) {
        console.error('❌ JavaScript Error:', e.error);
        showNotification('⚠️ Something went wrong. Check the console for details.', 'error');
    });

    // Utility Functions
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        // Create notification element
        const notification = document.createElement('div');
        notification.className = \`notification notification--\${type}\`;
        notification.innerHTML = \`
            <div class="notification__content">
                \${message}
            </div>
            <button class="notification__close">&times;</button>
        \`;

        // Add styles
        notification.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 1000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        \`;

        // Add to page
        document.body.appendChild(notification);

        // Close button
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = \`
        .notification--success { border-color: #10b981; }
        .notification--error { border-color: #ef4444; }
        .notification--info { border-color: #3b82f6; }
        .notification--warning { border-color: #f59e0b; }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }

        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
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
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('🎯 SW registered'))
            .catch(error => console.log('❌ SW registration failed'));
    });
}`,
}

export default function EditorPage() {
  const [currentCode, setCurrentCode] = useState(defaultCode)
  const [activeTab, setActiveTab] = useState('editor')
  const { toast } = useToast()

  const handleCodeChange = (code: { html: string; css: string; js: string }) => {
    setCurrentCode(code)
  }

  const handleSave = () => {
    // In a real app, this would save to database
    localStorage.setItem('codiner-editor-code', JSON.stringify(currentCode))
    toast({
      title: "Code Saved",
      description: "Your code has been saved to local storage",
    })
  }

  const handleLoad = () => {
    const saved = localStorage.getItem('codiner-editor-code')
    if (saved) {
      setCurrentCode(JSON.parse(saved))
      toast({
        title: "Code Loaded",
        description: "Your saved code has been loaded",
      })
    } else {
      toast({
        title: "No Saved Code",
        description: "No previously saved code found",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(currentCode, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = 'codiner-project.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Export Complete",
      description: "Your project has been exported as JSON",
    })
  }

  const handleShare = () => {
    // In a real app, this would create a shareable link
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Share Link Copied",
      description: "Shareable link copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <Code className="w-8 h-8 mr-3 text-blue-500" />
            Code Editor
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Professional code editor with live preview and AI assistance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Zap className="w-3 h-3 mr-1" />
            Monaco Editor
          </Badge>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleLoad}>
              <Upload className="h-4 w-4 mr-2" />
              Load
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-white/50 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="editor" className="text-sm font-medium">
            <Code className="w-4 h-4 mr-2" />
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-sm font-medium">
            <Eye className="w-4 h-4 mr-2" />
            Full Preview
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-sm font-medium">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-sm font-medium">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <CodeEditor
            initialCode={currentCode}
            onCodeChange={handleCodeChange}
            height="700px"
            className="shadow-2xl"
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-6 h-6 mr-3 text-green-500" />
                Full Page Preview
              </CardTitle>
              <CardDescription>
                See your complete application in a full browser window
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-2 mb-4 flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 text-center">
                  <span className="text-sm text-slate-600 dark:text-slate-300 font-mono">
                    codiner.online
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <style>${currentCode.css}</style>
                    </head>
                    <body>${currentCode.html}<script>${currentCode.js}</script></body>
                    </html>
                  `}
                  className="w-full h-[600px] border-0"
                  title="Full Page Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Code Templates
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Start with pre-built templates for common patterns and components
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="card-hover cursor-pointer" onClick={() => setCurrentCode(defaultCode)}>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Landing Page</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Modern landing page with hero section</p>
                </CardContent>
              </Card>

              <Card className="card-hover cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">React Component</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reusable React component template</p>
                </CardContent>
              </Card>

              <Card className="card-hover cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Play className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Interactive Demo</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Interactive demo with animations</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Editor Settings</CardTitle>
              <CardDescription>
                Customize your coding experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Editor Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Font Size</span>
                      <select className="text-sm border rounded px-2 py-1">
                        <option>12px</option>
                        <option>14px</option>
                        <option selected>16px</option>
                        <option>18px</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tab Size</span>
                      <select className="text-sm border rounded px-2 py-1">
                        <option>2 spaces</option>
                        <option selected>4 spaces</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Word Wrap</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Preview Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-refresh</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show Console</span>
                      <input type="checkbox" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile Preview</span>
                      <input type="checkbox" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Bar */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <Button size="sm" className="rounded-full shadow-lg">
          <Zap className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" className="rounded-full shadow-lg bg-white/80 backdrop-blur-sm">
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
