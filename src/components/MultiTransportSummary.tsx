import { Transport } from '../models/types';
import { calculateTransportStats, formatCurrency, formatWeight } from '../utils/calculations';

interface MultiTransportSummaryProps {
  transports: Transport[];
  onClose: () => void;
}

function MultiTransportSummary({ transports, onClose }: MultiTransportSummaryProps) {
  if (transports.length === 0) {
    return null;
  }

  // Calculate combined totals
  let totalBaskets = 0;
  let totalWeight = 0;
  let totalShrimpWeight = 0;
  let totalBasePrice = 0;
  let totalDeduction = 0;
  let totalFinalPrice = 0;

  transports.forEach(transport => {
    const stats = calculateTransportStats(transport);
    totalBaskets += stats.basketCount;
    totalWeight += stats.totalWeight;
    totalShrimpWeight += stats.shrimpWeight;
    totalBasePrice += stats.basePrice;
    totalDeduction += stats.deduction;
    totalFinalPrice += stats.finalPrice;
  });

  return (
    <div className="multi-transport-summary">
      <div className="summary-header">
        <div className="summary-title">
          <h3>Selected Transports Summary</h3>
          <span className="transport-count">{transports.length} transport{transports.length !== 1 ? 's' : ''} selected</span>
        </div>
        <button className="btn-icon close-btn" onClick={onClose} title="Close">
          ✕
        </button>
      </div>

      <div className="summary-content">
        {/* Transport List */}
        <div className="selected-transports-list">
          {transports.map(transport => (
            <div key={transport.id} className="selected-transport-item">
              <span className="transport-name">📦 {transport.name}</span>
              <span className="transport-baskets">{calculateTransportStats(transport).basketCount} baskets</span>
            </div>
          ))}
        </div>

        {/* Combined Stats Grid */}
        <div className="combined-stats-grid">
          <div className="combined-stat">
            <span className="combined-stat-label">Total Baskets</span>
            <span className="combined-stat-value">{totalBaskets}</span>
          </div>
          <div className="combined-stat">
            <span className="combined-stat-label">Total Weight</span>
            <span className="combined-stat-value">{formatWeight(totalWeight)}</span>
          </div>
          <div className="combined-stat">
            <span className="combined-stat-label">Shrimp Weight</span>
            <span className="combined-stat-value">{formatWeight(totalShrimpWeight)}</span>
          </div>
        </div>

        {/* Price Breakdown */}
        {totalBasePrice > 0 && (
          <div className="price-breakdown">
            <h4>Combined Price Calculation</h4>
            <div className="price-breakdown-row">
              <span>Base Price:</span>
              <span>{formatCurrency(totalBasePrice)}</span>
            </div>
            <div className="price-breakdown-row deduction-row">
              <span>Total Deduction:</span>
              <span>- {formatCurrency(totalDeduction)}</span>
            </div>
            <div className="price-breakdown-row final-row">
              <span>Final Total:</span>
              <span className="final-total">{formatCurrency(totalFinalPrice)}</span>
            </div>
          </div>
        )}

        {totalBasePrice === 0 && (
          <div className="no-pricing-notice">
            <span>⚠️ Some transports don't have pricing set</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiTransportSummary;
