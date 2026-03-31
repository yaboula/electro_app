-- ============================================================
-- ELECTRO.ma — Test Seed Data
-- Run in Supabase SQL Editor before E2E tests.
-- Safe to run multiple times (uses ON CONFLICT DO NOTHING).
-- ============================================================

-- ── Products ──────────────────────────────────────────────────────────────

INSERT INTO products (id, title, slug, platform, type, base_description, is_published)
VALUES
  (
    'aaaaaaaa-0001-4000-a000-000000000001',
    'PlayStation 5 Console',
    'playstation-5-console',
    'PS5',
    'console',
    'La console next-gen de Sony. 4K, 120fps, SSD ultra-rapide. Includes DualSense controller.',
    true
  ),
  (
    'aaaaaaaa-0002-4000-a000-000000000002',
    'FIFA 25 PS5',
    'fifa-25-ps5',
    'PS5',
    'game',
    'Le jeu de football le plus populaire au monde. Saison 2025 avec nouvelles équipes marocaines.',
    true
  ),
  (
    'aaaaaaaa-0003-4000-a000-000000000003',
    'Xbox Series X',
    'xbox-series-x',
    'Xbox Series',
    'console',
    'La console Xbox la plus puissante jamais créée. 4K natif, 120fps, Game Pass compatible.',
    true
  ),
  (
    'aaaaaaaa-0004-4000-a000-000000000004',
    'DualSense PlayStation 5',
    'dualsense-ps5',
    'PS5',
    'accessory',
    'Manette sans fil DualSense pour PS5. Retour haptique et gâchettes adaptatives.',
    true
  ),
  (
    'aaaaaaaa-0005-4000-a000-000000000005',
    'Nintendo Switch OLED',
    'nintendo-switch-oled',
    'Nintendo Switch',
    'console',
    'Nouvelle Nintendo Switch avec écran OLED 7 pouces. Idéale pour jouer partout.',
    true
  ),
  (
    'aaaaaaaa-0006-4000-a000-000000000006',
    'Produit Non Publié',
    'produit-non-publie',
    'PC',
    'accessory',
    'Ce produit ne doit pas apparaître dans le storefront.',
    false
  )
ON CONFLICT (id) DO NOTHING;

-- ── Inventory Items ───────────────────────────────────────────────────────

INSERT INTO inventory_items (id, product_id, condition, serial_number, grade_notes, stock_quantity, price, is_active)
VALUES
  -- PS5 Console — Neuf, 2 en stock
  (
    'bbbbbbbb-0001-4000-b000-000000000001',
    'aaaaaaaa-0001-4000-a000-000000000001',
    'NUEVO',
    NULL,
    NULL,
    2,
    7500.00,
    true
  ),
  -- PS5 Console — Occasion Grade A (unique)
  (
    'bbbbbbbb-0002-4000-b000-000000000002',
    'aaaaaaaa-0001-4000-a000-000000000001',
    'USADO_A',
    'SN-PS5-TEST-001',
    'Très bon état. Quelques traces légères sur la façade.',
    1,
    5800.00,
    true
  ),
  -- PS5 Console — Occasion Grade B (unique)
  (
    'bbbbbbbb-0003-4000-b000-000000000003',
    'aaaaaaaa-0001-4000-a000-000000000001',
    'USADO_B',
    'SN-PS5-TEST-002',
    'Bon état fonctionnel. Rayures visibles sur le dessus.',
    1,
    4500.00,
    true
  ),
  -- FIFA 25 — Neuf
  (
    'bbbbbbbb-0004-4000-b000-000000000004',
    'aaaaaaaa-0002-4000-a000-000000000002',
    'NUEVO',
    NULL,
    NULL,
    5,
    450.00,
    true
  ),
  -- Xbox Series X — Neuf
  (
    'bbbbbbbb-0005-4000-b000-000000000005',
    'aaaaaaaa-0003-4000-a000-000000000003',
    'NUEVO',
    NULL,
    NULL,
    1,
    8200.00,
    true
  ),
  -- DualSense — Neuf
  (
    'bbbbbbbb-0006-4000-b000-000000000006',
    'aaaaaaaa-0004-4000-a000-000000000004',
    'NUEVO',
    NULL,
    NULL,
    3,
    750.00,
    true
  ),
  -- Nintendo Switch OLED — Occasion Grade A
  (
    'bbbbbbbb-0007-4000-b000-000000000007',
    'aaaaaaaa-0005-4000-a000-000000000005',
    'USADO_A',
    'SN-NSW-TEST-001',
    'Comme neuf, acheté il y a 3 mois.',
    1,
    3200.00,
    true
  ),
  -- Item inactif (ne doit pas apparaître)
  (
    'bbbbbbbb-0008-4000-b000-000000000008',
    'aaaaaaaa-0004-4000-a000-000000000004',
    'NUEVO',
    NULL,
    NULL,
    0,
    600.00,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- ── Test Customer ─────────────────────────────────────────────────────────

INSERT INTO customers (id, phone, full_name, default_city)
VALUES
  (
    'cccccccc-0001-4000-c000-000000000001',
    '+212612345678',
    'Test Client E2E',
    'Casablanca'
  )
ON CONFLICT (phone) DO NOTHING;

-- ── Verification queries ──────────────────────────────────────────────────

-- Run these to verify seed was applied correctly:
-- SELECT count(*) FROM products WHERE is_published = true;         -- should be 5
-- SELECT count(*) FROM inventory_items WHERE is_active = true;     -- should be 7
-- SELECT count(*) FROM inventory_items WHERE condition != 'NUEVO'; -- should be 3 (used items)
