
import React, { useState } from 'react';
import { StoreItemType, type StoreItem } from '../../../types/store';

interface PurchaseModalProps {
    isOpen: boolean;
    item: StoreItem;
    onConfirm: (quantity: number) => void;
    onCancel: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, item, onConfirm, onCancel }) => {
    const [quantity, setQuantity] = useState(1);

    const handleConfirm = () => {
        onConfirm(quantity);
        setQuantity(1);
    };

    const totalPrice = item.price * quantity;
    const isConsumable = item.type !== StoreItemType.PROFILE_FRAME;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Confirm Purchase</h2>
                
                <div className="mb-6">
                    <h3 className="text-lg text-white mb-2">{item.name}</h3>
                    <p className="text-gray-400 mb-4">{item.description}</p>
                    
                    {isConsumable && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white"
                                >
                                    -
                                </button>
                                <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Cost:</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                                    <span className="text-black font-bold text-xs">¢</span>
                                </div>
                                <span className="text-yellow-400 font-bold text-lg">{totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex space-x-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-black rounded-lg font-semibold transition-colors"
                    >
                        Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseModal;
