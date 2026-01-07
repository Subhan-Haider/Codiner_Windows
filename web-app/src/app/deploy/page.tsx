"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Rocket,
  Cloud,
  Globe,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Download,
  RefreshCw,
  Zap,
  Shield,
  DollarSign,
  Clock,
  Code,
  Database,
  Smartphone,
  Monitor,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DeploymentEngine, type DeploymentTarget, type DeploymentConfig, type DeploymentResult } from "@/lib/deployment-engine"

export default function DeployPage() {
  const [targets, setTargets] = useState<DeploymentTarget[]>([])
  const [selectedTarget, setSelectedTarget] = useState<string>('')
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    target: '',
    projectName: 'my-codiner-app',
    branch: 'main',
    buildCommand: 'npm run build',
    outputDir: 'dist'
  })
  const [code, setCode] = useState({
    html: '<div class="app"><h1>Hello World</h1><p>Deployed with Codiner!</p></div>',
    css: 'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; } .app { max-width: 800px; margin: 0 auto; }',
    js: 'console.log("App loaded successfully!");'
  })
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([])
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const availableTargets = DeploymentEngine.getDeploymentTargets()
    setTargets(availableTargets)
  }, [])

  const selectedTargetInfo = targets.find(t => t.id === selectedTarget)

  const handleDeploy = async () => {
    if (!selectedTarget || !deploymentConfig.projectName) {
      toast({
        title: "Configuration Required",
        description: "Please select a deployment target and provide a project name",
        variant: "destructive",
      })
      return
    }

    // Validate configuration
    const validation = DeploymentEngine.validateDeploymentConfig({
      ...deploymentConfig,
      target: selectedTarget
    })

    if (!validation.valid) {
      toast({
        title: "Configuration Error",
        description: validation.errors.join(', '),
        variant: "destructive",
      })
      return
    }

    setIsDeploying(true)
    setDeploymentLogs([])
    setDeploymentResult(null)

    try {
      const result = await DeploymentEngine.deploy(code, {
        ...deploymentConfig,
        target: selectedTarget
      }, {
        onProgress: (message) => {
          setDeploymentLogs(prev => [...prev, message])
        },
        onComplete: (result) => {
          setDeploymentResult(result)
          toast({
            title: "Deployment Successful! 🎉",
            description: `Your app is now live at ${result.url}`,
          })
        },
        onError: (error) => {
          toast({
            title: "Deployment Failed",
            description: error,
            variant: "destructive",
          })
        }
      })

      setDeploymentResult(result)
    } catch (error: any) {
      toast({
        title: "Deployment Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const handleCopyUrl = () => {
    if (deploymentResult?.url) {
      navigator.clipboard.writeText(deploymentResult.url)
      toast({
        title: "URL Copied",
        description: "Deployment URL copied to clipboard",
      })
    }
  }

  const getPricingBadge = (pricing: DeploymentTarget['pricing']) => {
    switch (pricing) {
      case 'free':
        return <Badge className="bg-green-100 text-green-800">Free</Badge>
      case 'freemium':
        return <Badge className="bg-blue-100 text-blue-800">Freemium</Badge>
      case 'paid':
        return <Badge className="bg-orange-100 text-orange-800">Paid</Badge>
    }
  }

  const getCategoryIcon = (category: DeploymentTarget['category']) => {
    switch (category) {
      case 'static':
        return <Globe className="w-5 h-5" />
      case 'frontend':
        return <Monitor className="w-5 h-5" />
      case 'backend':
        return <Database className="w-5 h-5" />
      case 'fullstack':
        return <Code className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <Rocket className="w-8 h-8 mr-3 text-blue-500" />
            Deploy Your App
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Deploy your applications to production with one click
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Cloud className="w-3 h-3 mr-1" />
            10+ Platforms
          </Badge>
          <Button variant="outline" onClick={() => setShowConfigDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Quick Deploy Section */}
      <Card className="card-hover glass">
        <CardHeader>
          <CardTitle>Quick Deploy</CardTitle>
          <CardDescription>
            Choose a platform and deploy instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Deployment Target</label>
              <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a platform..." />
                </SelectTrigger>
                <SelectContent>
                  {targets.map((target) => (
                    <SelectItem key={target.id} value={target.id}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{target.icon}</span>
                        <span>{target.name}</span>
                        {getPricingBadge(target.pricing)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Project Name</label>
              <Input
                value={deploymentConfig.projectName}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, projectName: e.target.value }))}
                placeholder="my-awesome-app"
              />
            </div>
          </div>

          {selectedTargetInfo && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{selectedTargetInfo.icon}</span>
                <div>
                  <h4 className="font-semibold">{selectedTargetInfo.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedTargetInfo.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  {getCategoryIcon(selectedTargetInfo.category)}
                  <span className="capitalize">{selectedTargetInfo.category}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Code className="w-4 h-4" />
                  <span>{selectedTargetInfo.supportedLanguages.slice(0, 3).join(', ')}</span>
                </div>
                {getPricingBadge(selectedTargetInfo.pricing)}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleDeploy}
              disabled={isDeploying || !selectedTarget}
              size="lg"
              className="btn-gradient"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5 mr-2" />
                  Deploy Now
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Progress */}
      {(isDeploying || deploymentResult) && (
        <Card className="card-hover glass">
          <CardHeader>
            <CardTitle>Deployment Status</CardTitle>
            <CardDescription>
              {isDeploying ? 'Deploying your application...' : 'Deployment completed'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isDeploying && (
              <div className="space-y-4">
                <Progress value={Math.min((deploymentLogs.length / 10) * 100, 90)} className="h-3" />
                <ScrollArea className="h-48 w-full rounded-md border border-slate-200 dark:border-slate-700">
                  <div className="p-4 space-y-2">
                    {deploymentLogs.map((log, index) => (
                      <div key={index} className="text-sm font-mono text-slate-600 dark:text-slate-400">
                        <span className="text-blue-500">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {deploymentResult && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    deploymentResult.status === 'success'
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {deploymentResult.status === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">
                      {deploymentResult.status === 'success' ? 'Deployment Successful!' : 'Deployment Failed'}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      Duration: {Math.round(deploymentResult.duration / 1000)}s
                    </p>
                  </div>
                </div>

                {deploymentResult.url && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-green-900 dark:text-green-100">Your app is live!</h5>
                        <p className="text-green-700 dark:text-green-300 font-mono text-sm">{deploymentResult.url}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={handleCopyUrl}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" asChild>
                          <a href={deploymentResult.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {deploymentResult.error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <h5 className="font-medium text-red-900 dark:text-red-100">Deployment Error</h5>
                        <p className="text-red-700 dark:text-red-300 text-sm">{deploymentResult.error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <ScrollArea className="h-48 w-full rounded-md border border-slate-200 dark:border-slate-700">
                  <div className="p-4 space-y-2">
                    {deploymentResult.logs.map((log, index) => (
                      <div key={index} className="text-sm font-mono text-slate-600 dark:text-slate-400">
                        <span className="text-blue-500">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Platform Comparison */}
      <Card className="card-hover glass">
        <CardHeader>
          <CardTitle>Choose Your Platform</CardTitle>
          <CardDescription>
            Compare deployment options and find the perfect fit for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targets.slice(0, 6).map((target) => (
              <Card
                key={target.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTarget === target.id
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                onClick={() => setSelectedTarget(target.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{target.icon}</span>
                      <div>
                        <h4 className="font-semibold">{target.name}</h4>
                        <p className="text-sm text-slate-500 capitalize">{target.category}</p>
                      </div>
                    </div>
                    {getPricingBadge(target.pricing)}
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {target.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {target.supportedLanguages.slice(0, 3).map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs capitalize">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Shield className="w-3 h-3" />
                      <span>{target.setupRequired ? 'Setup Required' : 'No Setup'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Deployment Configuration</DialogTitle>
            <DialogDescription>
              Configure advanced deployment settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Repository URL</label>
                <Input
                  value={deploymentConfig.repository}
                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, repository: e.target.value }))}
                  placeholder="https://github.com/user/repo"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Branch</label>
                <Input
                  value={deploymentConfig.branch}
                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, branch: e.target.value }))}
                  placeholder="main"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Build Command</label>
                <Input
                  value={deploymentConfig.buildCommand}
                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, buildCommand: e.target.value }))}
                  placeholder="npm run build"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Output Directory</label>
                <Input
                  value={deploymentConfig.outputDir}
                  onChange={(e) => setDeploymentConfig(prev => ({ ...prev, outputDir: e.target.value }))}
                  placeholder="dist"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Custom Domain</label>
              <Input
                value={deploymentConfig.domain}
                onChange={(e) => setDeploymentConfig(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="myapp.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Environment Variables</label>
              <Textarea
                value={Object.entries(deploymentConfig.environmentVariables || {})
                  .map(([key, value]) => `${key}=${value}`)
                  .join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n')
                  const envVars: Record<string, string> = {}
                  lines.forEach(line => {
                    const [key, ...valueParts] = line.split('=')
                    if (key && valueParts.length > 0) {
                      envVars[key.trim()] = valueParts.join('=').trim()
                    }
                  })
                  setDeploymentConfig(prev => ({ ...prev, environmentVariables: envVars }))
                }}
                placeholder={`NODE_ENV=production\nAPI_KEY=your-api-key`}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowConfigDialog(false)}>
                Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
