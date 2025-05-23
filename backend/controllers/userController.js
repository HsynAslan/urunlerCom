const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json({
      message: 'Profil başarıyla güncellendi',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
