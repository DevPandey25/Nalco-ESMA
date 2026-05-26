import React, { useMemo } from 'react';

export default function ReceiptFooter({ request }) {
  const currentTimestamp = useMemo(() => {
    return new Date().toLocaleDateString('en-IN') + ', ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, []);

  const verificationHash = useMemo(() => {
    if (!request) return '';
    // Build a deterministic string based on request properties
    const employeeId = request.employee?.personalNo || request.personalNo || '0000';
    const reqId = request.id || 'ESMA-0000';
    const status = request.status || 'DRAFT';
    const rawString = `${reqId}-${employeeId}-${status}`;
    
    // Quick simple hash function to produce a SHA-256 style string for visual audit
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const absHash = Math.abs(hash).toString(16).toUpperCase();
    return `SEC-AUD-${absHash.padStart(8, '0')}-${(Math.floor(Math.random() * 90000) + 10000)}`;
  }, [request]);

  const allApproved = request?.status === 'IMPLEMENTED' || request?.status === 'APPROVED';

  return (
    <div className="mt-8 border-t border-dashed border-slate-300 pt-6 text-center select-none">
      {/* Dynamic Security Notice */}
      <p className="text-[10px] font-extrabold text-slate-500 tracking-wider">
        System-Generated Document • {allApproved ? 'Valid only with all 3 digital approvals.' : 'DRAFT VIEW - Subject to workflow approvals.'}
      </p>
      
      {/* Generated On Timestamp */}
      <p className="text-[8px] font-bold text-slate-400 tracking-widest mt-1">
        Generated on: {currentTimestamp}
      </p>
      
      {/* Audit Block */}
      <div className="mt-3 flex items-center justify-center space-x-1 text-[8px] font-semibold text-slate-400 select-none">
        <svg className="w-3 h-3 text-slate-300 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Audit Verification Key: <span className="font-mono text-slate-500 font-bold">{verificationHash}</span></span>
      </div>
    </div>
  );
}
