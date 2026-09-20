// Admin script to easily seed/update nationwide schemes into Supabase DB
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/ANON_KEY must be configured in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAdminSchemes() {
  console.log('[Admin Seed Script] Seeding nationwide central & state schemes...');

  const schemesData = [
    {
      name_en: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      name_kn: 'ಪಿಎಂ-ಕಿಸಾನ್ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ)',
      description_en: 'Central sector income support scheme providing ₹6,000 annually to all landholding farmer families across India.',
      description_kn: 'ಭಾರತದಾದ್ಯಂತ ಭೂಮಿ ಹೊಂದಿರುವ ಎಲ್ಲಾ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ಆದಾಯ ಬೆಂಬಲ ನೀಡುವ ಕೇಂದ್ರ ಯೋಜನೆ.',
      eligibility_en: 'Landholding farmer families with cultivable land in their names.',
      eligibility_kn: 'ತಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಸಾಗುವಳಿ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳು.',
      benefit_en: '₹6,000 per year transferred in 3 equal installments of ₹2,000 directly to bank accounts.',
      benefit_kn: 'ವರ್ಷಕ್ಕೆ ₹6,000 ಮೊತ್ತವನ್ನು ತಲಾ ₹2,000 ರಂತೆ 3 ಕಂತುಗಳಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ.',
      scope: 'central',
      state: null,
      category: 'all',
      application_link: 'https://pmkisan.gov.in/',
      deadline: 'Ongoing'
    },
    {
      name_en: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
      name_kn: 'ಪಿಎಂಎಫ್‌ಬಿವೈ (ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ)',
      description_en: 'Nationwide crop insurance scheme offering financial coverage against crop failure due to natural disasters, pests & diseases.',
      description_kn: 'ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳು, ಕೀಟಗಳು ಮತ್ತು ರೋಗಗಳಿಂದ ಬೆಳೆ ಹಾನಿಯಾದಾಗ ಆರ್ಥಿಕ ಭದ್ರತೆ ನೀಡುವ ರಾಷ್ಟ್ರೀಯ ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ.',
      eligibility_en: 'All farmers growing notified crops in notified areas including sharecroppers & tenant farmers.',
      eligibility_kn: 'ಅಧಿಸೂಚಿತ ಪ್ರದೇಶಗಳಲ್ಲಿ ಅಧಿಸೂಚಿತ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯುವ ಗೇಣಿದಾರರು ಸೇರಿದಂತೆ ಎಲ್ಲಾ ರೈತರು.',
      benefit_en: 'Minimal premium rates (1.5% Rabi, 2% Kharif, 5% Commercial crops) with full claim coverage.',
      benefit_kn: 'ಕಡಿಮೆ ಪ್ರೀಮಿಯಂ ದರಗಳು (ರಬಿಗೆ 1.5%, ಖಾರಿಫ್‌ಗೆ 2%) ಮತ್ತು ಸಂಪೂರ್ಣ ನಷ್ಟ ಪರಿಹಾರ.',
      scope: 'central',
      state: null,
      category: 'all',
      application_link: 'https://pmfby.gov.in/',
      deadline: 'Pre-Sowing Season'
    }
  ];

  const { data, error } = await supabase
    .from('schemes')
    .upsert(schemesData, { onConflict: 'name_en' })
    .select();

  if (error) {
    console.error('[Admin Seed Script] Error upserting schemes:', error);
  } else {
    console.log(`[Admin Seed Script] Successfully inserted/updated ${data.length} schemes.`);
  }
}

seedAdminSchemes();
