import { memo } from 'react';
import { SIGNATURE_SLOTS } from '../constants/workflow';

const SignatureMatrix = memo(({ signatures = {}, isNewForm = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {SIGNATURE_SLOTS.map(({ key, label }) => {
        const sign = signatures[key];
        const isSigned = !!sign;
        
        return (
          <article key={key} className="bg-enterprise-soft/30 border border-enterprise-line rounded-xl p-4 flex flex-col justify-between h-full min-h-[140px]">
            <div>
              <strong className="text-sm font-bold text-nalco-blue block mb-3">{label}</strong>
              <div className="text-xs text-enterprise-muted mb-1 font-medium">
                Name: {sign ? sign.name : '-'} <span className="mx-1">Date:</span> {sign ? sign.timestamp : '-'}
              </div>
              <p className="text-xs text-enterprise-muted mb-4">
                {sign && (sign.comment || sign.note) ? (sign.comment || sign.note) : 'Awaiting digital signature'}
              </p>
            </div>
            
            <div className="mt-auto">
              <span className={`
                inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                ${isSigned 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : (isNewForm ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-orange-50 text-orange-700 border-orange-200')}
              `}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-60" />
                {isSigned ? 'Signed' : (isNewForm ? 'Draft' : 'Pending')}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
});

SignatureMatrix.displayName = 'SignatureMatrix';

export default SignatureMatrix;
