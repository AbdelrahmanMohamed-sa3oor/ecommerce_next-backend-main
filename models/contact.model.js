const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true
        },
        status: {
            type: String,
            enum: ['pending', 'read', 'replied'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);