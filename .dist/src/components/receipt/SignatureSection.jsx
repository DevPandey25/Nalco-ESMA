import React from 'react';

export default function SignatureSection({ request }) {
  if (!request) return null;

  const signatures = request.signatures || {};

  // Positions configurations
  const positions = [
    {
      key: 'hodSign',
      title: 'Head of Department',
      shortTitle: 'HOD',
      signerDefault: 'A. K. Das'
    },
    {
      key: 'caSign',
      title: 'Competent Authority',
      shortTitle: 'Competent Authority',
      signerDefault: 'R. Mohanty'
    },
    {
      key: 'naSign',
      title: 'Network Administrator',
      shortTitle: 'Network Admin',
      signerDefault: 'Prakash Behera'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-6 pt-10 pb-6 select-none">
      {positions.map((pos) => {
        const signData = signatures[pos.key];
        const isSigned = !!signData;
        const name = signData?.name || pos.signerDefault;
        const dateStr = signData?.timestamp || '';

        return (
          <div key={pos.key} className="flex flex-col items-center text-center">
            {/* Signature Area */}
            <div className="h-16 flex items-end justify-center w-full mb-2">
              {isSigned ? (
                signData.image ? (
                  /* Drawn Signature */
                  <img 
                    src={signData.image} 
                    alt={`${pos.title} Signature`} 
                    className="max-h-16 max-w-[120px] object-contain dark:filter-none select-none"
                  />
                ) : (
                  /* Auto Signature (Cursive styling) */
                  <span 
                    className="text-base md:text-lg font-bold text-slate-800 italic select-none"
                    style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif', letterSpacing: '-0.02em', textDecoration: 'underline', textDecorationColor: '#c62828', textUnderlineOffset: '6px' }}
                  >
                    {name.toLowerCase()}
                  </span>
                )
              ) : (
                /* Pending Signature placeholder */
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-dashed border-slate-300 rounded px-3 py-1.5 animate-pulse">
                  Awaiting Approval
                </span>
              )}
            </div>

            {/* Divider Line */}
            <div className="w-4/5 border-t border-slate-300 my-1" />

            {/* Signer Details */}
            <div className="mt-1">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">
                {pos.title}
              </p>
              {isSigned && (
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                  Signed: {dateStr}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
