const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/alumni', require('./routes/alumni'));
app.use('/api/events', require('./routes/events'));
app.use('/api/jobs',   require('./routes/jobs'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ AlumniConnect API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
