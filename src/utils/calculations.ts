import { Transport, Lot, TransportStats, LotStats } from '../models/types';

/**
 * Calculate statistics for a transport
 */
export function calculateTransportStats(transport: Transport): TransportStats {
  const basketCount = transport.baskets.length;
  const totalWeight = transport.baskets.reduce((sum, basket) => sum + basket.weight, 0);

  // Calculate shrimp weight from regular baskets (subtract basket weight)
  const basketShrimpWeight = totalWeight - (basketCount * transport.basketWeight);

  // Calculate remain shrimp weight (already pure shrimp weight, no basket)
  const remainCount = transport.remainShrimp?.length || 0;
  const remainWeight = transport.remainShrimp?.reduce((sum, remain) => sum + remain.weight, 0) || 0;

  // Total shrimp weight = basket shrimp + remain shrimp
  const shrimpWeight = basketShrimpWeight + remainWeight;

  const basePrice = shrimpWeight * transport.pricePerKg;
  const deduction = basePrice * (transport.deductionPercentage / 100);
  const finalPrice = basePrice - deduction;

  return {
    totalWeight,
    shrimpWeight,
    basketCount,
    remainCount,
    remainWeight,
    basePrice,
    deduction,
    finalPrice
  };
}

/**
 * Calculate statistics for a lot
 */
export function calculateLotStats(lot: Lot): LotStats {
  const transportCount = lot.transports.length;

  let totalBaskets = 0;
  let totalWeight = 0;
  let totalShrimpWeight = 0;
  let totalValue = 0;

  lot.transports.forEach(transport => {
    const stats = calculateTransportStats(transport);
    totalBaskets += stats.basketCount;
    totalWeight += stats.totalWeight;
    totalShrimpWeight += stats.shrimpWeight;
    totalValue += stats.finalPrice;
  });

  return {
    transportCount,
    totalBaskets,
    totalWeight,
    totalShrimpWeight,
    totalValue
  };
}

/**
 * Format number as Thai Baht currency
 */
export function formatCurrency(amount: number): string {
  return `฿${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format weight with kg suffix
 */
export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} kg`;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Convert auto-decimal input (e.g., "567" -> 5.67)
 */
export function convertAutoDecimal(input: string): number {
  const num = parseInt(input, 10);
  if (isNaN(num)) return 0;
  return num / 100;
}
