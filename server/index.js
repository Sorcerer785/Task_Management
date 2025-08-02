const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('tasks.db');

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    completed BOOLEAN DEFAULT 0,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'User already exists' });
        }
        
        const token = jwt.sign({ userId: this.lastID, username }, JWT_SECRET);
        res.status(201).json({ token, user: { id: this.lastID, username, email } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });
});

// Task routes
app.get('/api/tasks', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.userId],
    (err, tasks) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(tasks);
    }
  );
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  const { title, description, priority, category } = req.body;

  db.run(
    'INSERT INTO tasks (title, description, priority, category, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, priority, category, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      
      db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, task) => {
        if (err) {
          return res.status(500).json({ error: 'Server error' });
        }
        res.status(201).json(task);
      });
    }
  );
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const { title, description, priority, category, completed } = req.body;
  const taskId = req.params.id;

  db.run(
    'UPDATE tasks SET title = ?, description = ?, priority = ?, category = ?, completed = ? WHERE id = ? AND user_id = ?',
    [title, description, priority, category, completed, taskId, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, task) => {
        if (err) {
          return res.status(500).json({ error: 'Server error' });
        }
        res.json(task);
      });
    }
  );
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;

  db.run(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [taskId, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
