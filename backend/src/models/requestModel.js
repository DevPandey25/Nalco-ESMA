const mongoose = require('mongoose');
const { encryptData, decryptData, encryptObject, decryptObject } = require('../utils/securityUtils');

const requestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    employee: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    employeeId: {
        type: String,
        required: true,
        index: true
    },
    department: {
        type: String,
        required: true,
        index: true
    },
    designation: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        required: true,
        enum: ['USB', 'CD', 'External HDD', 'External SSD', 'Others']
    },
    justification: {
        type: String,
        required: true,
        get: decryptData,
        set: encryptData
    },
    unit: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['DRAFT', 'SUBMITTED', 'RECOMMENDED', 'APPROVED', 'IMPLEMENTED', 'REJECTED', 'RETURNED'],
        default: 'DRAFT',
        index: true
    },
    currentStage: {
        type: String,
        required: true,
        default: 'Submission'
    },
    assignedTo: {
        type: String,
        index: true
    },
    aiRiskScore: {
        type: Number,
        default: 0
    },
    aiRiskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'LOW'
    },
    aiSummary: {
        type: String,
        get: decryptData,
        set: encryptData
    },
    signatures: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        get: decryptObject,
        set: encryptObject
    },
    comments: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        get: decryptObject,
        set: encryptObject
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Indexing for optimized filtering and search
requestSchema.index({ status: 1, department: 1, createdAt: -1 });

module.exports = mongoose.model('Request', requestSchema);
