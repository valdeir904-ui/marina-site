import { query } from './src/lib/db';

async function fixInstagramUrl() {
  const result = await query("UPDATE settings SET value = 'https://www.instagram.com/psimarinafalcao/' WHERE key = 'instagram_url';");
  console.log('Update result:', result);
  const check = await query("SELECT * FROM settings WHERE key = 'instagram_url';");
  console.log('New value:', check);
}

fixInstagramUrl();
