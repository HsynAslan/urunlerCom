const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const verifyAdmin = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token gerekli' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id);

      if (!admin) return res.status(403).json({ message: 'Admin bulunamadı' });

      req.admin = admin;

      // super admin her şeye erişebilir
      if (admin.roles.includes('super_admin')) return next();

      if (requiredRoles.length > 0) {
        const hasRole = requiredRoles.some(role => admin.roles.includes(role));
        if (!hasRole) return res.status(403).json({ message: 'Yetersiz yetki' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Geçersiz token' });
    }
  };
};

const adminProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token eksik' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) return res.status(401).json({ message: 'Admin bulunamadı' });

    req.admin = admin; // Rol kontrolü için saklıyoruz
    next();
  } catch (err) {
    res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
  }
};

// Gerekli roller varsa kontrol eder. 'super_admin' her şeye erişebilir.
const allowAdminRoles = (requiredRoles = []) => {
  return (req, res, next) => {
    const admin = req.admin;
    if (!admin) return res.status(403).json({ message: 'Admin doğrulanamadı' });

    if (admin.roles.includes('super_admin')) return next();

    const hasPermission = requiredRoles.some(role => admin.roles.includes(role));
    if (!hasPermission) {
      return res.status(403).json({ message: 'Yetersiz yetki' });
    }

    next();
  };
};


module.exports = {
  adminProtect,
  allowAdminRoles,
  verifyAdmin
};
