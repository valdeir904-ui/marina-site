import { query } from './src/lib/db';

async function checkSettings() {
  const result = await query('SELECT * FROM settings;');
  console.log(result);
}

checkSettings();
