import type { Database } from "./database.types";

type Tables = Database["public"]["Tables"];
type Enums = Database["public"]["Enums"];

// Row types (what you get from SELECT)
export type Product = Tables["products"]["Row"];
export type InventoryItem = Tables["inventory_items"]["Row"];
export type Customer = Tables["customers"]["Row"];
export type Order = Tables["orders"]["Row"];
export type OrderItem = Tables["order_items"]["Row"];

// Insert types (what you pass to INSERT)
export type ProductInsert = Tables["products"]["Insert"];
export type ProductUpdate = Tables["products"]["Update"];
export type InventoryItemInsert = Tables["inventory_items"]["Insert"];
export type InventoryItemUpdate = Tables["inventory_items"]["Update"];
export type OrderUpdate = Tables["orders"]["Update"];

// Enum types
export type ProductCondition = Enums["product_condition"];
export type OrderStatus = Enums["order_status"];

// Composite types for views with joins
export interface ProductWithInventory extends Product {
  min_price: number;
  has_used: boolean;
  active_items_count: number;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & {
    inventory_item: InventoryItem & { product: Product };
  })[];
  customer: Customer;
}

// RPC return type
export type CreateOrderResult =
  Database["public"]["Functions"]["create_order_atomic"]["Returns"];
