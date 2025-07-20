const Seller = require('../models/Seller');
const SellerAbout = require('../models/SellerAbout');
const SellerPhoto = require('../models/SellerPhoto');
const Theme = require('../models/Theme');

exports.getSellerInfo = async (req, res) => {
  try {
    console.log('User ID:', req.user.id);

    const seller = await Seller.findOne({ user: req.user.id })
      .populate({ path: 'theme', select: 'name previewImage' })
      .populate({ path: 'user', select: 'name email' }); // 👈 user bilgilerini dahil et

    console.log('Seller Info:', seller);

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

exports.getStats = async (req, res) => {
  try {
    // Örnek olarak basit istatistik verisi döndürüyoruz
    const stats = {
      totalProducts: 100,
      totalSales: 50,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.selectSchema = async (req, res) => {
  try {
    // *** Kullanıcının oturum açtığında elinde olan kullanıcı ID'si (User ID) ***
    const userId = req.user._id; // kullanıcı id

    const { schemaId } = req.body;
    if (!schemaId) {
      return res.status(400).json({ message: 'schemaId gönderilmedi.' });
    }

    // Seçilen tema ID'si ile tema kontrolü yapılıyor
    const theme = await Theme.findById(schemaId);
    if (!theme) {
      return res.status(404).json({ message: 'Seçilen tema bulunamadı.' });
    }

    // *** Seller koleksiyonunda user alanı (User ID) ile kayıt bulunup, seçilen tema ID'si ile güncelleme yapılıyor ***
    const updatedSeller = await Seller.findOneAndUpdate(
      { user: userId },  // burada user alanı seller modelindeki user ObjectId'si
      { selectedTheme: schemaId },
      { new: true }
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller bulunamadı.' });
    }

    // *** Güncellenen seller kaydının _id'si (Seller ID) kullanılarak frontend için yayınlanan sayfa URL'si oluşturuluyor ***
    const publishedUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/seller/${updatedSeller._id}`;

    // JSON olarak mesaj ve yayınlanan URL dönülüyor
    res.json({ message: 'Tema seçildi.', publishedUrl });
  } catch (error) {
    console.error('Şema seçme hatası:', error);
    res.status(500).json({ message: 'Şema seçilirken hata oluştu.' });
  }
};



exports.createOrGetSeller = async (req, res) => {
  try {
    let seller = await Seller.findOne({ user: req.user.id })
      .populate({ path: 'theme', select: 'name previewImage' })
      .populate({ path: 'user', select: 'name email' });

    if (!seller) {
      seller = new Seller({ user: req.user.id });
      await seller.save();
    }

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getSellerAbout = async (req, res) => {
  try {
    const about = await SellerAbout.findOne({ seller: req.user.id });
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ message: 'Hakkımda bilgisi alınamadı' });
  }
};

exports.updateSellerAbout = async (req, res) => {
  try {
    const { content } = req.body;
    const updated = await SellerAbout.findOneAndUpdate(
      { seller: req.user.id },
      { content },
      { upsert: true, new: true }
    );
    console.log('Updated About:', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Hakkımda bilgisi güncellenemedi' });
  }
};

exports.getSellerPhotos = async (req, res) => {
  try {
    const photos = await SellerPhoto.find({ seller: req.user.id });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Fotoğraflar alınamadı' });
  }
};

exports.addSellerPhoto = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    const newPhoto = new SellerPhoto({
      seller: req.user.id,
      imageUrl,
      caption,
    });
    await newPhoto.save();
    res.json(newPhoto);
  } catch (err) {
    res.status(500).json({ message: 'Fotoğraf eklenemedi' });
  }
};

exports.deleteSellerPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await SellerPhoto.findOneAndDelete({ _id: id, seller: req.user.id });
    if (!result) return res.status(404).json({ message: 'Fotoğraf bulunamadı' });
    res.json({ message: 'Silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silme işlemi başarısız' });
  }
};
