"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Github, Loader2, CheckCircle, X } from 'lucide-react'
import { useGitHubAuth } from '@/hooks/useGitHubAuth'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface GitHubConnectButtonProps {
  variant?: 'button' | 'card'
  className?: string
}

export function GitHubConnectButton({
  variant = 'button',
  className = ''
}: GitHubConnectButtonProps) {
  const { user, isAuthenticated, loading, connectGitHub, disconnectGitHub } = useGitHubAuth()
  const { toast } = useToast()
  const [disconnecting, setDisconnecting] = useState(false)

  const handleConnect = async () => {
    try {
      await connectGitHub()
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to GitHub. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      await disconnectGitHub()
      toast({
        title: 'Disconnected',
        description: 'Successfully disconnected from GitHub.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disconnect from GitHub.',
        variant: 'destructive'
      })
    } finally {
      setDisconnecting(false)
    }
  }

  if (variant === 'card') {
    return (
      <Card className={`bg-card/50 backdrop-blur-lg border border-border/40 shadow-lg hover:shadow-xl transition-shadow duration-200 ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border border-zinc-500/10">
                <Github className="h-6 w-6 text-[#181717] dark:text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-black tracking-tight">
                  {isAuthenticated ? 'GitHub Connected' : 'Connect GitHub'}
                </CardTitle>
                <CardDescription className="text-sm font-medium">
                  {isAuthenticated
                    ? 'Access repositories and sync your projects'
                    : 'Connect your GitHub account to access repositories'
                  }
                </CardDescription>
              </div>
            </div>
            {isAuthenticated && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isAuthenticated ? (
            <div className="space-y-4">
              {user && (
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url} alt={user.login} />
                    <AvatarFallback>{user.login.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {user.name || user.login}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      @{user.login}
                    </p>
                  </div>
                </div>
              )}

              <Button
                onClick={handleDisconnect}
                disabled={disconnecting}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                {disconnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Disconnect GitHub
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={loading}
              className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Github className="h-5 w-5 mr-2" />
                  Connect to GitHub
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Button variant
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {isAuthenticated ? (
        <>
          {user && (
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url} alt={user.login} />
                <AvatarFallback className="text-xs">{user.login.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.name || user.login}</p>
                <p className="text-xs text-muted-foreground">@{user.login}</p>
              </div>
            </div>
          )}
          <Button
            onClick={handleDisconnect}
            disabled={disconnecting}
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            {disconnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="bg-[#238636] hover:bg-[#2ea043] text-white font-bold px-4 py-2 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub
            </>
          )}
        </Button>
      )}
    </div>
  )
}
