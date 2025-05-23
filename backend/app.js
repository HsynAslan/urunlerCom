const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const { i18next, middleware } = require('./utils/i18nConfig');
dotenv.config();
connectDB();
require('dotenv').config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/sellers', require('./routes/sellerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/themes', require('./routes/themeRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/mails', require('./routes/mailRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use(middleware.handle(i18next));
// Error handling middleware
app.use(errorHandler);

module.exports = app;
