import { useState } from 'react';
import { Transport, Basket } from '../models/types';
import { formatWeight, formatDate } from '../utils/calculations';

interface BasketListProps {
  transport: Transport;
  onUpdateTransport: (transport: Transport) => void;
}

function BasketList({ transport, onUpdateTransport }: BasketListProps) {
  const [editingBasketId, setEditingBasketId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState('');

  const handleDelete = (basketId: string) => {
    if (confirm('Delete this basket?')) {
      onUpdateTransport({
        ...transport,
        baskets: transport.baskets.filter(b => b.id !== basketId)
      });
    }
  };

  const handleStartEdit = (basket: Basket) => {
    setEditingBasketId(basket.id);
    setEditWeight(basket.weight.toString());
  };

  const handleSaveEdit = (basketId: string) => {
    const weight = parseFloat(editWeight);
    if (!isNaN(weight) && weight > 0) {
      onUpdateTransport({
        ...transport,
        baskets: transport.baskets.map(b =>
          b.id === basketId ? { ...b, weight } : b
        )
      });
    }
    setEditingBasketId(null);
  };

  const handleCancelEdit = () => {
    setEditingBasketId(null);
    setEditWeight('');
  };

  if (transport.baskets.length === 0) {
    return (
      <div className="baskets-section">
        <h5>Baskets</h5>
        <div className="empty-baskets">
          <p>No baskets added yet</p>
        </div>
      </div>
    );
  }

  // Show last 5 baskets by default
  const recentBaskets = [...transport.baskets].reverse().slice(0, 5);

  return (
    <div className="baskets-section">
      <h5>Recent Baskets ({transport.baskets.length} total)</h5>

      <div className="basket-list">
        {recentBaskets.map((basket, index) => {
          const actualIndex = transport.baskets.length - index;
          const isEditing = editingBasketId === basket.id;

          return (
            <div key={basket.id} className="basket-item">
              <span className="basket-number">#{actualIndex}</span>

              {isEditing ? (
                <div className="basket-edit">
                  <input
                    type="number"
                    step="0.01"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="form-input-small"
                    autoFocus
                  />
                  <button
                    className="btn-icon btn-success"
                    onClick={() => handleSaveEdit(basket.id)}
                    title="Save"
                  >
                    ✓
                  </button>
                  <button
                    className="btn-icon btn-secondary"
                    onClick={handleCancelEdit}
                    title="Cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span className="basket-weight">{formatWeight(basket.weight)}</span>
                  <span className="basket-time">{formatDate(basket.timestamp)}</span>
                  <div className="basket-actions">
                    <button
                      className="btn-icon"
                      onClick={() => handleStartEdit(basket)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDelete(basket.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {transport.baskets.length > 5 && (
        <p className="basket-list-note">
          Showing last 5 of {transport.baskets.length} baskets
        </p>
      )}
    </div>
  );
}

export default BasketList;
