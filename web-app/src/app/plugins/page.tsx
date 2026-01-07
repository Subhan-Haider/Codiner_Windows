"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Download,
  Settings,
  Star,
  Users,
  Zap,
  Code,
  Palette,
  Database,
  Cloud,
  Wrench,
  Puzzle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Info,
  Crown,
  DollarSign,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { pluginManager, type Plugin } from "@/lib/plugin-system"

const categoryIcons = {
  editor: Code,
  ai: Zap,
  deployment: Cloud,
  theme: Palette,
  integration: Wrench,
  utility: Settings,
}

const categoryColors = {
  editor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  ai: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  deployment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  theme: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  integration: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  utility: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [installedPlugins, setInstalledPlugins] = useState<Plugin[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadPlugins()
  }, [])

  const loadPlugins = async () => {
    setIsLoading(true)
    try {
      const availablePlugins = await pluginManager.discoverPlugins()
      const installed = pluginManager.getInstalledPlugins()

      setPlugins(availablePlugins)
      setInstalledPlugins(installed)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load plugins",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInstallPlugin = async (plugin: Plugin) => {
    try {
      const success = await pluginManager.installPlugin(plugin.id)
      if (success) {
        toast({
          title: "Plugin Installed",
          description: `${plugin.name} has been installed successfully`,
        })
        loadPlugins()
      }
    } catch (error: any) {
      toast({
        title: "Installation Failed",
        description: error.message || "Failed to install plugin",
        variant: "destructive",
      })
    }
  }

  const handleUninstallPlugin = async (plugin: Plugin) => {
    try {
      const success = await pluginManager.uninstallPlugin(plugin.id)
      if (success) {
        toast({
          title: "Plugin Uninstalled",
          description: `${plugin.name} has been uninstalled`,
        })
        loadPlugins()
      }
    } catch (error) {
      toast({
        title: "Uninstallation Failed",
        description: "Failed to uninstall plugin",
        variant: "destructive",
      })
    }
  }

  const handleTogglePlugin = async (plugin: Plugin) => {
    try {
      if (plugin.isEnabled) {
        await pluginManager.disablePlugin(plugin.id)
        toast({
          title: "Plugin Disabled",
          description: `${plugin.name} has been disabled`,
        })
      } else {
        await pluginManager.enablePlugin(plugin.id)
        toast({
          title: "Plugin Enabled",
          description: `${plugin.name} has been enabled`,
        })
      }
      loadPlugins()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle plugin",
        variant: "destructive",
      })
    }
  }

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getPluginStatus = (plugin: Plugin) => {
    if (plugin.isInstalled && plugin.isEnabled) return 'active'
    if (plugin.isInstalled && !plugin.isEnabled) return 'installed'
    return 'available'
  }

  const getStatusBadge = (plugin: Plugin) => {
    const status = getPluginStatus(plugin)
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'installed':
        return <Badge className="bg-yellow-100 text-yellow-800">Installed</Badge>
      default:
        return <Badge variant="outline">Available</Badge>
    }
  }

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <Puzzle className="w-8 h-8 mr-3 text-purple-500" />
            Plugin System
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Extend Codiner with powerful plugins and integrations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Zap className="w-3 h-3 mr-1" />
            {installedPlugins.length} Active
          </Badge>
          <Button variant="outline" onClick={loadPlugins} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">{plugins.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Available Plugins</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{installedPlugins.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Installed</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {installedPlugins.filter(p => p.isEnabled).length}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {plugins.filter(p => p.price > 0).length}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Premium</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-white/50 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="browse" className="text-sm font-medium">
            <Search className="w-4 h-4 mr-2" />
            Browse Plugins
          </TabsTrigger>
          <TabsTrigger value="installed" className="text-sm font-medium">
            <Download className="w-4 h-4 mr-2" />
            My Plugins
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-sm font-medium">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Browse Plugins */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card className="card-hover glass">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search plugins..."
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
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="ai">AI & ML</SelectItem>
                    <SelectItem value="deployment">Deployment</SelectItem>
                    <SelectItem value="theme">Themes</SelectItem>
                    <SelectItem value="integration">Integrations</SelectItem>
                    <SelectItem value="utility">Utilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Plugin Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlugins.map((plugin) => {
              const CategoryIcon = categoryIcons[plugin.category]
              const status = getPluginStatus(plugin)

              return (
                <Card key={plugin.id} className="card-hover glass group overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          categoryColors[plugin.category]
                        }`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                            {plugin.name}
                          </CardTitle>
                          <p className="text-sm text-slate-500 dark:text-slate-400">by {plugin.author}</p>
                        </div>
                      </div>
                      {getStatusBadge(plugin)}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-2">
                      {plugin.description}
                    </CardDescription>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {plugin.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {plugin.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{plugin.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Price and Version */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {plugin.price === 0 ? (
                          <Badge className="bg-green-100 text-green-800">Free</Badge>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                              {plugin.price}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">v{plugin.version}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      {status === 'available' && (
                        <Button
                          className="flex-1 btn-gradient"
                          onClick={() => handleInstallPlugin(plugin)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Install
                        </Button>
                      )}

                      {status === 'installed' && (
                        <>
                          <Switch
                            checked={plugin.isEnabled}
                            onCheckedChange={() => handleTogglePlugin(plugin)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUninstallPlugin(plugin)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Uninstall
                          </Button>
                        </>
                      )}

                      {status === 'active' && (
                        <>
                          <Switch
                            checked={plugin.isEnabled}
                            onCheckedChange={() => handleTogglePlugin(plugin)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPlugin(plugin)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPlugin(plugin)}
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredPlugins.length === 0 && (
            <div className="text-center py-12">
              <Puzzle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No plugins found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search criteria or browse all categories
              </p>
            </div>
          )}
        </TabsContent>

        {/* My Plugins */}
        <TabsContent value="installed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Installed Plugins ({installedPlugins.length})
              </CardTitle>
              <CardDescription>
                Manage your installed plugins and their settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {installedPlugins.length === 0 ? (
                <div className="text-center py-12">
                  <Download className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No plugins installed
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Browse the plugin store to find extensions for Codiner
                  </p>
                  <Button onClick={() => document.querySelector('[value="browse"]')?.click()}>
                    Browse Plugins
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {installedPlugins.map((plugin) => {
                    const CategoryIcon = categoryIcons[plugin.category]

                    return (
                      <div key={plugin.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            categoryColors[plugin.category]
                          }`}>
                            <CategoryIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">{plugin.name}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{plugin.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-slate-500">v{plugin.version}</span>
                              {getStatusBadge(plugin)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={plugin.isEnabled}
                            onCheckedChange={() => handleTogglePlugin(plugin)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPlugin(plugin)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUninstallPlugin(plugin)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plugin Settings</CardTitle>
              <CardDescription>
                Configure plugin behavior and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-update plugins</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Automatically update plugins when new versions are available
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow beta plugins</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Show and allow installation of beta and experimental plugins
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Plugin analytics</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Allow plugins to send anonymous usage analytics
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h4 className="font-medium mb-4">Plugin Permissions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">File system access</span>
                    <Badge variant="outline">Required</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Network requests</span>
                    <Badge className="bg-green-100 text-green-800">Allowed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Local storage</span>
                    <Badge className="bg-green-100 text-green-800">Allowed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Editor access</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Ask First</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plugin Details Modal */}
      {selectedPlugin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${
                    categoryColors[selectedPlugin.category]
                  }`}>
                    {React.createElement(categoryIcons[selectedPlugin.category], {
                      className: "w-6 h-6"
                    })}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedPlugin.name}</CardTitle>
                    <p className="text-slate-500 dark:text-slate-400">by {selectedPlugin.author}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlugin(null)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-slate-600 dark:text-slate-400">{selectedPlugin.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Version</h4>
                  <p className="text-sm">{selectedPlugin.version}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">License</h4>
                  <p className="text-sm">{selectedPlugin.license}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedPlugin.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="justify-center">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedPlugin.dependencies.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Dependencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlugin.dependencies.map((dep) => (
                      <Badge key={dep} variant="secondary">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedPlugin.settings && selectedPlugin.settings.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Settings</h4>
                  <div className="space-y-3">
                    {selectedPlugin.settings.map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">{setting.label}</label>
                          {setting.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">{setting.description}</p>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Default: {setting.default}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                {selectedPlugin.homepage && (
                  <Button variant="outline" asChild>
                    <a href={selectedPlugin.homepage} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Homepage
                    </a>
                  </Button>
                )}
                {selectedPlugin.repository && (
                  <Button variant="outline" asChild>
                    <a href={selectedPlugin.repository} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Repository
                    </a>
                  </Button>
                )}
                <Button onClick={() => setSelectedPlugin(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
