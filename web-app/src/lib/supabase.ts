import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Database types (generated from Supabase)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          bio: string | null
          ai_credits: number
          subscription_tier: 'free' | 'personal' | 'pro' | 'team' | 'enterprise'
          created_at: string
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          ai_credits?: number
          subscription_tier?: 'free' | 'personal' | 'pro' | 'team' | 'enterprise'
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          bio?: string | null
          ai_credits?: number
          subscription_tier?: 'free' | 'personal' | 'pro' | 'team' | 'enterprise'
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          template_id: string | null
          code: string
          preview_url: string | null
          is_public: boolean
          tags: string[]
          ai_model_used: string
          credits_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          template_id?: string | null
          code: string
          preview_url?: string | null
          is_public?: boolean
          tags?: string[]
          ai_model_used: string
          credits_used: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          template_id?: string | null
          code?: string
          preview_url?: string | null
          is_public?: boolean
          tags?: string[]
          ai_model_used?: string
          credits_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          code: string
          preview_image: string | null
          tags: string[]
          is_premium: boolean
          downloads: number
          rating: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          code: string
          preview_image?: string | null
          tags?: string[]
          is_premium?: boolean
          downloads?: number
          rating?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          code?: string
          preview_image?: string | null
          tags?: string[]
          is_premium?: boolean
          downloads?: number
          rating?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_requests: {
        Row: {
          id: string
          user_id: string
          prompt: string
          response: string
          model: string
          tokens_used: number
          credits_used: number
          success: boolean
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          response: string
          model: string
          tokens_used: number
          credits_used: number
          success?: boolean
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          response?: string
          model?: string
          tokens_used?: number
          credits_used?: number
          success?: boolean
          error_message?: string | null
          created_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          category: 'question' | 'showcase' | 'tutorial' | 'discussion'
          tags: string[]
          upvotes: number
          downvotes: number
          views: number
          is_pinned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          category?: 'question' | 'showcase' | 'tutorial' | 'discussion'
          tags?: string[]
          upvotes?: number
          downvotes?: number
          views?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          category?: 'question' | 'showcase' | 'tutorial' | 'discussion'
          tags?: string[]
          upvotes?: number
          downvotes?: number
          views?: number
          is_pinned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_projects: {
        Args: { user_id: string }
        Returns: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }[]
      }
      increment_template_downloads: {
        Args: { template_id: string }
        Returns: number
      }
      search_projects: {
        Args: { search_query: string; user_id?: string }
        Returns: {
          id: string
          name: string
          description: string | null
          tags: string[]
          created_at: string
        }[]
      }
    }
    Enums: {
      subscription_tier: 'free' | 'personal' | 'pro' | 'team' | 'enterprise'
      post_category: 'question' | 'showcase' | 'tutorial' | 'discussion'
    }
  }
}
