import { STATUS_LABELS, APPROVAL_STAGES } from '../constants/workflow.js';

export function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(value));
}

export function nowStamp() {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;
}

export function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

export function statusClass(status) {
  return `status-${status}`;
}

export function isRejected(request) {
  return request.status === 'REJECTED_L1' || request.status === 'REJECTED_FINAL';
}

export function approvalStage(request) {
  return APPROVAL_STAGES[request.status] || request.status;
}

export function workflowToastVerb(action) {
  return {
    submit: 'submitted', recommend: 'recommended', return: 'returned',
    approve: 'approved', reject: 'rejected', implement: 'implemented',
  }[action] || action;
}

export function getDirectEditLink(id) {
  return `${window.location.origin}/request?edit=${id}`;
}
