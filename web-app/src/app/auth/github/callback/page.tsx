"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, Github } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function GitHubCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Connecting to GitHub...')

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setMessage('GitHub authorization failed')
        toast({
          title: 'Connection Failed',
          description: 'GitHub authorization was denied or failed.',
          variant: 'destructive'
        })
        return
      }

      if (code) {
        try {
          // The API route will handle the redirect, but we can show a success message
          setStatus('success')
          setMessage('Successfully connected to GitHub!')

          toast({
            title: 'Connected!',
            description: 'Successfully connected to GitHub.',
          })

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/')
          }, 2000)

        } catch (err) {
          setStatus('error')
          setMessage('Failed to complete GitHub connection')
          toast({
            title: 'Connection Failed',
            description: 'Failed to complete GitHub connection.',
            variant: 'destructive'
          })
        }
      } else {
        setStatus('error')
        setMessage('No authorization code received')
      }
    }

    handleCallback()
  }, [searchParams, router, toast])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'border-blue-200'
      case 'success':
        return 'border-green-200'
      case 'error':
        return 'border-red-200'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className={`w-full max-w-md ${getStatusColor()}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-lg">
              <Github className="h-8 w-8 text-[#181717] dark:text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Connecting to GitHub'}
            {status === 'success' && 'Connected Successfully!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>

          {status === 'error' && (
            <Button
              onClick={() => router.push('/')}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          )}

          {status === 'success' && (
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
