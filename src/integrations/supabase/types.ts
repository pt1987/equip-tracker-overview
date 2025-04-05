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
        }
        Relationships: []
      }
      documents: {
        Row: {
          asset_id: string
          created_at: string | null
          file_path: string
          file_type: string
          id: string
          name: string
          upload_date: string
        }
        Insert: {
          asset_id: string
          created_at?: string | null
          file_path: string
          file_type: string
          id?: string
          name: string
          upload_date?: string
        }
        Update: {
          asset_id?: string
          created_at?: string | null
          file_path?: string
          file_type?: string
          id?: string
          name?: string
          upload_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_form_accessories: {
        Row: {
          created_at: string | null
          form_asset_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          form_asset_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          form_asset_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_form_accessories_form_asset_id_fkey"
            columns: ["form_asset_id"]
            isOneToOne: false
            referencedRelation: "employee_form_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_form_assets: {
        Row: {
          asset_id: string
          asset_name: string
          condition: string | null
          created_at: string | null
          form_id: string
          id: string
          serial_number: string | null
        }
        Insert: {
          asset_id: string
          asset_name: string
          condition?: string | null
          created_at?: string | null
          form_id: string
          id?: string
          serial_number?: string | null
        }
        Update: {
          asset_id?: string
          asset_name?: string
          condition?: string | null
          created_at?: string | null
          form_id?: string
          id?: string
          serial_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_form_assets_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_form_assets_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "employee_forms"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_form_checklist: {
        Row: {
          checked: boolean
          created_at: string | null
          form_asset_id: string
          id: string
          label: string
        }
        Insert: {
          checked?: boolean
          created_at?: string | null
          form_asset_id: string
          id?: string
          label: string
        }
        Update: {
          checked?: boolean
          created_at?: string | null
          form_asset_id?: string
          id?: string
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_form_checklist_form_asset_id_fkey"
            columns: ["form_asset_id"]
            isOneToOne: false
            referencedRelation: "employee_form_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_forms: {
        Row: {
          completed_date: string | null
          created_at: string | null
          created_date: string
          document_url: string | null
          email_sent: boolean
          employee_id: string
          employee_name: string
          form_type: string
          id: string
          notes: string | null
          signature: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string | null
          created_date?: string
          document_url?: string | null
          email_sent?: boolean
          employee_id: string
          employee_name: string
          form_type: string
          id?: string
          notes?: string | null
          signature?: string | null
          status: string
          updated_at?: string | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string | null
          created_date?: string
          document_url?: string | null
          email_sent?: boolean
          employee_id?: string
          employee_name?: string
          form_type?: string
          id?: string
          notes?: string | null
          signature?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_forms_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          budget: number
          cluster: string
          created_at: string | null
          first_name: string
          id: string
          image_url: string | null
          last_name: string
          position: string
          profile_image: string | null
          start_date: string
          updated_at: string | null
          used_budget: number
        }
        Insert: {
          budget?: number
          cluster: string
          created_at?: string | null
          first_name: string
          id?: string
          image_url?: string | null
          last_name: string
          position: string
          profile_image?: string | null
          start_date: string
          updated_at?: string | null
          used_budget?: number
        }
        Update: {
          budget?: number
          cluster?: string
          created_at?: string | null
          first_name?: string
          id?: string
          image_url?: string | null
          last_name?: string
          position?: string
          profile_image?: string | null
          start_date?: string
          updated_at?: string | null
          used_budget?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
