export const STATUS_LABELS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  RECOMMENDED: 'Recommended',
  APPROVED: 'Approved',
  IMPLEMENTED: 'Implemented',
  REJECTED_L1: 'Rejected L1',
  REJECTED_FINAL: 'Rejected Final',
};

export const APPROVAL_STAGES = {
  DRAFT: 'Employee draft',
  SUBMITTED: 'HOD recommendation',
  RECOMMENDED: 'Authority approval',
  APPROVED: 'Network implementation',
  IMPLEMENTED: 'Closed',
  REJECTED_L1: 'Rejected by HOD',
  REJECTED_FINAL: 'Final rejection',
};

export const STATUS_TO_ASSIGNEE = {
  DRAFT: 'Employee',
  SUBMITTED: 'HOD',
  RECOMMENDED: 'Competent Authority',
  APPROVED: 'Network Admin',
  IMPLEMENTED: 'Network Admin',
  REJECTED_L1: 'Employee',
  REJECTED_FINAL: 'Employee',
};

export const WORKFLOW_TABS = [
  { label: 'All Work', value: 'all' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'Recommended', value: 'RECOMMENDED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Implemented', value: 'IMPLEMENTED' },
  { label: 'Rejected', value: 'rejected' },
];

export const BOARD_COLUMNS = [
  'DRAFT', 'SUBMITTED', 'RECOMMENDED', 'APPROVED', 'IMPLEMENTED', 'REJECTED',
];

export const SIGNATURE_SLOTS = [
  { key: 'employeeSign', label: 'Employee' },
  { key: 'hodSign', label: 'HOD Recommendation' },
  { key: 'caSign', label: 'Authority Approval' },
  { key: 'naSign', label: 'Implementation' },
];

export const WORKFLOW_CONFIGS = {
  submit: {
    title: (id) => `Submit ${id}`,
    commentLabel: 'Employee Declaration',
    placeholder: 'Confirm declaration before submitting',
    defaultComment: 'I confirm that the submitted details are accurate and required for official work.',
    confirmText: 'Submit & Sign',
  },
  recommend: {
    title: (id) => `Recommend ${id}`,
    commentLabel: 'HOD Comment',
    placeholder: 'Recommendation comment',
    confirmText: 'Recommend & Sign',
  },
  return: {
    title: (id) => `Return ${id}`,
    commentLabel: 'Return Comment',
    placeholder: 'Reason for returning to employee',
    confirmText: 'Return & Sign',
  },
  approve: {
    title: (id) => `Approve ${id}`,
    commentLabel: 'Authority Comment',
    placeholder: 'Final approval comment',
    confirmText: 'Approve & Sign',
  },
  reject: {
    title: (id) => `Reject ${id}`,
    commentLabel: 'Rejection Reason',
    placeholder: 'Mandatory rejection reason',
    confirmText: 'Reject & Sign',
  },
  implement: {
    title: (id) => `Implement ${id}`,
    commentLabel: 'Implementation Note',
    placeholder: 'Implementation note',
    confirmText: 'Implement & Sign',
  },
};

export const PAGE_TITLES = {
  '/dashboard': ['Dashboard', 'ESMA Command Center'],
  '/request': ['Request Form', 'External Storage Media Access Form'],
  '/data': ['Data Management / All Requests', 'ESMA Work Queue'],
  '/approvals': ['Approvals', 'Role-Based Approval Queue'],
  '/reports': ['Reports', 'ESMA Workflow Reports'],
};
