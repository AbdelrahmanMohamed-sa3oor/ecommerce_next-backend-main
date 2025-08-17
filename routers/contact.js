const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/userauth');
const {
    getAllContacts,
    getContactById,
    createContact,
    deleteContact,
} = require('../controller/contact');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - subject
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Contact person name
 *         email:
 *           type: string
 *           format: email
 *           description: Contact email address
 *         phone:
 *           type: string
 *           description: Contact phone number
 *         subject:
 *           type: string
 *           description: Contact subject/topic
 *         message:
 *           type: string
 *           description: Contact message content
 *         status:
 *           type: string
 *           enum: [pending, read, replied]
 *           default: pending
 *           description: Contact status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/contact/:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contact messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/contact/{contactId}:
 *   get:
 *     summary: Get a contact message by ID
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact message details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Contact not found
 */

/**
 * @swagger
 * /api/contact/:
 *   post:
 *     summary: Create a new contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               subject:
 *                 type: string
 *                 example: "General Inquiry"
 *               message:
 *                 type: string
 *                 example: "I have a question about your products"
 *     responses:
 *       201:
 *         description: Contact message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Contact message sent successfully
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/contact/{contactId}:
 *   patch:
 *     summary: Update contact status
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, read, replied]
 *                 example: "read"
 *     responses:
 *       200:
 *         description: Contact status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Contact status updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Contact not found
 *   delete:
 *     summary: Delete a contact message
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Contact deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Contact not found
 */

// Public routes (no authentication required)
router.post('/', createContact);

// Protected routes (authentication required)
router.get('/', isAuthenticated, getAllContacts);
router.get('/:contactId', isAuthenticated, getContactById);
router.delete('/:contactId', isAuthenticated, deleteContact);

module.exports = router;