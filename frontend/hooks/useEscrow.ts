import { useState, useEffect } from 'react';

export interface EscrowData {
  id: string;
  buyer: string;
  farmer: string;
  amount: number;
  cropId: string;
  status: 'pending' | 'released' | 'rejected';
  createdAt: string;
  qualityRating?: number;
}

export const useEscrow = (publicKey: string | null) => {
  const [escrows, setEscrows] = useState<EscrowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      fetchEscrows();
    }
  }, [publicKey]);

  const fetchEscrows = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/escrow?address=${publicKey}`);
      if (!response.ok) throw new Error('Failed to fetch escrows');
      
      const data = await response.json();
      setEscrows(data.escrows || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch escrows');
      console.error('Escrow fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEscrow = async (escrowData: {
    farmer: string;
    amount: number;
    cropId: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v1/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...escrowData,
          buyer: publicKey,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create escrow');
      
      const data = await response.json();
      setEscrows([...escrows, data.escrow]);
      return data.escrow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create escrow');
      console.error('Escrow creation failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    escrows,
    loading,
    error,
    createEscrow,
    refetch: fetchEscrows,
  };
};
