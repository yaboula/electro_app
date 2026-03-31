import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const mockOrder = {
  id: "12345678-abcd-4321-efgh-000000000001",
  customerName: "Mohammed Alaoui",
  phone: "+212612345678",
  city: "Casablanca",
  items: [
    {
      name: "PS5 Console",
      condition: "NUEVO",
      price: 7000,
    },
  ],
  total: 7000,
};

describe("buildWhatsAppUrl", () => {
  it("returns a valid wa.me URL", () => {
    const url = buildWhatsAppUrl(mockOrder);
    expect(url).toMatch(/^https:\/\/wa\.me\//);
  });

  it("URL is properly encoded (no raw spaces)", () => {
    const url = buildWhatsAppUrl(mockOrder);
    expect(url).not.toContain(" ");
  });

  it("includes the order ID (first 8 chars) in the message", () => {
    const url = buildWhatsAppUrl(mockOrder);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("12345678");
  });

  it("includes customer name in the message", () => {
    const url = buildWhatsAppUrl(mockOrder);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Mohammed Alaoui");
  });

  it("includes city in the message", () => {
    const url = buildWhatsAppUrl(mockOrder);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Casablanca");
  });

  it("includes total in MAD format", () => {
    const url = buildWhatsAppUrl(mockOrder);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("MAD");
  });

  it("includes COD payment mention", () => {
    const url = buildWhatsAppUrl(mockOrder);
    const decoded = decodeURIComponent(url);
    expect(decoded.toLowerCase()).toMatch(/livraison|cod/i);
  });

  it("uses 'Occasion Grade A' label for USADO_A condition", () => {
    const order = {
      ...mockOrder,
      items: [{ name: "PS4 Slim", condition: "USADO_A", price: 2500 }],
    };
    const url = buildWhatsAppUrl(order);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Occasion Grade A");
  });

  it("uses 'Occasion Grade B' label for USADO_B condition", () => {
    const order = {
      ...mockOrder,
      items: [{ name: "PS4 Pro", condition: "USADO_B", price: 2000 }],
    };
    const url = buildWhatsAppUrl(order);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Occasion Grade B");
  });

  it("uses 'Neuf' label for NUEVO condition", () => {
    const url = buildWhatsAppUrl(mockOrder);
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("Neuf");
  });

  it("uses NEXT_PUBLIC_ADMIN_WHATSAPP env var when set", () => {
    vi.stubEnv("NEXT_PUBLIC_ADMIN_WHATSAPP", "212700000001");
    const url = buildWhatsAppUrl(mockOrder);
    expect(url).toContain("212700000001");
    vi.unstubAllEnvs();
  });

  it("falls back to default phone when env var not set", () => {
    vi.unstubAllEnvs();
    const url = buildWhatsAppUrl(mockOrder);
    expect(url).toMatch(/wa\.me\/\d+/);
  });
});
