const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

const path = require('path');

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// --- VERIFY THIS SECTION ---
// Your router mounting should look exactly like this.
// The order doesn't strictly matter, but ensure the line for '/api/categories' EXISTS.
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes')); // <-- THIS LINE IS CRITICAL



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));