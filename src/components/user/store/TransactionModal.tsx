import React, { useState, useEffect, useRef } from 'react';
import { storeService } from '../../../services/axios/user/store';
import type { CoinTransaction, CoinTransactionResponse } from '../../../types/store';
import LoadingSpinner from '../../common/LoadingSpinner';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, buttonRef }) => {
    const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, buttonRef]);

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

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className="absolute top-full right-0 z-50 mt-3 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 shadow-[0_40px_120px_-60px_rgba(17,24,39,0.7)]"
            style={{ minWidth: '500px' }}
        >
            <div className="flex items-center justify-between rounded-t-3xl border-b border-white/10 px-6 py-5">
                <h2 className="text-lg font-semibold text-white">Transaction History</h2>
                <button
                    onClick={onClose}
                    className="text-white/50 transition-colors hover:text-white"
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="px-6 py-5">
                <div className="max-h-96 overflow-y-auto pr-2">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center text-rose-300">{error}</div>
                    ) : transactions.length === 0 ? (
                        <div className="py-12 text-center text-white/60">No transactions found</div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="rounded-3xl border border-white/12 bg-gray-700 p-5 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.7)] transition hover:border-white/25"
                                >
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className={`font-semibold ${transaction.type === 'earn' ? 'text-emerald-300' : 'text-rose-300'}`}>
                                                    {transaction.type === 'earn' ? 'Earned' : 'Spent'}
                                                </span>
                                                <span className="text-white/50">·</span>
                                                <span className="capitalize text-white/60">
                                                    {transaction.source.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="mt-2 text-base font-semibold text-white">
                                                {transaction.description}
                                            </div>
                                            <div className="mt-1 text-xs uppercase tracking-[0.3em] text-white/40">
                                                {formatDate(transaction.createdAt)}
                                            </div>
                                        </div>
                                        <div className={`text-right text-lg font-semibold ${transaction.type === 'earn' ? 'text-emerald-300' : 'text-rose-300'}`}>
                                            {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-3 border-t border-white/10 pt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            Previous
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = Math.max(1, currentPage - 2) + i;
                                if (page > totalPages) return null;

                                const isActive = page === currentPage;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`rounded-full px-4 py-2 text-sm transition ${
                                            isActive
                                                ? 'bg-white text-black'
                                                : 'border border-white/15 text-white/80 hover:border-white/30 hover:text-white'
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
                            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
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

