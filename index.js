import express from 'express';
import pool from './db.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Autorise les requêtes depuis Flutter
app.use(express.json()); // Parse le JSON dans les requêtes

// 🔄 Route GET : récupérer tous les messages
app.get('/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur récupération messages:', err);
    res.status(500).send('Erreur serveur');
  }
});

// ➕ Route POST : ajouter un nouveau message
app.post('/messages', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).send('Message manquant');
  }

  try {
    await pool.query('INSERT INTO messages (content) VALUES ($1)', [message]);
    res.status(201).send('Message ajouté');
  } catch (err) {
    console.error('Erreur ajout message:', err);
    res.status(500).send('Erreur serveur');
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur backend en ligne sur http://localhost:${port}`);
});
