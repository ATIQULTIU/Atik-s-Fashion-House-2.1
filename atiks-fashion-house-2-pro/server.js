require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');
fs.mkdirSync(DATA_DIR, { recursive: true });

const defaultSettings = {
  storeName: "Atik's Fashion House",
  contactEmail: process.env.STORE_EMAIL || 'atik.cmttiu1001@gmail.com',
  currency: 'BDT', status: 'Open',
  heroEyebrow: 'CURATED FOR YOUR EVERYDAY', heroHeadline: 'Wear your',
  heroItalic: 'own story.',
  heroDescription: 'Modern essentials. Confident silhouettes. Pieces that feel like you.',
  heroButton: 'Explore the collection',
  heroImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85'
};
const seedProducts = [
  ['The Everyday Shirt','Clothing',1850,'Ivory',18,'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85'],
  ['Soft Form Knit','Clothing',2200,'Oat',12,'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85'],
  ['City Denim','Clothing',2650,'Blue',4,'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85'],
  ['The Weekend Tote','Accessories',1250,'Natural',21,'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85'],
  ['Studio Overshirt','Outerwear',3200,'Sand',3,'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85'],
  ['Off-Duty Tee','Clothing',950,'White',32,'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85'],
  ['Soft Structure Jacket','Outerwear',3950,'Charcoal',7,'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85'],
  ['Everywhere Cap','Accessories',850,'Olive',2,'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85']
];
function loadStore() {
  try {
    const saved = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return {
      admins: Array.isArray(saved.admins) ? saved.admins : [],
      products: Array.isArray(saved.products) ? saved.products : [],
      orders: Array.isArray(saved.orders) ? saved.orders : [],
      settings: { ...defaultSettings, ...(saved.settings || {}) },
      nextProductId: Number(saved.nextProductId) || 1
    };
  } catch {
    return {
      admins: [],
      products: seedProducts.map((p, i) => ({ id: i + 1, name: p[0], category: p[1], price: p[2], color: p[3], stock: p[4], image: p[5], active: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })),
      orders: [], settings: { ...defaultSettings }, nextProductId: seedProducts.length + 1
    };
  }
}
let store = loadStore();
function saveStore() {
  const temp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(store, null, 2), 'utf8');
  fs.renameSync(temp, DATA_FILE);
}
if (!fs.existsSync(DATA_FILE)) saveStore();

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  name: 'afh.sid',
  secret: process.env.SESSION_SECRET || 'local-development-secret-change-before-deploying-2026',
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 4 * 60 * 60 * 1000 }
}));
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }));
app.use(express.static(path.join(__dirname, 'public')));

function requireAdmin(req, res, next) {
  if (!req.session.admin) return res.status(401).json({ error: 'Sign in required.' });
  next();
}
function validateProduct(body) {
  const name = String(body.name || '').trim();
  const category = String(body.category || '').trim();
  const color = String(body.color || '').trim();
  const image = String(body.image || '').trim();
  const price = Number(body.price), stock = Number(body.stock);
  if (!name || name.length > 120) return 'Product name is required (max 120 characters).';
  if (!['Clothing', 'Outerwear', 'Accessories'].includes(category)) return 'Choose a valid category.';
  if (!Number.isInteger(price) || price < 0 || price > 100000000) return 'Price must be a valid non-negative integer.';
  if (!Number.isInteger(stock) || stock < 0 || stock > 1000000) return 'Stock must be a valid non-negative integer.';
  if (!color || color.length > 60) return 'Color/variant is required (max 60 characters).';
  if (image && !/^https?:\/\/.{1,2000}$/i.test(image)) return 'Image must be an http(s) URL.';
  return null;
}

