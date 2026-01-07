import { createClient } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface Collaborator {
  id: string
  userId: string
  username: string
  avatar?: string
  color: string
  cursor?: {
    line: number
    column: number
    file: string
  }
  selection?: {
    startLine: number
    startColumn: number
    endLine: number
    endColumn: number
    file: string
  }
  isActive: boolean
  lastSeen: Date
}

export interface CollaborationSession {
  id: string
  projectId: string
  collaborators: Collaborator[]
  isActive: boolean
  createdAt: Date
  lastActivity: Date
}

export interface CodeChange {
  id: string
  userId: string
  file: string
  changes: {
    type: 'insert' | 'delete' | 'replace'
    position: {
      line: number
      column: number
    }
    text?: string
    length?: number
    oldText?: string
    newText?: string
  }
  timestamp: Date
}

export interface CollaborationEvent {
  type: 'cursor_move' | 'selection_change' | 'code_change' | 'user_join' | 'user_leave' | 'file_open' | 'file_close'
  userId: string
  data: any
  timestamp: Date
}

export class CollaborationService {
  private supabase = createClient()
  private channel: RealtimeChannel | null = null
  private session: CollaborationSession | null = null
  private currentUserId: string = ''
  private eventListeners: Map<string, Set<Function>> = new Map()

  // Session Management
  async createSession(projectId: string): Promise<CollaborationSession> {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    this.session = {
      id: sessionId,
      projectId,
      collaborators: [],
      isActive: true,
      createdAt: new Date(),
      lastActivity: new Date()
    }

    // Join the collaboration channel
    this.joinChannel(sessionId)

    return this.session
  }

  async joinSession(sessionId: string, userId: string): Promise<CollaborationSession | null> {
    this.currentUserId = userId

    try {
      // Check if session exists
      const { data: sessionData, error } = await this.supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (error || !sessionData) {
        throw new Error('Session not found')
      }

      this.session = {
        id: sessionData.session_id,
        projectId: sessionData.project_id,
        collaborators: sessionData.collaborators || [],
        isActive: sessionData.is_active,
        createdAt: new Date(sessionData.created_at),
        lastActivity: new Date()
      }

      // Join the collaboration channel
      this.joinChannel(sessionId)

      // Announce user joined
      this.broadcastEvent({
        type: 'user_join',
        userId,
        data: { sessionId },
        timestamp: new Date()
      })

      return this.session
    } catch (error) {
      console.error('Failed to join session:', error)
      return null
    }
  }

  async leaveSession(): Promise<void> {
    if (this.session && this.currentUserId) {
      // Announce user left
      this.broadcastEvent({
        type: 'user_leave',
        userId: this.currentUserId,
        data: { sessionId: this.session.id },
        timestamp: new Date()
      })
    }

    // Leave the channel
    if (this.channel) {
      await this.supabase.removeChannel(this.channel)
      this.channel = null
    }

    this.session = null
  }

  // Real-time Communication
  private joinChannel(sessionId: string): void {
    this.channel = this.supabase.channel(`collaboration-${sessionId}`, {
      config: {
        presence: {
          key: this.currentUserId
        }
      }
    })

    // Handle presence events
    this.channel
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel?.presenceState()
        this.handlePresenceSync(state)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.handleUserJoin(key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.handleUserLeave(key, leftPresences)
      })
      .on('broadcast', { event: 'collaboration_event' }, ({ payload }) => {
        this.handleCollaborationEvent(payload)
      })

