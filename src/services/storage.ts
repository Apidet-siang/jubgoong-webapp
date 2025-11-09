import { AppData, Lot, Transport, Basket } from '../models/types';

const STORAGE_KEY = 'jubgoong-data';

/**
 * Serialize dates when saving to localStorage
 */
function serialize(data: AppData): string {
  return JSON.stringify(data);
}

/**
 * Deserialize and restore dates when loading from localStorage
 */
function deserialize(json: string): AppData {
  const data = JSON.parse(json);

  // Restore Date objects
  data.lots = data.lots.map((lot: Lot) => ({
    ...lot,
    createdAt: new Date(lot.createdAt),
    transports: lot.transports.map((transport: Transport) => ({
      ...transport,
      baskets: transport.baskets.map((basket: Basket) => ({
        ...basket,
        timestamp: new Date(basket.timestamp)
      })),
      remainShrimp: (transport.remainShrimp || []).map((remain: Basket) => ({
        ...remain,
        timestamp: new Date(remain.timestamp)
      }))
    }))
  }));

  return data;
}

/**
 * Save data to localStorage
 */
export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, serialize(data));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
}

/**
 * Load data from localStorage
 */
export function loadData(): AppData {
  try {
    const json = localStorage.getItem(STORAGE_KEY);

    if (!json) {
      return getDefaultData();
    }

    return deserialize(json);
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return getDefaultData();
  }
}

/**
 * Get default app data
 */
export function getDefaultData(): AppData {
  return {
    lots: [],
    lotCounter: 1
  };
}

/**
 * Clear all data from localStorage
 */
export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export data as JSON file
 */
export function exportDataAsJson(data: AppData): void {
  const json = serialize(data);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jubgoong-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 */
export function importDataFromJson(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = deserialize(json);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
