import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StellarContextType {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  publicKey: string | null;
}

const StellarContext = createContext<StellarContextType | undefined>(undefined);

export const StellarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const connect = () => {
    // In a real implementation, this would connect to a Stellar wallet
    setIsConnected(true);
    setPublicKey('GDEMOXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  };

  const disconnect = () => {
    setIsConnected(false);
    setPublicKey(null);
  };

  return (
    <StellarContext.Provider value={{ isConnected, connect, disconnect, publicKey }}>
      {children}
    </StellarContext.Provider>
  );
};

export const useStellar = () => {
  const context = useContext(StellarContext);
  if (context === undefined) {
    throw new Error('useStellar must be used within a StellarProvider');
  }
  return context;
};
