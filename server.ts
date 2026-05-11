import express from 'express';
import { createServer as createViteServer } from 'vite';
import os from 'os';
import db from './src/db.ts';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post('/api/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const info = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, password, role);
      res.json({ success: true, userId: info.lastInsertRowid });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(email, password) as any;
    if (user) {
      res.json({ success: true, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  // Donations
  app.post('/api/donations', (req, res) => {
    const { donor_id, donor_name, food_name, quantity, contact, address, pickup_time } = req.body;
    // Generate random lat/lng around a city center for demo
    const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
    const lng = -74.0060 + (Math.random() - 0.5) * 0.1;
    try {
      db.prepare(`
        INSERT INTO donations (donor_id, donor_name, food_name, quantity, contact, address, pickup_time, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(donor_id, donor_name, food_name, quantity, contact, address, pickup_time, lat, lng);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get('/api/donations', (req, res) => {
    const donations = db.prepare("SELECT * FROM donations WHERE status != 'Cancelled' ORDER BY id DESC").all();
    res.json(donations);
  });

  app.patch('/api/donations/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, volunteer_id } = req.body;
    try {
      db.prepare('UPDATE donations SET status = ? WHERE id = ?').run(status, id);
      if (status === 'Accepted' && volunteer_id) {
        // Get donation location to set initial delivery location
        const donation = db.prepare('SELECT lat, lng FROM donations WHERE id = ?').get(id) as any;
        db.prepare('INSERT INTO deliveries (donation_id, volunteer_id, current_lat, current_lng) VALUES (?, ?, ?, ?)').run(id, volunteer_id, donation.lat, donation.lng);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Stats & Prediction
  app.get('/api/stats', (req, res) => {
    const total = db.prepare('SELECT COUNT(*) as count FROM donations').get() as any;
    const active = db.prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'Available'").get() as any;
    const delivered = db.prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'Delivered'").get() as any;

    // Simple Linear Regression Simulation for "AI Prediction"
    // In a real app, this would call the Python script or use a library.
    // We'll use the historical data to calculate a simple trend.
    const history = db.prepare('SELECT food_prepared, waste FROM food_waste_data').all() as any[];

    let predictedWaste = 0;
    if (history.length > 1) {
      // Very crude linear regression: average waste % of prepared food
      const avgWasteRatio = history.reduce((acc, curr) => acc + (curr.waste / curr.food_prepared), 0) / history.length;
      const lastPrepared = history[history.length - 1].food_prepared;
      predictedWaste = Math.round(lastPrepared * avgWasteRatio * 1.1); // Assuming 10% more prep for tomorrow
    } else {
      predictedWaste = 15; // Default fallback
    }

    // Provide last 7 days of waste and sold data for charts (previous week)
    const weeklyData = db
      .prepare(`
        SELECT date, SUM(waste) as waste, SUM(food_sold) as food_sold
        FROM food_waste_data
        WHERE date >= date('now', '-6 days') AND date <= date('now')
        GROUP BY date
        ORDER BY date ASC
      `)
      .all() as any[];

    // Fill missing days with zero values
    const allDays: any[] = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0,10);
      const existing = weeklyData.find((row) => row.date === key);
      allDays.push({
        date: key,
        waste: existing ? Number(existing.waste) : 0,
        food_sold: existing ? Number(existing.food_sold) : 0,
      });
    }

    res.json({
      total: total.count,
      active: active.count,
      delivered: delivered.count,
      predictedWaste,
      weeklyWaste: allDays,
    });
  });

  app.post('/api/food_waste_data/save_today', (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = today.toISOString().slice(0, 10);

    // total donation count (food_prepared) for today (by pickup date, approximate)
    const preparedCount = db
      .prepare("SELECT COUNT(*) as count FROM donations WHERE date(pickup_time) = date('now', 'localtime')")
      .get() as any;

    // total delivered count (food_sold) for today
    const soldCount = db
      .prepare("SELECT COUNT(*) as count FROM donations WHERE status = 'Delivered' AND date(pickup_time) = date('now', 'localtime')")
      .get() as any;

    const food_prepared = Number(preparedCount.count || 0);
    const food_sold = Number(soldCount.count || 0);
    const waste = Math.max(0, food_prepared - food_sold);

    const existing = db.prepare('SELECT id FROM food_waste_data WHERE date = ?').get(dateStr) as any;
    if (existing) {
      db.prepare('UPDATE food_waste_data SET food_prepared = ?, food_sold = ?, waste = ? WHERE id = ?')
        .run(food_prepared, food_sold, waste, existing.id);
    } else {
      db.prepare('INSERT INTO food_waste_data (date, food_prepared, food_sold, waste) VALUES (?, ?, ?, ?)')
        .run(dateStr, food_prepared, food_sold, waste);
    }

    res.json({
      success: true,
      date: dateStr,
      food_prepared,
      food_sold,
      waste,
    });
  });

  app.get('/api/deliveries/:userId', (req, res) => {
    const { userId } = req.params;
    const deliveries = db.prepare(`
      SELECT d.*, del.delivery_status, del.id as delivery_id, del.current_lat, del.current_lng
      FROM donations d
      JOIN deliveries del ON d.id = del.donation_id
      WHERE del.volunteer_id = ?
    `).all(userId);
    res.json(deliveries);
  });

  app.patch('/api/deliveries/:id/location', (req, res) => {
    const { id } = req.params;
    const { lat, lng } = req.body;
    try {
      db.prepare('UPDATE deliveries SET current_lat = ?, current_lng = ? WHERE id = ?').run(lat, lng, id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.patch('/api/deliveries/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      db.prepare('UPDATE deliveries SET delivery_status = ? WHERE id = ?').run(status, id);
      if (status === 'Delivered') {
        const delivery = db.prepare('SELECT donation_id FROM deliveries WHERE id = ?').get(id) as any;
        db.prepare("UPDATE donations SET status = 'Delivered' WHERE id = ?").run(delivery.donation_id);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    const localHost = `http://localhost:${PORT}`;

    const networkIps = Object.values(os.networkInterfaces())
      .flat()
      .filter((ni): ni is os.NetworkInterfaceInfo => !!ni && ni.family === 'IPv4' && !ni.internal)
      .map((ni) => `http://${ni.address}:${PORT}`);

    console.log('Server running:');
    console.log(`  > Local:   ${localHost}`);
    networkIps.forEach((ip) => console.log(`  > Network: ${ip}`));
  });
}

startServer();
