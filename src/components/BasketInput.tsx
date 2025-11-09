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
      <div className="input-row-compact">
        <button
          className={`btn-mode-toggle ${isRemainMode ? 'active' : ''}`}
          onClick={() => setIsRemainMode(!isRemainMode)}
          title="Toggle ชั่งเศษ Mode"
        >
          {isRemainMode ? '🔶 ชั่งเศษ' : '⬜ ปกติ'}
        </button>

        <input
          type={transport.autoDecimalMode ? 'text' : 'number'}
          step="0.01"
          value={manualWeight}
          onChange={(e) => setManualWeight(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={transport.autoDecimalMode ? "567" : "Weight"}
          className="form-input-compact"
        />

        <button
          className={isRemainMode ? "btn-add-remain" : "btn-add"}
          onClick={handleManualAdd}
        >
          Add
        </button>

        <button className="btn-quick" onClick={handleQuickAdd} title={`Quick add ${transport.quickAddWeight} kg`}>
          ⚡ {transport.quickAddWeight}
        </button>
      </div>

      {transport.autoDecimalMode && manualWeight && (
        <div className="preview-text">
          → {convertAutoDecimal(manualWeight).toFixed(2)} kg
        </div>
      )}
    </div>
  );
}

export default BasketInput;
