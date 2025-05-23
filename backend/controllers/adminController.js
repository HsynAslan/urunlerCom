const User = require('../models/User');
const Seller = require('../models/Seller');
const Theme = require('../models/Theme');

exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().populate('user').populate('theme');
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSellerPlan = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { plan } = req.body;
    const updated = await Seller.findByIdAndUpdate(sellerId, { plan }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
