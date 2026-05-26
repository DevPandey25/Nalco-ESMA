const mongoose = require('mongoose');
const { encryptData, decryptData } = require('../utils/securityUtils');

const signatureSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        index: true
    },
    signedBy: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    signatureImage: {
        type: String, // Base64 or reference URL
        required: true,
        get: decryptData,
        set: encryptData
    },
    signatureType: {
        type: String,
        enum: ['canvas', 'typed', 'auto'],
        default: 'canvas'
    },
    verificationHash: {
        type: String, // SHA256 integrity hash
        required: true
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

module.exports = mongoose.model('Signature', signatureSchema);
