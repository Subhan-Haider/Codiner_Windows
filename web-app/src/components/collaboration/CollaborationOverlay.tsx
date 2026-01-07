"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  MessageCircle,
  Video,
  Mic,
  MicOff,
  Phone,
  Settings,
  MoreVertical,
  Crown,
  Shield,
  User,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { collaborationService, type Collaborator, type CollaborationSession } from "@/lib/collaboration/collaboration-service"

interface CollaborationOverlayProps {
  session: CollaborationSession | null
  currentUserId: string
  onInviteUser?: () => void
  onStartCall?: () => void
  className?: string
}

export function CollaborationOverlay({
  session,
  currentUserId,
  onInviteUser,
  onStartCall,
  className = ''
}: CollaborationOverlayProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const cursorsRef = useRef<Map<string, HTMLElement>>(new Map())

  useEffect(() => {
    if (!session) return

    // Listen for collaboration events
    const handleCollaboratorsUpdate = (updatedCollaborators: Collaborator[]) => {
      setCollaborators(updatedCollaborators)
      updateCursors(updatedCollaborators)
    }

    const handleCollaborationEvent = (event: any) => {
      // Handle cursor movements, selections, etc.
      if (event.type === 'cursor_move') {
        updateCursorPosition(event.userId, event.data.cursor)
      } else if (event.type === 'selection_change') {
        updateSelection(event.userId, event.data.selection)
      }
    }

    collaborationService.on('collaborators_updated', handleCollaboratorsUpdate)
    collaborationService.on('collaboration_event', handleCollaborationEvent)

    // Initial setup
    setCollaborators(session.collaborators)

    return () => {
      collaborationService.off('collaborators_updated', handleCollaboratorsUpdate)
      collaborationService.off('collaboration_event', handleCollaborationEvent)
    }
  }, [session])

  const updateCursors = (collaborators: Collaborator[]) => {
    collaborators.forEach(collaborator => {
      if (collaborator.userId !== currentUserId && collaborator.cursor) {
        updateCursorPosition(collaborator.userId, collaborator.cursor)
      }
    })
  }

  const updateCursorPosition = (userId: string, cursor: { line: number; column: number; file: string }) => {
    // This would integrate with the Monaco editor to show live cursors
    // For now, we'll just log the cursor position
    console.log(`User ${userId} cursor at line ${cursor.line}, column ${cursor.column} in ${cursor.file}`)
  }

  const updateSelection = (userId: string, selection: any) => {
    // Handle selection updates
    console.log(`User ${userId} selection:`, selection)
  }

  const getUserRoleIcon = (userId: string) => {
    // This would check user roles from the auth service
    if (userId === session?.projectId) return <Crown className="w-3 h-3 text-yellow-500" />
    return null
  }

  const getUserStatusColor = (collaborator: Collaborator) => {
    if (collaborator.userId === currentUserId) return 'bg-blue-500'
    if (collaborationService.isUserActive(collaborator.userId)) return 'bg-green-500'
    return 'bg-gray-400'
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    // Integrate with WebRTC audio
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    // End WebRTC call
  }

  if (!session) {
    return (
      <div className={`fixed top-4 right-4 z-50 ${className}`}>
        <Button
          onClick={onInviteUser}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Users className="w-4 h-4 mr-2" />
          Start Collaboration
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Main Collaboration Panel */}
      <div className={`fixed top-4 right-4 z-50 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 min-w-[320px] ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Collaboration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {collaborators.length} participant{collaborators.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onInviteUser}>
                <Users className="w-4 h-4 mr-2" />
                Invite Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onStartCall}>
                <Video className="w-4 h-4 mr-2" />
                Start Video Call
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Collaboration Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Collaborators List */}
        <div className="space-y-3 mb-4">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={collaborator.avatar} alt={collaborator.username} />
                  <AvatarFallback className="text-xs" style={{ backgroundColor: collaborator.color }}>
                    {collaborator.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${getUserStatusColor(collaborator)}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {collaborator.username}
                  </p>
                  {getUserRoleIcon(collaborator.userId)}
                  {collaborator.userId === currentUserId && (
                    <Badge variant="outline" className="text-xs px-1">You</Badge>
                  )}
                </div>

                {collaborator.cursor && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Line {collaborator.cursor.line + 1}, Col {collaborator.cursor.column + 1}
                  </p>
                )}

                {!collaborator.isActive && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">Offline</p>
                )}
              </div>

              {collaborator.userId !== currentUserId && (
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Voice/Video Call Controls */}
        {isCallActive && (
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium">Call in progress</span>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleMute}
                className={isMuted ? 'text-red-600' : ''}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEndCall}
                className="text-red-600 hover:text-red-700"
              >
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onInviteUser}
            className="flex-1"
          >
            <Users className="w-4 h-4 mr-2" />
            Invite
          </Button>

          {!isCallActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsCallActive(true)
                onStartCall?.()
              }}
              className="flex-1"
            >
              <Video className="w-4 h-4 mr-2" />
              Call
            </Button>
          )}
        </div>
      </div>

      {/* Live Cursors Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {collaborators
          .filter(c => c.userId !== currentUserId && c.cursor)
          .map((collaborator) => (
            <div
              key={`cursor-${collaborator.id}`}
              ref={(el) => {
                if (el) {
                  cursorsRef.current.set(collaborator.id, el)
                }
              }}
              className="absolute pointer-events-none"
              style={{
                // These positions would be calculated based on the editor's coordinate system
                left: `${collaborator.cursor!.column * 8}px`, // Rough estimate
                top: `${collaborator.cursor!.line * 20}px`, // Rough estimate
                zIndex: 40
              }}
            >
              <div
                className="w-0.5 h-5"
                style={{ backgroundColor: collaborator.color }}
              />
              <div
                className="px-2 py-1 rounded text-xs text-white text-center whitespace-nowrap"
                style={{ backgroundColor: collaborator.color }}
              >
                {collaborator.username}
              </div>
            </div>
          ))}
      </div>

      {/* Selection Highlights */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {collaborators
          .filter(c => c.userId !== currentUserId && c.selection)
          .map((collaborator) => (
            <div
              key={`selection-${collaborator.id}`}
              className="absolute pointer-events-none opacity-30"
              style={{
                backgroundColor: collaborator.color,
                // Selection rectangle would be calculated based on editor coordinates
                left: `${collaborator.selection!.startColumn * 8}px`,
                top: `${collaborator.selection!.startLine * 20}px`,
                width: `${(collaborator.selection!.endColumn - collaborator.selection!.startColumn) * 8}px`,
                height: `${(collaborator.selection!.endLine - collaborator.selection!.startLine + 1) * 20}px`,
              }}
            />
          ))}
      </div>
    </>
  )
}
