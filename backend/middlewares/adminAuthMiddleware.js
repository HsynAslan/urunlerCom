const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.adminProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id);

      if (!admin) return res.status(401).json({ message: 'Admin not found' });

      req.admin = admin;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
};

exports.allowAdminRoles = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.admin || !Array.isArray(req.admin.roles)) {
      return res.status(401).json({ message: 'Admin yetkileri tanımsız veya geçersiz' });
    }

    const hasPermission = req.admin.roles.some(role => requiredRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({
        message: 'Yetkisiz erişim: Gerekli admin rolüne sahip değilsiniz.',
        requiredRoles,
        yourRoles: req.admin.roles,
      });
    }

    next();
  };
};
