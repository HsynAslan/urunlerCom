const Product = require('../models/Product');
const Seller = require('../models/Seller');

exports.getSellerProducts = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) {
      return res.status(404).json({ message: 'Seller profile not found' });
    }
    const products = await Product.find({ seller: seller._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const slugify = require('slugify'); // slug otomatik oluşturmak için

exports.createProduct = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    let {
      name,
      slug,
      price,
      priceCurrency,
      descriptionSections,
      stock,
      stockUnit,
      images,
      showcaseImageIndex,
    } = req.body;

    if (!slug && name) {
      slug = slugify(name, { lower: true, strict: true });
    }

    const product = new Product({
      seller: seller._id,
      name,
      slug,
      price,
      priceCurrency,
      descriptionSections,
      stock,
      stockUnit,
      images,
      showcaseImageIndex,
      isPublished: true,
    });

    await product.save();
    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir ürünü ID ile getir
exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ürünü ID ile sil
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

