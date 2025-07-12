export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      calls: {
        Row: {
          analysis: string | null
          bet_type: string
          created_at: string
          id: string
          match_away_team: string
          match_home_team: string
          odds: string
          pick: string
          status: Database["public"]["Enums"]["call_status"]
          units: number
          expert_id: string | null
        }
        Insert: {
          analysis?: string | null
          bet_type: string
          created_at?: string
          id?: string
          match_away_team: string
          match_home_team: string
          odds: string
          pick: string
          status?: Database["public"]["Enums"]["call_status"]
          units: number
          expert_id?: string | null
        }
        Update: {
          analysis?: string | null
          bet_type?: string
          created_at?: string
          id?: string
          match_away_team?: string
          match_home_team?: string
          odds?: string
          pick?: string
          status?: Database["public"]["Enums"]["call_status"]
          units?: number
          expert_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          helio_subscription_id: string | null
          id: string
          subscription_status: string | null
          subscription_tier: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          helio_subscription_id?: string | null
          id: string
          subscription_status?: string | null
          subscription_tier?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          helio_subscription_id?: string | null
          id?: string
          subscription_status?: string | null
          subscription_tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          currency: string
          interval: Database["public"]["Enums"]["plan_interval"]
          features: Json | null
          is_active: boolean
          helio_product_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          currency?: string
          interval: Database["public"]["Enums"]["plan_interval"]
          features?: Json | null
          is_active?: boolean
          helio_product_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          currency?: string
          interval?: Database["public"]["Enums"]["plan_interval"]
          features?: Json | null
          is_active?: boolean
          helio_product_id?: string | null
        }
        Relationships: []
      }
      experts: {
        Row: {
          id: string
          created_at: string
          name: string
          bio: string | null
          avatar_url: string | null
          win_rate: number | null
          total_calls: number
          total_units: number
          follower_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          bio?: string | null
          avatar_url?: string | null
          win_rate?: number | null
          total_calls?: number
          total_units?: number
          follower_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          bio?: string | null
          avatar_url?: string | null
          win_rate?: number | null
          total_calls?: number
          total_units?: number
          follower_count?: number
        }
        Relationships: []
      }
      expert_followers: {
        Row: {
          user_id: string
          expert_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          expert_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          expert_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_followers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_followers_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          }
        ]
      }
      discussions: {
        Row: {
          id: string
          created_at: string
          call_id: string
          user_id: string
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          call_id: string
          user_id: string
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          call_id?: string
          user_id?: string
          content?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussions_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      call_status: "Upcoming" | "Won" | "Lost" | "Push"
      plan_interval: "monthly" | "annual"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
