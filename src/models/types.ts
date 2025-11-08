/**
 * Represents a single basket weight entry
 */
export interface Basket {
  id: string;
  weight: number;
  timestamp: Date;
}

/**
 * Represents a transport/shipment containing multiple baskets
 */
export interface Transport {
  id: string;
  name: string;
  basketWeight: number;
  quickAddWeight: number;
  autoDecimalMode: boolean;
  pricePerKg: number;
  deductionPercentage: number;
  baskets: Basket[];
}

/**
 * Represents a lot (collection of transports)
 */
export interface Lot {
  id: string;
  name: string;
  defaultBasketWeight: number;
  transports: Transport[];
  createdAt: Date;
}

/**
 * Application state
 */
export interface AppData {
  lots: Lot[];
  lotCounter: number;
}

/**
 * Statistics for a transport
 */
export interface TransportStats {
  totalWeight: number;
  shrimpWeight: number;
  basketCount: number;
  basePrice: number;
  deduction: number;
  finalPrice: number;
}

/**
 * Statistics for a lot
 */
export interface LotStats {
  transportCount: number;
  totalBaskets: number;
  totalWeight: number;
  totalShrimpWeight: number;
  totalValue: number;
}
