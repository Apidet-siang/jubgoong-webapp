import { useState } from 'react';
import { Lot, Transport } from '../models/types';
import { calculateLotStats, formatCurrency, formatWeight } from '../utils/calculations';
import { exportLotAsPDF } from '../services/pdfExport';
import TransportCard from './TransportCard';
import MultiTransportSummary from './MultiTransportSummary';

interface LotDetailProps {
  lot: Lot;
  onBack: () => void;
  onUpdateLot: (lot: Lot) => void;
  onAddTransport: (lotId: string) => void;
  onSelectTransport: (transport: Transport) => void;
  getLot: (lotId: string) => Lot | undefined;
}

function LotDetail({ lot, onBack, onUpdateLot, onAddTransport, onSelectTransport, getLot }: LotDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(lot.name);
  const [editBasketWeight, setEditBasketWeight] = useState(lot.defaultBasketWeight.toString());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTransportIds, setSelectedTransportIds] = useState<Set<string>>(new Set());

  const stats = calculateLotStats(lot);

  // Get selected transports
  const selectedTransports = lot.transports.filter(t => selectedTransportIds.has(t.id));

  const handleSaveEdit = () => {
    onUpdateLot({
      ...lot,
      name: editName,
      defaultBasketWeight: parseFloat(editBasketWeight) || 5.0
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(lot.name);
    setEditBasketWeight(lot.defaultBasketWeight.toString());
    setIsEditing(false);
  };

  const handleExportPDF = () => {
    const freshLot = getLot(lot.id);
    if (freshLot) {
      exportLotAsPDF(freshLot);
    }
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      // Clear selections when exiting selection mode
      setSelectedTransportIds(new Set());
    }
  };

  const handleToggleSelect = (transportId: string) => {
    setSelectedTransportIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(transportId)) {
        newSet.delete(transportId);
      } else {
        newSet.add(transportId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedTransportIds.size === lot.transports.length) {
      setSelectedTransportIds(new Set());
    } else {
      setSelectedTransportIds(new Set(lot.transports.map(t => t.id)));
    }
  };

  const handleCloseSummary = () => {
    setSelectionMode(false);
    setSelectedTransportIds(new Set());
  };

  return (
    <div className="lot-detail-container">
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>
          ← กลับไปยังการจับ
        </button>

        <div className="detail-actions">
          <button className="btn-secondary" onClick={handleExportPDF}>
            📄 Export PDF
          </button>
        </div>
      </div>

      <div className="lot-info-card">
        {isEditing ? (
          <div className="lot-edit-form">
            <div className="form-group">
              <label>ชื่อการจับ</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Default Basket Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                value={editBasketWeight}
                onChange={(e) => setEditBasketWeight(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleSaveEdit}>
                Save
              </button>
              <button className="btn-secondary" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="lot-info-header">
              <h2>{lot.name}</h2>
              <button className="btn-edit" onClick={() => setIsEditing(true)}>
                ✏️ Edit
              </button>
            </div>
            <p className="lot-basket-weight">
              Default Basket Weight: {formatWeight(lot.defaultBasketWeight)}
            </p>

            <div className="lot-summary-stats">
              <div className="summary-stat">
                <span className="summary-label">Transports</span>
                <span className="summary-value">{stats.transportCount}</span>
              </div>
              <div className="summary-stat">
                <span className="summary-label">Total Baskets</span>
                <span className="summary-value">{stats.totalBaskets}</span>
              </div>
              <div className="summary-stat">
                <span className="summary-label">Total Weight</span>
                <span className="summary-value">{formatWeight(stats.totalWeight)}</span>
              </div>
              <div className="summary-stat">
                <span className="summary-label">Shrimp Weight</span>
                <span className="summary-value">{formatWeight(stats.totalShrimpWeight)}</span>
              </div>
              {stats.totalValue > 0 && (
                <div className="summary-stat highlight">
                  <span className="summary-label">Total Value</span>
                  <span className="summary-value">{formatCurrency(stats.totalValue)}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="transports-section">
        <div className="section-header">
          <h3>Transports</h3>
          <div className="section-actions">
            {lot.transports.length > 0 && (
              <button
                className={`btn-secondary ${selectionMode ? 'active' : ''}`}
                onClick={toggleSelectionMode}
              >
                {selectionMode ? '✕ Cancel Selection' : '☑ Select Multiple'}
              </button>
            )}
            <button className="btn-primary" onClick={() => onAddTransport(lot.id)}>
              + Add Transport
            </button>
          </div>
        </div>

        {selectionMode && lot.transports.length > 0 && (
          <div className="selection-toolbar">
            <button className="btn-small btn-secondary" onClick={handleSelectAll}>
              {selectedTransportIds.size === lot.transports.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="selection-count">
              {selectedTransportIds.size} of {lot.transports.length} selected
            </span>
          </div>
        )}

        {lot.transports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚚</div>
            <h3>No Transports Yet</h3>
            <p>Add a transport to start tracking baskets</p>
            <button className="btn-primary" onClick={() => onAddTransport(lot.id)}>
              Add First Transport
            </button>
          </div>
        ) : (
          <>
            <div className="transports-grid">
              {lot.transports.map(transport => (
                <TransportCard
                  key={transport.id}
                  transport={transport}
                  onClick={() => onSelectTransport(transport)}
                  selectionMode={selectionMode}
                  isSelected={selectedTransportIds.has(transport.id)}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </div>

            {selectionMode && selectedTransports.length > 0 && (
              <MultiTransportSummary
                transports={selectedTransports}
                onClose={handleCloseSummary}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LotDetail;
