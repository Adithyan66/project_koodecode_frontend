



// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../../app/store';
// import TransactionModal from './TransactionModal';
// import { storeService } from '../../../services/axios/user/store';

// const CoinBalance: React.FC = () => {
//     const [showTransactions, setShowTransactions] = useState(false);
//     const user = useSelector((state: RootState) => state.user.user);
//     const [coinBalance, setCoinBalance] = useState(0);
//     const buttonRef = useRef<HTMLButtonElement>(null);

//     const handleViewTransactions = () => {
//         setShowTransactions(true);
//     };

//     const handleCloseTransactions = () => {
//         setShowTransactions(false);
//     };

//     async function fetchCoinBalance() {
//         const balance = await storeService.getCoinBalance();
//         setCoinBalance(balance);
//     }

//     useEffect(() => {
//         fetchCoinBalance();
//     }, [user]);

//     if (!user) return null;

//     return (
//         <div className="relative">
//             <div className="flex items-center space-x-4">
//                 {/* Coin Balance Display */}
//                 <div className="flex items-center space-x-2 bg-gray-900 rounded-lg px-4 py-2 border border-gray-700">
//                     <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
//                         <span className="text-black font-bold text-sm">¢</span>
//                     </div>
//                     <span className="text-yellow-400 font-semibold">
//                         {coinBalance}
//                     </span>
//                 </div>

//                 {/* View Transactions Button */}
//                 <button
//                     ref={buttonRef}
//                     onClick={handleViewTransactions}
//                     className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                     View Transactions
//                 </button>
//             </div>

//             {/* Transaction Modal */}
//             <TransactionModal
//                 isOpen={showTransactions}
//                 onClose={handleCloseTransactions}
//                 buttonRef={buttonRef}
//             />
//         </div>
//     );
// };

// export default CoinBalance;













import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import TransactionModal from './TransactionModal';
import CoinPurchaseModal from './CoinPurchaseModal'; // Add this import
import { storeService } from '../../../services/axios/user/store';

const CoinBalance: React.FC = () => {
    const [showTransactions, setShowTransactions] = useState(false);
    const [showPurchase, setShowPurchase] = useState(false); // Add this state
    const user = useSelector((state: RootState) => state.user.user);
    const [coinBalance, setCoinBalance] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleViewTransactions = () => {
        setShowTransactions(true);
    };

    const handleCloseTransactions = () => {
        setShowTransactions(false);
    };

    // Add these two functions
    const handlePurchaseCoins = () => {
        setShowPurchase(true);
    };

    const handleClosePurchase = () => {
        setShowPurchase(false);
    };

    const handlePurchaseSuccess = () => {
        fetchCoinBalance(); // Refresh balance after purchase
    };

    async function fetchCoinBalance() {
        const balance = await storeService.getCoinBalance();
        setCoinBalance(balance);
    }

    useEffect(() => {
        fetchCoinBalance();
    }, [user]);

    if (!user) return null;

    return (
        <div className="relative">
            <div className="flex items-center space-x-4">
                {/* Coin Balance Display */}
                <div className="flex items-center space-x-2 bg-gray-900 rounded-lg px-4 py-2 border border-gray-700">
                    <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                        <span className="text-black font-bold text-sm">¢</span>
                    </div>
                    <span className="text-yellow-400 font-semibold">
                        {coinBalance}
                    </span>
                </div>

                {/* Add Buy Coins Button */}
                <button
                    onClick={handlePurchaseCoins}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold text-black transition-colors text-sm"
                >
                    Buy Coins
                </button>

                {/* View Transactions Button */}
                <button
                    ref={buttonRef}
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
                buttonRef={buttonRef}
            />

            {/* Add Coin Purchase Modal */}
            <CoinPurchaseModal
                isOpen={showPurchase}
                onClose={handleClosePurchase}
                onSuccess={handlePurchaseSuccess}
            />
        </div>
    );
};

export default CoinBalance;
