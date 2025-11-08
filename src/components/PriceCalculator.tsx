import { useState } from 'react';
import { Transport, TransportStats } from '../models/types';
import { formatCurrency } from '../utils/calculations';

interface PriceCalculatorProps {
  transport: Transport;
  stats: TransportStats;
  onUpdateTransport: (transport: Transport) => void;
}

function PriceCalculator({ transport, stats, onUpdateTransport }: PriceCalculatorProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editPricePerKg, setEditPricePerKg] = useState(transport.pricePerKg.toString());
  const [editDeduction, setEditDeduction] = useState(transport.deductionPercentage.toString());

  const handleSavePrice = () => {
    onUpdateTransport({
      ...transport,
      pricePerKg: parseFloat(editPricePerKg) || 0,
      deductionPercentage: parseFloat(editDeduction) || 0
    });
    setIsEditingPrice(false);
  };

  const handleCancelPrice = () => {
    setEditPricePerKg(transport.pricePerKg.toString());
    setEditDeduction(transport.deductionPercentage.toString());
    setIsEditingPrice(false);
  };

  const hasPrice = transport.pricePerKg > 0;

  return (
    <div className="price-calculator">
      <h5>Price Calculator</h5>

      {isEditingPrice ? (
        <div className="price-edit-form">
          <div className="form-row">
            <div className="form-group">
              <label>Price per kg (฿)</label>
              <input
                type="number"
                step="0.01"
                value={editPricePerKg}
                onChange={(e) => setEditPricePerKg(e.target.value)}
                className="form-input"
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Deduction (%)</label>
              <input
                type="number"
                step="0.1"
                value={editDeduction}
                onChange={(e) => setEditDeduction(e.target.value)}
                className="form-input"
                placeholder="0"
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn-small btn-primary" onClick={handleSavePrice}>
              Save
            </button>
            <button className="btn-small btn-secondary" onClick={handleCancelPrice}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {hasPrice ? (
            <div className="price-display">
              <div className="price-info">
                <div className="price-row">
                  <span>Price/kg:</span>
                  <span className="price-value">{formatCurrency(transport.pricePerKg)}</span>
                </div>
                <div className="price-row">
                  <span>Deduction:</span>
                  <span className="price-value">{transport.deductionPercentage}%</span>
                </div>
              </div>

              <div className="price-calculation">
                <div className="calc-row">
                  <span>Base Price:</span>
                  <span>{formatCurrency(stats.basePrice)}</span>
                </div>
                <div className="calc-row deduction">
                  <span>Deduction:</span>
                  <span>- {formatCurrency(stats.deduction)}</span>
                </div>
                <div className="calc-row final">
                  <span>Final Price:</span>
                  <span className="final-price">{formatCurrency(stats.finalPrice)}</span>
                </div>
              </div>

              <button className="btn-small btn-secondary" onClick={() => setIsEditingPrice(true)}>
                Edit Pricing
              </button>
            </div>
          ) : (
            <div className="price-empty">
              <p>No pricing set for this transport</p>
              <button className="btn-small btn-primary" onClick={() => setIsEditingPrice(true)}>
                Set Price
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PriceCalculator;
