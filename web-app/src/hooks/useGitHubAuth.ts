import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

interface GitHubUser {
  id: number
  login: string
  name: string | null
  avatar_url: string
  email: string | null
}

interface GitHubAuthState {
  user: GitHubUser | null
  isAuthenticated: boolean
  loading: boolean
  accessToken: string | null
}

export function useGitHubAuth() {
  const [authState, setAuthState] = useState<GitHubAuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    accessToken: null
  })

  const { toast } = useToast()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/github/user')

      if (response.ok) {
        const data = await response.json()
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          loading: false,
          accessToken: data.accessToken
        })
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
          accessToken: null
        })
      }
    } catch (error) {
      console.error('Failed to check GitHub auth status:', error)
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        accessToken: null
      })
    }
  }

  const connectGitHub = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))

      // Redirect to GitHub OAuth
      window.location.href = '/api/auth/github/initiate'
    } catch (error) {
      console.error('Failed to initiate GitHub OAuth:', error)
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to GitHub. Please try again.',
        variant: 'destructive'
      })
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const disconnectGitHub = async () => {
    try {
      // Clear cookies by calling a logout endpoint
      await fetch('/api/auth/github/logout', { method: 'POST' })

      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        accessToken: null
      })

      toast({
        title: 'Disconnected',
        description: 'Successfully disconnected from GitHub.',
      })
    } catch (error) {
      console.error('Failed to disconnect from GitHub:', error)
      toast({
        title: 'Error',
        description: 'Failed to disconnect from GitHub.',
        variant: 'destructive'
      })
    }
  }

  // Helper function to make authenticated GitHub API calls
  const githubApiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!authState.accessToken) {
      throw new Error('Not authenticated with GitHub')
    }

    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${authState.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Codiner-Web-App',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    return response.json()
  }

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    accessToken: authState.accessToken,
    connectGitHub,
    disconnectGitHub,
    githubApiCall,
    checkAuthStatus
  }
}
