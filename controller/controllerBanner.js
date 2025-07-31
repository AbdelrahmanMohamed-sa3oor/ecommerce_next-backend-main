const Banner = require("../models/BannerModel");

// Create banner
const createBanner = async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json({status:true,banner});
  } catch (error) {
    res.status(500).json({
      message: "Failed to create banner",
      error: error.message,
    });
  }
};

// Get all banners
const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().populate('products', 'name price images');
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get single banner
const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id).populate('products', 'name price images');
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete banner
const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createBanner,
  getAllBanners,
  getBannerById,
  deleteBanner
};
