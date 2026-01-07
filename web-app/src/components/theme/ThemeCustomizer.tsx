"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Palette,
  Plus,
  Save,
  Trash2,
  Copy,
  Download,
  Upload,
  Eye,
  Settings,
  RefreshCw,
  CheckCircle,
  X,
} from "lucide-react"
import { useTheme, type Theme, type ThemeColors } from "@/lib/theme/theme-manager"
import { useToast } from "@/hooks/use-toast"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
}

function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [isValid, setIsValid] = useState(true)

  const handleChange = (newValue: string) => {
    // Basic color validation
    const isValidColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^hsl\(\d+,\s*\d+%,\s*\d+%\)$|^rgb\(\d+,\s*\d+,\s*\d+\)$/.test(newValue)
    setIsValid(isValidColor)
    if (isValidColor) {
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center space-x-2">
        <div
          className="w-8 h-8 rounded border-2 border-white shadow-sm"
          style={{ backgroundColor: isValid ? value : '#ff0000' }}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={`font-mono text-sm ${!isValid ? 'border-red-500' : ''}`}
          placeholder="#000000 or hsl(0, 0%, 0%)"
        />
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {!isValid && (
        <p className="text-xs text-red-500">Invalid color format</p>
      )}
    </div>
  )
}

interface GradientEditorProps {
  gradients: ThemeColors['gradient']
  onChange: (gradients: ThemeColors['gradient']) => void
}

function GradientEditor({ gradients, onChange }: GradientEditorProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Gradient Colors</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ColorPicker
          label="Primary Gradient"
          value={gradients.primary}
          onChange={(value) => onChange({ ...gradients, primary: value })}
          description="Used for primary buttons and highlights"
        />
        <ColorPicker
          label="Secondary Gradient"
          value={gradients.secondary}
          onChange={(value) => onChange({ ...gradients, secondary: value })}
          description="Used for secondary elements"
        />
        <ColorPicker
          label="Accent Gradient"
          value={gradients.accent}
          onChange={(value) => onChange({ ...gradients, accent: value })}
          description="Used for accent elements and links"
        />
      </div>
    </div>
  )
}

interface FontSelectorProps {
  fonts: Theme['fonts']
  onChange: (fonts: Theme['fonts']) => void
}

