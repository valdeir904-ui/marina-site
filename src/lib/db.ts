import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open, Database as SQLiteDatabase } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

// Environment variables
const driver = process.env.DB_DRIVER || 'sqlite';
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '3306', 10);
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'marina_falcao_db';

let mysqlPool: mysql.Pool | null = null;
let sqliteDb: SQLiteDatabase | null = null;

async function getSqliteDb() {
  if (!sqliteDb) {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    sqliteDb = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }
  return sqliteDb;
}

function getMysqlPool() {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return mysqlPool;
}

export async function query(sql: string, params: any[] = []): Promise<any> {
  await initDb();

  if (driver === 'mysql') {
    const pool = getMysqlPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
  } else {
    const db = await getSqliteDb();
    // Convert MySQL placeholder style if needed or handle parameters
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return await db.all(sql, params);
    } else if (sql.trim().toUpperCase().startsWith('INSERT') || sql.trim().toUpperCase().startsWith('UPDATE') || sql.trim().toUpperCase().startsWith('DELETE')) {
      const result = await db.run(sql, params);
      return { insertId: result.lastID, affectedRows: result.changes };
    } else {
      return await db.run(sql, params);
    }
  }
}

let initialized = false;

export async function initDb() {
  if (initialized) return;

  try {
    if (driver === 'sqlite') {
      const db = await getSqliteDb();
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          summary TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT DEFAULT 'Artigos',
          image_url TEXT,
          video_url TEXT,
          published INTEGER DEFAULT 1,
          featured INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS page_stats (
          path TEXT PRIMARY KEY,
          views INTEGER DEFAULT 0,
          time_spent INTEGER DEFAULT 0,
          conversions INTEGER DEFAULT 0
        );
      `);

      // Tenta adicionar a coluna video_type se ela não existir
      try {
        await db.exec(`ALTER TABLE posts ADD COLUMN video_type TEXT DEFAULT 'youtube';`);
      } catch (e) {
        // Ignora o erro se a coluna já existir
      }

      // Tenta adicionar a coluna featured se ela não existir
      try {
        await db.exec(`ALTER TABLE posts ADD COLUMN featured INTEGER DEFAULT 0;`);
      } catch (e) {
        // Ignora o erro se a coluna já existir
      }

      // Seed initial admin if empty
      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [process.env.ADMIN_EMAIL || 'marina@marinafalcao.com.br']);
      if (!existingUser) {
        const adminEmail = process.env.ADMIN_EMAIL || 'marina@marinafalcao.com.br';
        const rawPassword = process.env.ADMIN_PASSWORD || 'admin123456';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        await db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          ['Marina Falcão', adminEmail, hashedPassword]
        );
      }

      // Seed default settings if empty
      const settingsCount = await db.get('SELECT COUNT(*) as count FROM settings');
      if (settingsCount.count === 0) {
        const defaultSettings = [
          ['site_title', 'Psicóloga Marina Falcão'],
          ['tagline', 'Tudo começa na sua saúde mental.'],
          ['whatsapp_number', '5516997712697'],
          ['whatsapp_message', 'Oi Marina! 🖐 Gostaria de agendar uma consulta de terapia!'],
          ['crp', 'CRP 06/162899'],
          ['address', 'Atendimento presencial em Ribeirão Preto - SP e on-line para todo o Brasil'],
          ['google_reviews_url', 'https://www.google.com/search?q=Marina+Falc%C3%A3o+Psic%C3%B3loga+Ribeir%C3%A3o+Preto'],
          ['doctoralia_url', 'https://www.doctoralia.com.br'],
          ['instagram_url', 'https://www.instagram.com'],
        ];

        for (const [key, value] of defaultSettings) {
          await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, value]);
        }
      }

      // Seed sample blog posts if empty
      const postCount = await db.get('SELECT COUNT(*) as count FROM posts');
      if (postCount.count === 0) {
        const samplePosts = [
          {
            title: 'Como Reconhecer os Sinais de Burnout e Sobrecarga Emocional',
            slug: 'como-reconhecer-sinais-de-burnout',
            summary: 'O esgotamento profissional e a exaustão constante não surgem da noite para o dia. Entenda como o seu corpo e mente sinalizam a necessidade de pausa.',
            category: 'Burnout & Estresse',
            image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
            video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: `<p>Em meio à rotina acelerada e às infinitas cobranças modernas, é frequente sentirmos que a mente simplesmente não consegue acompanhar o ritmo que tentamos impor ao corpo.</p>
            <p>O <strong>Burnout</strong> se caracteriza como uma síndrome resultante do estresse crônico no local de trabalho ou nas responsabilidades diárias que não foi gerido com sucesso. Os principais sinais incluem:</p>
            <ul>
              <li>Sensação de exaustão constante ou falta de energia física e mental;</li>
              <li>Sentimentos de distanciamento mental ou negativismo relacionados ao trabalho;</li>
              <li>Sensação de ineficácia e falta de realização.</li>
            </ul>
            <p>Na <em>Análise do Comportamento</em>, buscamos entender quais contingencies e ambientes estão mantendo essa sobrecarga. A psicoterapia oferece ferramentas para reconhecer os sinais do corpo e redesenhar rotinas mais saudáveis e funcionais.</p>`,
          },
          {
            title: 'Análise do Comportamento e Ansiedade: Entendendo Seus Gatilhos',
            slug: 'analise-do-comportamento-e-ansiedade',
            summary: 'A ansiedade se manifesta através de comportamentos automáticos e estados de alerta. Aprenda como a abordagem comportamental auxilia na regulação emocional.',
            category: 'Ansiedade',
            image_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
            video_url: '',
            content: `<p>A ansiedade é uma resposta natural do organismo diante de situações percebidas como ameaçadoras ou incertas. No entanto, quando essa resposta se torna desproporcional e frequente, ela paralisa a vida diária.</p>
            <p>A partir da <strong>Análise do Comportamento</strong>, não olhamos para a ansiedade apenas como um sintoma isolado, mas como uma relação contínua entre o indivíduo, o seu ambiente e a sua história de aprendizagem.</p>
            <p>Ao identificar os gatilhos e os padrões de evitação comportamental, é possível desenvolver habilidades estratégicas de enfrentamento, respiração consciente e autocompaixão.</p>`,
          },
          {
            title: 'Elaboração do Luto: O Caminho do Acolhimento e da Reconstrução',
            slug: 'elaboracao-do-luto-caminho-do-acolhimento',
            summary: 'Atravessar uma perda é um processo doloroso e singular. Saiba como a psicoterapia atua como um espaço seguro de escuta sem julgamentos.',
            category: 'Luto',
            image_url: 'https://images.unsplash.com/photo-1499209974431-9dac3ada0097?auto=format&fit=crop&q=80&w=800',
            video_url: '',
            content: `<p>O luto não é uma doença a ser curada, mas uma vivência de dor necessária que precisa de tempo, validação e acolhimento.</p>
            <p>Seja a perda de um ente querido, o fim de um relacionamento ou uma transição drástica de vida, o processo de elaboração do luto exige a permissão para sentir sem a pressão da "superação imediata".</p>
            <p>No espaço terapêutico, construímos caminhos para ressignificar a dor e integrar a lembrança com afeto e serenidade.</p>`,
          },
        ];

        for (const post of samplePosts) {
          await db.run(
            `INSERT INTO posts (title, slug, summary, content, category, image_url, video_url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [post.title, post.slug, post.summary, post.content, post.category, post.image_url, post.video_url]
          );
        }
      }
    } else {
      // MySQL init logic for Hostinger
      const pool = getMysqlPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          summary TEXT NOT NULL,
          content LONGTEXT NOT NULL,
          category VARCHAR(100) DEFAULT 'Artigos',
          image_url VARCHAR(500),
          video_url VARCHAR(500),
          published TINYINT DEFAULT 1,
          featured TINYINT DEFAULT 0,
          views INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS settings (
          \`key\` VARCHAR(100) PRIMARY KEY,
          \`value\` TEXT NOT NULL
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS page_stats (
          path VARCHAR(255) PRIMARY KEY,
          views INT DEFAULT 0,
          time_spent INT DEFAULT 0,
          conversions INT DEFAULT 0
        );
      `);

      // Tenta adicionar a coluna video_type se ela não existir
      try {
        await pool.query(`ALTER TABLE posts ADD COLUMN video_type VARCHAR(20) DEFAULT 'youtube';`);
      } catch (e) {
        // Ignora o erro se a coluna já existir
      }

      // Tenta adicionar a coluna featured se ela não existir
      try {
        await pool.query(`ALTER TABLE posts ADD COLUMN featured TINYINT DEFAULT 0;`);
      } catch (e) {
        // Ignora o erro se a coluna já existir
      }

      // Seed initial admin if MySQL empty
      const [users]: any = await pool.query('SELECT COUNT(*) as count FROM users');
      if (users[0].count === 0) {
        const adminEmail = process.env.ADMIN_EMAIL || 'marina@marinafalcao.com.br';
        const rawPassword = process.env.ADMIN_PASSWORD || 'admin123456';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
          'Marina Falcão',
          adminEmail,
          hashedPassword,
        ]);
      }
    }
    initialized = true;
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}
