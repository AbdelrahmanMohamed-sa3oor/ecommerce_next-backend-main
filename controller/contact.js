const Contact = require('../models/contact.model.js');

// Get all contacts
const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find()
            .sort('-createdAt');
        
        res.status(200).json({ 
            status: 'success', 
            data: contacts 
        });
    } catch (err) {
        next({ message: "Failed to retrieve contacts", error: err.message });
    }
};

// Get contact by ID
const getContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        
        const contact = await Contact.findById(contactId);
        
        if (!contact) {
            return res.status(404).json({ 
                status: 'error',
                message: "Contact not found" 
            });
        }
        
        res.status(200).json({ 
            status: 'success', 
            data: contact 
        });
    } catch (err) {
        next({ message: "Failed to retrieve contact", error: err.message });
    }
};

// Create new contact
const createContact = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({
                status: 'error',
                message: "All fields are required: name, email, phone, subject, and message"
            });
        }

        // Validate email format
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: "Please enter a valid email address"
            });
        }

        // Validate phone number (basic validation)
        if (phone.length < 10) {
            return res.status(400).json({
                status: 'error',
                message: "Please enter a valid phone number"
            });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message
        });

        res.status(201).json({ 
            status: 'success', 
            message: 'Contact message sent successfully',
            data: contact 
        });
    } catch (err) {
        next({ message: "Failed to create contact", error: err.message });
    }
};

// Delete contact
const deleteContact = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        
        const contact = await Contact.findByIdAndDelete(contactId);
        
        if (!contact) {
            return res.status(404).json({ 
                status: 'error',
                message: "Contact not found" 
            });
        }

        res.status(200).json({ 
            status: 'success', 
            message: 'Contact deleted successfully' 
        });
    } catch (err) {
        next({ message: "Failed to delete contact", error: err.message });
    }
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    deleteContact,
};
