const { Queue, Worker } = require('bullmq');
const nodemailer = require('nodemailer');
const Notification = require('../models/notificationModel');

// Ensure graceful fallback if Redis connection fails in dev environment
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379)
};

let notificationQueue;
if (process.env.USE_REDIS_QUEUE === 'true') {
    try {
        notificationQueue = new Queue('enterprise-notifications', { connection });
    } catch (err) {
        console.warn('⚠️ BullMQ/Redis initialization failed, falling back to direct asynchronous messaging.');
    }
} else {
    console.log('ℹ️ Local Mode: Bypassing Redis Queue connections. Notifications will process directly.');
}

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.SMTP_PORT || 2525),
    secure: Number(process.env.SMTP_PORT || 2525) === 465, // true for port 465 (SSL), false for 587 (TLS)
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass'
    }
});

class NotificationService {
    /**
     * Dispatch notification payload into background processing queue
     */
    async dispatchNotification({ recipient, recipientRole, title, message, requestId, type, sendViaEmail = false }) {
        // Persist notification record directly for UI viewability
        const notificationRecord = await Notification.create({
            recipient,
            recipientRole,
            title,
            message,
            requestId,
            type,
            sentViaEmail: sendViaEmail
        });

        // Trigger socket.io event if initialized globally
        if (global.io) {
            global.io.emit('notification', notificationRecord);
        }

        const jobPayload = {
            notificationId: notificationRecord._id,
            recipient,
            title,
            message,
            sendViaEmail
        };

        if (notificationQueue) {
            try {
                await notificationQueue.add('send-notification', jobPayload, {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 2000 }
                });
            } catch (err) {
                console.error('Queue trigger failed, handling notification immediately.');
                await this.processNotificationImmediately(jobPayload);
            }
        } else {
            await this.processNotificationImmediately(jobPayload);
        }

        return notificationRecord;
    }

    async processNotificationImmediately({ recipient, title, message, sendViaEmail }) {
        if (sendViaEmail && recipient.includes('@')) {
            try {
                const htmlMessage = message.replace(/\n/g, '<br/>');
                
                // Bypasses Render SMTP port blocking by sending over standard HTTPS (Port 443)
                if (process.env.RESEND_API_KEY) {
                    console.log('📨 Dispatching email via Resend HTTP REST API...');
                    const response = await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                        },
                        body: JSON.stringify({
                            from: 'NALCO ESMA <onboarding@resend.dev>',
                            to: recipient,
                            subject: title,
                            html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h3>${title}</h3><p>${htmlMessage}</p></div>`
                        })
                    });
                    
                    const resData = await response.json();
                    if (!response.ok) {
                        throw new Error(resData.message || 'Resend API returned an error');
                    }
                    console.log(`📧 Email sent successfully via Resend to ${recipient}`);
                    return;
                }

                // Fallback to standard SMTP (May time out on Render if SMTP ports are blocked)
                await transporter.sendMail({
                    from: '"NALCO ESMA Platform" <noreply@nalco.example.com>',
                    to: recipient,
                    subject: title,
                    text: message,
                    html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h3>${title}</h3><p>${htmlMessage}</p></div>`
                });
            } catch (error) {
                console.error(`📧 Email transmission error to ${recipient}:`, error.message);
            }
        }
    }

    async getNotificationsForUser(role, email) {
        return await Notification.find({
            $or: [{ recipientRole: role }, { recipient: email }]
        }).sort({ createdAt: -1 }).limit(50);
    }

    async markAsRead(id) {
        return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }
}

// Background Worker instantiation (Only if Redis is operational)
if (notificationQueue) {
    try {
        new Worker('enterprise-notifications', async job => {
            const { recipient, title, message, sendViaEmail } = job.data;
            if (sendViaEmail && recipient.includes('@')) {
                const htmlMessage = message.replace(/\n/g, '<br/>');
                if (process.env.RESEND_API_KEY) {
                    await fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                        },
                        body: JSON.stringify({
                            from: 'NALCO ESMA <onboarding@resend.dev>',
                            to: recipient,
                            subject: title,
                            html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h3>${title}</h3><p>${htmlMessage}</p></div>`
                        })
                    });
                    return;
                }
                await transporter.sendMail({
                    from: '"NALCO ESMA Platform" <noreply@nalco.example.com>',
                    to: recipient,
                    subject: title,
                    text: message,
                    html: `<div style="font-family:Arial,sans-serif;padding:20px;"><h3>${title}</h3><p>${htmlMessage}</p></div>`
                });
            }
        }, { connection });
    } catch (err) {
        // Ignored in local disconnected Redis states
    }
}

module.exports = new NotificationService();
