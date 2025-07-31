const express = require('express');
const router = express.Router();
const {
    createBanner,
    getAllBanners,
    getBannerById,
    deleteBanner
} = require('../controller/controllerBanner');
const Banner = require('../models/BannerModel');

// Admin-only routes
router.post('/',  createBanner);
router.get('/all-banner',  getAllBanners);
router.get('/banner/:id',  getBannerById);
router.delete('/:id',  deleteBanner);

// Public route (show only active banners)
router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const banners = await Banner.find({
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).populate('products', 'name price images');

        res.status(200).json(banners);
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
});

module.exports = router;
