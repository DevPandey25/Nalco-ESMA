import { memo } from 'react';

const RateCards = memo(({ approvalRate, rejectionRate }) => {
  return (
    <div className="rate-grid">
      <article className="rate-card">
        <span>Approval Rate</span>
        <strong>{approvalRate}%</strong>
      </article>
      <article className="rate-card">
        <span>Rejection Rate</span>
        <strong>{rejectionRate}%</strong>
      </article>
    </div>
  );
});

RateCards.displayName = 'RateCards';

export default RateCards;
