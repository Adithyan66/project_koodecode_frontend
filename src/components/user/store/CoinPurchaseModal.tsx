



import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setPortalContainer(document.body);
        }
    }, []);

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

            // Create order on backend
            const order = await paymentService.createOrder(coinPackage.coins);

            // Razorpay options with all payment methods enabled
            const options = {
                key: order.key,
                amount: order.amount * 100, // Amount in paise
                currency: 'INR',
                name: 'KoodeCode',
                description: `Purchase ${coinPackage.coins} coins`,
                order_id: order.orderId,
                method: {
                    upi: true,
                    card: true,
                    netbanking: true,
                    wallet: true,
                    paylater: false
                },
                handler: async (response: RazorpayResponse) => {
                    try {
                        console.log('Payment successful:', response);

                        // Send verification to backend
                        const verification = await paymentService.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verification.success && verification.data) {
                            const { coins } = verification.data;

                            // Display success message with payment method
                            toast.success(
                                `Successfully added ${coins} coins to your account! `);

                            onSuccess(); // Refresh coin balance
                            onClose();
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error: any) {
                        console.error('Payment verification error:', error);
                        toast.error(
                            error.response?.data?.message ||
                            'Payment verification failed. Please contact support if coins are not added.'
                        );
                    } finally {
                        setLoading(false);
                        setSelectedPackage(null);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setSelectedPackage(null);
                    }
                },
                theme: {
                    color: '#10B981',
                    backdrop_color: '#000000cc'
                },
                notes: {
                    coins: coinPackage.coins.toString(),
                    package: JSON.stringify(coinPackage)
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error: any) {
            console.error('Payment initiation error:', error);
            toast.error(
                error.response?.data?.message ||
                'Failed to initiate payment. Please try again.'
            );
            setLoading(false);
            setSelectedPackage(null);
        }
    };

    if (!isOpen || !portalContainer) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Purchase Coins</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
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
                            className={`relative border rounded-lg p-4 cursor-pointer transition-all ${pkg.popular
                                    ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                                    : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                                } ${loading && selectedPackage?.coins === pkg.coins ? 'opacity-75' : ''}`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                                            <span className="text-black font-bold text-sm">¢</span>
                                        </div>
                                        <span className="text-white font-semibold text-lg">{pkg.coins} Coins</span>
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        <span className="text-green-400 font-semibold">₹{pkg.price}</span>
                                        <span> (₹{(pkg.price / pkg.coins).toFixed(2)} per coin)</span>
                                    </div>
                                    {pkg.coins === 500 && (
                                        <div className="text-xs text-green-400 mt-1">
                                            Best Value - 5x coins for 5x price
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handlePurchase(pkg)}
                                    disabled={loading}
                                    className={`px-6 py-2 rounded-lg font-semibold transition-all transform ${loading && selectedPackage?.coins === pkg.coins
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed scale-95'
                                            : pkg.popular
                                                ? 'bg-green-500 hover:bg-green-600 text-black hover:scale-105 active:scale-95 shadow-lg'
                                                : 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105 active:scale-95'
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

                {/* Payment Info & Security */}
                <div className="space-y-3">
                    {/* Security Features */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
                            <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Secure Payment Features
                        </h3>
                        <div className="space-y-1 text-sm text-gray-300">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                SSL encrypted via Razorpay
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Multiple payment methods (UPI, Card, Net Banking)
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Instant coin crediting after payment
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Server-side webhook verification
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <div className="text-xs text-gray-400 mb-2">Accepted Payment Methods</div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">UPI</span>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">Card</span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">Net Banking</span>
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">Wallet</span>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                        <div className="flex items-start">
                            <svg className="w-4 h-4 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="text-xs text-yellow-300">
                                <strong>Note:</strong> Coins will be added instantly after successful payment.
                                If you face any issues, contact support with your payment ID.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        portalContainer
    );
};

export default CoinPurchaseModal;

