-- =======================================================
-- NATIONWIDE CENTRAL & STATE AGRICULTURAL SCHEMES SEED
-- =======================================================

INSERT INTO public.schemes (name_en, name_kn, description_en, description_kn, eligibility_en, eligibility_kn, benefit_en, benefit_kn, scope, state, category, application_link, deadline) VALUES
-- 1. CENTRAL SCHEMES
(
  'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
  'ಪಿಎಂ-ಕಿಸಾನ್ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ)',
  'Central sector income support scheme providing ₹6,000 annually to all landholding farmer families across India.',
  'ಭಾರತದಾದ್ಯಂತ ಭೂಮಿ ಹೊಂದಿರುವ ಎಲ್ಲಾ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ಆದಾಯ ಬೆಂಬಲ ನೀಡುವ ಕೇಂದ್ರ ಯೋಜನೆ.',
  'Landholding farmer families with cultivable land in their names.',
  'ತಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಸಾಗುವಳಿ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳು.',
  '₹6,000 per year transferred in 3 equal installments of ₹2,000 directly to bank accounts.',
  'ವರ್ಷಕ್ಕೆ ₹6,000 ಮೊತ್ತವನ್ನು ತಲಾ ₹2,000 ರಂತೆ 3 ಕಂತುಗಳಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ.',
  'central', NULL, 'all', 'https://pmkisan.gov.in/', 'Ongoing'
),
(
  'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
  'ಪಿಎಂಎಫ್‌ಬಿವೈ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ)',
  'Nationwide crop insurance scheme offering financial coverage against crop failure due to natural disasters, pests & diseases.',
  'ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳು, ಕೀಟಗಳು ಮತ್ತು ರೋಗಗಳಿಂದ ಬೆಳೆ ಹಾನಿಯಾದಾಗ ಆರ್ಥಿಕ ಭದ್ರತೆ ನೀಡುವ ರಾಷ್ಟ್ರೀಯ ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ.',
  'All farmers growing notified crops in notified areas including sharecroppers & tenant farmers.',
  'ಅಧಿಸೂಚಿತ ಪ್ರದೇಶಗಳಲ್ಲಿ ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯುವ ಗೇಣಿದಾರರು ಸೇರಿದಂತೆ ಎಲ್ಲಾ ರೈತರು.',
  'Minimal premium rates (1.5% Rabi, 2% Kharif, 5% Commercial crops) with full claim coverage.',
  'ಕಡಿಮೆ ಪ್ರೀಮಿಯಂ ದರಗಳು (ರಬಿಗೆ 1.5%, ಖಾರಿಫ್‌ಗೆ 2%) ಮತ್ತು ಸಂಪೂರ್ಣ ನಷ್ಟ ಪರಿಹಾರ.',
  'central', NULL, 'all', 'https://pmfby.gov.in/', 'Pre-Sowing Season'
),
(
  'Kisan Credit Card (KCC)',
  'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (ಕೆಸಿಸಿ)',
  'Provides institutional credit to farmers for agricultural inputs, post-harvest expenses, and animal husbandry/fisheries.',
  'ಬೀಜ, ಗೊಬ್ಬರ, ಕೊಯ್ಲೋತ್ತರ ವೆಚ್ಚಗಳು ಮತ್ತು ಪಶುಸಂಗೋಪನೆಗಾಗಿ ರೈತರಿಗೆ ಸುಲಭ ಸಾಲ ಒದಗಿಸುವ ಯೋಜನೆ.',
  'Farmers, tenant farmers, sharecroppers, and Self-Help Groups (SHGs).',
  'ರೈತರು, ಗೇಣಿದಾರರು, ಪಾಲುದಾರರು ಮತ್ತು ಸ್ವಸಹಾಯ ಗುಂಪುಗಳು.',
  'Subsidized credit up to ₹3 Lakhs at an effective 4% interest rate per annum with prompt repayment.',
  'ವರ್ಷಕ್ಕೆ 4% ರಿಯಾಯಿತಿ ಬಡ್ಡಿದರದಲ್ಲಿ ₹3 ಲಕ್ಷದವರೆಗೆ ಸಾಲ ಸೌಲಭ್ಯ.',
  'central', NULL, 'all', 'https://www.myscheme.gov.in/schemes/kcc', 'Ongoing'
),
(
  'Soil Health Card Scheme',
  'ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆ',
  'Issues periodic soil test reports giving crop-wise nutrient recommendations to farmers to reduce unnecessary fertilizer costs.',
  'ರೈತರ ಭೂಮಿಯ ಮಣ್ಣು ಪರೀಕ್ಷಿಸಿ ಅಗತ್ಯವಿರುವ ಪೋಷಕಾಂಶ ಮತ್ತು ಗೊಬ್ಬರಗಳ ಕುರಿತು ಶಿಫಾರಸು ನೀಡುವ ಯೋಜನೆ.',
  'All landowning farmers across India.',
  'ಭಾರತದಾದ್ಯಂತ ಇರುವ ಎಲ್ಲಾ ಕೃಷಿ ಭೂಮಾಲೀಕರು.',
  'Free soil test report every 3 years with customized NPK and micro-nutrient dosage instructions.',
  'ಪ್ರತಿ 3 ವರ್ಷಗಳಿಗೊಮ್ಮೆ ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷಾ ವರದಿ ಮತ್ತು ಗೊಬ್ಬರ ಬಳಕೆಯ ಮಾರ್ಗದರ್ಶಿ.',
  'central', NULL, 'all', 'https://soilhealth.dac.gov.in/', 'Ongoing'
),
(
  'PM Krishi Sinchayee Yojana (PMKSY)',
  'ಪಿಎಂ ಕೃಷಿ ಸಿಂಚಾಯಿ ಯೋಜನೆ (PMKSY)',
  'Promotes efficient water use ("Per Drop More Crop") through drip and sprinkler micro-irrigation systems.',
  'ಹನಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ವ್ಯವಸ್ಥೆಗಳ ಮೂಲಕ ನೀರನ್ನು ಸಮರ್ಥವಾಗಿ ಬಳಸಲು ಪ್ರೋತ್ಸಾಹಿಸುವ ಯೋಜನೆ.',
  'Farmers owning agricultural land with verified water source.',
  'ನೀರಿನ ಮೂಲ ಹೊಂದಿರುವ ಕೃಷಿ ಭೂಮಾಲೀಕ ರೈತರು.',
  '45% to 55% subsidy for installing drip/sprinkler micro-irrigation equipment.',
  'ಹನಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ಉಪಕರಣಗಳಿಗೆ 45% ರಿಂದ 55% ರವರೆಗೆ ಸಬ್ಸಿಡಿ.',
  'central', NULL, 'small', 'https://pmksy.gov.in/', 'District Agriculture Cycle'
),
(
  'PM-KUSUM (Solar Pump Scheme)',
  'ಪಿಎಂ-ಕುಸುಮ್ (ಸೌರ ಪಂಪ್ ಯೋಜನೆ)',
  'Provides subsidies for installing standalone solar agriculture pumpsets and solarizing grid-connected pumps.',
  'ರೈತರಿಗೆ ಸೌರ ಚಾಲಿತ ನೀರಾವರಿ ಪಂಪ್‌ಸೆಟ್‌ಗಳನ್ನು ಅಳವಡಿಸಲು ಭಾರಿ ಸಬ್ಸಿಡಿ ನೀಡುವ ಯೋಜನೆ.',
  'Individual farmers, cooperatives, and farmer producer organizations (FPOs).',
  'ವೈಯಕ್ತಿಕ ರೈತರು, ಸಹಕಾರ ಸಂಘಗಳು ಮತ್ತು ಎಫ್‌ಪಿಒಗಳು.',
  'Up to 60% total subsidy (30% Central + 30% State) for installing off-grid solar pumps.',
  'ಸೌರ ಪಂಪ್‌ಸೆಟ್ ಅಳವಡಿಕೆಗೆ ಒಟ್ಟು 60% ರವರೆಗೆ ಸಬ್ಸಿಡಿ ಸೌಲಭ್ಯ.',
  'central', NULL, 'all', 'https://pmkusum.mnre.gov.in/', 'State Renewable Energy Dept'
),

