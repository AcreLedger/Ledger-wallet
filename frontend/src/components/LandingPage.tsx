import React from 'react';
import { useStellar } from '../context/StellarContext';

export const LandingPage: React.FC = () => {
  const { connect } = useStellar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          AcreLedger
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Agricultural Supply Chain Finance on Stellar
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Instant Payouts for Farmers
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to access escrow services, track your credit score, 
            and receive instant payments for your agricultural products.
          </p>
          <button
            onClick={connect}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Connect Wallet
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-2">Escrow Services</h3>
            <p className="text-gray-600 text-sm">
              Secure instant payouts with warehouse validation
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-2">Credit Scoring</h3>
            <p className="text-gray-600 text-sm">
              Build your reputation through successful trades
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-2">Low Fees</h3>
            <p className="text-gray-600 text-sm">
              85% to farmers, 15% cooperative fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
