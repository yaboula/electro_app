import { MessageCircle } from "lucide-react";

export function WhatsAppLink({
  phone,
  orderId,
  children,
}: {
  phone: string;
  orderId?: string;
  children?: React.ReactNode;
}) {
  const cleanPhone = phone.replace(/[^0-9+]/g, "").replace("+", "");
  const message = orderId
    ? encodeURIComponent(
        `Bonjour! Concernant votre commande #${orderId.slice(0, 8).toUpperCase()} sur ELECTRO.ma...`
      )
    : "";

  const href = `https://wa.me/${cleanPhone}${message ? `?text=${message}` : ""}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors"
    >
      <MessageCircle className="h-3 w-3" />
      {children ?? phone}
    </a>
  );
}
