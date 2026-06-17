import React from 'react';
import { useStellar } from '../context/StellarContext';

export const Dashboard: React.FC = () => {
  const { disconnect, publicKey } = useStellar();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">AcreLedger</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {publicKey?.slice(0, 8)}...{publicKey?.slice(-4)}
              </span>
              <button
                onClick={disconnect}
                className="text-gray-600 hover:text-gray-900"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-2">Manage your agricultural supply chain transactions</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Credit Score</h3>
            <p className="text-4xl font-bold text-green-600">75</p>
            <p className="text-sm text-gray-500 mt-1">Based on 12 trades</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Volume</h3>
            <p className="text-4xl font-bold text-blue-600">$45,000</p>
            <p className="text-sm text-gray-500 mt-1">All time trades</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Escrows</h3>
            <p className="text-4xl font-bold text-purple-600">3</p>
            <p className="text-sm text-gray-500 mt-1">Pending release</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <p>No transactions yet</p>
              <p className="text-sm mt-2">Your transaction history will appear here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
