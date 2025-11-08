import { useState, useEffect } from 'react';
import { AppData, Lot, Transport } from './models/types';
import { loadData, saveData } from './services/storage';
import { generateId } from './utils/calculations';
import LotList from './components/LotList';
import LotDetail from './components/LotDetail';
import TransportDetail from './components/TransportDetail';
import './styles/App.css';

function App() {
  const [appData, setAppData] = useState<AppData>(() => loadData());
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);

  // Auto-save whenever data changes
  useEffect(() => {
    saveData(appData);
  }, [appData]);

  // Create new lot
  const createLot = () => {
    const newLot: Lot = {
      id: generateId(),
      name: `การจับ ${appData.lotCounter}`,
      defaultBasketWeight: 5.0,
      transports: [],
      createdAt: new Date()
    };

    setAppData(prev => ({
      lots: [...prev.lots, newLot],
      lotCounter: prev.lotCounter + 1
    }));

    setSelectedLot(newLot);
  };

  // Update lot
  const updateLot = (updatedLot: Lot) => {
    setAppData(prev => ({
      ...prev,
      lots: prev.lots.map(lot => lot.id === updatedLot.id ? updatedLot : lot)
    }));

    if (selectedLot?.id === updatedLot.id) {
      setSelectedLot(updatedLot);
    }
  };

  // Delete lot
  const deleteLot = (lotId: string) => {
    setAppData(prev => ({
      ...prev,
      lots: prev.lots.filter(lot => lot.id !== lotId)
    }));

    if (selectedLot?.id === lotId) {
      setSelectedLot(null);
    }
  };

  // Add transport to lot
  const addTransport = (lotId: string) => {
    const lot = appData.lots.find(l => l.id === lotId);
    if (!lot) return;

    const transportNumber = lot.transports.length + 1;
    const newTransport: Transport = {
      id: generateId(),
      name: `Transport ${transportNumber}`,
      basketWeight: lot.defaultBasketWeight,
      quickAddWeight: 50.0,
      autoDecimalMode: false,
      pricePerKg: 0,
      deductionPercentage: 0,
      baskets: []
    };

    const updatedLot = {
      ...lot,
      transports: [...lot.transports, newTransport]
    };

    updateLot(updatedLot);
  };

  // Get fresh lot data
  const getLot = (lotId: string): Lot | undefined => {
    return appData.lots.find(l => l.id === lotId);
  };

  // Handle transport selection
  const handleSelectTransport = (transport: Transport) => {
    setSelectedTransport(transport);
  };

  // Handle transport detail back
  const handleBackFromTransport = () => {
    setSelectedTransport(null);
  };

  // Delete transport
  const deleteTransport = (transportId: string) => {
    if (!selectedLot) return;

    const updatedLot = {
      ...selectedLot,
      transports: selectedLot.transports.filter(t => t.id !== transportId)
    };

    updateLot(updatedLot);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🦐 JubGoong</h1>
      </header>

      <main className="app-main">
        {!selectedLot ? (
          <LotList
            lots={appData.lots}
            onSelectLot={setSelectedLot}
            onCreateLot={createLot}
            onDeleteLot={deleteLot}
          />
        ) : selectedTransport ? (
          <TransportDetail
            transport={selectedTransport}
            lot={selectedLot}
            onBack={handleBackFromTransport}
            onUpdateLot={updateLot}
            onDelete={deleteTransport}
          />
        ) : (
          <LotDetail
            lot={selectedLot}
            onBack={() => setSelectedLot(null)}
            onUpdateLot={updateLot}
            onAddTransport={addTransport}
            onSelectTransport={handleSelectTransport}
            getLot={getLot}
          />
        )}
      </main>
    </div>
  );
}

export default App;
