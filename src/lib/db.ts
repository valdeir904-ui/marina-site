import type mysql from 'mysql2/promise';
import type { Database as SQLiteDatabase } from 'sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import { createPool, VercelPool } from '@vercel/postgres';

// Environment variables
const pgConnectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
const driver = pgConnectionString ? 'postgres' : (process.env.DB_DRIVER || 'sqlite');
const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT || '3306', 10);
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'marina_falcao_db';

let mysqlPool: mysql.Pool | null = null;
let sqliteDb: SQLiteDatabase | null = null;
let pgPool: VercelPool | null = null;

async function getSqliteDb() {
  if (!sqliteDb) {
    const sqlite3 = (await import('sqlite3')).default;
    const { open } = await import('sqlite');
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    sqliteDb = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }
  return sqliteDb;
}

async function getMysqlPool() {
  if (!mysqlPool) {
    const mysql = (await import('mysql2/promise')).default;
    mysqlPool = mysql.createPool({
      host, port, user, password, database,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });
  }
  return mysqlPool;
}

function getPgPool() {
  if (!pgPool) {
    pgPool = createPool({ connectionString: pgConnectionString });
  }
  return pgPool;
}

export async function query(sql: string, params: any[] = []): Promise<any> {
  await initDb();

  if (driver === 'postgres') {
    const pool = getPgPool();
    // Convert ? to $1, $2, etc for Postgres
    let pgSql = sql;
    if (pgSql.includes('?')) {
      let index = 1;
      pgSql = pgSql.replace(/\?/g, () => `$${index++}`);
    }
    
    // Postgres needs RETURNING id to get the insertId back
    const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
    if (isInsert && !pgSql.toUpperCase().includes('RETURNING ID')) {
      // Only append if it's not a settings insert (settings doesn't have autoincrement ID)
      if (!pgSql.toUpperCase().includes('INTO SETTINGS') && !pgSql.toUpperCase().includes('INTO PAGE_STATS')) {
        pgSql += ' RETURNING id';
      }
    }

    // Fix MySQL backticks for Postgres (replace `key` or `value` with "key" or "value")
    pgSql = pgSql.replace(/`/g, '"');

    const result = await pool.query(pgSql, params);

    if (pgSql.trim().toUpperCase().startsWith('SELECT')) {
      return result.rows;
    } else if (isInsert) {
      return { insertId: result.rows[0]?.id, affectedRows: result.rowCount };
    } else {
      return { affectedRows: result.rowCount };
    }
  } else if (driver === 'mysql') {
    const pool = await getMysqlPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
  } else {
    const db = await getSqliteDb();
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
    if (driver === 'postgres') {
      const pool = getPgPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          summary TEXT NOT NULL,
          content TEXT NOT NULL,
          category VARCHAR(100) DEFAULT 'Artigos',
          image_url VARCHAR(500),
          video_url VARCHAR(500),
          video_type VARCHAR(20) DEFAULT 'youtube',
          published SMALLINT DEFAULT 1,
          featured SMALLINT DEFAULT 0,
          views INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS settings (
          "key" VARCHAR(100) PRIMARY KEY,
          "value" TEXT NOT NULL
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

      await pool.query(`
        CREATE TABLE IF NOT EXISTS reviews_cache (
          id VARCHAR(50) PRIMARY KEY,
          rating DECIMAL(3,1) DEFAULT 5.0,
          user_ratings_total INT DEFAULT 0,
          google_url VARCHAR(500),
          reviews TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed initial admin if empty
      const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
      if (parseInt(userCount.rows[0].count) === 0) {
        const adminEmail = process.env.ADMIN_EMAIL || 'marina@marinafalcao.com.br';
        const rawPassword = process.env.ADMIN_PASSWORD || 'admin123456';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [
          'Marina Falcão',
          adminEmail,
          hashedPassword,
        ]);
      }
    } else if (driver === 'sqlite') {
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
          video_type TEXT DEFAULT 'youtube',
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
        CREATE TABLE IF NOT EXISTS reviews_cache (
          id TEXT PRIMARY KEY,
          rating REAL DEFAULT 5.0,
          user_ratings_total INTEGER DEFAULT 0,
          google_url TEXT,
          reviews TEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [process.env.ADMIN_EMAIL || 'marina@marinafalcao.com.br']);
      if (!existingUser) {
        const adminEmail = process.env.ADMIN_EMAIL || 'marina@marinafalcao.com.br';
        const rawPassword = process.env.ADMIN_PASSWORD || 'admin123456';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ['Marina Falcão', adminEmail, hashedPassword]);
      }
    } else {
      // MySQL logic
      const pool = await getMysqlPool();
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
          video_type VARCHAR(20) DEFAULT 'youtube',
          published TINYINT DEFAULT 1,
          featured TINYINT DEFAULT 0,
          views INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `);
      await pool.query(`CREATE TABLE IF NOT EXISTS settings (\`key\` VARCHAR(100) PRIMARY KEY, \`value\` TEXT NOT NULL);`);
      await pool.query(`CREATE TABLE IF NOT EXISTS page_stats (path VARCHAR(255) PRIMARY KEY, views INT DEFAULT 0, time_spent INT DEFAULT 0, conversions INT DEFAULT 0);`);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reviews_cache (
          id VARCHAR(50) PRIMARY KEY,
          rating DECIMAL(3,1) DEFAULT 5.0,
          user_ratings_total INT DEFAULT 0,
          google_url VARCHAR(500),
          reviews LONGTEXT,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      const [users]: any = await pool.query('SELECT COUNT(*) as count FROM users');
      if (users[0].count === 0) {
        const adminEmail = process.env.ADMIN_EMAIL || 'marina@marinafalcao.com.br';
        const rawPassword = process.env.ADMIN_PASSWORD || 'admin123456';
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ['Marina Falcão', adminEmail, hashedPassword]);
      }
    }
    initialized = true;
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}
