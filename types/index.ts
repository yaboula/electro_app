export type ProductCondition = "NUEVO" | "USADO_A" | "USADO_B";

export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "ENVIADO"
  | "ENTREGADO"
  | "RTO";

export interface Product {
  id: string;
  title: string;
  platform: string;
  type: string;
  base_description: string;
  main_image_url: string;
  is_published: boolean;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  product_id: string;
  condition: ProductCondition;
  serial_number: string | null;
  stock_quantity: number;
  price: number;
  extra_images: string[];
  created_at: string;
}

export interface Customer {
  id: string;
  phone: string;
  full_name: string;
  default_city: string | null;
  successful_deliveries: number;
  failed_deliveries: number;
}

export interface Order {
  id: string;
  customer_id: string;
  delivery_name: string;
  delivery_phone: string;
  city: string;
  address: string;
  total_amount: number;
  status: OrderStatus;
  dispatch_notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  inventory_item_id: string;
  quantity: number;
  unit_price_at_purchase: number;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { inventory_item: InventoryItem & { product: Product } })[];
  customer: Customer;
}
