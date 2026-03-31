/**
 * Manual type definitions matching the Supabase schema.
 * Replace with auto-generated types once the DB is provisioned:
 *   npx supabase gen types typescript --project-id <id> > types/database.types.ts
 */
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          platform: string;
          type: string;
          base_description: string;
          main_image_url: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          platform: string;
          type?: string;
          base_description?: string;
          main_image_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          platform?: string;
          type?: string;
          base_description?: string;
          main_image_url?: string | null;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      inventory_items: {
        Row: {
          id: string;
          product_id: string;
          condition: "NUEVO" | "USADO_A" | "USADO_B";
          serial_number: string | null;
          grade_notes: string | null;
          stock_quantity: number;
          price: number;
          extra_images: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          condition?: "NUEVO" | "USADO_A" | "USADO_B";
          serial_number?: string | null;
          grade_notes?: string | null;
          stock_quantity?: number;
          price: number;
          extra_images?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          condition?: "NUEVO" | "USADO_A" | "USADO_B";
          serial_number?: string | null;
          grade_notes?: string | null;
          stock_quantity?: number;
          price?: number;
          extra_images?: string[];
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inventory_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      customers: {
        Row: {
          id: string;
          phone: string;
          full_name: string;
          default_city: string | null;
          successful_deliveries: number;
          failed_deliveries: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          full_name: string;
          default_city?: string | null;
          successful_deliveries?: number;
          failed_deliveries?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          full_name?: string;
          default_city?: string | null;
          successful_deliveries?: number;
          failed_deliveries?: number;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          delivery_name: string;
          delivery_phone: string;
          city: string;
          address: string;
          total_amount: number;
          status: "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "RTO";
          dispatch_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          delivery_name: string;
          delivery_phone: string;
          city: string;
          address: string;
          total_amount: number;
          status?: "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "RTO";
          dispatch_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          delivery_name?: string;
          delivery_phone?: string;
          city?: string;
          address?: string;
          total_amount?: number;
          status?: "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "RTO";
          dispatch_notes?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          inventory_item_id: string;
          quantity: number;
          unit_price_at_purchase: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          inventory_item_id: string;
          quantity?: number;
          unit_price_at_purchase: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          inventory_item_id?: string;
          quantity?: number;
          unit_price_at_purchase?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_inventory_item_id_fkey";
            columns: ["inventory_item_id"];
            isOneToOne: false;
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_order_atomic: {
        Args: {
          p_inventory_item_id: string;
          p_quantity: number;
          p_full_name: string;
          p_phone: string;
          p_city: string;
          p_address: string;
        };
        Returns: {
          success: boolean;
          order_id?: string;
          customer_id?: string;
          product_title?: string;
          condition?: string;
          total?: number;
          error?: string;
        };
      };
      normalize_moroccan_phone: {
        Args: { raw_phone: string };
        Returns: string;
      };
    };
    Enums: {
      product_condition: "NUEVO" | "USADO_A" | "USADO_B";
      order_status: "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "RTO";
    };
  };
};
