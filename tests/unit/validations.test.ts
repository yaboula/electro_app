import { describe, it, expect } from "vitest";
import {
  loginSchema,
  productSchema,
  inventoryItemSchema,
  checkoutSchema,
  moroccanPhoneSchema,
} from "@/lib/validations";

// ── loginSchema ────────────────────────────────────────────────────────────

describe("loginSchema", () => {
  it("passes with valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "admin@electro.ma",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Email invalide");
  });

  it("fails with short password (< 6 chars)", () => {
    const result = loginSchema.safeParse({
      email: "admin@electro.ma",
      password: "123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Mot de passe trop court");
  });
});

// ── moroccanPhoneSchema ────────────────────────────────────────────────────

describe("moroccanPhoneSchema", () => {
  const validNumbers = [
    "0612345678",
    "0712345678",
    "0512345678",
    "+212612345678",
    "+212712345678",
  ];

  const invalidNumbers = [
    "123456789",       // too short, no valid prefix
    "+1612345678",     // US number
    "0812345678",      // invalid prefix (8 not valid in Morocco)
    "06123",           // too short
    "abcdefghij",      // not a number
  ];

  validNumbers.forEach((num) => {
    it(`accepts valid Moroccan number: ${num}`, () => {
      const result = moroccanPhoneSchema.safeParse(num);
      expect(result.success).toBe(true);
    });
  });

  invalidNumbers.forEach((num) => {
    it(`rejects invalid number: ${num}`, () => {
      const result = moroccanPhoneSchema.safeParse(num);
      expect(result.success).toBe(false);
    });
  });
});

// ── productSchema ──────────────────────────────────────────────────────────

describe("productSchema", () => {
  const validProduct = {
    title: "PS5 Console",
    slug: "ps5-console",
    platform: "PS5" as const,
    type: "console" as const,
    base_description: "La console PlayStation 5 de Sony.",
    is_published: false,
  };

  it("passes with valid product data", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("fails with title too short (< 3 chars)", () => {
    const result = productSchema.safeParse({ ...validProduct, title: "PS" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("3");
  });

  it("fails with invalid slug (spaces/uppercase)", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      slug: "Invalid Slug",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("Slug invalide");
  });

  it("accepts valid slug with hyphens and numbers", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      slug: "fifa-24-ps5",
    });
    expect(result.success).toBe(true);
  });

  it("fails with unknown platform", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      platform: "Sega",
    });
    expect(result.success).toBe(false);
  });

  it("fails with description too short (< 10 chars)", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      base_description: "Court",
    });
    expect(result.success).toBe(false);
  });
});

// ── inventoryItemSchema ────────────────────────────────────────────────────

describe("inventoryItemSchema", () => {
  const validUUID = "12345678-1234-4321-abcd-000000000001";

  const baseItem = {
    product_id: validUUID,
    condition: "NUEVO" as const,
    stock_quantity: 5,
    price: 3500,
    is_active: true,
  };

  it("passes for NUEVO condition without serial number", () => {
    const result = inventoryItemSchema.safeParse(baseItem);
    expect(result.success).toBe(true);
  });

  it("fails for USADO_A without serial number", () => {
    const result = inventoryItemSchema.safeParse({
      ...baseItem,
      condition: "USADO_A",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("série");
  });

  it("fails for USADO_B without serial number", () => {
    const result = inventoryItemSchema.safeParse({
      ...baseItem,
      condition: "USADO_B",
    });
    expect(result.success).toBe(false);
  });

  it("passes for USADO_A with serial number", () => {
    const result = inventoryItemSchema.safeParse({
      ...baseItem,
      condition: "USADO_A",
      serial_number: "SN-PS5-001",
    });
    expect(result.success).toBe(true);
  });

  it("fails with negative price", () => {
    const result = inventoryItemSchema.safeParse({ ...baseItem, price: -100 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("prix");
  });

  it("fails with negative stock quantity", () => {
    const result = inventoryItemSchema.safeParse({
      ...baseItem,
      stock_quantity: -1,
    });
    expect(result.success).toBe(false);
  });

  it("fails with invalid product_id (non-UUID)", () => {
    const result = inventoryItemSchema.safeParse({
      ...baseItem,
      product_id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });
});

// ── checkoutSchema ─────────────────────────────────────────────────────────

describe("checkoutSchema", () => {
  const validCheckout = {
    fullName: "Mohammed Alaoui",
    phone: "0612345678",
    city: "Casablanca" as const,
    address: "123 Boulevard Hassan II, Ain Sebaa",
  };

  it("passes with valid checkout data", () => {
    const result = checkoutSchema.safeParse(validCheckout);
    expect(result.success).toBe(true);
  });

  it("fails with name too short (< 3 chars)", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, fullName: "Mo" });
    expect(result.success).toBe(false);
  });

  it("fails with invalid phone number", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      phone: "1234",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("téléphone");
  });

  it("fails with invalid city (not in Moroccan cities list)", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      city: "Paris",
    });
    expect(result.success).toBe(false);
  });

  it("accepts 'Autre' as a valid city", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, city: "Autre" });
    expect(result.success).toBe(true);
  });

  it("fails with address too short (< 10 chars)", () => {
    const result = checkoutSchema.safeParse({ ...validCheckout, address: "Rue 1" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("courte");
  });

  it("fails with address too long (> 500 chars)", () => {
    const result = checkoutSchema.safeParse({
      ...validCheckout,
      address: "A".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
