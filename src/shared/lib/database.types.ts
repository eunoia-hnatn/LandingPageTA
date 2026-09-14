// Type DB — bản viết tay tối thiểu cho Module Auth.
// TODO: khi có quyền CLI, thay bằng `supabase gen types typescript --linked > src/shared/lib/database.types.ts`
export type AppRole = "super_admin" | "marketing" | "cskh";

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  role: AppRole;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLogRow {
  id: number;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  diff: Record<string, unknown>;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & Pick<ProfileRow, "id" | "email">;
        Update: Partial<ProfileRow>;
      };
      audit_log: {
        Row: AuditLogRow;
        Insert: Partial<AuditLogRow> & Pick<AuditLogRow, "action" | "entity">;
        Update: Partial<AuditLogRow>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_app_role: { Args: Record<string, never>; Returns: AppRole };
    };
    Enums: {
      app_role: AppRole;
    };
  };
}
