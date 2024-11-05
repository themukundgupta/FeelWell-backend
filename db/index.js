import Database from 'better-sqlite3';
import bcryptjs from 'bcryptjs';

const db = new Database('feelwell.db', { verbose: console.log });

export function initDB() {
  // Drop existing tables if they exist
  db.exec(`DROP TABLE IF EXISTS users`);
  
  // Create users table with proper schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database initialized successfully');
}

export async function createUser({ email, password, name }) {
  try {
    const hashedPassword = await bcryptjs.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
    const result = stmt.run(email, hashedPassword, name);
    
    if (result.changes === 0) {
      throw new Error('Failed to create user');
    }

    return {
      id: result.lastInsertRowid,
      email,
      name
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export function findUserByEmail(email) {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

export function findUserById(id) {
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
}

export default db;