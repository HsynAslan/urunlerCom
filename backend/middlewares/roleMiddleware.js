exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const hasRole = roles.some(role => {
      if (role === 'admin') return user.isAdmin;
      if (role === 'seller') return user.isSeller;
      if (role === 'customer') return !user.isAdmin && !user.isSeller;
      return false;
    });

    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  };
};
