exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const hasRole = roles.some(role => {
      if (role === 'admin') return user.isAdmin;
      if (role === 'seller') return user.isSeller;
      if (role === 'customer') return !user.isAdmin && !user.isSeller;
       if (role === 'edit_theme') return user.roles.includes('edit_theme');
      if (role === 'manage_admins') return user.roles.includes('manage_admins');    
      if (role === 'edit_site_settings') return user.roles.includes('edit_site_settings');
      if (role === 'manage_users') return user.roles.includes('manage_users');
      if (role === 'view_everything') return user.roles.includes('view_everything');
      if (role === 'super_admin') return user.roles.includes('super_admin');
       
      return false;
    });

    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  };
};
