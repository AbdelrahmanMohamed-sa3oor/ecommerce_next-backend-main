const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/userauth');
const { authorizeAdmin } = require('../middlewares/authrization');
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controller/category');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Admin only routes
router.post('/', isAuthenticated, authorizeAdmin, upload.fields([
    { name: 'image', maxCount: 1 }
]), (req, res, next) => {
    if (req.files && req.files.image) {
        req.files.categoryImage = req.files.image;
    }
    next();
}, createCategory);
router.patch('/:id', isAuthenticated, authorizeAdmin,upload.fields([
    { name: 'image', maxCount: 1 }
]), (req, res, next) => {
    if (req.files && req.files.image) {
        req.files.categoryImage = req.files.image;
    }
    next();
}, updateCategory);
router.delete('/:id', isAuthenticated, authorizeAdmin, deleteCategory);

module.exports = router;
