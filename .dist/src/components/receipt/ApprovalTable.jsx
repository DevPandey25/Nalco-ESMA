import React from 'react';
import { formatDate } from '../../utils/statusHelpers';

export default function ApprovalTable({ request }) {
  if (!request) return null;

  const employeeName = request.employee?.name || request.employee || 'N/A';
  const designation = request.employee?.designation || request.employee?.title || request.designation || 'N/A';
  const personalNo = request.employee?.personalNo || request.personalNo || 'N/A';
  const department = request.department || 'N/A';
  const unit = request.unit || 'N/A';
  const media = request.media || 'N/A';
  const fromDateStr = request.fromDate ? formatDate(request.fromDate) : 'N/A';
  const toDateStr = request.toDate ? formatDate(request.toDate) : 'N/A';
  const justification = request.justification || 'N/A';
  const submissionDate = request.timestamps?.submitted || request.timestamps?.created || request.createdAt || 'N/A';

  // Format submission date nicely if it's an ISO string
  const formatDateTime = (str) => {
    if (!str || str === 'N/A') return 'N/A';
    try {
      const d = new Date(str);
      if (isNaN(d.getTime())) return str; // return raw if not parsable ISO
      return d.toLocaleDateString('en-IN') + ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return str;
    }
  };

  // Determine stage status and remarks
  const getStageStatus = (stage) => {
    const status = request.status;
    const signatures = request.signatures || {};

    if (stage === 'HOD') {
      if (signatures.hodSign) {
        if (status === 'REJECTED_L1') return { text: 'REJECTED', className: 'text-red-700 font-bold bg-red-50 border-red-200' };
        return { text: 'APPROVED / RECOMMENDED', className: 'text-green-700 font-bold bg-green-50 border-green-200' };
      }
      if (status === 'SUBMITTED') return { text: 'UNDER REVIEW', className: 'text-amber-700 font-bold bg-amber-50 border-amber-200 animate-pulse' };
      return { text: 'PENDING SUBMISSION', className: 'text-slate-400 font-semibold bg-slate-50 border-slate-200' };
    }

    if (stage === 'CA') {
      if (signatures.caSign) {
        if (status === 'REJECTED_FINAL') return { text: 'REJECTED', className: 'text-red-700 font-bold bg-red-50 border-red-200' };
        return { text: 'APPROVED', className: 'text-green-700 font-bold bg-green-50 border-green-200' };
      }
      if (status === 'RECOMMENDED') return { text: 'UNDER REVIEW', className: 'text-amber-700 font-bold bg-amber-50 border-amber-200 animate-pulse' };
      if (status === 'SUBMITTED' || status === 'DRAFT' || status === 'REJECTED_L1') {
        return { text: 'AWAITING PREVIOUS STAGE', className: 'text-slate-300 font-normal bg-slate-50 border-slate-100' };
      }
      return { text: 'PENDING', className: 'text-slate-400 font-semibold bg-slate-50 border-slate-200' };
    }

    if (stage === 'NA') {
      if (signatures.naSign) {
        return { text: 'IMPLEMENTED', className: 'text-green-700 font-bold bg-green-50 border-green-200' };
      }
      if (status === 'APPROVED') return { text: 'AWAITING IMPLEMENTATION', className: 'text-amber-700 font-bold bg-amber-50 border-amber-200 animate-pulse' };
      if (['DRAFT', 'SUBMITTED', 'RECOMMENDED', 'REJECTED_L1', 'REJECTED_FINAL'].includes(status)) {
        return { text: 'AWAITING PREVIOUS STAGE', className: 'text-slate-300 font-normal bg-slate-50 border-slate-100' };
      }
      return { text: 'PENDING', className: 'text-slate-400 font-semibold bg-slate-50 border-slate-200' };
    }

    return { text: 'PENDING', className: '' };
  };

  const getStageRemarks = (stage) => {
    const signatures = request.signatures || {};
    const comments = request.comments || {};

    if (stage === 'HOD') {
      return signatures.hodSign?.comment || comments.hod || request.rejectionReason || 'No comments';
    }
    if (stage === 'CA') {
      return signatures.caSign?.comment || comments.ca || (request.status === 'REJECTED_FINAL' ? request.rejectionReason : null) || 'No comments';
    }
    if (stage === 'NA') {
      return signatures.naSign?.comment || signatures.naSign?.note || comments.na || 'No comments';
    }
    return '';
  };

  return (
    <div className="space-y-8 select-none">
      {/* 1. Employee & Request Details */}
      <div>
        <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase mb-3 flex items-center">
          <span className="bg-nalco-red w-1.5 h-4 inline-block mr-2" />
          1. Employee & Request Details
        </h4>
        <div className="border border-slate-300 overflow-hidden rounded-md">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <tbody className="divide-y divide-slate-300">
              <tr className="divide-x divide-slate-300 bg-slate-50/50">
                <td className="w-1/3 px-4 py-2 font-bold text-slate-700">Requester Name</td>
                <td className="px-4 py-2 text-slate-900 font-medium">{employeeName}</td>
              </tr>
              <tr className="divide-x divide-slate-300">
                <td className="px-4 py-2 font-bold text-slate-700">Personal / Employee No.</td>
                <td className="px-4 py-2 text-slate-900 font-medium">{personalNo}</td>
              </tr>
              <tr className="divide-x divide-slate-300 bg-slate-50/50">
                <td className="px-4 py-2 font-bold text-slate-700">Department</td>
                <td className="px-4 py-2 text-slate-900 font-medium uppercase">{department}</td>
              </tr>
              <tr className="divide-x divide-slate-300">
                <td className="px-4 py-2 font-bold text-slate-700">Designation</td>
                <td className="px-4 py-2 text-slate-900 font-medium">{designation}</td>
              </tr>
              <tr className="divide-x divide-slate-300 bg-slate-50/50">
                <td className="px-4 py-2 font-bold text-slate-700">Request Type</td>
                <td className="px-4 py-2 text-slate-900 font-medium">External Storage Media Access</td>
              </tr>
              <tr className="divide-x divide-slate-300">
                <td className="px-4 py-2 font-bold text-slate-700">Access Period</td>
                <td className="px-4 py-2 text-slate-900 font-bold">
                  {fromDateStr} <span className="text-slate-400 font-normal">to</span> {toDateStr}
                </td>
              </tr>
              <tr className="divide-x divide-slate-300 bg-slate-50/50">
                <td className="px-4 py-2 font-bold text-slate-700">Justification</td>
                <td className="px-4 py-2 text-slate-800 leading-relaxed italic">{justification}</td>
              </tr>
              <tr className="divide-x divide-slate-300">
                <td className="px-4 py-2 font-bold text-slate-700">Date of Submission</td>
                <td className="px-4 py-2 text-slate-900 font-medium">{formatDateTime(submissionDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Approval Workflow Status */}
      <div>
        <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase mb-3 flex items-center">
          <span className="bg-nalco-red w-1.5 h-4 inline-block mr-2" />
          2. Approval Workflow Status
        </h4>
        <div className="border border-slate-300 overflow-hidden rounded-md">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="divide-x divide-slate-300 bg-slate-100 text-slate-800 border-b border-slate-300">
                <th className="w-1/3 px-4 py-2.5 font-bold uppercase tracking-wider">Authority</th>
                <th className="w-1/4 px-4 py-2.5 font-bold uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 font-bold uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {['HOD', 'CA', 'NA'].map((roleKey, idx) => {
                const label = roleKey === 'HOD' 
                  ? 'HOD (Stage 1)' 
                  : roleKey === 'CA' 
                    ? 'Competent Authority (Stage 2)' 
                    : 'Network Admin (Stage 3)';
                const status = getStageStatus(roleKey);
                const remarks = getStageRemarks(roleKey);
                
                return (
                  <tr key={roleKey} className={`divide-x divide-slate-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-4 py-3 font-bold text-slate-800">{label}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 text-[10px] rounded-full border tracking-wide uppercase ${status.className}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 italic text-xs">{remarks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