function FontSelector({ fonts, onChange }: FontSelectorProps) {
  const fontOptions = [
    { value: 'Inter, system-ui, sans-serif', label: 'Inter (Default)' },
    { value: 'system-ui, sans-serif', label: 'System UI' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
    { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  ]

  const monoFontOptions = [
    { value: 'JetBrains Mono, Monaco, Consolas, monospace', label: 'JetBrains Mono (Default)' },
    { value: 'Fira Code, Monaco, Consolas, monospace', label: 'Fira Code' },
    { value: 'Source Code Pro, Monaco, Consolas, monospace', label: 'Source Code Pro' },
    { value: 'Monaco, Consolas, monospace', label: 'Monaco' },
    { value: 'Consolas, Monaco, monospace', label: 'Consolas' },
    { value: 'Courier New, monospace', label: 'Courier New' },
  ]

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Typography</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Body Font</Label>
          <Select
            value={fonts.body}
            onValueChange={(value) => onChange({ ...fonts, body: value })}
          >
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Heading Font</Label>
          <Select
            value={fonts.heading}
            onValueChange={(value) => onChange({ ...fonts, heading: value })}
          >
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Monospace Font</Label>
          <Select
            value={fonts.mono}
            onValueChange={(value) => onChange({ ...fonts, mono: value })}
          >
            <SelectContent>
              {monoFontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export function ThemeCustomizer() {
  const { theme: currentTheme, getAvailableThemes, addCustomTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [customThemes, setCustomThemes] = useState<Theme[]>([])
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load custom themes from localStorage
    const saved = localStorage.getItem('custom-themes')
    if (saved) {
      setCustomThemes(JSON.parse(saved))
    }
  }, [])

  const createNewTheme = (): Theme => {
    const baseTheme = currentTheme || getAvailableThemes()[0]
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: 'My Custom Theme',
      mode: 'light',
      variant: 'default',
      fonts: { ...baseTheme.fonts },
      borderRadius: '0.5rem',
      animations: true,
      colors: {
        light: { ...baseTheme.colors.light },
        dark: { ...baseTheme.colors.dark }
      }
    }
    return newTheme
  }

  const startCreating = () => {
    setEditingTheme(createNewTheme())
    setIsCreating(true)
  }

  const startEditing = (theme: Theme) => {
    setEditingTheme({ ...theme })
    setIsCreating(false)
  }

  const saveTheme = () => {
    if (!editingTheme) return

    const updatedThemes = isCreating
      ? [...customThemes, editingTheme]
      : customThemes.map(t => t.id === editingTheme.id ? editingTheme : t)

    setCustomThemes(updatedThemes)
    localStorage.setItem('custom-themes', JSON.stringify(updatedThemes))

    // Add to theme manager
    addCustomTheme(editingTheme)

    toast({
      title: "Theme Saved",
      description: `"${editingTheme.name}" has been saved successfully`,
    })

    setEditingTheme(null)
    setIsCreating(false)
  }

  const deleteTheme = (themeId: string) => {
    const updatedThemes = customThemes.filter(t => t.id !== themeId)
    setCustomThemes(updatedThemes)
    localStorage.setItem('custom-themes', JSON.stringify(updatedThemes))

    toast({
      title: "Theme Deleted",
      description: "Custom theme has been removed",
    })
  }

  const exportTheme = (theme: Theme) => {
    const dataStr = JSON.stringify(theme, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Theme Exported",
      description: "Theme file has been downloaded",
    })
  }

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const theme = JSON.parse(e.target?.result as string) as Theme
        const updatedThemes = [...customThemes, theme]
        setCustomThemes(updatedThemes)
        localStorage.setItem('custom-themes', JSON.stringify(updatedThemes))
        addCustomTheme(theme)

        toast({
          title: "Theme Imported",
          description: `"${theme.name}" has been imported successfully`,
        })
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid theme file format",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  if (!currentTheme) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          Customize Theme
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Theme Customizer</DialogTitle>
          <DialogDescription>
            Create and customize your own themes with custom colors, fonts, and styles
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-4 h-[600px]">
          {/* Theme List */}
          <div className="w-80 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Themes</CardTitle>
                <div className="flex space-x-2">
                  <Button onClick={startCreating} size="sm" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <label>
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                      <input
                        type="file"
                        accept=".json"
                        onChange={importTheme}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="space-y-2 p-4">
                    {customThemes.map((theme) => (
                      <div
                        key={theme.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => startEditing(theme)}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: theme.colors.light.primary }}
                          />
                          <span className="text-sm font-medium">{theme.name}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              exportTheme(theme)
                            }}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTheme(theme.id)
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {customThemes.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No custom themes yet</p>
                        <p className="text-xs">Create your first theme to get started</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Theme Editor */}
          <div className="flex-1">
            {editingTheme ? (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {isCreating ? 'Create New Theme' : 'Edit Theme'}
                      </CardTitle>
                      <CardDescription>
                        Customize colors, fonts, and other theme properties
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={saveTheme} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Theme
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingTheme(null)}
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="colors" className="h-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="colors">Colors</TabsTrigger>
                      <TabsTrigger value="fonts">Fonts</TabsTrigger>
                      <TabsTrigger value="gradients">Gradients</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="colors" className="mt-4">
                      <ScrollArea className="h-96">
                        <div className="space-y-6">
                          {/* Basic Info */}
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Theme Name</Label>
                                <Input
                                  value={editingTheme.name}
                                  onChange={(e) => setEditingTheme({
                                    ...editingTheme,
                                    name: e.target.value
                                  })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Border Radius</Label>
                                <Select
                                  value={editingTheme.borderRadius}
                                  onValueChange={(value) => setEditingTheme({
                                    ...editingTheme,
                                    borderRadius: value
                                  })}
                                >
                                  <SelectContent>
                                    <SelectItem value="0px">Sharp</SelectItem>
                                    <SelectItem value="0.25rem">Small</SelectItem>
                                    <SelectItem value="0.5rem">Medium</SelectItem>
                                    <SelectItem value="0.75rem">Large</SelectItem>
                                    <SelectItem value="1rem">Extra Large</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Light Mode Colors */}
                          <div>
                            <h4 className="font-medium mb-4 flex items-center">
                              <Sun className="w-4 h-4 mr-2" />
                              Light Mode Colors
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <ColorPicker
                                label="Background"
                                value={editingTheme.colors.light.background}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    light: { ...editingTheme.colors.light, background: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Foreground"
                                value={editingTheme.colors.light.foreground}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    light: { ...editingTheme.colors.light, foreground: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Primary"
                                value={editingTheme.colors.light.primary}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    light: { ...editingTheme.colors.light, primary: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Secondary"
                                value={editingTheme.colors.light.secondary}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    light: { ...editingTheme.colors.light, secondary: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Accent"
                                value={editingTheme.colors.light.accent}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    light: { ...editingTheme.colors.light, accent: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Border"
                                value={editingTheme.colors.light.border}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    light: { ...editingTheme.colors.light, border: value }
                                  }
                                })}
                              />
                            </div>
                          </div>

                          {/* Dark Mode Colors */}
                          <div>
                            <h4 className="font-medium mb-4 flex items-center">
                              <Moon className="w-4 h-4 mr-2" />
                              Dark Mode Colors
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <ColorPicker
                                label="Background"
                                value={editingTheme.colors.dark.background}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    dark: { ...editingTheme.colors.dark, background: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Foreground"
                                value={editingTheme.colors.dark.foreground}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    dark: { ...editingTheme.colors.dark, foreground: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Primary"
                                value={editingTheme.colors.dark.primary}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    dark: { ...editingTheme.colors.dark, primary: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Secondary"
                                value={editingTheme.colors.dark.secondary}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    dark: { ...editingTheme.colors.dark, secondary: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Accent"
                                value={editingTheme.colors.dark.accent}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    dark: { ...editingTheme.colors.dark, accent: value }
                                  }
                                })}
                              />
                              <ColorPicker
                                label="Border"
                                value={editingTheme.colors.dark.border}
                                onChange={(value) => setEditingTheme({
                                  ...editingTheme,
                                  colors: {
                                    ...editingTheme.colors,
                                    dark: { ...editingTheme.colors.dark, border: value }
                                  }
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="fonts" className="mt-4">
                      <FontSelector
                        fonts={editingTheme.fonts}
                        onChange={(fonts) => setEditingTheme({ ...editingTheme, fonts })}
                      />
                    </TabsContent>

                    <TabsContent value="gradients" className="mt-4">
                      <GradientEditor
                        gradients={editingTheme.colors.light.gradient}
                        onChange={(gradient) => setEditingTheme({
                          ...editingTheme,
                          colors: {
                            ...editingTheme.colors,
                            light: { ...editingTheme.colors.light, gradient },
                            dark: { ...editingTheme.colors.dark, gradient }
                          }
                        })}
                      />
                    </TabsContent>

                    <TabsContent value="settings" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="animations"
                            checked={editingTheme.animations}
                            onChange={(e) => setEditingTheme({
                              ...editingTheme,
                              animations: e.target.checked
                            })}
                          />
                          <Label htmlFor="animations">Enable animations</Label>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Theme ID</Label>
                          <Input
                            value={editingTheme.id}
                            onChange={(e) => setEditingTheme({
                              ...editingTheme,
                              id: e.target.value
                            })}
                            className="font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Unique identifier for this theme
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Theme Selected</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a theme to edit or create a new one
                  </p>
                  <Button onClick={startCreating}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Theme
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
