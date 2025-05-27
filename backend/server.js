const app = require('./app');
const http = require('http');
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

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
          'edit_theme'
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

// Ana başlatıcı
(async () => {
  try {
    // Eğer burada mongoose.connect yoksa, globalde bir yerde zaten bağlanıyor olmalı
    await createDefaultAdmin();

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err.message);
    process.exit(1);
  }
})();
