import React from 'react';
import { useStellar } from '../context/StellarContext';

export const LandingPage: React.FC = () => {
  const { connectWallet, loading, error } = useStellar();

  return (
    <div className="min-h-screen bg-stellar-purple flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-white mb-6">AcreLedger</h1>
        <p className="text-xl text-gray-300 mb-8">
          Decentralized Agricultural Supply Chain Finance on Stellar
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-accent-green mb-3">Instant Escrow Payouts</h3>
            <p className="text-gray-400">
              Lock stablecoins in smart contracts that instantly release funds to farmers 
              upon quality-verified delivery at warehouses.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-accent-orange mb-3">DeFi Credit Scoring</h3>
            <p className="text-gray-400">
              Build on-chain trade history to generate decentralized credit scores, 
              unlocking micro-loans for agricultural inputs.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={connectWallet}
            disabled={loading}
            className="px-8 py-4 bg-accent-green hover:bg-green-400 text-stellar-blue font-bold rounded-lg text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Connect with Freighter Wallet'}
          </button>
          
          {error && (
            <p className="text-red-400 mt-4">{error}</p>
          )}
          
          <p className="text-gray-500 text-sm mt-4">
            Don't have Freighter?{' '}
            <a 
              href="https://www.freighter.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent-green hover:underline"
            >
              Install the Freighter Wallet extension
            </a>
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-green rounded-full flex items-center justify-center text-stellar-blue font-bold text-xl mb-3 mx-auto">
                1
              </div>
              <h4 className="font-semibold text-white mb-2">Lock Funds</h4>
              <p className="text-gray-400 text-sm">
                Buyers lock USDC in smart contracts for crop purchases
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-green rounded-full flex items-center justify-center text-stellar-blue font-bold text-xl mb-3 mx-auto">
                2
              </div>
              <h4 className="font-semibold text-white mb-2">Verify Quality</h4>
              <p className="text-gray-400 text-sm">
                Warehouse validators verify crop quality upon delivery
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-green rounded-full flex items-center justify-center text-stellar-blue font-bold text-xl mb-3 mx-auto">
                3
              </div>
              <h4 className="font-semibold text-white mb-2">Instant Payout</h4>
              <p className="text-gray-400 text-sm">
                Funds are instantly released (85% to farmer, 15% to cooperative)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
