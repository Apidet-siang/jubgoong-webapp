import { Transport } from '../models/types';
import { calculateTransportStats, formatCurrency, formatWeight } from '../utils/calculations';

interface TransportCardProps {
  transport: Transport;
  onClick: () => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (transportId: string) => void;
}

function TransportCard({ transport, onClick, selectionMode, isSelected, onToggleSelect }: TransportCardProps) {
  const stats = calculateTransportStats(transport);
  const hasPrice = transport.pricePerKg > 0;

  const handleClick = () => {
    if (selectionMode && onToggleSelect) {
      onToggleSelect(transport.id);
    } else {
      onClick();
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSelect) {
      onToggleSelect(transport.id);
    }
  };

  return (
    <div
      className={`transport-card-simple ${selectionMode ? 'selection-mode' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="transport-card-header">
        <div className="transport-title">
          {selectionMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              onClick={handleCheckboxClick}
              className="transport-checkbox"
            />
          )}
          <h4>{transport.name}</h4>
          {!hasPrice && <span className="warning-badge">⚠️ No Price</span>}
        </div>
        {!selectionMode && <span className="view-arrow">→</span>}
      </div>

      <div className="transport-card-stats">
        <div className="stat">
          <span className="stat-label">Baskets</span>
          <span className="stat-value">{stats.basketCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Weight</span>
          <span className="stat-value">{formatWeight(stats.totalWeight)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Shrimp Weight</span>
          <span className="stat-value">{formatWeight(stats.shrimpWeight)}</span>
        </div>
        {hasPrice && (
          <div className="stat">
            <span className="stat-label">Final Price</span>
            <span className="stat-value stat-value-currency">{formatCurrency(stats.finalPrice)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransportCard;
