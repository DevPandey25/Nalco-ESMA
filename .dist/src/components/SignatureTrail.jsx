import { memo } from 'react';
import { SIGNATURE_SLOTS } from '../constants/workflow';

const SignatureTrail = memo(({ signatures = {} }) => {
  return (
    <div className="signature-trail">
      {SIGNATURE_SLOTS.map(({ key, label }) => {
        const isSigned = !!signatures[key];
        const shortLabel = label.split(' ')[0];
        return (
          <span
            key={key}
            className={`signature-dot ${isSigned ? 'signed' : ''}`}
            title={label}
          >
            {shortLabel} {isSigned ? 'Signed' : 'Pending'}
          </span>
        );
      })}
    </div>
  );
});

SignatureTrail.displayName = 'SignatureTrail';

export default SignatureTrail;
