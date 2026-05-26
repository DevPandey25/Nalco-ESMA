const aiChatAssistant = require('../ai/services/aiChatAssistant');
const aiProvider = require('../ai/services/aiProvider');

const askAssistant = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ success: false, error: 'Prompt message string is mandatory.' });
        }

        const userScope = {
            id: req.user.id,
            role: req.user.role || 'Employee',
            personalNo: req.user.personalNo || '1001'
        };

        const result = await aiChatAssistant.processConversationalQuery(prompt, userScope);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getApprovalAssistantAdvice = async (req, res, next) => {
    try {
        const { requestState, riskLevel, departmentScope } = req.body;
        const advice = await aiProvider.generateApprovalRecommendation({ requestState, riskLevel, departmentScope });
        res.status(200).json({ success: true, data: advice });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getDepartmentInsights = async (req, res, next) => {
    try {
        const department = req.query.department || 'Operations';
        const insight = await aiProvider.generateInsight(department);
        res.status(200).json({ success: true, data: insight });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { askAssistant, getApprovalAssistantAdvice, getDepartmentInsights };
