import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast
import type { RootState } from '../../app/store';
import Navbar from '../../components/user/Navbar';
import CoinBalance from '../../components/user/store/CoinBalance';
import StoreItemCard from '../../components/user/store/StoreItemCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { storeService } from '../../services/axios/user/store';
import type { StoreItem } from '../../types/store';

const StorePage: React.FC = () => {
    const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useSelector((state: RootState) => state.user.user);

    const fetchStoreItems = async () => {
        try {
            setLoading(true);
            const items = await storeService.getStoreItems();
            setStoreItems(items);
            setError(null);
        } catch (err) {
            setError('Failed to load store items');
            toast.error('Failed to load store items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStoreItems();
    }, []);

    const handlePurchase = async (itemId: string, quantity: number = 1) => {
        try {
            const response = await storeService.purchaseItem({ itemId, quantity });
            toast.success(response.message);
            // Refetch store items to update ownership status
            await fetchStoreItems();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Purchase failed';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation */}
            <Navbar />

            {/* Store Header */}
            <section className="relative px-6 py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Balance */}
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-4">
                                Item <span className="text-green-400">Store</span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-lg">
                                Customize your profile and unlock special features with our store items.
                            </p>
                        </div>
                        
                        {/* Coin Balance - Top Right */}
                        <div className="flex-shrink-0">
                            <CoinBalance />
                        </div>
                    </div>

                    {/* Store Content */}
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <div className="text-red-400 text-xl mb-4">{error}</div>
                            <button
                                onClick={fetchStoreItems}
                                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold text-black transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : storeItems.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-gray-400 text-xl mb-4">No items available in the store</div>
                            <p className="text-gray-500">Check back later for new items!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {storeItems.map((item) => (
                                <StoreItemCard
                                    key={item.id}
                                    item={item}
                                    onPurchase={handlePurchase}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Background geometric pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 bg-black border-t border-gray-700">
                <div className="max-w-7xl mx-auto text-center text-gray-400">
                    <p>&copy; 2024 KodeCode. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default StorePage;
