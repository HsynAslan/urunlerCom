const app = require('./app');
const http = require('http');
const https = require('https');
const url = require('url');
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const Theme = require('./models/Theme');  
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Varsayılan admin oluşturur.
 */
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

/**
 * Varsayılan temaları oluşturur.
 */
const createDefaultThemes = async () => {
  try {
    const count = await Theme.countDocuments();
    if (count === 0) {
      await Theme.insertMany([
        {
          name: 'Beyaz Tema',
          cssFileUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/static/themes/theme-light.css`,
          previewImageUrl: 'https://example.com/previews/light-theme.jpg',
          createdBy: null
        },
        {
          name: 'Koyu Tema',
          cssFileUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/static/themes/theme-dark.css`,
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

/**
 * Sunucunun uykuya geçmesini önlemek için belirli aralıklarla kendini pingler.
 */
const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000; // 14 dakika

const keepAlive = () => {
  const backendUrl = process.env.BACKEND_URL;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!backendUrl && !frontendUrl) return;

  setInterval(() => {
    if (backendUrl) {
      const parsedBackendUrl = url.parse(backendUrl);
      const protocolModule = parsedBackendUrl.protocol === 'https:' ? https : http;
      protocolModule.get(backendUrl, (res) => {
        console.log(`🔁 Ping to BACKEND_URL: ${backendUrl} -> Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('⚠️ Backend keep-alive ping error:', err.message);
      });
    }

    if (frontendUrl) {
      const parsedFrontendUrl = url.parse(frontendUrl);
      const protocolModule = parsedFrontendUrl.protocol === 'https:' ? https : http;
      protocolModule.get(frontendUrl, (res) => {
        console.log(`🔁 Ping to FRONTEND_URL: ${frontendUrl} -> Status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('⚠️ Frontend keep-alive ping error:', err.message);
      });
    }
  }, KEEP_ALIVE_INTERVAL);
};

// Ana başlatıcı
(async () => {
  try {
    await createDefaultAdmin();
    await createDefaultThemes();

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      keepAlive(); // Uyumayı önlemek için fonksiyonu burada başlatıyoruz
    });
  } catch (err) {
    console.error('❌ Server startup error:', err.message);
    process.exit(1);
  }
})();
