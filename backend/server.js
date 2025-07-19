const app = require('./app');
const http = require('http');
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const Theme = require('./models/Theme');  
const { connectDB } = require('./config/db');


const PORT = process.env.PORT || 5000;

const createDefaultAdmin = async () => {
  try {
    const exists = await Admin.findOne({ username: 'admin' });
    if (!exists) {
      const hashed = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        password: hashed,
        roles: [
          'manage_admins',
          'edit_site_settings',
          'manage_users',
          'view_everything',
          'edit_theme',
          'super_admin'
        ]
      });
      console.log('✅ Default admin created');
    } else {
      console.log('ℹ️ Default admin already exists');
    }
  } catch (err) {
    console.error('❌ Error creating default admin:', err.message);
  }
};

const createDefaultThemes = async () => {
  try {
    const count = await Theme.countDocuments();
    if (count === 0) {
      await Theme.insertMany([
        {
          name: 'Beyaz Tema',
          cssFileUrl: 'http://localhost:5000/static/themes/theme-light.css',
          previewImageUrl: 'https://example.com/previews/light-theme.jpg',
          createdBy: null // opsiyonel, admin id'si konabilir
        },
        {
          name: 'Koyu Tema',
          cssFileUrl: 'http://localhost:5000/static/themes/theme-dark.css',
          previewImageUrl: 'https://example.com/previews/dark-theme.jpg',
          createdBy: null
        }
      ]);
      console.log('✅ Default themes created');
    } else {
      console.log('ℹ️ Default themes already exist');
    }
  } catch (err) {
    console.error('❌ Error creating default themes:', err.message);
  }
};


// Ana başlatıcı
(async () => {
  try {
    // Eğer burada mongoose.connect yoksa, globalde bir yerde zaten bağlanıyor olmalı
    await createDefaultAdmin();
  await createDefaultThemes();
  
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err.message);
    process.exit(1);
  }
})();
