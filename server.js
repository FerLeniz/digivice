const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const itemRoutes = require('./routes/cardRoutes');
const userRoutes = require('./routes/userRoutes')
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Middleware to parse JSON requests
app.use(cors({
  origin: 'http://localhost:3002', // Frontend URL
  credentials: true, // Allow cookies
}));

app.use(express.json());

// Use your defined routes
app.use('/api', itemRoutes);
app.use('/api/auth', userRoutes);

// Serve the 'uploads' folder as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Function to attempt starting the server
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is in use. Trying a different port...`);
      startServer(port + 1); // Try the next port
    } else {
      console.error('Server error:', error);
    }
  });
};

// Start the server
startServer(DEFAULT_PORT);
