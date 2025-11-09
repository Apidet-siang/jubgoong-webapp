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

  const handleDeleteRemain = (remainId: string) => {
    if (confirm('Delete this ชั่งเศษ entry?')) {
      onUpdateTransport({
        ...transport,
        remainShrimp: transport.remainShrimp.filter(r => r.id !== remainId)
      });
    }
  };

  const handleStartEdit = (basket: Basket) => {
    setEditingBasketId(basket.id);
    setEditWeight(basket.weight.toString());
  };

  const handleSaveEdit = (basketId: string, isRemain: boolean = false) => {
    const weight = parseFloat(editWeight);
    if (!isNaN(weight) && weight > 0) {
      if (isRemain) {
        onUpdateTransport({
          ...transport,
          remainShrimp: transport.remainShrimp.map(r =>
            r.id === basketId ? { ...r, weight } : r
          )
        });
      } else {
        onUpdateTransport({
          ...transport,
          baskets: transport.baskets.map(b =>
            b.id === basketId ? { ...b, weight } : b
          )
        });
      }
    }
    setEditingBasketId(null);
  };

  const handleCancelEdit = () => {
    setEditingBasketId(null);
    setEditWeight('');
  };

  const hasBaskets = transport.baskets.length > 0;
  const hasRemainShrimp = transport.remainShrimp && transport.remainShrimp.length > 0;

  if (!hasBaskets && !hasRemainShrimp) {
    return (
      <div className="baskets-section">
        <h5>Baskets & ชั่งเศษ</h5>
        <div className="empty-baskets">
          <p>No entries added yet</p>
        </div>
      </div>
    );
  }

  // Show last 5 baskets by default
  const recentBaskets = hasBaskets ? [...transport.baskets].reverse().slice(0, 5) : [];
  const recentRemainShrimp = hasRemainShrimp ? [...transport.remainShrimp].reverse().slice(0, 3) : [];

  return (
    <div className="baskets-section">
      {/* Regular Baskets */}
      {hasBaskets && (
        <>
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
                        onClick={() => handleSaveEdit(basket.id, false)}
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
        </>
      )}

      {/* ชั่งเศษ */}
      {hasRemainShrimp && (
        <>
          <h5 className="remain-section-title">
            🔶 ชั่งเศษ ({transport.remainShrimp.length} entries)
          </h5>
          <div className="basket-list remain-list">
            {recentRemainShrimp.map((remain, index) => {
              const actualIndex = transport.remainShrimp.length - index;
              const isEditing = editingBasketId === remain.id;

              return (
                <div key={remain.id} className="basket-item remain-item">
                  <span className="basket-number remain-number">ช{actualIndex}</span>

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
                        onClick={() => handleSaveEdit(remain.id, true)}
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
                      <span className="basket-weight remain-weight">
                        {formatWeight(remain.weight)}
                      </span>
                      <span className="basket-time">{formatDate(remain.timestamp)}</span>
                      <div className="basket-actions">
                        <button
                          className="btn-icon"
                          onClick={() => handleStartEdit(remain)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteRemain(remain.id)}
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

          {transport.remainShrimp.length > 3 && (
            <p className="basket-list-note remain-note">
              Showing last 3 of {transport.remainShrimp.length} ชั่งเศษ entries
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default BasketList;
