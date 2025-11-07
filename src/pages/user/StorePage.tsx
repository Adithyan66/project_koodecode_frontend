import React from 'react';
import Navbar from '../../components/user/Navbar';
import CoinBalance from '../../components/user/store/CoinBalance';
import StoreItemCard from '../../components/user/store/StoreItemCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TimeTravelTicketModal from '../../components/user/store/TimeTravelTicketModal';
import useStore from '../../app/hooks/store/useStore';
import Footer from '../../components/landing/LandingFooter';

const StorePage: React.FC = () => {
    const {
        storeItems,
        loading,
        error,
        showTimeTravelModal,
        handlePurchase,
        handleUse,
        handleTimeTravelConfirm,
        closeTimeTravelModal,
        fetchStoreItems,
    } = useStore();

    return (
        <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
            <Navbar />
            <main className="relative flex-1 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.12),_transparent_55%)]"></div>
                <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col gap-16 px-6 py-16">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl space-y-4">
                            <h1 className="text-4xl font-semibold text-white md:text-5xl">KodeCode Store</h1>
                            <p className="text-base text-gray-300 md:text-lg">
                                Personalize your presence and unlock time-saving utilities crafted for consistent creators.
                            </p>
                        </div>
                        <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur lg:text-right">
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Coin Balance</p>
                            <div className="mt-3">
                                <CoinBalance />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        {loading ? (
                                <LoadingSpinner />
                        ) : error ? (
                            <div className="flex min-h-[320px] flex-col items-center justify-center gap-6 text-center">
                                <div className="text-lg font-semibold text-rose-300">{error}</div>
                                <button
                                    onClick={fetchStoreItems}
                                    className="rounded-full bg-emerald-500 px-7 py-2.5 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 hover:bg-emerald-400"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : storeItems.length === 0 ? (
                            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center">
                                <div className="text-lg font-semibold text-gray-200">No items available right now</div>
                                <p className="max-w-md text-sm text-gray-400">We update drops regularly. Keep an eye on this space for the next collection.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {storeItems.map(item => (
                                    <StoreItemCard
                                        key={item.id}
                                        item={item}
                                        onPurchase={handlePurchase}
                                        onUse={handleUse}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
            <TimeTravelTicketModal
                isOpen={showTimeTravelModal}
                onConfirm={handleTimeTravelConfirm}
                onCancel={closeTimeTravelModal}
            />
        </div>
    );
};

export default StorePage;
