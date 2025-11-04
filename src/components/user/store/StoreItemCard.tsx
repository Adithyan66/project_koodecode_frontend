

import React, { useState } from 'react';
import { StoreItemType, type StoreItem } from '../../../types/store';
import { getFrameComponent } from './frames/FrameComponents';
import PurchaseModal from './PurchaseModal';

interface StoreItemCardProps {
    item: StoreItem;
    onPurchase: (itemId: string, quantity?: number) => Promise<void>;
    onUse?: (itemId: string) => Promise<void>;
}

const StoreItemCard: React.FC<StoreItemCardProps> = ({ item, onPurchase, onUse }) => {
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    const handlePurchaseClick = () => {
        setShowPurchaseModal(true);
    };

    const handlePurchaseConfirm = async (quantity: number = 1) => {
        await onPurchase(item.id, quantity);
        setShowPurchaseModal(false);
    };

    const handlePurchaseCancel = () => {
        setShowPurchaseModal(false);
    };

    const handleUseClick = async () => {
        if (onUse) {
            await onUse(item.id);
        }
    };

    const renderPreview = () => {
        if (item.type === StoreItemType.PROFILE_FRAME) {
            const FrameComponent = getFrameComponent(item.componentId);
            return (
                <div className="flex justify-center mb-4">
                    <FrameComponent size="large">
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-gray-400">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </FrameComponent>
                </div>
            );
        } else {
            // For tickets, show icon based on type
            const iconColor = item.type === StoreItemType.TIME_TRAVEL_TICKET ? 'text-blue-400' : 'text-purple-400';
            const iconPath = item.type === StoreItemType.TIME_TRAVEL_TICKET 
                ? "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                : "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z";
            
            return (
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
                        <svg className={`w-10 h-10 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                        </svg>
                    </div>
                </div>
            );
        }
    };

    const getItemTypeLabel = () => {
        switch (item.type) {
            case StoreItemType.PROFILE_FRAME:
                return 'Profile Frame';
            case StoreItemType.TIME_TRAVEL_TICKET:
                return 'Time Travel Ticket';
            case StoreItemType.PROBLEM_SUBMIT_TICKET:
                return 'Submit Ticket';
            default:
                return 'Unknown';
        }
    };

    return (
        <>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
                {/* Preview */}
                {renderPreview()}

                {/* Item Info */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">{getItemTypeLabel()}</p>
                    <p className="text-sm text-gray-300 mb-4">{item.description}</p>
                    
                    {/* Price */}
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                            <span className="text-black font-bold text-xs">¢</span>
                        </div>
                        <span className="text-yellow-400 font-bold text-lg">{item.price}</span>
                    </div>

                    {/* Ownership Status */}
                    {item.isOwned && (
                        <div className="mb-4">
                            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm inline-flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>
                                    Owned {item.quantity && item.quantity > 1 ? `(x${item.quantity})` : ''}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Purchase/Use Button */}
                    {item.isOwned && item.type !== StoreItemType.PROFILE_FRAME ? (
                        <button
                            onClick={handleUseClick}
                            className="w-full py-2 px-4 rounded-lg font-semibold transition-colors bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            Use
                        </button>
                    ) : (
                        <button
                            onClick={handlePurchaseClick}
                            disabled={item.isOwned && item.type === StoreItemType.PROFILE_FRAME}
                            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                                item.isOwned && item.type === StoreItemType.PROFILE_FRAME
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 text-black'
                            }`}
                        >
                            {item.isOwned && item.type === StoreItemType.PROFILE_FRAME ? 'Already Owned' : 'Purchase'}
                        </button>
                    )}
                </div>
            </div>

            {/* Purchase Modal */}
            <PurchaseModal
                isOpen={showPurchaseModal}
                item={item}
                onConfirm={handlePurchaseConfirm}
                onCancel={handlePurchaseCancel}
            />
        </>
    );
};

export default StoreItemCard;
