import { useState } from 'react';
import { Transport, Basket } from '../models/types';
import { generateId, convertAutoDecimal } from '../utils/calculations';

interface BasketInputProps {
  transport: Transport;
  onUpdateTransport: (transport: Transport) => void;
}

function BasketInput({ transport, onUpdateTransport }: BasketInputProps) {
  const [manualWeight, setManualWeight] = useState('');
  const [isRemainMode, setIsRemainMode] = useState(false);

  const addBasket = (weight: number) => {
    if (weight <= 0) return;

    const newBasket: Basket = {
      id: generateId(),
      weight,
      timestamp: new Date(),
      isRemainMode
    };

    if (isRemainMode) {
      // Add to remain shrimp array
      onUpdateTransport({
        ...transport,
        remainShrimp: [...transport.remainShrimp, newBasket]
      });
    } else {
      // Add to regular baskets array
      onUpdateTransport({
        ...transport,
        baskets: [...transport.baskets, newBasket]
      });
    }
  };

  const handleManualAdd = () => {
    let weight: number;

    if (transport.autoDecimalMode) {
      weight = convertAutoDecimal(manualWeight);
    } else {
      weight = parseFloat(manualWeight);
    }

    if (!isNaN(weight) && weight > 0) {
      addBasket(weight);
      setManualWeight('');
    }
  };

  const handleQuickAdd = () => {
    addBasket(transport.quickAddWeight);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualAdd();
    }
  };

  return (
    <div className={`basket-input-section ${isRemainMode ? 'remain-mode' : ''}`}>
      <div className="input-header">
        <h5>{isRemainMode ? 'Add Remain Shrimp' : 'Add Basket'}</h5>
        <button
          className={`btn-mode-toggle ${isRemainMode ? 'active' : ''}`}
          onClick={() => setIsRemainMode(!isRemainMode)}
          title="Toggle Remain Mode"
        >
          <span className="mode-icon">{isRemainMode ? '🔶' : '⬜'}</span>
          {isRemainMode ? 'Remain Mode' : 'Normal Mode'}
        </button>
      </div>

      {isRemainMode && (
        <div className="remain-mode-info">
          <small>💡 Remain mode: Enter pure shrimp weight (no basket weight)</small>
        </div>
      )}

      <div className="input-row">
        <div className="manual-input">
          <input
            type={transport.autoDecimalMode ? 'text' : 'number'}
            step="0.01"
            value={manualWeight}
            onChange={(e) => setManualWeight(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={transport.autoDecimalMode ? "Enter digits (e.g., 567)" : "Enter weight"}
            className="form-input"
          />
          <button
            className={isRemainMode ? "btn-remain" : "btn-primary"}
            onClick={handleManualAdd}
          >
            {isRemainMode ? 'Add Remain' : 'Add'}
          </button>
        </div>

        <button className="btn-quick-add" onClick={handleQuickAdd}>
          Quick Add {transport.quickAddWeight} kg
        </button>
      </div>

      {transport.autoDecimalMode && manualWeight && (
        <div className="auto-decimal-preview">
          Preview: {convertAutoDecimal(manualWeight).toFixed(2)} kg
          {isRemainMode && ' (pure shrimp)'}
        </div>
      )}
    </div>
  );
}

export default BasketInput;
