const reportService = require('../services/reportService');

const getAnalytics = async (req, res, next) => {
    try {
        const overview = await reportService.getAnalyticsOverview();
        res.status(200).json({ success: true, data: overview });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const exportReports = async (req, res, next) => {
    try {
        const format = req.query.format || 'csv';
        const data = await reportService.generateExportData(format);

        if (format === 'csv') {
            res.header('Content-Type', 'text/csv');
            res.attachment(`NALCO_ESMA_Report_${new Date().toISOString().slice(0, 10)}.csv`);
            return res.send(data);
        }

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getAnalytics, exportReports };
