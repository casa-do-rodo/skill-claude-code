// Tipos manuais do schema `facioflow_dashboard`.
// generate_typescript_types do MCP só cobre `public`, então mantemos manual.
// Sempre que alterar a migration, atualizar aqui.

export type Database = {
  facioflow_dashboard: {
    Tables: {
      spaces: {
        Row: {
          id: string;
          name: string;
          type: 'client' | 'internal';
          created_at: string;
          last_synced_at: string;
        };
        Insert: {
          id: string;
          name: string;
          type?: 'client' | 'internal';
          created_at?: string;
          last_synced_at?: string;
        };
        Update: Partial<{
          name: string;
          type: 'client' | 'internal';
          last_synced_at: string;
        }>;
        Relationships: [];
      };
      folders: {
        Row: {
          id: string;
          space_id: string;
          name: string;
          last_synced_at: string;
        };
        Insert: {
          id: string;
          space_id: string;
          name: string;
          last_synced_at?: string;
        };
        Update: Partial<{
          name: string;
          space_id: string;
          last_synced_at: string;
        }>;
        Relationships: [
          {
            foreignKeyName: 'folders_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          }
        ];
      };
      lists: {
        Row: {
          id: string;
          folder_id: string;
          name: string;
          order_index: number | null;
          last_synced_at: string;
        };
        Insert: {
          id: string;
          folder_id: string;
          name: string;
          order_index?: number | null;
          last_synced_at?: string;
        };
        Update: Partial<{
          name: string;
          folder_id: string;
          order_index: number | null;
          last_synced_at: string;
        }>;
        Relationships: [
          {
            foreignKeyName: 'lists_folder_id_fkey';
            columns: ['folder_id'];
            isOneToOne: false;
            referencedRelation: 'folders';
            referencedColumns: ['id'];
          }
        ];
      };
      tasks: {
        Row: {
          id: string;
          list_id: string;
          name: string;
          status: string;
          priority: string | null;
          due_date: string | null;
          url: string | null;
          date_created: string | null;
          date_updated: string | null;
          last_synced_at: string;
        };
        Insert: {
          id: string;
          list_id: string;
          name: string;
          status: string;
          priority?: string | null;
          due_date?: string | null;
          url?: string | null;
          date_created?: string | null;
          date_updated?: string | null;
          last_synced_at?: string;
        };
        Update: Partial<{
          name: string;
          status: string;
          priority: string | null;
          due_date: string | null;
          url: string | null;
          date_updated: string | null;
          last_synced_at: string;
        }>;
        Relationships: [
          {
            foreignKeyName: 'tasks_list_id_fkey';
            columns: ['list_id'];
            isOneToOne: false;
            referencedRelation: 'lists';
            referencedColumns: ['id'];
          }
        ];
      };
      sync_log: {
        Row: {
          id: string;
          started_at: string;
          finished_at: string | null;
          spaces_synced: number;
          tasks_synced: number;
          status: 'running' | 'success' | 'error';
          error_message: string | null;
        };
        Insert: {
          id?: string;
          started_at?: string;
          finished_at?: string | null;
          spaces_synced?: number;
          tasks_synced?: number;
          status?: 'running' | 'success' | 'error';
          error_message?: string | null;
        };
        Update: Partial<{
          finished_at: string | null;
          spaces_synced: number;
          tasks_synced: number;
          status: 'running' | 'success' | 'error';
          error_message: string | null;
        }>;
        Relationships: [];
      };
      kpi_snapshots: {
        Row: {
          id: string;
          captured_at: string;
          total_tasks: number | null;
          completed_tasks: number | null;
          by_status: Record<string, number> | null;
          by_space: Record<string, { total: number; complete: number }> | null;
        };
        Insert: {
          id?: string;
          captured_at?: string;
          total_tasks?: number | null;
          completed_tasks?: number | null;
          by_status?: Record<string, number> | null;
          by_space?: Record<string, { total: number; complete: number }> | null;
        };
        Update: Partial<{
          total_tasks: number | null;
          completed_tasks: number | null;
          by_status: Record<string, number> | null;
          by_space: Record<string, { total: number; complete: number }> | null;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
