const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: String, // Email or role reference
        required: true,
        index: true
    },
    recipientRole: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    requestId: {
        type: String,
        index: true
    },
    type: {
        type: String,
        enum: ['APPROVAL_PENDING', 'REJECTION_ALERT', 'WORKFLOW_UPDATE', 'ESCALATION_ALERT', 'AI_RISK_ALERT'],
        default: 'WORKFLOW_UPDATE'
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    sentViaEmail: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
