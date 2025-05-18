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
      asset_bookings: {
        Row: {
          asset_id: string
          created_at: string
          employee_id: string | null
          end_date: string
          id: string
          purpose: string | null
          return_info: Json | null
          start_date: string
          status: string
        }
        Insert: {
          asset_id: string
          created_at?: string
          employee_id?: string | null
          end_date: string
          id?: string
          purpose?: string | null
          return_info?: Json | null
          start_date: string
          status: string
        }
        Update: {
          asset_id?: string
          created_at?: string
          employee_id?: string | null
          end_date?: string
          id?: string
          purpose?: string | null
          return_info?: Json | null
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_bookings_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_bookings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
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
      asset_vendors: {
        Row: {
          asset_id: string | null
          created_at: string | null
          id: string
          manufacturer: string
          price: number
          purchase_date: string | null
          vendor_id: string | null
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          manufacturer: string
          price: number
          purchase_date?: string | null
          vendor_id?: string | null
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          id?: string
          manufacturer?: string
          price?: number
          purchase_date?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_vendors_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_vendors_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          actual_return_date: string | null
          additional_warranty: boolean | null
          asset_owner_id: string | null
          category: string
          classification: string | null
          connected_asset_id: string | null
          contract_duration: string | null
          contract_end_date: string | null
          contract_name: string | null
          created_at: string | null
          disposal_method: string | null
          employee_id: string | null
          handover_to_employee_date: string | null
          has_warranty: boolean | null
          id: string
          image_url: string | null
          imei: string | null
          inventory_number: string | null
          is_external: boolean | null
          is_personal_data: boolean | null
          is_pool_device: boolean | null
          last_review_date: string | null
          lifecycle_stage: string | null
          manufacturer: string
          model: string
          name: string
          next_review_date: string | null
          notes: string | null
          owner_company: string | null
          phone_number: string | null
          planned_return_date: string | null
          price: number
          project_id: string | null
          provider: string | null
          purchase_date: string
          related_asset_id: string | null
          responsible_employee_id: string | null
          risk_level: string | null
          serial_number: string | null
          status: string
          type: string
          updated_at: string | null
          vendor: string
          warranty_expiry_date: string | null
          warranty_info: string | null
        }
        Insert: {
          actual_return_date?: string | null
          additional_warranty?: boolean | null
          asset_owner_id?: string | null
          category: string
          classification?: string | null
          connected_asset_id?: string | null
          contract_duration?: string | null
          contract_end_date?: string | null
          contract_name?: string | null
          created_at?: string | null
          disposal_method?: string | null
          employee_id?: string | null
          handover_to_employee_date?: string | null
          has_warranty?: boolean | null
          id?: string
          image_url?: string | null
          imei?: string | null
          inventory_number?: string | null
          is_external?: boolean | null
          is_personal_data?: boolean | null
          is_pool_device?: boolean | null
          last_review_date?: string | null
          lifecycle_stage?: string | null
          manufacturer: string
          model: string
          name: string
          next_review_date?: string | null
          notes?: string | null
          owner_company?: string | null
          phone_number?: string | null
          planned_return_date?: string | null
          price: number
          project_id?: string | null
          provider?: string | null
          purchase_date: string
          related_asset_id?: string | null
          responsible_employee_id?: string | null
          risk_level?: string | null
          serial_number?: string | null
          status: string
          type: string
          updated_at?: string | null
          vendor: string
          warranty_expiry_date?: string | null
          warranty_info?: string | null
        }
        Update: {
          actual_return_date?: string | null
          additional_warranty?: boolean | null
          asset_owner_id?: string | null
          category?: string
          classification?: string | null
          connected_asset_id?: string | null
          contract_duration?: string | null
          contract_end_date?: string | null
          contract_name?: string | null
          created_at?: string | null
          disposal_method?: string | null
          employee_id?: string | null
          handover_to_employee_date?: string | null
          has_warranty?: boolean | null
          id?: string
          image_url?: string | null
          imei?: string | null
          inventory_number?: string | null
          is_external?: boolean | null
          is_personal_data?: boolean | null
          is_pool_device?: boolean | null
          last_review_date?: string | null
          lifecycle_stage?: string | null
          manufacturer?: string
          model?: string
          name?: string
          next_review_date?: string | null
          notes?: string | null
          owner_company?: string | null
          phone_number?: string | null
          planned_return_date?: string | null
          price?: number
          project_id?: string | null
          provider?: string | null
          purchase_date?: string
          related_asset_id?: string | null
          responsible_employee_id?: string | null
          risk_level?: string | null
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
            referencedRelation: "employees"
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
          competence_level: string | null
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
          competence_level?: string | null
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
          competence_level?: string | null
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
      license_assignments: {
        Row: {
          assigned_at: string | null
          employee_id: string
          id: string
          license_id: string
          notes: string | null
        }
        Insert: {
          assigned_at?: string | null
          employee_id: string
          id?: string
          license_id: string
          notes?: string | null
        }
        Update: {
          assigned_at?: string | null
          employee_id?: string
          id?: string
          license_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "license_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_assignments_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "software_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_costs: {
        Row: {
          asset_id: string | null
          cost: number
          created_at: string | null
          description: string | null
          id: string
          maintenance_date: string | null
          maintenance_type: string
        }
        Insert: {
          asset_id?: string | null
          cost?: number
          created_at?: string | null
          description?: string | null
          id?: string
          maintenance_date?: string | null
          maintenance_type: string
        }
        Update: {
          asset_id?: string | null
          cost?: number
          created_at?: string | null
          description?: string | null
          id?: string
          maintenance_date?: string | null
          maintenance_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_costs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
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
      software_licenses: {
        Row: {
          assigned_count: number
          cost_per_license: number
          created_at: string | null
          expiry_date: string | null
          id: string
          license_type: string
          name: string
          status: string
          total_licenses: number
        }
        Insert: {
          assigned_count?: number
          cost_per_license?: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          license_type: string
          name: string
          status?: string
          total_licenses?: number
        }
        Update: {
          assigned_count?: number
          cost_per_license?: number
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          license_type?: string
          name?: string
          status?: string
          total_licenses?: number
        }
        Relationships: []
      }
      vendors: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          rating: number | null
          vendor_name: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          vendor_name: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          vendor_name?: string
        }
        Relationships: []
      }
      warranty_defects: {
        Row: {
          asset_id: string | null
          created_at: string | null
          defect_date: string | null
          defect_type: string
          has_warranty: boolean | null
          id: string
          repair_cost: number | null
          resolution: string | null
          warranty_covered: boolean | null
        }
        Insert: {
          asset_id?: string | null
          created_at?: string | null
          defect_date?: string | null
          defect_type: string
          has_warranty?: boolean | null
          id?: string
          repair_cost?: number | null
          resolution?: string | null
          warranty_covered?: boolean | null
        }
        Update: {
          asset_id?: string | null
          created_at?: string | null
          defect_date?: string | null
          defect_type?: string
          has_warranty?: boolean | null
          id?: string
          repair_cost?: number | null
          resolution?: string | null
          warranty_covered?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "warranty_defects_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      yearly_budget: {
        Row: {
          budget_amount: number
          category: string
          created_at: string | null
          id: string
          month: number
          quarter: number
          spent_amount: number
          year: number
        }
        Insert: {
          budget_amount?: number
          category: string
          created_at?: string | null
          id?: string
          month: number
          quarter: number
          spent_amount?: number
          year: number
        }
        Update: {
          budget_amount?: number
          category?: string
          created_at?: string | null
          id?: string
          month?: number
          quarter?: number
          spent_amount?: number
          year?: number
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
      populate_report_test_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
