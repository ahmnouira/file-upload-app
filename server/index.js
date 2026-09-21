/**
 * Example backend for testing. Run: node server/index.js
 * Listens on http://localhost:3001
 */
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email) {
    return res.status(400).json({ message: 'Email required' });
  }
  res.json({
    token: `demo-${Date.now()}`,
    user: { email },
  });
});

// Upload CSV/Excel
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const ext = path.extname(req.file.originalname).toLowerCase();
  if (!['.csv', '.xlsx', '.xls'].includes(ext)) {
    return res.status(400).json({ message: 'Only CSV and Excel files allowed' });
  }
  res.json({
    success: true,
    filename: req.file.originalname,
    size: req.file.size,
    path: req.file.path,
  });
});

app.listen(3001, () => {
  console.log('Backend running at http://localhost:3001');
});
