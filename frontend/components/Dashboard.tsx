import React from 'react';
import { useStellar } from '../context/StellarContext';
import { useEscrow } from '../hooks/useEscrow';
import { useCreditScore } from '../hooks/useCreditScore';

export const Dashboard: React.FC = () => {
  const { publicKey, balance, disconnectWallet } = useStellar();
  const { escrows, loading: escrowLoading } = useEscrow(publicKey);
  const { creditData, loading: creditLoading } = useCreditScore(publicKey);

  const activeEscrows = escrows.filter(e => e.status === 'pending');
  const completedEscrows = escrows.filter(e => e.status === 'released');

  return (
    <div className="min-h-screen bg-stellar-purple">
      {/* Header */}
      <header className="bg-stellar-blue border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">AcreLedger</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-lg font-semibold text-accent-green">{balance} USDC</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Connected</p>
              <p className="text-sm font-mono text-white">
                {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
              </p>
            </div>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Credit Score Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">DeFi Credit Score</h2>
          {creditLoading ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
              Loading credit score...
            </div>
          ) : creditData ? (
            <div className="bg-gray-800 rounded-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Credit Score</p>
                <p className="text-4xl font-bold text-accent-green">{creditData.score}/100</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Total Trades</p>
                <p className="text-2xl font-semibold text-white">{creditData.totalTrades}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Total Volume</p>
                <p className="text-2xl font-semibold text-white">{creditData.totalVolume} USDC</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Avg Quality</p>
                <p className="text-2xl font-semibold text-white">
                  {creditData.tradeHistory.length > 0 
                    ? (creditData.tradeHistory.reduce((sum, t) => sum + t.qualityRating, 0) / creditData.tradeHistory.length).toFixed(1)
                    : 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
              No credit data available
            </div>
          )}
        </div>

        {/* Active Escrows */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">Active Escrows</h2>
          {activeEscrows.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
              No active escrows
            </div>
          ) : (
            <div className="grid gap-4">
              {activeEscrows.map((escrow) => (
                <div key={escrow.id} className="bg-gray-800 rounded-lg p-6 border-l-4 border-yellow-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{escrow.cropId}</h3>
                      <p className="text-gray-400 text-sm">
                        Farmer: {escrow.farmer.slice(0, 8)}...{escrow.farmer.slice(-8)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent-green">{escrow.amount} USDC</p>
                      <p className="text-sm text-yellow-500">Pending Release</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Escrows */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Completed Transactions</h2>
          {completedEscrows.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
              No completed transactions
            </div>
          ) : (
            <div className="grid gap-4">
              {completedEscrows.map((escrow) => (
                <div key={escrow.id} className="bg-gray-800 rounded-lg p-6 border-l-4 border-accent-green">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{escrow.cropId}</h3>
                      <p className="text-gray-400 text-sm">
                        Farmer: {escrow.farmer.slice(0, 8)}...{escrow.farmer.slice(-8)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent-green">{escrow.amount} USDC</p>
                      <p className="text-sm text-accent-green">Released</p>
                      {escrow.qualityRating && (
                        <p className="text-sm text-gray-400">Quality: {escrow.qualityRating}/5</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