-- 2. STATE SCHEMES
-- KARNATAKA
(
  'Raitha Vidya Nidhi Scheme',
  'ರೈತ ವಿದ್ಯಾ ನಿಧಿ ಯೋಜನೆ (ಕರ್ನಾಟಕ)',
  'Karnataka State scholarship scheme for children of registered farmers studying in PUC, Degree, Engineering, or Medicine.',
  'ಉನ್ನತ ಶಿಕ್ಷಣದಲ್ಲಿ ವ್ಯಾಸಂಗ ಮಾಡುತ್ತಿರುವ ಕರ್ನಾಟಕದ ರೈತರ ಮಕ್ಕಳಿಗೆ ಆರ್ಥಿಕ ನೆರವು ನೀಡುವ ಯೋಜನೆ.',
  'Children of farmers in Karnataka registered on the K-KISAN / FRUITS portal studying post-10th.',
  'ಫ್ರೂಟ್ಸ್ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿತರಾದ ಕರ್ನಾಟಕದ ರೈತರ ಮಕ್ಕಳು.',
  'Annual scholarship grant ranging from ₹2,500 to ₹11,000 directly transferred via SSP.',
  'ಎಸ್‌ಎಸ್‌ಪಿ ಪೋರ್ಟಲ್ ಮೂಲಕ ನೇರವಾಗಿ ವಿದ್ಯಾರ್ಥಿ ಖಾತೆಗೆ ₹2,500 ರಿಂದ ₹11,000 ವಾರ್ಷಿಕ ನೆರವು.',
  'state', 'Karnataka', 'marginal', 'https://ssp.postmatric.karnataka.gov.in/', 'SSP Annual Cycle'
),
(
  'Krishi Bhagya Scheme',
  'ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ (ಕರ್ನಾಟಕ)',
  'Provides high subsidy for constructing rain-water harvesting farm ponds (Krishi Honda) and installing polythene lining.',
  'ಮಳೆಯಾಶ್ರಿತ ಕೃಷಿ ಪ್ರದೇಶಗಳಲ್ಲಿ ಕೃಷಿ ಹೊಂಡ ನಿರ್ಮಾಣಕ್ಕೆ 80% ರಿಂದ 90% ರವರೆಗೆ ಸಬ್ಸಿಡಿ ನೀಡುವ ಯೋಜನೆ.',
  'Farmers in dryland and rainfed districts of Karnataka.',
  'ಕರ್ನಾಟಕದ ಶುಷ್ಕ ಮತ್ತು ಮಳೆಯಾಶ್ರಿತ ಪ್ರದೇಶಗಳ ರೈತರು.',
  '80% to 90% subsidy for Krishi Honda construction, diesel pumpsets, and drip systems.',
  'ಕೃಷಿ ಹೊಂಡ, ಡೀಸೆಲ್ ಪಂಪ್‌ಸೆಟ್ ಮತ್ತು ಹನಿ ನೀರಾವರಿಗೆ 80% - 90% ಸಬ್ಸಿಡಿ.',
  'state', 'Karnataka', 'small', 'https://raitamitra.karnataka.gov.in/', 'District Agri Officer'
),

