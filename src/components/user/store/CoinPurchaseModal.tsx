
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { paymentService } from '../../../services/axios/user/payment';
import type { CoinPackage, RazorpayResponse } from '../../../types/payment';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface CoinPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CoinPurchaseModal: React.FC<CoinPurchaseModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);

    const coinPackages: CoinPackage[] = [
        { coins: 100, price: 100 },
        { coins: 500, price: 500, popular: true },
        { coins: 1000, price: 1000 }
    ];

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePurchase = async (coinPackage: CoinPackage) => {
        setLoading(true);
        setSelectedPackage(coinPackage);

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error('Failed to load payment gateway');
                return;
            }
            console.log("okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
            
            // Create order
            const order = await paymentService.createOrder(coinPackage.coins);

            // Razorpay options
            const options = {
                key: order.key,
                amount: order.amount * 100, 
                currency: 'INR',
                name: 'KoodeCode',
                description: `Purchase ${coinPackage.coins} coins`,
                order_id: order.orderId,
                method: {
                    upi: true,
                    card: true,
                    netbanking: true,
                    wallet: false,
                    paylater: false
                },
                handler: async (response: RazorpayResponse) => {
                    try {
                        const verification = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verification.success) {
                            toast.success(verification.message);
                            onSuccess(); // Refresh coin balance
                            onClose();
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error: any) {
                        toast.error(error.response?.data?.message || 'Payment verification failed');
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setSelectedPackage(null);
                    }
                },
                theme: {
                    color: '#10B981'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
        } finally {
            setLoading(false);
            setSelectedPackage(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Purchase Coins</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        disabled={loading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Coin Packages */}
                <div className="space-y-3 mb-6">
                    {coinPackages.map((pkg) => (
                        <div
                            key={pkg.coins}
                            className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                                pkg.popular 
                                    ? 'border-green-500 bg-green-500/10' 
                                    : 'border-gray-600 hover:border-gray-500'
                            }`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded">
                                        POPULAR
                                    </span>
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                                            <span className="text-black font-bold text-sm">¢</span>
                                        </div>
                                        <span className="text-white font-semibold">{pkg.coins} Coins</span>
                                    </div>
                                    <div className="text-gray-400 text-sm mt-1">
                                        ₹{pkg.price} (₹1 per coin)
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => handlePurchase(pkg)}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                        loading && selectedPackage?.coins === pkg.coins
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : pkg.popular
                                                ? 'bg-green-500 hover:bg-green-600 text-black'
                                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                                    }`}
                                >
                                    {loading && selectedPackage?.coins === pkg.coins ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        'Buy Now'
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Info */}
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Secure payment via UPI</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300 mt-1">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Coins added instantly after payment</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinPurchaseModal;
