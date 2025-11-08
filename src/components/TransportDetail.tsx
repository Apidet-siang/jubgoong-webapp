import { useState } from 'react';
import { Transport, Lot } from '../models/types';
import { calculateTransportStats, formatCurrency, formatWeight } from '../utils/calculations';
import BasketInput from './BasketInput';
import BasketList from './BasketList';
import PriceCalculator from './PriceCalculator';

interface TransportDetailProps {
  transport: Transport;
  lot: Lot;
  onBack: () => void;
  onUpdateLot: (lot: Lot) => void;
  onDelete: (transportId: string) => void;
}

function TransportDetail({ transport, lot, onBack, onUpdateLot, onDelete }: TransportDetailProps) {
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editName, setEditName] = useState(transport.name);
  const [editBasketWeight, setEditBasketWeight] = useState(transport.basketWeight.toString());
  const [editQuickAdd, setEditQuickAdd] = useState(transport.quickAddWeight.toString());

  // Always get fresh transport data from the lot
  const currentTransport = lot.transports.find(t => t.id === transport.id) || transport;
  const stats = calculateTransportStats(currentTransport);

  const updateTransport = (updatedTransport: Transport) => {
    onUpdateLot({
      ...lot,
      transports: lot.transports.map(t =>
        t.id === transport.id ? updatedTransport : t
      )
    });
  };

  const handleSaveSettings = () => {
    updateTransport({
      ...currentTransport,
      name: editName,
      basketWeight: parseFloat(editBasketWeight) || 5.0,
      quickAddWeight: parseFloat(editQuickAdd) || 50.0
    });
    setIsEditingSettings(false);
  };

  const handleCancelSettings = () => {
    setEditName(currentTransport.name);
    setEditBasketWeight(currentTransport.basketWeight.toString());
    setEditQuickAdd(currentTransport.quickAddWeight.toString());
    setIsEditingSettings(false);
  };

  const toggleAutoDecimal = () => {
    updateTransport({
      ...currentTransport,
      autoDecimalMode: !currentTransport.autoDecimalMode
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this transport?')) {
      onDelete(transport.id);
      onBack();
    }
  };

  const hasPrice = currentTransport.pricePerKg > 0;

  return (
    <div className="transport-detail-container">
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>
          ← กลับไปยัง{lot.name}
        </button>

        <button className="btn-danger" onClick={handleDelete}>
          🗑️ Delete Transport
        </button>
      </div>

      <div className="transport-detail-header">
        <div className="transport-title-section">
          <h2>{currentTransport.name}</h2>
          {!hasPrice && <span className="warning-badge">⚠️ No Price Set</span>}
        </div>

        {/* Stats Summary */}
        <div className="transport-stats-summary">
          <div className="stat-card">
            <span className="stat-label">Total Weight</span>
            <span className="stat-value">{formatWeight(stats.totalWeight)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Shrimp Weight</span>
            <span className="stat-value">{formatWeight(stats.shrimpWeight)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Baskets</span>
            <span className="stat-value">{stats.basketCount}</span>
          </div>
          {hasPrice && (
            <div className="stat-card highlight">
              <span className="stat-label">Final Price</span>
              <span className="stat-value">{formatCurrency(stats.finalPrice)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Settings Section */}
      <div className="detail-section">
        <h3>Transport Settings</h3>
        <div className="section-content">
          {isEditingSettings ? (
            <div className="settings-edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Transport Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Basket Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editBasketWeight}
                    onChange={(e) => setEditBasketWeight(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Quick Add Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editQuickAdd}
                    onChange={(e) => setEditQuickAdd(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={handleSaveSettings}>
                  Save Settings
                </button>
                <button className="btn-secondary" onClick={handleCancelSettings}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="settings-display-grid">
              <div className="setting-item">
                <span className="setting-label">Basket Weight</span>
                <span className="setting-value">{formatWeight(currentTransport.basketWeight)}</span>
              </div>
              <div className="setting-item">
                <span className="setting-label">Quick Add Weight</span>
                <span className="setting-value">{formatWeight(currentTransport.quickAddWeight)}</span>
              </div>
              <div className="setting-item">
                <span className="setting-label">Auto-Decimal Mode</span>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={currentTransport.autoDecimalMode}
                    onChange={toggleAutoDecimal}
                  />
                  {currentTransport.autoDecimalMode ? 'Enabled (567 → 5.67)' : 'Disabled'}
                </label>
              </div>
              <div className="setting-item">
                <button className="btn-secondary" onClick={() => setIsEditingSettings(true)}>
                  ⚙️ Edit Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price Calculator Section */}
      <div className="detail-section">
        <h3>Price Calculator</h3>
        <div className="section-content">
          <PriceCalculator
            transport={currentTransport}
            stats={stats}
            onUpdateTransport={updateTransport}
          />
        </div>
      </div>

      {/* Basket Input Section */}
      <div className="detail-section">
        <h3>Add Basket</h3>
        <div className="section-content">
          <BasketInput
            transport={currentTransport}
            onUpdateTransport={updateTransport}
          />
        </div>
      </div>

      {/* Basket List Section */}
      <div className="detail-section">
        <h3>Baskets ({currentTransport.baskets.length})</h3>
        <div className="section-content">
          <BasketList
            transport={currentTransport}
            onUpdateTransport={updateTransport}
          />
        </div>
      </div>
    </div>
  );
}

export default TransportDetail;
