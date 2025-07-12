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
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      call_status: "Upcoming" | "Won" | "Lost" | "Push"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
