const crypto = require('crypto');
const Signature = require('../models/signatureModel');

class SignatureService {
    /**
     * Generate SHA-256 validation hash for a digital signature payload
     */
    generateVerificationHash(requestId, signedBy, role, signatureImage, timestamp) {
        const payload = `${requestId}:${signedBy}:${role}:${signatureImage.slice(0, 100)}:${timestamp}`;
        return crypto.createHash('sha256').update(payload).digest('hex');
    }

    /**
     * Store and audit a digital signature
     */
    async storeSignature({ requestId, signedBy, role, signatureImage, signatureType = 'canvas' }) {
        const timestamp = new Date().toISOString();
        const verificationHash = this.generateVerificationHash(requestId, signedBy, role, signatureImage, timestamp);

        const signature = await Signature.create({
            requestId,
            signedBy,
            role,
            signatureImage,
            signatureType,
            verificationHash
        });

        return signature;
    }

    /**
     * Verify authenticity and integrity of a stored signature
     */
    async verifySignature(signatureId) {
        const signature = await Signature.findById(signatureId);
        if (!signature) {
            throw new Error('Signature record not found.');
        }

        const expectedHash = this.generateVerificationHash(
            signature.requestId,
            signature.signedBy,
            signature.role,
            signature.signatureImage,
            signature.createdAt.toISOString()
        );

        return signature.verificationHash === expectedHash;
    }

    async getSignaturesForRequest(requestId) {
        return await Signature.find({ requestId }).sort({ createdAt: 1 });
    }
}

module.exports = new SignatureService();
