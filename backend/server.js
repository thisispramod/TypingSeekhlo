const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const paragraphRoutes = require('./routes/paragraphRoutes');
const userRoutes = require('./routes/userRoutes');
// const resultRoutes = require('./routes/resultRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/paragraphs', paragraphRoutes);
app.use('/api/user', userRoutes);
// app.use('/api/results', resultRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Typing Speed Test API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
