import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Server, { Transaction, Networks } from '@stellar/stellar-sdk';

interface StellarContextType {
  isConnected: boolean;
  publicKey: string | null;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  loading: boolean;
  error: string | null;
}

const StellarContext = createContext<StellarContextType | undefined>(undefined);

// Stellar testnet server
const server = new Server('https://horizon-testnet.stellar.org');

export const StellarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for Freighter wallet on mount
  useEffect(() => {
    const checkFreighterConnection = async () => {
      try {
        if (window.freightersetup) {
          const isConnected = await window.freightersetup.isConnected();
          setIsConnected(isConnected);
          if (isConnected) {
            const publicKey = await window.freightersetup.getPublicKey();
            setPublicKey(publicKey);
            await fetchBalance(publicKey);
          }
        }
      } catch (err) {
        console.error('Freighter connection check failed:', err);
      }
    };

    checkFreighterConnection();
  }, []);

  const fetchBalance = async (pubKey: string) => {
    try {
      interface StellarBalance {
        asset_type: string;
        asset_code?: string;
        balance: string;
      }

      const account = await server.loadAccount(pubKey);
      const balance = account.balances
        .find((b: StellarBalance) => b.asset_type === 'credit_alphanum4' && b.asset_code === 'USDC')
        || account.balances.find((b: StellarBalance) => b.asset_type === 'native');
      
      setBalance(balance ? balance.balance : '0');
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setBalance('0');
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!window.freightersetup) {
        throw new Error('Freighter wallet extension not found. Please install Freighter.');
      }

      const publicKey = await window.freightersetup.getPublicKey();
      setPublicKey(publicKey);
      setIsConnected(true);
      await fetchBalance(publicKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      console.error('Wallet connection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    setIsConnected(false);
    setBalance('0');
    setError(null);
  };

  const signTransaction = async (transaction: Transaction): Promise<Transaction> => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      const xdr = transaction.toXDR();
      const signedXdr = await window.freightersetup.signXDR(xdr, publicKey);
      const signedTx = new Transaction(signedXdr, Networks.TESTNET);
      return signedTx;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to sign transaction');
    }
  };

  return (
    <StellarContext.Provider
      value={{
        isConnected,
        publicKey,
        balance,
        connectWallet,
        disconnectWallet,
        signTransaction,
        loading,
        error,
      }}
    >
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

// Declare Freighter window interface
declare global {
  interface Window {
    freightersetup: {
      isConnected: () => Promise<boolean>;
      getPublicKey: () => Promise<string>;
      signXDR: (xdr: string, publicKey: string) => Promise<string>;
    };
  }
}
