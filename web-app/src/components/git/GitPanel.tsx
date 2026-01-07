"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Plus,
  Upload,
  Download,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  FileText,
  Settings,
  RefreshCw,
  Copy,
  ExternalLink,
  UserPlus,
  MessageCircle,
  Code,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GitService, type GitStatus, type GitBranch, type GitCommit, type CollaborationSession } from "@/lib/git-service"

interface GitPanelProps {
  projectId: string
  projectName: string
  className?: string
}

export function GitPanel({ projectId, projectName, className = '' }: GitPanelProps) {
  const [activeTab, setActiveTab] = useState('status')
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null)
  const [branches, setBranches] = useState<GitBranch[]>([])
  const [commits, setCommits] = useState<GitCommit[]>([])
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [commitMessage, setCommitMessage] = useState('')
  const [newBranchName, setNewBranchName] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const { toast } = useToast()

  const gitService = new GitService()

  useEffect(() => {
    loadGitData()
  }, [projectId])

  const loadGitData = async () => {
    setIsLoading(true)
    try {
      const [status, branchList, commitList, sessions] = await Promise.all([
        gitService.getRepositoryStatus(projectId),
        gitService.getBranches(projectId),
        gitService.getCommitHistory(projectId),
        gitService.getActiveSessions(projectId)
      ])

      setGitStatus(status)
      setBranches(branchList)
      setCommits(commitList)
      setCollaborationSessions(sessions)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Git data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a commit message",
        variant: "destructive",
      })
      return
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select files to commit",
        variant: "destructive",
      })
      return
    }

    try {
      const commit = await gitService.commitChanges(
        projectId,
        commitMessage,
        selectedFiles,
        { name: 'Current User', email: 'user@example.com' } // Would get from auth
      )

      if (commit) {
        toast({
          title: "Success",
          description: `Committed ${selectedFiles.length} files`,
        })
        setCommitMessage('')
        setSelectedFiles([])
        loadGitData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to commit changes",
        variant: "destructive",
      })
    }
  }

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a branch name",
        variant: "destructive",
      })
      return
    }

    try {
      const success = await gitService.createBranch(projectId, newBranchName)
      if (success) {
        toast({
          title: "Success",
          description: `Created branch '${newBranchName}'`,
        })
        setNewBranchName('')
        loadGitData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create branch",
        variant: "destructive",
      })
    }
  }

  const handleSwitchBranch = async (branchName: string) => {
    try {
      const success = await gitService.switchBranch(projectId, branchName)
      if (success) {
        toast({
          title: "Success",
          description: `Switched to branch '${branchName}'`,
        })
        loadGitData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to switch branch",
        variant: "destructive",
      })
    }
  }

  const handleCreateCollaborationSession = async () => {
    try {
      const session = await gitService.createCollaborationSession(projectId, 'current-user-id')
      if (session) {
        toast({
          title: "Session Created",
          description: "Collaboration session started",
        })
        loadGitData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collaboration session",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'staged': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'modified': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'untracked': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'deleted': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'staged': return <CheckCircle className="w-4 h-4" />
      case 'modified': return <AlertCircle className="w-4 h-4" />
      case 'untracked': return <Plus className="w-4 h-4" />
      case 'deleted': return <AlertCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Version Control</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{projectName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <GitBranch className="w-3 h-3 mr-1" />
            {branches.find(b => b.isCurrent)?.name || 'main'}
          </Badge>
          <Button variant="ghost" size="sm" onClick={loadGitData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-5 h-12 bg-white/50 backdrop-blur-sm border-b border-white/20 mx-4 mt-4">
          <TabsTrigger value="status" className="text-sm font-medium">
            Status
          </TabsTrigger>
          <TabsTrigger value="branches" className="text-sm font-medium">
            Branches
          </TabsTrigger>
          <TabsTrigger value="commits" className="text-sm font-medium">
            History
          </TabsTrigger>
          <TabsTrigger value="collaborate" className="text-sm font-medium">
            <Users className="w-4 h-4 mr-1" />
            Collaborate
          </TabsTrigger>
          <TabsTrigger value="pulls" className="text-sm font-medium">
            <GitPullRequest className="w-4 h-4 mr-1" />
            PRs
          </TabsTrigger>
        </TabsList>

        {/* Repository Status */}
        <TabsContent value="status" className="p-6">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCommit} disabled={!commitMessage.trim() || selectedFiles.length === 0}>
                <GitCommit className="w-4 h-4 mr-2" />
                Commit Changes
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Push
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Pull
              </Button>
            </div>

            {/* Commit Message */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Commit Message</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your changes..."
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="min-h-[80px]"
                />
              </CardContent>
            </Card>

            {/* File Status */}
            {gitStatus && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      Staged Files ({gitStatus.staged.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      {gitStatus.staged.map((file) => (
                        <div key={file} className="flex items-center space-x-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFiles([...selectedFiles, file])
                              } else {
                                setSelectedFiles(selectedFiles.filter(f => f !== file))
                              }
                            }}
                          />
                          <FileText className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-mono">{file}</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                      Modified Files ({gitStatus.modified.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      {gitStatus.modified.map((file) => (
                        <div key={file} className="flex items-center space-x-2 p-2">
                          <FileText className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-mono">{file}</span>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Branches */}
        <TabsContent value="branches" className="p-6">
          <div className="space-y-6">
            {/* Create Branch */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Create New Branch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="branch-name"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                  />
                  <Button onClick={handleCreateBranch}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Branch List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Branches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {branches.map((branch) => (
                    <div key={branch.name} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <GitBranch className="w-4 h-4 text-blue-500" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{branch.name}</span>
                            {branch.isCurrent && <Badge className="text-xs">Current</Badge>}
                            {branch.isRemote && <Badge variant="outline" className="text-xs">Remote</Badge>}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {branch.lastCommit.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500">
                          {new Date(branch.lastCommit.timestamp).toLocaleDateString()}
                        </span>
                        {!branch.isCurrent && (
                          <Button size="sm" variant="outline" onClick={() => handleSwitchBranch(branch.name)}>
                            Switch
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Commit History */}
        <TabsContent value="commits" className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Commit History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {commits.map((commit) => (
                    <div key={commit.id} className="flex items-start space-x-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <GitCommit className="w-5 h-5 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{commit.message}</span>
                          <Badge variant="outline" className="text-xs">
                            {commit.id.slice(0, 7)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>{commit.author}</span>
                          <span>{new Date(commit.timestamp).toLocaleString()}</span>
                          <span>+{commit.changes.additions} -{commit.changes.deletions}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {commit.changes.files.slice(0, 3).map((file) => (
                            <Badge key={file} variant="secondary" className="text-xs">
                              {file}
                            </Badge>
                          ))}
                          {commit.changes.files.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{commit.changes.files.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collaboration */}
        <TabsContent value="collaborate" className="p-6">
          <div className="space-y-6">
            {/* Start Session */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Real-time Collaboration</CardTitle>
                <CardDescription>
                  Invite others to edit this project together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleCreateCollaborationSession} className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Start Collaboration Session
                </Button>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            {collaborationSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {collaborationSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Session #{session.id.slice(0, 6)}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {session.participants.length} participant{session.participants.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Online Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'John Doe', status: 'active', avatar: '/avatars/john.jpg' },
                    { name: 'Jane Smith', status: 'idle', avatar: '/avatars/jane.jpg' },
                    { name: 'Bob Wilson', status: 'active', avatar: '/avatars/bob.jpg' },
                  ].map((participant) => (
                    <div key={participant.name} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{participant.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {participant.status === 'active' ? 'Currently editing' : 'Online'}
                        </p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        participant.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pull Requests */}
        <TabsContent value="pulls" className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pull Requests</CardTitle>
              <CardDescription>
                Review and merge code changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <GitPullRequest className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Pull Requests
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Create a pull request to propose changes to this project
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Pull Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
