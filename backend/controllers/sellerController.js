const Seller = require('../models/Seller');

exports.getSellerInfo = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.id }).populate('theme');
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSellerInfo = async (req, res) => {
  try {
    const updates = req.body;
    const seller = await Seller.findOneAndUpdate({ user: req.user.id }, updates, {
      new: true,
    });
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
