-- Seed market prices data for major Karnataka APMCs, Coffee Board, Coconut Board

INSERT INTO public.market_prices (crop, market, district, price, unit, date, source) VALUES
('Ragi (Finger Millet)', 'Mandya APMC', 'Mandya', 3450.00, 'Quintal', CURRENT_DATE, 'KRAMA Karnataka'),
('Ragi (Finger Millet)', 'Mandya APMC', 'Mandya', 3420.00, 'Quintal', CURRENT_DATE - INTERVAL '1 day', 'KRAMA Karnataka'),
('Ragi (Finger Millet)', 'Mandya APMC', 'Mandya', 3400.00, 'Quintal', CURRENT_DATE - INTERVAL '2 days', 'KRAMA Karnataka'),
('Ragi (Finger Millet)', 'Mandya APMC', 'Mandya', 3380.00, 'Quintal', CURRENT_DATE - INTERVAL '3 days', 'KRAMA Karnataka'),
('Ragi (Finger Millet)', 'Mandya APMC', 'Mandya', 3350.00, 'Quintal', CURRENT_DATE - INTERVAL '4 days', 'KRAMA Karnataka'),
('Ragi (Finger Millet)', 'Mandya APMC', 'Mandya', 3320.00, 'Quintal', CURRENT_DATE - INTERVAL '5 days', 'KRAMA Karnataka'),
('Ragi (Finger Millet)', 'Mandya APMC', 'Mandya', 3300.00, 'Quintal', CURRENT_DATE - INTERVAL '6 days', 'KRAMA Karnataka'),

('Paddy (Sona Masuri)', 'Raichur APMC', 'Raichur', 2480.00, 'Quintal', CURRENT_DATE, 'KRAMA Karnataka'),
('Paddy (Sona Masuri)', 'Raichur APMC', 'Raichur', 2460.00, 'Quintal', CURRENT_DATE - INTERVAL '1 day', 'KRAMA Karnataka'),
('Paddy (Sona Masuri)', 'Raichur APMC', 'Raichur', 2450.00, 'Quintal', CURRENT_DATE - INTERVAL '2 days', 'KRAMA Karnataka'),

('Maize (Yellow)', 'Davangere APMC', 'Davangere', 2250.00, 'Quintal', CURRENT_DATE, 'KRAMA Karnataka'),
('Maize (Yellow)', 'Davangere APMC', 'Davangere', 2240.00, 'Quintal', CURRENT_DATE - INTERVAL '1 day', 'KRAMA Karnataka'),
('Maize (Yellow)', 'Davangere APMC', 'Davangere', 2210.00, 'Quintal', CURRENT_DATE - INTERVAL '2 days', 'KRAMA Karnataka'),

('Sugarcane', 'Belagavi Market', 'Belagavi', 3150.00, 'Ton', CURRENT_DATE, 'KRAMA Karnataka'),
('Sugarcane', 'Belagavi Market', 'Belagavi', 3100.00, 'Ton', CURRENT_DATE - INTERVAL '1 day', 'KRAMA Karnataka'),

('Arecanut (Rashi)', 'Shivamogga APMC', 'Shivamogga', 51200.00, 'Quintal', CURRENT_DATE, 'KRAMA Karnataka'),
('Arecanut (Rashi)', 'Shivamogga APMC', 'Shivamogga', 51000.00, 'Quintal', CURRENT_DATE - INTERVAL '1 day', 'KRAMA Karnataka'),
('Arecanut (Rashi)', 'Shivamogga APMC', 'Shivamogga', 50500.00, 'Quintal', CURRENT_DATE - INTERVAL '2 days', 'KRAMA Karnataka'),

('Arabica Coffee Parchment', 'Chikmagalur Market', 'Chikmagalur', 18500.00, '50 Kg Bag', CURRENT_DATE, 'Coffee Board of India'),
('Arabica Coffee Parchment', 'Chikmagalur Market', 'Chikmagalur', 18400.00, '50 Kg Bag', CURRENT_DATE - INTERVAL '1 day', 'Coffee Board of India'),

('Robusta Coffee Cherry', 'Kodagu / Madikeri', 'Kodagu', 8200.00, '50 Kg Bag', CURRENT_DATE, 'Coffee Board of India'),
('Robusta Coffee Cherry', 'Kodagu / Madikeri', 'Kodagu', 8150.00, '50 Kg Bag', CURRENT_DATE - INTERVAL '1 day', 'Coffee Board of India'),

('Tender Coconut', 'Maddur Coconut Market', 'Mandya', 28.00, 'Piece', CURRENT_DATE, 'Coconut Development Board'),
('Tender Coconut', 'Maddur Coconut Market', 'Mandya', 27.50, 'Piece', CURRENT_DATE - INTERVAL '1 day', 'Coconut Development Board'),
('Dry Coconut (Copra)', 'Tiptur APMC', 'Tumakuru', 11500.00, 'Quintal', CURRENT_DATE, 'Coconut Development Board'),
('Dry Coconut (Copra)', 'Tiptur APMC', 'Tumakuru', 11400.00, 'Quintal', CURRENT_DATE - INTERVAL '1 day', 'Coconut Development Board');
