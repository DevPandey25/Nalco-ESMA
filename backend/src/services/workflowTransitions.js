const { WORKFLOW_STATES, WORKFLOW_ACTIONS } = require('./workflowRules');

// State transition table mapping: CurrentState -> Action -> NextState
const TRANSITIONS = {
    [WORKFLOW_STATES.DRAFT]: {
        [WORKFLOW_ACTIONS.SUBMIT]: WORKFLOW_STATES.SUBMITTED
    },
    [WORKFLOW_STATES.SUBMITTED]: {
        [WORKFLOW_ACTIONS.RECOMMEND]: WORKFLOW_STATES.RECOMMENDED,
        [WORKFLOW_ACTIONS.REJECT]: WORKFLOW_STATES.REJECTED,
        [WORKFLOW_ACTIONS.RETURN]: WORKFLOW_STATES.RETURNED
    },
    [WORKFLOW_STATES.RECOMMENDED]: {
        [WORKFLOW_ACTIONS.APPROVE]: WORKFLOW_STATES.APPROVED,
        [WORKFLOW_ACTIONS.REJECT]: WORKFLOW_STATES.REJECTED
    },
    [WORKFLOW_STATES.APPROVED]: {
        [WORKFLOW_ACTIONS.IMPLEMENT]: WORKFLOW_STATES.IMPLEMENTED
    },
    [WORKFLOW_STATES.RETURNED]: {
        [WORKFLOW_ACTIONS.SUBMIT]: WORKFLOW_STATES.SUBMITTED
    }
};

/**
 * Validate if a state transition is legal
 * @param {string} currentState 
 * @param {string} action 
 * @returns {string|null} Target state if valid, null if invalid
 */
const getNextState = (currentState, action) => {
    const stateTransitions = TRANSITIONS[currentState];
    if (!stateTransitions) return null;
    return stateTransitions[action] || null;
};

module.exports = {
    TRANSITIONS,
    getNextState
};
