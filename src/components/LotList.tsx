import { Lot } from '../models/types';
import { calculateLotStats, formatCurrency, formatWeight, formatDate } from '../utils/calculations';

interface LotListProps {
  lots: Lot[];
  onSelectLot: (lot: Lot) => void;
  onCreateLot: () => void;
  onDeleteLot: (lotId: string) => void;
}

function LotList({ lots, onSelectLot, onCreateLot, onDeleteLot }: LotListProps) {
  const handleDelete = (e: React.MouseEvent, lotId: string) => {
    e.stopPropagation();
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบการจับนี้?')) {
      onDeleteLot(lotId);
    }
  };

  return (
    <div className="lot-list-container">
      <div className="list-header">
        <h2>การจับ</h2>
        <button className="btn-primary" onClick={onCreateLot}>
          + สร้างใหม่
        </button>
      </div>

      {lots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>ยังไม่มีการจับ</h3>
          <p>สร้างการจับแรกเพื่อเริ่มติดตามน้ำหนักกุ้ง</p>
          <button className="btn-primary" onClick={onCreateLot}>
            สร้างการจับแรก
          </button>
        </div>
      ) : (
        <div className="lot-grid">
          {lots.map(lot => {
            const stats = calculateLotStats(lot);
            return (
              <div
                key={lot.id}
                className="lot-card"
                onClick={() => onSelectLot(lot)}
              >
                <div className="lot-card-header">
                  <h3>{lot.name}</h3>
                  <button
                    className="btn-delete"
                    onClick={(e) => handleDelete(e, lot.id)}
                    aria-label="Delete lot"
                  >
                    🗑️
                  </button>
                </div>

                <div className="lot-card-info">
                  <p className="lot-date">{formatDate(lot.createdAt)}</p>
                </div>

                <div className="lot-stats">
                  <div className="stat">
                    <span className="stat-label">Transports</span>
                    <span className="stat-value">{stats.transportCount}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Baskets</span>
                    <span className="stat-value">{stats.totalBaskets}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Shrimp Weight</span>
                    <span className="stat-value">{formatWeight(stats.totalShrimpWeight)}</span>
                  </div>
                  {stats.totalValue > 0 && (
                    <div className="stat">
                      <span className="stat-label">Total Value</span>
                      <span className="stat-value stat-value-currency">{formatCurrency(stats.totalValue)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LotList;
