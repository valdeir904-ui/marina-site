const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const settings = [
  ['whatsapp_number', '5516994244626'],
  ['whatsapp_message', 'Oi Marina! 🖐 Preciso de ajuda com alguns problemas e gostaria de conversar com você.'],
  ['instagram_url', 'https://instagram.com/marinafalcaopsi'],
  ['crp', 'CRP 06/162899'],
  ['address', 'Atendimento presencial em Ribeirão Preto - SP e on-line para todo o Brasil'],
  ['doctoralia_url', 'https://www.doctoralia.com.br/marina-falcao/psicologo/ribeirao-preto'],
  ['google_reviews_url', '']
];

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      \`key\` TEXT PRIMARY KEY,
      \`value\` TEXT
    )
  `);

  const stmt = db.prepare('INSERT OR REPLACE INTO settings (\`key\`, \`value\`) VALUES (?, ?)');
  
  settings.forEach((setting) => {
    stmt.run(setting[0], setting[1]);
  });
  
  stmt.finalize();
  
  console.log("Configurações atualizadas com sucesso!");
});

db.close();
