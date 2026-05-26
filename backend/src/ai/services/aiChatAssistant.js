const Request = require('../../models/requestModel');
const Approval = require('../../models/approvalModel');

class AIChatAssistantService {
    /**
     * Parse natural language prompts to execute contextual database aggregation routing
     */
    async processConversationalQuery(prompt, user) {
        const lowerPrompt = prompt.toLowerCase();

        // 1. Context Query: "Why was this request rejected?"
        if (lowerPrompt.includes('why') && lowerPrompt.includes('rejected')) {
            // Find recent rejected request for user context
            const filter = user.role === 'Employee' ? { employeeId: user.personalNo, status: 'REJECTED' } : { status: 'REJECTED' };
            const lastRejected = await Request.findOne(filter).sort({ updatedAt: -1 });

            if (!lastRejected) {
                return {
                    response: "No recent rejected requests could be identified in the active context boundary.",
                    data: null
                };
            }

            // Fetch granular rejection approval comment trace
            const rejectionTrace = await Approval.findOne({
                requestId: lastRejected.requestId,
                action: 'REJECT'
            }).sort({ createdAt: -1 });

            const reason = rejectionTrace ? rejectionTrace.comment : "No granular comment recorded in explicit approval document.";
            return {
                response: `Request ${lastRejected.requestId} was rejected at stage [${lastRejected.currentStage}]. Recorded Reason: "${reason}"`,
                data: lastRejected
            };
        }

        // 2. Context Query: "Show pending approvals"
        if (lowerPrompt.includes('pending') || lowerPrompt.includes('queue')) {
            let targetAssigned = 'HOD';
            if (user.role === 'Competent Authority') targetAssigned = 'CA';
            else if (user.role === 'Network Admin') targetAssigned = 'Network Admin';

            const pendingList = await Request.find({ assignedTo: targetAssigned }).sort({ createdAt: 1 }).limit(5);
            return {
                response: `Identified ${pendingList.length} top pending requests assigned to layer [${targetAssigned}].`,
                data: pendingList
            };
        }

        // 3. Context Query: "Generate workflow summary"
        if (lowerPrompt.includes('summary')) {
            const counts = await Request.aggregate([
                { $group: { _id: '$status', total: { $sum: 1 } } }
            ]);
            const breakdown = counts.map(c => `${c._id}: ${c.total}`).join(', ');
            return {
                response: `Overall Platform Status Breakdown: ${breakdown || 'No active requests present.'}`,
                data: counts
            };
        }

        // 4. Context Query: "Show high-risk requests"
        if (lowerPrompt.includes('high-risk') || lowerPrompt.includes('risk')) {
            const riskyRequests = await Request.find({ aiRiskLevel: 'HIGH' }).sort({ aiRiskScore: -1 }).limit(5);
            return {
                response: `Fetched top ${riskyRequests.length} critical high-risk requests tagged by automated pre-evaluation heuristic pipelines.`,
                data: riskyRequests
            };
        }

        // Default response pattern mapping when explicit prompt intents don't match heuristics
        return {
            response: "Conversational query received. In full API mode, this delegates to embedded vector indices for natural language generation. Currently operational in fallback pattern mapping.",
            data: null
        };
    }
}

module.exports = new AIChatAssistantService();
