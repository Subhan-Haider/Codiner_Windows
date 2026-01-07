import { createClient } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  username: string
  full_name: string
  avatar_url?: string
  bio?: string
  website?: string
  location?: string
  company?: string
  role: 'user' | 'pro' | 'admin' | 'moderator'
  plan: 'free' | 'pro' | 'enterprise'
  credits: number
  preferences: UserPreferences
  stats: UserStats
  created_at: string
  updated_at: string
  last_login_at?: string
  is_email_verified: boolean
  is_active: boolean
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  email_notifications: boolean
  ai_suggestions: boolean
  code_completion: boolean
  auto_save: boolean
  font_size: number
  tab_size: number
  word_wrap: boolean
  minimap: boolean
  line_numbers: boolean
}

export interface UserStats {
  projects_created: number
  templates_used: number
  deployments_made: number
  ai_requests: number
  collaborators: number
  reputation_score: number
  achievements: string[]
  joined_at: string
  last_active_at: string
}

export interface AuthPermissions {
  can_create_projects: boolean
  can_publish_templates: boolean
  can_access_pro_features: boolean
  can_collaborate: boolean
  can_deploy: boolean
  can_use_ai: boolean
  max_projects: number
  max_collaborators: number
  max_deployments_per_month: number
  max_ai_requests_per_day: number
  storage_limit_gb: number
}

export interface AuthSession {
  user: User | null
  profile: UserProfile | null
  permissions: AuthPermissions
  isLoading: boolean
  isAuthenticated: boolean
}

export class AuthService {
  private supabase = createClient()
  private currentSession: AuthSession = {
    user: null,
    profile: null,
    permissions: this.getDefaultPermissions(),
    isLoading: true,
    isAuthenticated: false
  }

  // Session Management
  async initialize(): Promise<AuthSession> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()

      if (error) {
        console.error('Error getting session:', error)
        return this.currentSession
      }

      if (session?.user) {
        const profile = await this.getUserProfile(session.user.id)
        const permissions = this.calculatePermissions(profile)

        this.currentSession = {
          user: session.user,
          profile,
          permissions,
          isLoading: false,
          isAuthenticated: true
        }

        // Update last login
        await this.updateLastLogin(session.user.id)
      } else {
        this.currentSession = {
          user: null,
          profile: null,
          permissions: this.getDefaultPermissions(),
          isLoading: false,
          isAuthenticated: false
        }
      }

