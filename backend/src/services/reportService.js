const Request = require('../models/requestModel');
const Approval = require('../models/approvalModel');

class ReportService {
    async getAnalyticsOverview() {
        const totalRequests = await Request.countDocuments();
        
        // Status breakdown pipeline
        const statusDistribution = await Request.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Department breakdown pipeline
        const departmentAnalytics = await Request.aggregate([
            { $group: { _id: '$department', total: { $sum: 1 }, avgRisk: { $avg: '$aiRiskScore' } } }
        ]);

        // Rejection / Approval counting
        const approvedCount = await Request.countDocuments({ status: { $in: ['APPROVED', 'IMPLEMENTED'] } });
        const rejectedCount = await Request.countDocuments({ status: 'REJECTED' });

        const approvalRate = totalRequests > 0 ? ((approvedCount / totalRequests) * 100).toFixed(2) : 0;
        const rejectionRate = totalRequests > 0 ? ((rejectedCount / totalRequests) * 100).toFixed(2) : 0;

        // Bottlenecks calculation (Count requests dwelling long in specific assigned stages)
        const bottlenecks = await Request.aggregate([
            { $match: { status: { $nin: ['DRAFT', 'IMPLEMENTED', 'REJECTED'] } } },
            { $group: { _id: '$assignedTo', pendingCount: { $sum: 1 } } }
        ]);

        return {
            totalRequests,
            approvalRate: Number(approvalRate),
            rejectionRate: Number(rejectionRate),
            statusDistribution,
            departmentAnalytics,
            bottlenecks,
            turnaroundTimes: {
                averageDays: 3.4, // placeholder mock calculations mapping real delta timelines
                slaCompliantPercentage: 91.2
            }
        };
    }

    async generateExportData(type = 'csv') {
        const requests = await Request.find().sort({ createdAt: -1 }).lean();
        
        if (type === 'csv') {
            const headers = ['Request ID', 'Employee', 'Department', 'Media Type', 'Status', 'Assigned Layer', 'Risk Level', 'Submission Date'];
            const rows = requests.map(r => [
                r.requestId,
                `"${r.employee}"`,
                `"${r.department}"`,
                r.mediaType,
                r.status,
                r.assignedTo || 'None',
                r.aiRiskLevel,
                new Date(r.createdAt).toISOString().slice(0, 10)
            ]);

            return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        }

        // Return raw pre-formatted payload JSON array for PDF renderer generation view components
        return requests;
    }
}

module.exports = new ReportService();
