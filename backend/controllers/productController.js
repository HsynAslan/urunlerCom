const Product = require('../models/Product');

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, slug, price, description, stock } = req.body;
    const sellerId = req.user.sellerId;

    const product = new Product({
      name,
      slug,
      price,
      description,
      stock,
      seller: sellerId,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
