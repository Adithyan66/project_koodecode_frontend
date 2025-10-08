
import React, { useState, useEffect } from 'react';
import { storeService } from '../../../services/axios/user/store';
import type { CoinTransaction, CoinTransactionResponse } from '../../../types/store';
import LoadingSpinner from '../../common/LoadingSpinner';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose }) => {
    const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response: CoinTransactionResponse = await storeService.getCoinTransactions(page, 10);
            setTransactions(response.transactions);
            setTotalPages(response.totalPages);
            setCurrentPage(response.currentPage);
        } catch (err) {
            setError('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchTransactions(1);
        }
    }, [isOpen]);

    const handlePageChange = (page: number) => {
        fetchTransactions(page);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTransactionIcon = (type: string, source: string) => {
        if (type === 'earn') {
            return <span className="text-green-400">+</span>;
        }
        return <span className="text-red-400">-</span>;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden border border-gray-700">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-96">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="text-red-400 text-center py-8">{error}</div>
                    ) : transactions.length === 0 ? (
                        <div className="text-gray-400 text-center py-8">No transactions found</div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                {getTransactionIcon(transaction.type, transaction.source)}
                                                <span className="text-white font-medium">
                                                    {transaction.description}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {formatDate(transaction.createdAt)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`font-bold ${transaction.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                                                {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                                            </div>
                                            <div className="text-xs text-gray-500 capitalize">
                                                {transaction.source.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-6 pt-4 border-t border-gray-700">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        
                        <div className="flex space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = Math.max(1, currentPage - 2) + i;
                                if (page > totalPages) return null;
                                
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-3 py-1 rounded ${
                                            page === currentPage
                                                ? 'bg-green-500 text-black'
                                                : 'bg-gray-800 text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionModal;