      return this.currentSession
    } catch (error) {
      console.error('Error initializing auth:', error)
      return this.currentSession
    }
  }

  async signInWithEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        const profile = await this.getUserProfile(data.user.id)
        const permissions = this.calculatePermissions(profile)

        this.currentSession = {
          user: data.user,
          profile,
          permissions,
          isLoading: false,
          isAuthenticated: true
        }

        await this.updateLastLogin(data.user.id)
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async signUpWithEmail(email: string, password: string, metadata: {
    username: string
    full_name: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        await this.createUserProfile(data.user.id, {
          email,
          username: metadata.username,
          full_name: metadata.full_name
        })

        // Send welcome email or trigger onboarding
        await this.triggerWelcomeFlow(data.user.id)
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async signInWithOAuth(provider: 'github' | 'google' | 'gitlab'): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'github' ? 'repo,user' : undefined
        }
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) throw error

      this.currentSession = {
        user: null,
        profile: null,
        permissions: this.getDefaultPermissions(),
        isLoading: false,
        isAuthenticated: false
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // User Profile Management
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  async createUserProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const profile: UserProfile = {
        id: userId,
        email: data.email!,
        username: data.username!,
        full_name: data.full_name!,
        role: 'user',
        plan: 'free',
        credits: 100, // Free credits for new users
        preferences: {
          theme: 'system',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          email_notifications: true,
          ai_suggestions: true,
          code_completion: true,
          auto_save: true,
          font_size: 14,
          tab_size: 2,
          word_wrap: true,
          minimap: true,
          line_numbers: true
        },
        stats: {
          projects_created: 0,
          templates_used: 0,
          deployments_made: 0,
          ai_requests: 0,
          collaborators: 0,
          reputation_score: 0,
          achievements: [],
          joined_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_email_verified: false,
        is_active: true,
        ...data
      }

      const { data: createdProfile, error } = await this.supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single()

      if (error) throw error

      return createdProfile as UserProfile
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      // Update current session if this is the current user
      if (this.currentSession.user?.id === userId) {
        this.currentSession.profile = data as UserProfile
        this.currentSession.permissions = this.calculatePermissions(data as UserProfile)
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  }

  // Permissions & Authorization
  private calculatePermissions(profile: UserProfile | null): AuthPermissions {
    if (!profile) return this.getDefaultPermissions()

    const basePermissions: AuthPermissions = {
      can_create_projects: true,
      can_publish_templates: false,
      can_access_pro_features: false,
      can_collaborate: true,
      can_deploy: false,
      can_use_ai: true,
      max_projects: 5,
      max_collaborators: 1,
      max_deployments_per_month: 3,
      max_ai_requests_per_day: 50,
      storage_limit_gb: 1
    }

    // Apply role-based permissions
    switch (profile.role) {
      case 'admin':
        return {
          ...basePermissions,
          can_publish_templates: true,
          can_access_pro_features: true,
          can_deploy: true,
          max_projects: -1, // unlimited
          max_collaborators: -1,
          max_deployments_per_month: -1,
          max_ai_requests_per_day: -1,
          storage_limit_gb: 100
        }

      case 'moderator':
        return {
          ...basePermissions,
          can_publish_templates: true,
          can_access_pro_features: true,
          can_deploy: true,
          max_projects: 50,
          max_collaborators: 10,
          max_deployments_per_month: 100,
          max_ai_requests_per_day: 1000,
          storage_limit_gb: 10
        }

      case 'pro':
        return {
          ...basePermissions,
          can_publish_templates: true,
          can_access_pro_features: true,
          can_deploy: true,
          max_projects: 25,
          max_collaborators: 5,
          max_deployments_per_month: 50,
          max_ai_requests_per_day: 500,
          storage_limit_gb: 5
        }

      case 'user':
      default:
        // Apply plan-based permissions
        if (profile.plan === 'enterprise') {
          return {
            ...basePermissions,
            can_publish_templates: true,
            can_access_pro_features: true,
            can_deploy: true,
            max_projects: 100,
            max_collaborators: 20,
            max_deployments_per_month: 200,
            max_ai_requests_per_day: 2000,
            storage_limit_gb: 50
          }
        } else if (profile.plan === 'pro') {
          return {
            ...basePermissions,
            can_publish_templates: true,
            can_access_pro_features: true,
            can_deploy: true,
            max_projects: 25,
            max_collaborators: 5,
            max_deployments_per_month: 50,
            max_ai_requests_per_day: 500,
            storage_limit_gb: 5
          }
        }

        return basePermissions
    }
  }

  private getDefaultPermissions(): AuthPermissions {
    return {
      can_create_projects: false,
      can_publish_templates: false,
      can_access_pro_features: false,
      can_collaborate: false,
      can_deploy: false,
      can_use_ai: false,
      max_projects: 0,
      max_collaborators: 0,
      max_deployments_per_month: 0,
      max_ai_requests_per_day: 0,
      storage_limit_gb: 0
    }
  }

  // Utility Methods
  getCurrentSession(): AuthSession {
    return this.currentSession
  }

  isAuthenticated(): boolean {
    return this.currentSession.isAuthenticated
  }

  hasPermission(permission: keyof AuthPermissions): boolean {
    return this.currentSession.permissions[permission] as boolean
  }

  canPerformAction(action: string, resourceCount?: number): boolean {
    switch (action) {
      case 'create_project':
        return this.hasPermission('can_create_projects') &&
               (this.currentSession.permissions.max_projects === -1 ||
                (this.currentSession.profile?.stats.projects_created || 0) < this.currentSession.permissions.max_projects)

      case 'deploy':
        return this.hasPermission('can_deploy') &&
               (this.currentSession.permissions.max_deployments_per_month === -1 ||
                (this.currentSession.profile?.stats.deployments_made || 0) < this.currentSession.permissions.max_deployments_per_month)

      case 'use_ai':
        return this.hasPermission('can_use_ai') &&
               (this.currentSession.permissions.max_ai_requests_per_day === -1 ||
                (this.currentSession.profile?.stats.ai_requests || 0) < this.currentSession.permissions.max_ai_requests_per_day)

      case 'collaborate':
        return this.hasPermission('can_collaborate') &&
               (!resourceCount || resourceCount <= this.currentSession.permissions.max_collaborators)

      default:
        return false
    }
  }

  // Private Methods
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.supabase
        .from('user_profiles')
        .update({
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }

  private async triggerWelcomeFlow(userId: string): Promise<void> {
    // Trigger welcome email, create default project, etc.
    console.log('Triggering welcome flow for user:', userId)
  }
}

// Global auth service instance
export const authService = new AuthService()
