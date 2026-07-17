const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { router: authRouter } = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Auth Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);

// ─── In-Memory Fallback Store ───────────────────────────────────────────────
let inMemoryReports = [];
let useMemory = false;

// ─── MongoDB Schema ──────────────────────────────────────────────────────────
const reportSchema = new mongoose.Schema({
  ideaTitle:       { type: String, required: true },
  description:     String,
  category:        String,
  targetAudience:  String,
  problemSolved:   String,
  keywords:        [String],
  scores: {
    originality:   Number,
    similarity:    Number,
    innovation:    Number,
    feasibility:   Number,
  },
  marketOpportunity: String,
  difficultyLevel:   String,
  similarIdeas:    [mongoose.Schema.Types.Mixed],
  suggestions:     mongoose.Schema.Types.Mixed,
  shareId:         { type: String, unique: true },
  createdAt:       { type: Date, default: Date.now },
});

let Report;
try {
  Report = mongoose.model('Report');
} catch {
  Report = mongoose.model('Report', reportSchema);
}

// ─── Connect to MongoDB ──────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/idea-checker';
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 })
  .then(() => { console.log('✅ MongoDB connected'); useMemory = false; })
  .catch(err => {
    console.warn('⚠️  MongoDB unavailable — using in-memory store:', err.message);
    useMemory = true;
  });

// ─── Helper: generate short share ID ────────────────────────────────────────
function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Save a report
app.post('/api/reports', async (req, res) => {
  try {
    const data = { ...req.body, shareId: genId() };
    if (useMemory) {
      const doc = { _id: genId(), ...data, createdAt: new Date() };
      inMemoryReports.unshift(doc);
      return res.json(doc);
    }
    const doc = await Report.create(data);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reports (history)
app.get('/api/reports', async (req, res) => {
  try {
    if (useMemory) return res.json(inMemoryReports);
    const docs = await Report.find().sort({ createdAt: -1 }).limit(50);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single report by id or shareId
app.get('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMemory) {
      const doc = inMemoryReports.find(r => r._id === id || r.shareId === id);
      if (!doc) return res.status(404).json({ error: 'Not found' });
      return res.json(doc);
    }
    let doc = await Report.findById(id).catch(() => null);
    if (!doc) doc = await Report.findOne({ shareId: id });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a report
app.delete('/api/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (useMemory) {
      inMemoryReports = inMemoryReports.filter(r => r._id !== id);
      return res.json({ ok: true });
    }
    await Report.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (_, res) => res.json({ ok: true, storage: useMemory ? 'memory' : 'mongodb' }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
