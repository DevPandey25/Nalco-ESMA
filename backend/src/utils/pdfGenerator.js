const PDFDocument = require('pdfkit');

/**
 * Generate a PDF buffer for a given media access request
 * @param {Object} request - The Mongoose request document
 * @returns {Promise<Buffer>} - Resolves to the PDF binary buffer
 */
function generateReceiptPdf(request) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            let buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfBuffer = Buffer.concat(buffers);
                resolve(pdfBuffer);
            });

            // --- Header & Brand ---
            doc.fillColor('#003B70')
               .fontSize(22)
               .text('NATIONAL ALUMINIUM COMPANY LIMITED', { align: 'center' })
               .fontSize(14)
               .text('(A Government of India Enterprise)', { align: 'center' })
               .moveDown(0.5);

            doc.strokeColor('#003B70')
               .lineWidth(2)
               .moveTo(50, doc.y)
               .lineTo(562, doc.y)
               .stroke()
               .moveDown(1);

            doc.fillColor('#333333')
               .fontSize(16)
               .text('External Storage Media Access Receipt', { align: 'center', underline: true })
               .moveDown(1.5);

            // --- Request Summary Card ---
            const startY = doc.y;
            doc.rect(50, startY, 512, 60)
               .fillColor('#f8f9fa')
               .fill()
               .strokeColor('#e2e8f0')
               .lineWidth(1)
               .rect(50, startY, 512, 60)
               .stroke();

            doc.fillColor('#333333')
               .fontSize(10);
            
            // Left column inside card
            doc.text(`Request ID: ${request.requestId}`, 65, startY + 15)
               .text(`Current Stage: ${request.currentStage || 'N/A'}`, 65, startY + 35);

            // Right column inside card
            const statusColor = request.status === 'APPROVED' ? '#2f855a' : request.status === 'REJECTED' ? '#c53030' : '#d69e2e';
            doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 350, startY + 15)
               .fillColor(statusColor)
               .text(`Status: ${request.status}`, 350, startY + 35);

            doc.fillColor('#333333').moveDown(3);

            // --- Section: Employee Details ---
            doc.fontSize(12)
               .fillColor('#003B70')
               .text('1. Employee Details', { underline: false })
               .moveDown(0.3);

            doc.strokeColor('#003B70')
               .lineWidth(0.5)
               .moveTo(50, doc.y)
               .lineTo(562, doc.y)
               .stroke()
               .moveDown(0.5);

            doc.fillColor('#333333').fontSize(10);
            const gridY1 = doc.y;
            doc.text(`Name:`, 50, gridY1)
               .text(request.employee, 150, gridY1)
               .text(`Personal No:`, 320, gridY1)
               .text(request.employeeId, 420, gridY1);

            const gridY2 = gridY1 + 18;
            doc.text(`Designation:`, 50, gridY2)
               .text(request.designation || 'Staff', 150, gridY2)
               .text(`Department:`, 320, gridY2)
               .text(request.department, 420, gridY2);

            const gridY3 = gridY2 + 18;
            doc.text(`Unit:`, 50, gridY3)
               .text(request.unit, 150, gridY3)
               .text(`Email Address:`, 320, gridY3)
               .text(request.email || 'N/A', 420, gridY3);

            doc.moveDown(3);

            // --- Section: Media Access Request Specifics ---
            doc.fontSize(12)
               .fillColor('#003B70')
               .text('2. Media Access Specifications', { underline: false })
               .moveDown(0.3);

            doc.strokeColor('#003B70')
               .lineWidth(0.5)
               .moveTo(50, doc.y)
               .lineTo(562, doc.y)
               .stroke()
               .moveDown(0.5);

            doc.fillColor('#333333').fontSize(10);
            const mediaGridY1 = doc.y;
            doc.text(`Media Type:`, 50, mediaGridY1)
               .text(request.mediaType || request.media, 150, mediaGridY1);

            const mediaGridY2 = mediaGridY1 + 18;
            const fromDateStr = new Date(request.fromDate).toLocaleDateString();
            const toDateStr = new Date(request.toDate).toLocaleDateString();
            doc.text(`Validity Period:`, 50, mediaGridY2)
               .text(`${fromDateStr}  to  ${toDateStr}`, 150, mediaGridY2);

            const mediaGridY3 = mediaGridY2 + 18;
            doc.text(`Justification:`, 50, mediaGridY3)
               .text(request.justification || 'No justification provided.', 150, mediaGridY3, { width: 412 });

            doc.moveDown(4);

            // --- Section: Digital Signatures Audit Trail ---
            doc.fontSize(12)
               .fillColor('#003B70')
               .text('3. Digital Signatures & Approvals Trail', { underline: false })
               .moveDown(0.3);

            doc.strokeColor('#003B70')
               .lineWidth(0.5)
               .moveTo(50, doc.y)
               .lineTo(562, doc.y)
               .stroke()
               .moveDown(0.5);

            const signatures = request.signatures || {};
            const signatureList = [
                { key: 'employeeSign', label: 'Employee Sign-off' },
                { key: 'hodSign', label: 'HOD Recommendation' },
                { key: 'caSign', label: 'Competent Authority Approval' },
                { key: 'naSign', label: 'Network Implementation' }
            ];

            doc.fillColor('#333333').fontSize(9);

            signatureList.forEach((sig) => {
                const data = signatures[sig.key];
                const blockY = doc.y;

                // Draw bullet indicator
                doc.fillColor('#003B70')
                   .circle(55, blockY + 5, 3)
                   .fill();

                doc.fillColor('#333333');
                if (data) {
                    doc.font('Helvetica-Bold').text(`${sig.label}:`, 70, blockY).font('Helvetica');
                    doc.text(`Digitally Signed by ${data.name} on ${data.timestamp}`, 70, blockY + 12);
                    doc.text(`Comment: "${data.comment || 'N/A'}"`, 70, blockY + 24);
                    doc.moveDown(3.5);
                } else {
                    doc.font('Helvetica-Bold').text(`${sig.label}:`, 70, blockY).font('Helvetica');
                    doc.fillColor('#718096')
                       .text('Pending Action / No signature recorded', 70, blockY + 12)
                       .fillColor('#333333');
                    doc.moveDown(2.5);
                }
            });

            // --- Footer Disclaimer ---
            doc.fontSize(8)
               .fillColor('#a0aec0')
               .text('This is a computer-generated receipt representing a secure digital workflow operation at NALCO.', 50, 720, { align: 'center' })
               .text('Authorized by NALCO ESMA Security Infrastructure.', { align: 'center' });

            doc.end();

        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    generateReceiptPdf
};
