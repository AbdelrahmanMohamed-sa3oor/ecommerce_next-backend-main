const express = require('express');
const productController = require('../controller/product.controller');
const variantController = require('../controller/variant.controller');
const { verifyToken, isAdmin, isAuthenticated } = require('../middlewares/userauth');
const { authorizeAdmin } = require('../middlewares/authrization');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();


router.get('/new-arrivals', productController.getNewArrivals);

router.get('/best-sellers', productController.getBestSellers);

router.get('/most-reviewed', productController.getMostReviewed);

router.get('/', productController.getAllProducts);

router.get('/filter', productController.filterProducts);
router.get('/category/:id',productController.getCategoryProducts)


router.get('/:id', productController.getProduct);


router.post('/', isAuthenticated, authorizeAdmin, upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), productController.createProduct);

router
    .route('/:id')
    .patch(
        isAuthenticated,
        authorizeAdmin,
        upload.fields([
            { name: 'imageCover', maxCount: 1 },
            { name: 'images', maxCount: 5 }
        ]),
        productController.updateProduct
    )
    .delete(isAuthenticated, authorizeAdmin, productController.deleteProduct);

/**
 * @swagger
 * /api/products/{productId}/variants:
 *   get:
 *     summary: Get all variants of a product
 *     tags: [Variants]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of variants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     variants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Variant'
 *   post:
 *     summary: Add a new variant to a product
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Variant'
 *     responses:
 *       201:
 *         description: Variant added successfully
 */
router.route('/:productId/variants')
    .post(
        isAuthenticated,
        authorizeAdmin,
        upload.fields([
            { name: 'images', maxCount: 5 }
        ]),
        variantController.addVariant
    );
router.route('/:productId/variants').get(variantController.getVariants);

/**
 * @swagger
 * /api/products/{productId}/variants/{variantId}:
 *   patch:
 *     summary: Update a variant
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Variant'
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *   delete:
 *     summary: Delete a variant
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Variant deleted successfully
 */
router
    .route('/:productId/variants/:variantId')
    .patch(
        isAuthenticated,
        authorizeAdmin,
        upload.fields([
            { name: 'images', maxCount: 5 }
        ]),
        variantController.updateVariant
    )
    .delete(isAuthenticated, authorizeAdmin, variantController.deleteVariant);


/**
 * @swagger
 * /api/products/related/{id}:
 *   get:
 *     summary: Get related products by product ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the current product
 *         schema:
 *           type: string
 *           example: 665d1c17356b62f1b9d82e4f
 *     responses:
 *       200:
 *         description: Successfully retrieved related products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 4
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/related/:id', productController.getRelatedProducts);


/**
 * @swagger
 * /api/products/{productId}/variants/{variantId}/stock:
 *   patch:
 *     summary: Update variant stock quantity
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       400:
 *         description: Invalid quantity
 */
router.patch('/:productId/variants/:variantId/stock', isAuthenticated, authorizeAdmin, variantController.updateStock);

module.exports = router;