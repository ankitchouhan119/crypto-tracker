require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { connectDB } = require('./config/database');
const { updateCryptoData } = require('./jobs/updateCryptoData');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());


// app.get('/', (req, res) => {
//     console.log('Root route accessed');
//     res.send('Welcome to the Crypto Tracker API! Use /api/stats?coin=bitcoin or /api/deviation?coin=bitcoin to get cryptocurrency data.');
// });

  

// Routes
app.use('/api', apiRoutes);

// Serve static files
app.use(express.static('public'));

// Schedule background job
cron.schedule('0 */2 * * *', updateCryptoData); // Runs every 2 hours


// cron.schedule('* * * * *', updateCryptoData); // Runs every minute


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});