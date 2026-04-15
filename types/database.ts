export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TenantRole =
  | "tenant_owner"
  | "tenant_admin"
  | "advisor"
  | "operator"
  | "viewer";

export type TenantStatus = "trial" | "active" | "suspended" | "archived";
export type MembershipStatus = "invited" | "active" | "suspended" | "removed";
export type PropertyStatus =
  | "draft"
  | "available"
  | "reserved"
  | "rented"
  | "sold"
  | "inactive";
export type PropertyType =
  | "apartment"
  | "house"
  | "land"
  | "office"
  | "commercial"
  | "warehouse"
  | "duplex"
  | "condo"
  | "other";
export type OperationType = "sale" | "rent";
export type LeadQualificationStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "unqualified"
  | "nurturing"
  | "won"
  | "lost";
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "canceled"
  | "no_show";
export type ConversationStatus =
  | "open"
  | "pending_human"
  | "automated"
  | "closed";
export type ChannelType =
  | "whatsapp"
  | "email"
  | "webchat"
  | "instagram"
  | "facebook_leads";

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_profiles"]["Insert"]
        >;
        Relationships: [];
      };
      platform_users: {
        Row: {
          id: string;
          user_id: string;
          role: "platform_admin";
          status: MembershipStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: "platform_admin";
          status?: MembershipStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["platform_users"]["Insert"]
        >;
        Relationships: [];
      };
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          status: TenantStatus;
          primary_currency: string;
          timezone: string;
          locale: string;
          settings: Json;
          branding: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          status?: TenantStatus;
          primary_currency?: string;
          timezone?: string;
          locale?: string;
          settings?: Json;
          branding?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>;
        Relationships: [];
      };
      tenant_users: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          role: TenantRole;
          status: MembershipStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          role: TenantRole;
          status?: MembershipStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tenant_users"]["Insert"]>;
        Relationships: [];
      };
      channels: {
        Row: {
          id: string;
          tenant_id: string;
          type: ChannelType;
          provider: string;
          external_account_id: string | null;
          display_name: string;
          status: string;
          credentials_ref: string | null;
          metadata: Json;
          connected_at: string | null;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          type: ChannelType;
          provider: string;
          external_account_id?: string | null;
          display_name: string;
          status?: string;
          credentials_ref?: string | null;
          metadata?: Json;
          connected_at?: string | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["channels"]["Insert"]>;
        Relationships: [];
      };
      channel_whatsapp_accounts: {
        Row: {
          id: string;
          tenant_id: string;
          channel_id: string;
          meta_business_account_id: string | null;
          whatsapp_business_account_id: string | null;
          phone_number_id: string | null;
          display_phone_number: string | null;
          verified_name: string | null;
          status: string;
          webhook_status: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          channel_id: string;
          meta_business_account_id?: string | null;
          whatsapp_business_account_id?: string | null;
          phone_number_id?: string | null;
          display_phone_number?: string | null;
          verified_name?: string | null;
          status?: string;
          webhook_status?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["channel_whatsapp_accounts"]["Insert"]
        >;
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          tenant_id: string;
          external_ref: string | null;
          title: string;
          description: string | null;
          operation_type: OperationType;
          property_type: PropertyType;
          price: number | null;
          currency: string;
          expenses_amount: number | null;
          location_text: string | null;
          country: string;
          state: string | null;
          city: string | null;
          neighborhood: string | null;
          address: string | null;
          bedrooms: number | null;
          bathrooms: number | null;
          garages: number | null;
          area_m2: number | null;
          lot_area_m2: number | null;
          pets_allowed: boolean;
          furnished: boolean;
          has_pool: boolean;
          has_garden: boolean;
          has_balcony: boolean;
          status: PropertyStatus;
          advisor_id: string | null;
          source: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          external_ref?: string | null;
          title: string;
          description?: string | null;
          operation_type: OperationType;
          property_type: PropertyType;
          price?: number | null;
          currency?: string;
          expenses_amount?: number | null;
          location_text?: string | null;
          country?: string;
          state?: string | null;
          city?: string | null;
          neighborhood?: string | null;
          address?: string | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          garages?: number | null;
          area_m2?: number | null;
          lot_area_m2?: number | null;
          pets_allowed?: boolean;
          furnished?: boolean;
          has_pool?: boolean;
          has_garden?: boolean;
          has_balcony?: boolean;
          status?: PropertyStatus;
          advisor_id?: string | null;
          source?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["properties"]["Insert"]>;
        Relationships: [];
      };
      pipeline_stages: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          position: number;
          category: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          position: number;
          category?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["pipeline_stages"]["Insert"]
        >;
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          tenant_id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          source: string | null;
          source_details: Json;
          interest_type: OperationType | null;
          budget_min: number | null;
          budget_max: number | null;
          desired_city: string | null;
          desired_neighborhood: string | null;
          bedrooms_needed: number | null;
          move_in_date: string | null;
          financing_needed: boolean | null;
          pets: boolean | null;
          notes: string | null;
          qualification_status: LeadQualificationStatus;
          score: number | null;
          assigned_to: string | null;
          pipeline_stage_id: string | null;
          is_human_handoff_required: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          source?: string | null;
          source_details?: Json;
          interest_type?: OperationType | null;
          budget_min?: number | null;
          budget_max?: number | null;
          desired_city?: string | null;
          desired_neighborhood?: string | null;
          bedrooms_needed?: number | null;
          move_in_date?: string | null;
          financing_needed?: boolean | null;
          pets?: boolean | null;
          notes?: string | null;
          qualification_status?: LeadQualificationStatus;
          score?: number | null;
          assigned_to?: string | null;
          pipeline_stage_id?: string | null;
          is_human_handoff_required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          tenant_id: string;
          channel_id: string;
          lead_id: string | null;
          property_id: string | null;
          assigned_to: string | null;
          status: ConversationStatus;
          contact_identifier: string | null;
          contact_display_name: string | null;
          handoff_reason: string | null;
          last_message_at: string | null;
          closed_at: string | null;
          ai_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          channel_id: string;
          lead_id?: string | null;
          property_id?: string | null;
          assigned_to?: string | null;
          status?: ConversationStatus;
          contact_identifier?: string | null;
          contact_display_name?: string | null;
          handoff_reason?: string | null;
          last_message_at?: string | null;
          closed_at?: string | null;
          ai_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["conversations"]["Insert"]
        >;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          tenant_id: string;
          conversation_id: string;
          sender_type: string;
          direction: "inbound" | "outbound";
          external_message_id: string | null;
          content: string | null;
          content_type: string;
          message_status: string;
          error_message: string | null;
          raw_payload: Json;
          sent_at: string | null;
          delivered_at: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          conversation_id: string;
          sender_type: string;
          direction: "inbound" | "outbound";
          external_message_id?: string | null;
          content?: string | null;
          content_type?: string;
          message_status?: string;
          error_message?: string | null;
          raw_payload?: Json;
          sent_at?: string | null;
          delivered_at?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          tenant_id: string;
          question: string;
          answer: string;
          category: string | null;
          status: "active" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          question: string;
          answer: string;
          category?: string | null;
          status?: "active" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          tenant_id: string;
          lead_id: string;
          property_id: string | null;
          advisor_id: string | null;
          scheduled_at: string;
          status: AppointmentStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          lead_id: string;
          property_id?: string | null;
          advisor_id?: string | null;
          scheduled_at: string;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["appointments"]["Insert"]>;
        Relationships: [];
      };
      lead_stage_history: {
        Row: {
          id: string;
          tenant_id: string;
          lead_id: string;
          stage_id: string;
          changed_by: string | null;
          changed_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          lead_id: string;
          stage_id: string;
          changed_by?: string | null;
          changed_at?: string;
          notes?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["lead_stage_history"]["Insert"]
        >;
        Relationships: [];
      };
      whatsapp_message_templates: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          language: string;
          category: string | null;
          status: string;
          components: Json;
          is_active: boolean;
          status_updated_by: string | null;
          status_updated_at: string | null;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          language?: string;
          category?: string | null;
          status?: string;
          components?: Json;
          is_active?: boolean;
          status_updated_by?: string | null;
          status_updated_at?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["whatsapp_message_templates"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "whatsapp_message_templates_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      channel_events: {
        Row: {
          id: string;
          tenant_id: string | null;
          channel_id: string | null;
          provider: string | null;
          event_type: string;
          direction: "inbound" | "outbound" | null;
          external_event_id: string | null;
          payload: Json;
          processing_status: string;
          error_message: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          channel_id?: string | null;
          provider?: string | null;
          event_type: string;
          direction?: "inbound" | "outbound" | null;
          external_event_id?: string | null;
          payload?: Json;
          processing_status?: string;
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["channel_events"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