-- MAHARASHTRA
(
  'Namo Shetkari Maha Samman Nidhi Yojana',
  'ನಮೋ ಶೇತ್ಕಾರಿ ಮಹಾಸಮ್ಮಾನ್ ನಿಧಿ (ಮಹಾರಾಷ್ಟ್ರ)',
  'Maharashtra State scheme giving an additional ₹6,000 per year over and above PM-KISAN to state farmers.',
  'ಪಿಎಂ-ಕಿಸಾನ್ ಹೊರತಾಗಿ ಮಹಾರಾಷ್ಟ್ರ ಸರ್ಕಾರದಿಂದ ರೈತರಿಗೆ ಹೆಚ್ಚುವರಿಯಾಗಿ ವರ್ಷಕ್ಕೆ ₹6,000 ನೀಡುವ ಯೋಜನೆ.',
  'Farmers in Maharashtra registered under PM-KISAN.',
  'ಮಹಾರಾಷ್ಟ್ರದ ನೋಂದಾಯಿತ ಪಿಎಂ-ಕಿಸಾನ್ ರೈತರು.',
  '₹6,000 per year in 3 installments (Total ₹12,000 combined with PM-KISAN).',
  'ವರ್ಷಕ್ಕೆ ₹6,000 ಹೆಚ್ಚುವರಿ ನೆರವು (ಪಿಎಂ-ಕಿಸಾನ್ ಜೊತೆ ಒಟ್ಟು ₹12,000).',
  'state', 'Maharashtra', 'all', 'https://mahabhulekh.maharashtra.gov.in/', 'Ongoing'
),

