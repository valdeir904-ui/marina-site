import { query } from './src/lib/db';

async function checkSettings() {
  const settings = await query('SELECT * FROM settings;');
  console.log(settings);
}

checkSettings();
