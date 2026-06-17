import { useState, useEffect } from 'react';

export interface CreditScoreData {
  farmer: string;
  score: number;
  totalTrades: number;
  totalVolume: number;
  tradeHistory: Array<{
    buyer: string;
    amount: number;
    timestamp: string;
    qualityRating: number;
  }>;
}

export const useCreditScore = (publicKey: string | null) => {
  const [creditData, setCreditData] = useState<CreditScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) {
      fetchCreditScore();
    }
  }, [publicKey]);

  const fetchCreditScore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/farmer/credit-score?address=${publicKey}`);
      if (!response.ok) throw new Error('Failed to fetch credit score');
      
      const data = await response.json();
      setCreditData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credit score');
      console.error('Credit score fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    creditData,
    loading,
    error,
    refetch: fetchCreditScore,
  };
};
