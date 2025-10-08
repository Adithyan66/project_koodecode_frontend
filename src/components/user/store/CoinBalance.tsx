import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import TransactionModal from './TransactionModal';

const CoinBalance: React.FC = () => {
    const [showTransactions, setShowTransactions] = useState(false);
    const user = useSelector((state: RootState) => state.user.user);

    const handleViewTransactions = () => {
        setShowTransactions(true);
    };

    const handleCloseTransactions = () => {
        setShowTransactions(false);
    };

    if (!user) return null;

    return (
        <>
            <div className="flex items-center space-x-4">
                {/* Coin Balance Display */}
                <div className="flex items-center space-x-2 bg-gray-900 rounded-lg px-4 py-2 border border-gray-700">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                        <span className="text-black font-bold text-sm">¢</span>
                    </div>
                    <span className="text-yellow-400 font-semibold">
                        {/* {user.coinBalance?.toLocaleString() || 0} */}
                        coin shoud fetch
                    </span>
                </div>

                {/* View Transactions Button */}
                <button
                    onClick={handleViewTransactions}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                    View Transactions
                </button>
            </div>

            {/* Transaction Modal */}
            <TransactionModal 
                isOpen={showTransactions}
                onClose={handleCloseTransactions}
            />
        </>
    );
};

export default CoinBalance;