-- UTTAR PRADESH
(
  'UP Kisan Karj Rahat Yojana',
  'ಉತ್ತರ ಪ್ರದೇಶ ಬೆಳೆ ಸಾಲ ಮನ್ನಾ ಯೋಜನೆ',
  'Waives off agricultural loans up to ₹1 Lakh for small and marginal farmers in Uttar Pradesh.',
  'ಉತ್ತರ ಪ್ರದೇಶದ ಸಣ್ಣ ಮತ್ತು ಅಂಚಿನ ರೈತರ ಕೃಷಿ ಸಾಲವನ್ನು ₹1 ಲಕ್ಷದವರೆಗೆ ಮನ್ನಾ ಮಾಡುವ ಯೋಜನೆ.',
  'Small and marginal farmers holding up to 2 hectares of land in UP.',
  'ಯುಪಿಯ 2 ಹೆಕ್ಟೇರ್‌ವರೆಗೆ ಭೂಮಿ ಹೊಂದಿರುವ ಸಣ್ಣ ರೈತರು.',
  'Complete waiver of agricultural crop loans up to ₹1,000,000.',
  '₹1,00,000 ವರೆಗಿನ ಕೃಷಿ ಬೆಳೆ ಸಾಲ ಸಂಪೂರ್ಣ ಮನ್ನಾ.',
  'state', 'Uttar Pradesh', 'small', 'https://upkisankarjrahat.upsdc.gov.in/', 'State Notification'
),

-- TAMIL NADU
(
  'Kalaignar All Village Integrated Agricultural Development Program',
  'ತಮಿಳುನಾಡು ಸಮಗ್ರ ಕೃಷಿ ಅಭಿವೃದ್ಧಿ ಯೋಜನೆ',
  'Brings fallow lands into cultivation with free borewells, drip irrigation, and coconut seedlings in Tamil Nadu villages.',
  'ತಮಿಳುನಾಡಿನ ಗ್ರಾಮಗಳಲ್ಲಿ ಬೀಳು ಭೂಮಿಯನ್ನು ಕೃಷಿಗೆ ತರಲು ಉಚಿತ ಕೊಳವೆಬಾವಿ ಮತ್ತು ತೆಂಗಿನ ಸಸಿ ವಿತರಣೆ ಯೋಜನೆ.',
  'Farmers in selected Gram Panchayats of Tamil Nadu.',
  'ತಮಿಳುನಾಡಿನ ಆಯ್ಕೆಮಾಡಿದ ಗ್ರಾಮ ಪಂಚಾಯತಿಗಳ ರೈತರು.',
  '100% free community borewells, micro-irrigation, and tree sapling kits.',
  'ಉಚಿತ ಸಮುದಾಯ ಕೊಳವೆಬಾವಿ ಮತ್ತು ಉಚಿತ ಕೃಷಿ ಕಿಟ್‌ಗಳು.',
  'state', 'Tamil Nadu', 'all', 'https://tnagrisnet.tn.gov.in/', 'Gram Panchayat Cycle'
),

-- ANDHRA PRADESH
(
  'YSR Rythu Bharosa',
  'ವೈಎಸ್‌ಆರ್ ರೈತ ಭರೋಸಾ (ಆಂಧ್ರ ಪ್ರದೇಶ)',
  'Financial assistance scheme providing ₹13,500 per year to farmer families in Andhra Pradesh.',
  'ಆಂಧ್ರ ಪ್ರದೇಶದ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹13,500 ಆರ್ಥಿಕ ನೆರವು ನೀಡುವ ಯೋಜನೆ.',
  'Farmer families including tenant farmers belonging to SC/ST/BC/Minority categories in AP.',
  'ಆಂಧ್ರ ಪ್ರದೇಶದ ರೈತರು ಮತ್ತು ಗೇಣಿದಾರ ಕುಟುಂಬಗಳು.',
  '₹13,500 per year provided before sowing seasons.',
  'ಬಿತ್ತನೆ ಋತುವಿಗಿಂತ ಮೊದಲು ವರ್ಷಕ್ಕೆ ₹13,500 ಧನಸಹಾಯ.',
  'state', 'Andhra Pradesh', 'all', 'https://ysrrythubharosa.ap.gov.in/', 'Annual Cycle'
);
