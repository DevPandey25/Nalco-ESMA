const mongoose = require('mongoose');
const { encryptData, decryptData } = require('../utils/securityUtils');

const auditLogSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        index: true
    },
    actionType: {
        type: String,
        required: true,
        enum: ['STATE_TRANSITION', 'APPROVAL_ACTION', 'FIELD_UPDATE', 'SYSTEM_OVERRIDE']
    },
    performedBy: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true,
        get: decryptData,
        set: encryptData
    },
    previousState: {
        type: String
    },
    newState: {
        type: String
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Audit logs must be immutable
auditLogSchema.pre('save', function() {
    if (!this.isNew) {
        throw new Error('Audit logs are immutable and cannot be updated.');
    }
});

auditLogSchema.pre('findOneAndUpdate', function() {
    throw new Error('Audit logs are immutable and cannot be updated.');
});

auditLogSchema.pre('update', function() {
    throw new Error('Audit logs are immutable and cannot be updated.');
});

auditLogSchema.pre('remove', function() {
    throw new Error('Audit logs are immutable and cannot be deleted.');
});

auditLogSchema.pre('findOneAndDelete', function() {
    throw new Error('Audit logs are immutable and cannot be deleted.');
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
