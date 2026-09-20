-- Seed data for Crop Guides (Ragi/Finger Millet, Paddy/Rice, Maize, Sugarcane, Cotton, Coffee, Coconut)

INSERT INTO public.crop_guides (crop_name_en, crop_name_kn, season, soil_type, water_needs, fertilizer_schedule, harvest_time, content_en, content_kn) VALUES
(
  'Finger Millet (Ragi)',
  'ರಾಗಿ (Finger Millet)',
  'Kharif (July - Nov) / Late Kharif',
  'Red loamy, sandy loam, or clay loam soils with pH 4.5 - 7.5',
  'Low to Moderate (350 - 500 mm rainfall)',
  'Basal: 40kg N, 20kg P, 20kg K per hectare. Top dressing with 20kg N at 30 days after sowing.',
  '100 - 120 days after sowing when earheads turn brown',
  'Ragi is Karnataka staple food grain. Highly drought resistant. Requires good weed control in first 35 days. Common diseases: Ragi Blast (treat with Tricyclazole) and Stem Borer.',
  'ರಾಗಿ ಕರ್ನಾಟಕದ ಮುಖ್ಯ ಆಹಾರ ಧಾನ್ಯವಾಗಿದೆ. ಅತ್ಯಂತ ಬರಾವು ನಿರೋಧಕ. ಬಿತ್ತನೆಯ ನಂತರ ಮೊದಲ 35 ದಿನಗಳಲ್ಲಿ ಉತ್ತಮ ಕಳೆ ನಿಯಂತ್ರಣ ಅಗತ್ಯವಿದೆ. ಪ್ರಮುಖ ರೋಗಗಳು: ರಾಗಿ ಬೆಂಕಿ ರೋಗ (ಟ್ರೈಸೈಕ್ಲಾಜೋಲ್‌ನಿಂದ ಉಪಚರಿಸಿ) ಮತ್ತು ಕಾಂಡ ಕೊರೆಯುವ ಕೀಟ.',
  'Kharif', 'Red Loam', 'Moderate', '40:20:20 NPK kg/ha', '110 Days', 'Standard guide', 'ಸಾಮಾನ್ಯ ಕೈಪಿಡಿ'
),
(
  'Paddy (Rice)',
  'ಭತ್ತ (Rice / Paddy)',
  'Kharif / Rabi (Water intensive)',
  'Clay or clay loam soils retaining water with pH 5.5 - 6.5',
  'High (1200 - 1500 mm rainfall / standing water)',
  '100kg N, 50kg P, 50kg K per hectare split into 3 doses (Basal, Tillering, Panicle Initiation).',
  '120 - 140 days when 80% grains turn golden yellow',
  'Paddy requires continuous field standing water maintenance. Apply Zinc Sulfate (25 kg/ha) to prevent Khaira disease. Watch out for Brown Planthopper (BPH) and Bacterial Leaf Blight.',
  'ಭತ್ತದ ಬೆಳೆಗೆ ನಿರಂತರ ನೀರಿನ ಅಗತ್ಯವಿದೆ. ಖೈರಾ ರೋಗವನ್ನು ತಡೆಗಟ್ಟಲು ಝಿಂಕ್ ಸಲ್ಫೇಟ್ (25 ಕೆಜಿ/ಹೆಕ್ಟೇರ್) ಬಳಸಿ. ಕಂದು ಜಿಗಿ ಹುಳು (BPH) ಮತ್ತು ಬ್ಯಾಕ್ಟೀರಿಯಾದ ಎಲೆ ಒಣಗುವ ರೋಗದ ಬಗ್ಗೆ ಜಾಗರೂಕರಾಗಿರಿ.',
  'Kharif/Rabi', 'Clay Loam', 'High', '100:50:50 NPK kg/ha', '135 Days', 'Paddy guide', 'ಭತ್ತದ ಕೈಪಿಡಿ'
),
(
  'Maize (Corn)',
  'ಮೆಕ್ಕೆಜೋಳ (Maize / Corn)',
  'Kharif & Rabi',
  'Deep well-drained fertile loamy soils with pH 6.5 - 7.5',
  'Moderate (500 - 750 mm)',
  '150kg N, 75kg P, 40kg K per hectare. Top dress N at knee-high and tasseling stages.',
  '90 - 110 days when cobs husk turns dry and brownish',
  'Maize is vulnerable to Fall Armyworm (FAW). Inspect whorls regularly and apply Emamectin Benzoate 5% SG at early larval infestation. Ensure no waterlogging.',
  'ಮೆಕ್ಕೆಜೋಳವು ಲಟಾನ್/ಸೈನಿಕ ಹುಳು (Fall Armyworm) ದಾಳಿಗೆ ತುತ್ತಾಗುತ್ತದೆ. ಸುಳಿಯನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಆರಂಭಿಕ ಹಂತದಲ್ಲಿ ಎಮಾಮೆಕ್ಟಿನ್ ಬೆಂಜೋಯಿಟ್ ಬಳಸಿ. ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
  'Kharif/Rabi', 'Loamy', 'Moderate', '150:75:40 NPK kg/ha', '100 Days', 'Maize guide', 'ಮೆಕ್ಕೆಜೋಳ ಕೈಪಿಡಿ'
),
(
  'Sugarcane',
  'ಕಬ್ಬು (Sugarcane)',
  'Annual / Perennial (12-14 Months)',
  'Deep rich alluvial or black clay soils with pH 6.5 - 8.0',
  'Very High (1500 - 2500 mm)',
  '250kg N, 75kg P, 75kg K per hectare in split doses. Apply pressmud or FYM organic manure.',
   me360 - 420 days when Brix sugar hydrometer reading > 18%',
  'Sugarcane requires heavy irrigation during tillering phase. Common threats: Early Shoot Borer and Red Rot disease. Earth up soil at 4 months to prevent lodging.',
  'ಕಬ್ಬಿಗೆ ಕಾಯಿಲೆಯಲ್ಲಿ ಹೆಚ್ಚು ನೀರಿನ ಅಗತ್ಯವಿರುತ್ತದೆ. ಪ್ರಮುಖ ಬೆದರಿಕೆಗಳು: ಬಾಲ್ಯದ ಸುಳಿ ಕೊರೆಯುವ ಹುಳು ಮತ್ತು ಕೆಂಪು ಕೊಳೆ ರೋಗ. ಗಿಡಗಳು ಬಾರದಂತೆ 4 ತಿಂಗಳಲ್ಲಿ ಮಣ್ಣು ಏರಿಸಿ.',
  'Annual', 'Black Alluvial', 'Very High', '250:75:75 NPK kg/ha', '12 Months', 'Sugarcane guide', 'ಕಬ್ಬು ಕೈಪಿಡಿ'
),
(
  'Arecanut (Betel Nut)',
  'ಅಡಿಕೆ (Arecanut)',
  'Perennial Plantation',
  'Deep well-drained red laterite or gravelly clay soil',
  'High & constant soil moisture',
  '100g N, 40g P, 140g K per palm per year + 12 kg green leaf manure.',
  'Harvested from September to January as tender (Kotte) or ripe nuts',
  'Major fungal threat in Malnad and Coastal Karnataka is Fruit Rot / Kole Roga (Phytophthora meadii). Spray 1% Bordeaux mixture before monsoon starts and during break.',
  'ಮಲೆನಾಡು ಮತ್ತು ಕರಾವಳಿಯಲ್ಲಿ ಪ್ರಮುಖ ಶಿಲೀಂಧ್ರ ಬೆದರಿಕೆ ಕೊಳೆ ರೋಗ (ಕೋಲೆ ರೋಗ). ಮುಂಗಾರು ಆರಂಭವಾಗುವ ಮೊದಲು 1% ಬೋರ್ಡೋ ಮಿಶ್ರಣವನ್ನು ಸಿಂಪಡಿಸಿ.',
  'Perennial', 'Red Laterite', 'High', '100g:40g:140g NPK/palm', 'Yearly Harvest', 'Arecanut guide', 'ಅಡಿಕೆ ಬೆಳೆ ಕೈಪಿಡಿ'
),
(
  'Coffee (Arabica / Robusta)',
  'ಕಾಫಿ (Coffee)',
  'Perennial Plantation (Western Ghats)',
  'Deep friable organic-rich jungle soil pH 6.0 - 6.5',
  'Moderate with distinct dry spell for blossoming',
  '120kg N, 90kg P, 120kg K per hectare divided into pre-monsoon and post-monsoon applications.',
  'November to February (Selective picking of ripe red cherries)',
  'Requires two-tier shade trees (Dadap, Silver Oak). Watch for Coffee White Stem Borer (Arabica) and Coffee Leaf Rust (Hemileia vastatrix). Spray 0.5% Bordeaux mixture.',
  'ಎರಡು ಹಂತದ ನೆರಳಿನ ಮರಗಳು ಅಗತ್ಯವಿದೆ. ಕಾಫಿ ಬಿಳಿ ಕಾಂಡ ಕೊರೆಯುವ ಹುಳು ಮತ್ತು ಎಲೆ ಮಚ್ಚೆ ರೋಗ (ಕಾಫಿ ರಸ್ಟ್) ಬಗ್ಗೆ ಗಮನವಿರಲಿ. 0.5% ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಸಿಂಪಡಿಸಿ.',
  'Perennial', 'Jungle Loam', 'Moderate', '120:90:120 NPK kg/ha', 'Nov-Feb Harvest', 'Coffee guide', 'ಕಾಫಿ ಬೆಳೆ ಕೈಪಿಡಿ'
);
