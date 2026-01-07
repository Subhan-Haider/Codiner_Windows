"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { Github, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'signin' | 'signup'
}

type AuthStep = 'auth' | 'verify' | 'success'

export function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [authStep, setAuthStep] = useState<AuthStep>('auth')
  const [showPassword, setShowPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
  })

  const { signIn, signUp, signInWithProvider, loading } = useAuth()
  const { toast } = useToast()

  // Countdown timer for verification code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendVerificationCode = async () => {
    // Simulate sending verification code
    setCountdown(60)
    toast({
      title: 'Verification Code Sent',
      description: `We've sent a verification code to ${formData.email}`,
    })
  }

  const handleVerifyCode = async () => {
    if (verificationCode.length === 6) {
      // Simulate verification
      setAuthStep('success')
      setTimeout(() => {
        onClose()
        toast({
          title: 'Welcome to Codiner!',
          description: 'Your account has been verified successfully.',
        })
      }, 2000)
    } else {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a valid 6-digit verification code.',
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: 'Error',
          description: 'Passwords do not match',
          variant: 'destructive',
        })
        return
      }

      if (formData.password.length < 6) {
        toast({
          title: 'Error',
          description: 'Password must be at least 6 characters',
          variant: 'destructive',
        })
        return
      }

      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        username: formData.username,
      })

      if (!error) {
        setAuthStep('verify')
        handleSendVerificationCode()
      }
    } else {
      const { error } = await signIn(formData.email, formData.password)

      if (!error) {
        onClose()
      }
    }
  }

  const handleProviderSignIn = async (provider: 'github' | 'google') => {
    const { error } = await signInWithProvider(provider)

    if (!error) {
      onClose()
    }
  }

  // Reset to auth step when modal opens
  useEffect(() => {
    if (isOpen) {
      setAuthStep('auth')
      setActiveTab(defaultTab)
      setVerificationCode('')
    }
  }, [isOpen, defaultTab])

  const getStepTitle = () => {
    switch (authStep) {
      case 'auth':
        return 'Welcome to Codiner'
      case 'verify':
        return 'Verify Your Email'
      case 'success':
        return 'Account Verified!'
      default:
        return 'Welcome to Codiner'
    }
  }

  const getStepDescription = () => {
    switch (authStep) {
      case 'auth':
        return 'Build amazing apps with AI-powered tools'
      case 'verify':
        return `We've sent a verification code to ${formData.email}`
      case 'success':
        return 'Your account has been successfully verified'
      default:
        return 'Build amazing apps with AI-powered tools'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass border-0 shadow-2xl">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            {authStep === 'success' ? (
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            ) : authStep === 'verify' ? (
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-gradient">
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-center">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        {authStep === 'auth' && (
          <>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
              </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="signup" className="space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            {activeTab === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full btn-gradient shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {activeTab === 'signin' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleProviderSignIn('github')}
              disabled={loading}
              className="border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              onClick={() => handleProviderSignIn('google')}
              disabled={loading}
              className="border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
          </div>

            {activeTab === 'signin' && (
              <div className="text-center mt-4">
                <Button variant="link" className="text-sm text-slate-600 dark:text-slate-400">
                  Forgot your password?
                </Button>
              </div>
            )}
          </Tabs>
          </>
        )}

        {authStep === 'verify' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="verificationCode" className="text-center block">
                Enter Verification Code
              </Label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              />
              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                Didn't receive the code?{' '}
                {countdown > 0 ? (
                  <span className="text-slate-500">Resend in {countdown}s</span>
                ) : (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-700"
                    onClick={handleSendVerificationCode}
                  >
                    Resend Code
                  </Button>
                )}
              </div>
            </div>

            <Button
              onClick={handleVerifyCode}
              className="w-full btn-gradient shadow-lg"
              disabled={verificationCode.length !== 6}
            >
              Verify Email
            </Button>

            <Button
              variant="link"
              className="w-full text-sm"
              onClick={() => setAuthStep('auth')}
            >
              ← Back to Sign Up
            </Button>
          </div>
        )}

        {authStep === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                Account Verified Successfully!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Welcome to Codiner. You can now start building amazing apps with AI.
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              ✓ Email Verified
            </Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