    this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Track presence
        await this.channel?.track({
          userId: this.currentUserId,
          online_at: new Date().toISOString()
        })
      }
    })
  }

  private handlePresenceSync(state: any): void {
    const collaborators: Collaborator[] = []

    Object.keys(state).forEach(userId => {
      const presence = state[userId][0]
      collaborators.push({
        id: userId,
        userId,
        username: presence.username || `User ${userId.slice(0, 6)}`,
        avatar: presence.avatar,
        color: this.getUserColor(userId),
        isActive: true,
        lastSeen: new Date(presence.online_at)
      })
    })

    if (this.session) {
      this.session.collaborators = collaborators
    }

    this.emit('collaborators_updated', collaborators)
  }

  private handleUserJoin(userId: string, presences: any[]): void {
    console.log('User joined:', userId)
    this.emit('user_joined', { userId, presences })
  }

  private handleUserLeave(userId: string, presences: any[]): void {
    console.log('User left:', userId)
    this.emit('user_left', { userId, presences })
  }

  private handleCollaborationEvent(event: CollaborationEvent): void {
    this.emit('collaboration_event', event)
  }

  private broadcastEvent(event: CollaborationEvent): void {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'collaboration_event',
        payload: event
      })
    }
  }

  // Cursor and Selection Tracking
  updateCursor(file: string, line: number, column: number): void {
    if (!this.session || !this.currentUserId) return

    const cursor = { line, column, file }

    // Update local collaborator
    const collaborator = this.session.collaborators.find(c => c.userId === this.currentUserId)
    if (collaborator) {
      collaborator.cursor = cursor
      collaborator.lastSeen = new Date()
    }

    // Broadcast cursor position
    this.broadcastEvent({
      type: 'cursor_move',
      userId: this.currentUserId,
      data: { cursor },
      timestamp: new Date()
    })
  }

  updateSelection(file: string, startLine: number, startColumn: number, endLine: number, endColumn: number): void {
    if (!this.session || !this.currentUserId) return

    const selection = { startLine, startColumn, endLine, endColumn, file }

    // Update local collaborator
    const collaborator = this.session.collaborators.find(c => c.userId === this.currentUserId)
    if (collaborator) {
      collaborator.selection = selection
      collaborator.lastSeen = new Date()
    }

    // Broadcast selection
    this.broadcastEvent({
      type: 'selection_change',
      userId: this.currentUserId,
      data: { selection },
      timestamp: new Date()
    })
  }

  // Code Change Broadcasting
  broadcastCodeChange(change: CodeChange): void {
    this.broadcastEvent({
      type: 'code_change',
      userId: this.currentUserId,
      data: change,
      timestamp: new Date()
    })
  }

  // File Operations
  broadcastFileOpen(file: string): void {
    this.broadcastEvent({
      type: 'file_open',
      userId: this.currentUserId,
      data: { file },
      timestamp: new Date()
    })
  }

  broadcastFileClose(file: string): void {
    this.broadcastEvent({
      type: 'file_close',
      userId: this.currentUserId,
      data: { file },
      timestamp: new Date()
    })
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(callback)
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in collaboration event listener for ${event}:`, error)
        }
      })
    }
  }

  // Utility Methods
  getCurrentSession(): CollaborationSession | null {
    return this.session
  }

  getCollaborators(): Collaborator[] {
    return this.session?.collaborators || []
  }

  getCollaborator(userId: string): Collaborator | undefined {
    return this.session?.collaborators.find(c => c.userId === userId)
  }

  isUserActive(userId: string): boolean {
    const collaborator = this.getCollaborator(userId)
    if (!collaborator) return false

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    return collaborator.lastSeen > fiveMinutesAgo
  }

  private getUserColor(userId: string): string {
    // Generate consistent color based on user ID
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ]

    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash)
    }

    return colors[Math.abs(hash) % colors.length]
  }

  // Conflict Resolution
  resolveConflict(localChange: CodeChange, remoteChange: CodeChange): CodeChange {
    // Simple conflict resolution: last writer wins
    if (localChange.timestamp > remoteChange.timestamp) {
      return localChange
    }

    // For more complex resolution, we could implement operational transformation
    return remoteChange
  }

  // Session Persistence
  async saveSession(): Promise<void> {
    if (!this.session) return

    try {
      const { error } = await this.supabase
        .from('collaboration_sessions')
        .upsert({
          session_id: this.session.id,
          project_id: this.session.projectId,
          collaborators: this.session.collaborators,
          is_active: this.session.isActive,
          last_activity: this.session.lastActivity.toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  async loadSession(sessionId: string): Promise<CollaborationSession | null> {
    try {
      const { data, error } = await this.supabase
        .from('collaboration_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single()

      if (error) throw error

      return {
        id: data.session_id,
        projectId: data.project_id,
        collaborators: data.collaborators || [],
        isActive: data.is_active,
        createdAt: new Date(data.created_at),
        lastActivity: new Date(data.last_activity)
      }
    } catch (error) {
      console.error('Failed to load session:', error)
      return null
    }
  }

  // Cleanup
  destroy(): void {
    if (this.channel) {
      this.supabase.removeChannel(this.channel)
      this.channel = null
    }

    this.eventListeners.clear()
    this.session = null
  }
}

// Global collaboration service instance
export const collaborationService = new CollaborationService()
