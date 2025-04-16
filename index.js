const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Pour accepter les requêtes JSON

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // pour Render
});

// Test endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Endpoint pour récupérer les messages
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint pour recevoir et stocker les messages
app.post('/messages', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Le message est requis' });
  }

  try {
    const result = await pool.query('INSERT INTO messages (content) VALUES ($1) RETURNING id, content', [message]);
    const newMessage = result.rows[0];
    res.status(201).json(newMessage);
    console.log(`Message ajouté : ${newMessage.content}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
