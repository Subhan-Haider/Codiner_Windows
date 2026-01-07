"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  User,
  Settings,
  Key,
  Shield,
  Bell,
  Palette,
  Code,
  BarChart3,
  Trophy,
  CreditCard,
  Download,
  Users,
  Rocket,
  Zap,
  Edit,
  Camera,
  Globe,
  MapPin,
  Building,
  Calendar,
  Clock,
  Star,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { authService, type UserProfile, type UserPreferences, type UserStats } from "@/lib/auth/auth-service"

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setIsLoading(true)
    try {
      const session = await authService.initialize()
      setProfile(session.profile)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return

    setIsSaving(true)
    try {
      const updatedProfile = await authService.updateUserProfile(profile.id, updates)
      if (updatedProfile) {
        setProfile(updatedProfile)
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!profile) return

    await updateProfile({
      preferences: {
        ...profile.preferences,
        ...preferences
      }
    })
  }

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      const result = await authService.updatePassword(newPassword)
      if (result.success) {
        toast({
          title: "Password Updated",
          description: "Your password has been changed successfully",
        })
        setShowPasswordDialog(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update password",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      })
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge className="bg-red-100 text-red-800">Admin</Badge>
      case 'moderator': return <Badge className="bg-orange-100 text-orange-800">Moderator</Badge>
      case 'pro': return <Badge className="bg-blue-100 text-blue-800">Pro User</Badge>
      default: return <Badge className="bg-gray-100 text-gray-800">User</Badge>
    }
  }

  const getCreditUsage = () => {
    if (!profile) return { used: 0, total: 100, percentage: 0 }

    const used = profile.stats.ai_requests
    const total = profile.credits + used // Total available credits
    const percentage = (used / total) * 100

    return { used, total, percentage }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We couldn't load your profile. Please try refreshing the page.
            </p>
            <Button onClick={loadProfile}>Refresh</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const creditUsage = getCreditUsage()

  return (
    <div className="min-h-screen space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback className="text-lg">
              {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {profile.full_name}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">@{profile.username}</p>
            <div className="flex items-center space-x-2 mt-2">
              {getRoleBadge(profile.role)}
              <Badge className={getPlanColor(profile.plan)}>
                {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)} Plan
              </Badge>
              {!profile.is_email_verified && (
                <Badge variant="outline" className="text-yellow-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Email Not Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {profile.stats.projects_created}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Projects Created</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {profile.stats.deployments_made}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Deployments</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {profile.stats.ai_requests}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">AI Requests</p>
          </CardContent>
        </Card>

        <Card className="card-hover glass text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {profile.stats.reputation_score}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reputation</p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Usage */}
      <Card className="card-hover glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            AI Credits
          </CardTitle>
          <CardDescription>
            Your current credit usage and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Credits Used</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {creditUsage.used} / {creditUsage.total}
              </span>
            </div>
            <Progress value={creditUsage.percentage} className="h-3" />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{creditUsage.used} used</span>
              <span>{creditUsage.total - creditUsage.used} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-white/50 backdrop-blur-sm border border-white/20">
          <TabsTrigger value="overview" className="text-sm font-medium">
            <User className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-sm font-medium">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-sm font-medium">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-sm font-medium">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => setProfile(prev => prev ? {...prev, full_name: e.target.value} : null)}
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Username</label>
                  <Input
                    value={profile.username}
                    onChange={(e) => setProfile(prev => prev ? {...prev, username: e.target.value} : null)}
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    value={profile.email}
                    disabled
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Bio</label>
                  <Textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, bio: e.target.value} : null)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    disabled={isSaving}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Website</label>
                    <Input
                      value={profile.website || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, website: e.target.value} : null)}
                      placeholder="https://..."
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Location</label>
                    <Input
                      value={profile.location || ''}
                      onChange={(e) => setProfile(prev => prev ? {...prev, location: e.target.value} : null)}
                      placeholder="City, Country"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Company</label>
                  <Input
                    value={profile.company || ''}
                    onChange={(e) => setProfile(prev => prev ? {...prev, company: e.target.value} : null)}
                    placeholder="Company name"
                    disabled={isSaving}
                  />
                </div>

                <Button
                  onClick={() => updateProfile(profile)}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Code className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Projects Created</p>
                      <p className="text-sm text-slate-500">Total projects built</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{profile.stats.projects_created}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Templates Used</p>
                      <p className="text-sm text-slate-500">Templates downloaded</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{profile.stats.templates_used}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Rocket className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Deployments</p>
                      <p className="text-sm text-slate-500">Apps deployed</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{profile.stats.deployments_made}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Collaborators</p>
                      <p className="text-sm text-slate-500">Team members</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold">{profile.stats.collaborators}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your Codiner experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme</label>
                  <Select
                    value={profile.preferences.theme}
                    onValueChange={(value) => updatePreferences({ theme: value as any })}
                  >
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <Select
                    value={profile.preferences.language}
                    onValueChange={(value) => updatePreferences({ language: value })}
                  >
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Font Size</label>
                  <Select
                    value={profile.preferences.font_size.toString()}
                    onValueChange={(value) => updatePreferences({ font_size: parseInt(value) })}
                  >
                    <SelectContent>
                      <SelectItem value="12">12px</SelectItem>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                      <SelectItem value="20">20px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-slate-500">Receive email updates</p>
                    </div>
                    <Switch
                      checked={profile.preferences.email_notifications}
                      onCheckedChange={(checked) => updatePreferences({ email_notifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">AI Suggestions</label>
                      <p className="text-xs text-slate-500">Show AI-powered suggestions</p>
                    </div>
                    <Switch
                      checked={profile.preferences.ai_suggestions}
                      onCheckedChange={(checked) => updatePreferences({ ai_suggestions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Auto Save</label>
                      <p className="text-xs text-slate-500">Automatically save changes</p>
                    </div>
                    <Switch
                      checked={profile.preferences.auto_save}
                      onCheckedChange={(checked) => updatePreferences({ auto_save: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editor Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Editor Settings</CardTitle>
                <CardDescription>
                  Configure your code editor preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tab Size</label>
                  <Select
                    value={profile.preferences.tab_size.toString()}
                    onValueChange={(value) => updatePreferences({ tab_size: parseInt(value) })}
                  >
                    <SelectContent>
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Word Wrap</label>
                      <p className="text-xs text-slate-500">Wrap long lines</p>
                    </div>
                    <Switch
                      checked={profile.preferences.word_wrap}
                      onCheckedChange={(checked) => updatePreferences({ word_wrap: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Minimap</label>
                      <p className="text-xs text-slate-500">Show code minimap</p>
                    </div>
                    <Switch
                      checked={profile.preferences.minimap}
                      onCheckedChange={(checked) => updatePreferences({ minimap: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Line Numbers</label>
                      <p className="text-xs text-slate-500">Show line numbers</p>
                    </div>
                    <Switch
                      checked={profile.preferences.line_numbers}
                      onCheckedChange={(checked) => updatePreferences({ line_numbers: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>
                Your accomplishments and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'first-project', name: 'First Project', description: 'Created your first project', icon: '🚀', unlocked: profile.stats.projects_created > 0 },
                  { id: 'ai-expert', name: 'AI Expert', description: 'Made 100+ AI requests', icon: '🤖', unlocked: profile.stats.ai_requests >= 100 },
                  { id: 'deployer', name: 'Deployer', description: 'Deployed 10+ applications', icon: '🚀', unlocked: profile.stats.deployments_made >= 10 },
                  { id: 'collaborator', name: 'Collaborator', description: 'Worked with 5+ team members', icon: '👥', unlocked: profile.stats.collaborators >= 5 },
                  { id: 'template-creator', name: 'Template Creator', description: 'Published a template', icon: '📦', unlocked: profile.role === 'pro' || profile.role === 'admin' },
                  { id: 'early-adopter', name: 'Early Adopter', description: 'Joined during beta', icon: '⭐', unlocked: true },
                ].map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 border rounded-lg ${
                      achievement.unlocked
                        ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
                        : 'border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className={`font-medium ${achievement.unlocked ? 'text-yellow-900 dark:text-yellow-100' : 'text-slate-600 dark:text-slate-400'}`}>
                          {achievement.name}
                        </h4>
                        <p className={`text-sm ${achievement.unlocked ? 'text-yellow-700 dark:text-yellow-200' : 'text-slate-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium capitalize">{profile.plan} Plan</span>
                    <Badge className={getPlanColor(profile.plan)}>
                      Active
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Projects</span>
                      <span>{profile.plan === 'free' ? '5' : profile.plan === 'pro' ? '25' : 'Unlimited'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>AI Requests/Day</span>
                      <span>{profile.plan === 'free' ? '50' : profile.plan === 'pro' ? '500' : 'Unlimited'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Deployments/Month</span>
                      <span>{profile.plan === 'free' ? '3' : profile.plan === 'pro' ? '50' : 'Unlimited'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Storage</span>
                      <span>{profile.plan === 'free' ? '1GB' : profile.plan === 'pro' ? '5GB' : '50GB'}</span>
                    </div>
                  </div>

                  {profile.plan !== 'enterprise' && (
                    <Button className="w-full">
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>AI Requests</span>
                      <span>{profile.stats.ai_requests}/500</span>
                    </div>
                    <Progress value={(profile.stats.ai_requests / 500) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Deployments</span>
                      <span>{profile.stats.deployments_made}/50</span>
                    </div>
                    <Progress value={(profile.stats.deployments_made / 50) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage Used</span>
                      <span>2.3GB / 5GB</span>
                    </div>
                    <Progress value={46} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>

          <PasswordChangeForm
            onSubmit={handlePasswordChange}
            onCancel={() => setShowPasswordDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PasswordChangeForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (currentPassword: string, newPassword: string) => void
  onCancel: () => void
}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      // Show error
      return
    }

    setIsSubmitting(true)
    await onSubmit(currentPassword, newPassword)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Current Password</label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">New Password</label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Confirm New Password</label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </Button>
      </div>
    </form>
  )
}
