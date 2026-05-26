const mongoose = require('mongoose');
const { encryptData, decryptData } = require('../utils/securityUtils');

const approvalSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        index: true
    },
    approver: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['SUBMIT', 'RECOMMEND', 'APPROVE', 'IMPLEMENT', 'REJECT', 'RETURN']
    },
    comment: {
        type: String,
        required: true,
        get: decryptData,
        set: encryptData
    },
    signatureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Signature'
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

approvalSchema.index({ requestId: 1, createdAt: 1 });

module.exports = mongoose.model('Approval', approvalSchema);
