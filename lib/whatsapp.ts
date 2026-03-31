import { formatMAD } from "./utils";

interface OrderSummary {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  items: { name: string; condition: string; price: number }[];
  total: number;
}

const conditionLabels: Record<string, string> = {
  NUEVO: "Neuf",
  USADO_A: "Occasion Grade A",
  USADO_B: "Occasion Grade B",
};

export function buildWhatsAppUrl(order: OrderSummary): string {
  const adminPhone =
    process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000";

  const message = [
    `🎮 *Nouvelle Commande ELECTRO.ma*`,
    ``,
    `📋 *Commande:* #${order.id.slice(0, 8).toUpperCase()}`,
    `👤 *Client:* ${order.customerName}`,
    `📞 *Tél:* ${order.phone}`,
    `🏙️ *Ville:* ${order.city}`,
    ``,
    `📦 *Articles:*`,
    ...order.items.map(
      (item) =>
        `  • ${item.name} (${conditionLabels[item.condition] ?? item.condition}) — ${formatMAD(item.price)}`
    ),
    ``,
    `💰 *Total: ${formatMAD(order.total)}*`,
    `💳 *Paiement:* À la livraison (COD)`,
    ``,
    `✅ Merci de confirmer cette commande.`,
  ].join("\n");

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
}