async function createInitialAdmin() {
  const username = String(process.env.ADMIN_USERNAME || '').trim();
  const password = String(process.env.ADMIN_PASSWORD || '');
  if (!username || !password || password === 'replace-this-with-a-strong-password') {
    console.warn('Admin API is not configured. Set ADMIN_USERNAME and a strong ADMIN_PASSWORD in .env to enable server API login.');
    return;
  }
  if (password.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters.');
  const existing = store.admins.find(a => a.username === username);
  if (!existing) {
    store.admins.push({ id: store.admins.reduce((max, a) => Math.max(max, a.id), 0) + 1, username, password_hash: await bcrypt.hash(password, 12), display_name: process.env.ADMIN_DISPLAY_NAME || 'Atik Admin', role: 'admin' });
    saveStore();
    console.log(`Created initial administrator "${username}" for the server API.`);
  }
}

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });
    const admin = store.admins.find(a => a.username === username);
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) return res.status(401).json({ error: 'Invalid username or password.' });
    req.session.regenerate(err => {
      if (err) return next(err);
      req.session.admin = { id: admin.id, username: admin.username, displayName: admin.display_name, role: admin.role };
      res.json({ admin: req.session.admin });
    });
  } catch (error) { next(error); }
});
app.post('/api/auth/logout', (req, res) => req.session.destroy(() => { res.clearCookie('afh.sid'); res.status(204).end(); }));
app.get('/api/auth/me', (req, res) => res.json({ admin: req.session.admin || null }));
app.get('/api/products', (req, res) => res.json({ products: store.products.filter(p => p.active !== 0) }));
app.get('/api/admin/products', requireAdmin, (req, res) => res.json({ products: store.products }));
app.post('/api/admin/products', requireAdmin, (req, res) => {
  const error = validateProduct(req.body); if (error) return res.status(400).json({ error });
  const now = new Date().toISOString();
  const product = { id: store.nextProductId++, name: String(req.body.name).trim(), category: req.body.category, price: Number(req.body.price), color: String(req.body.color).trim(), stock: Number(req.body.stock), image: String(req.body.image || '').trim(), active: 1, created_at: now, updated_at: now };
  store.products.unshift(product); saveStore(); res.status(201).json({ product });
});
app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id), product = store.products.find(p => p.id === id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid product id.' });
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  const error = validateProduct(req.body); if (error) return res.status(400).json({ error });
  Object.assign(product, { name: String(req.body.name).trim(), category: req.body.category, price: Number(req.body.price), color: String(req.body.color).trim(), stock: Number(req.body.stock), image: String(req.body.image || '').trim(), updated_at: new Date().toISOString() });
  saveStore(); res.json({ product });
});
app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const index = store.products.findIndex(p => p.id === Number(req.params.id));
  if (index < 0) return res.status(404).json({ error: 'Product not found.' });
  store.products.splice(index, 1); saveStore(); res.status(204).end();
});
app.get('/api/admin/orders', requireAdmin, (_req, res) => res.json({ orders: store.orders }));
app.patch('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  const allowed = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid order status.' });
  const order = store.orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  order.status = req.body.status; saveStore(); res.json({ order });
});
app.get('/api/admin/settings', requireAdmin, (_req, res) => res.json({ settings: store.settings }));
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  for (const [key, value] of Object.entries(req.body || {})) {
    if (Object.hasOwn(defaultSettings, key) && ['string', 'number', 'boolean'].includes(typeof value)) store.settings[key] = String(value).slice(0, 2000);
  }
  saveStore(); res.json({ settings: store.settings });
});
app.get('/api/admin/summary', requireAdmin, (_req, res) => {
  const completed = store.orders.filter(o => o.status === 'Completed');
  res.json({ products: store.products.filter(p => p.active !== 0).length, orders: store.orders.length, revenue: completed.reduce((sum, o) => sum + Number(o.total || 0), 0), lowStock: store.products.filter(p => p.active !== 0 && p.stock <= 5).length, recentOrders: [...store.orders].sort((a, b) => b.id - a.id).slice(0, 5) });
});
app.get('/health', (_req, res) => res.json({ status: 'ok', storage: 'json-file' }));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'An unexpected server error occurred.' }); });

createInitialAdmin().then(() => {
  app.listen(PORT, () => console.log(`Atik's Fashion House running at http://localhost:${PORT}`));
}).catch(error => { console.error(error.message); process.exit(1); });
