import React from 'react';
import { StellarProvider, useStellar } from './context/StellarContext';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

const AppContent: React.FC = () => {
  const { isConnected } = useStellar();

  return (
    <>
      {!isConnected ? <LandingPage /> : <Dashboard />}
    </>
  );
};

function App() {
  return (
    <StellarProvider>
      <AppContent />
    </StellarProvider>
  );
}

export default App;
