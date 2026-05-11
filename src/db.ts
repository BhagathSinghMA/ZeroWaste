import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('food_waste.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('Donor', 'Volunteer', 'NGO')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS donations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donor_id INTEGER,
    donor_name TEXT NOT NULL,
    food_name TEXT NOT NULL,
    quantity TEXT NOT NULL,
    contact TEXT NOT NULL,
    address TEXT NOT NULL,
    pickup_time TEXT NOT NULL,
    lat REAL,
    lng REAL,
    status TEXT DEFAULT 'Available' CHECK(status IN ('Available', 'Accepted', 'Cancelled', 'Delivered')),
    FOREIGN KEY(donor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    donation_id INTEGER,
    volunteer_id INTEGER,
    delivery_status TEXT DEFAULT 'Accepted' CHECK(delivery_status IN ('Accepted', 'Out for Delivery', 'Delivered')),
    current_lat REAL,
    current_lng REAL,
    FOREIGN KEY(donation_id) REFERENCES donations(id),
    FOREIGN KEY(volunteer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS food_waste_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    food_prepared REAL NOT NULL,
    food_sold REAL NOT NULL,
    waste REAL NOT NULL
  );
`);

// Migration for existing databases
try { db.exec("ALTER TABLE donations ADD COLUMN lat REAL;"); } catch (e) {}
try { db.exec("ALTER TABLE donations ADD COLUMN lng REAL;"); } catch (e) {}
try { db.exec("ALTER TABLE deliveries ADD COLUMN current_lat REAL;"); } catch (e) {}
try { db.exec("ALTER TABLE deliveries ADD COLUMN current_lng REAL;"); } catch (e) {}

// Seed some initial waste data for the AI prediction if empty
const wasteCount = db.prepare('SELECT COUNT(*) as count FROM food_waste_data').get() as { count: number };
if (wasteCount.count === 0) {
  const seedData = [
    ['2024-03-01', 100, 80, 20],
    ['2024-03-02', 110, 85, 25],
    ['2024-03-03', 95, 82, 13],
    ['2024-03-04', 120, 90, 30],
    ['2024-03-05', 105, 88, 17],
  ];
  const insert = db.prepare('INSERT INTO food_waste_data (date, food_prepared, food_sold, waste) VALUES (?, ?, ?, ?)');
  seedData.forEach(row => insert.run(row));
}

export default db;
