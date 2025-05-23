const Theme = require('../models/Theme');

exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find();
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadTheme = async (req, res) => {
  try {
    const { name, cssFileUrl, previewImageUrl } = req.body;
    const theme = await Theme.create({
      name,
      cssFileUrl,
      previewImageUrl,
      createdBy: req.user.id,
    });
    res.status(201).json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTheme = async (req, res) => {
  try {
    await Theme.findByIdAndDelete(req.params.id);
    res.json({ message: 'Theme deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
