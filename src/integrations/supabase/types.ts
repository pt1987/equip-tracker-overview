export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asset_history: {
        Row: {
          action: string
          asset_id: string
          created_at: string | null
          date: string
          employee_id: string | null
          id: string
          notes: string | null
        }
        Insert: {
          action: string
          asset_id: string
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          action?: string
          asset_id?: string
          created_at?: string | null
          date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_history_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          additional_warranty: boolean | null
          category: string
          connected_asset_id: string | null
          contract_duration: string | null
          contract_end_date: string | null
          contract_name: string | null
          created_at: string | null
          employee_id: string | null
          has_warranty: boolean | null
          id: string
          image_url: string | null
          imei: string | null
          inventory_number: string | null
          manufacturer: string
          model: string
          name: string
          phone_number: string | null
          price: number
          provider: string | null
          purchase_date: string
          related_asset_id: string | null
          serial_number: string | null
          status: string
          type: string
          updated_at: string | null
          vendor: string
          warranty_expiry_date: string | null
          warranty_info: string | null
        }
        Insert: {
          additional_warranty?: boolean | null
          category: string
          connected_asset_id?: string | null
          contract_duration?: string | null
          contract_end_date?: string | null
          contract_name?: string | null
          created_at?: string | null
          employee_id?: string | null
          has_warranty?: boolean | null
          id?: string
          image_url?: string | null
          imei?: string | null
          inventory_number?: string | null
          manufacturer: string
          model: string
          name: string
          phone_number?: string | null
          price: number
          provider?: string | null
          purchase_date: string
          related_asset_id?: string | null
          serial_number?: string | null
          status: string
          type: string
          updated_at?: string | null
          vendor: string
          warranty_expiry_date?: string | null
          warranty_info?: string | null
        }
        Update: {
          additional_warranty?: boolean | null
          category?: string
          connected_asset_id?: string | null
          contract_duration?: string | null
          contract_end_date?: string | null
          contract_name?: string | null
          created_at?: string | null
          employee_id?: string | null
          has_warranty?: boolean | null
          id?: string
          image_url?: string | null
          imei?: string | null
          inventory_number?: string | null
          manufacturer?: string
          model?: string
          name?: string
          phone_number?: string | null
          price?: number
          provider?: string | null
          purchase_date?: string
          related_asset_id?: string | null
          serial_number?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          vendor?: string
          warranty_expiry_date?: string | null
          warranty_info?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_connected_asset_id_fkey"
            columns: ["connected_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_related_asset_id_fkey"
            columns: ["related_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          budget: number
          cluster: string
          created_at: string | null
          email: string | null
          entry_date: string | null
          first_name: string
          id: string
          image_url: string | null
          last_name: string
          position: string
          profile_image: string | null
          start_date: string
          updated_at: string | null
          used_budget: number
          user_id: string | null
        }
        Insert: {
          budget?: number
          cluster: string
          created_at?: string | null
          email?: string | null
          entry_date?: string | null
          first_name: string
          id: string
          image_url?: string | null
          last_name: string
          position: string
          profile_image?: string | null
          start_date: string
          updated_at?: string | null
          used_budget?: number
          user_id?: string | null
        }
        Update: {
          budget?: number
          cluster?: string
          created_at?: string | null
          email?: string | null
          entry_date?: string | null
          first_name?: string
          id?: string
          image_url?: string | null
          last_name?: string
          position?: string
          profile_image?: string | null
          start_date?: string
          updated_at?: string | null
          used_budget?: number
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_safe_user_email: {
        Args: { user_id: string }
        Returns: string
      }
      update_user_email: {
        Args: { user_id: string; new_email: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
