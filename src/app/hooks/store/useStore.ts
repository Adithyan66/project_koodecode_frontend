import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { storeService } from '../../../services/axios/user/store';
import { StoreItemType } from '../../../types/store';
import type { StoreItem, UserInventory } from '../../../types/store';

interface UseStoreResult {
    storeItems: StoreItem[];
    userInventory: UserInventory | null;
    loading: boolean;
    error: string | null;
    showTimeTravelModal: boolean;
    handlePurchase: (itemId: string, quantity?: number) => Promise<void>;
    handleUse: (itemId: string) => Promise<void>;
    handleTimeTravelConfirm: (selectedDate: Date) => Promise<void>;
    closeTimeTravelModal: () => void;
    fetchStoreItems: () => Promise<void>;
}

const useStore = (): UseStoreResult => {
    const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
    const [userInventory, setUserInventory] = useState<UserInventory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTimeTravelModal, setShowTimeTravelModal] = useState(false);

    const fetchUserInventory = useCallback(async () => {
        try {
            const inventory = await storeService.getUserInventory();
            setUserInventory(inventory);
        } catch (err) {
            console.error('Failed to load user inventory:', err);
        }
    }, []);

    const fetchStoreItems = useCallback(async () => {
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
    }, []);

    const handlePurchase = useCallback(
        async (itemId: string, quantity: number = 1) => {
            try {
                const response = await storeService.purchaseItem({ itemId, quantity });
                toast.success(response.message);
                await fetchStoreItems();
                await fetchUserInventory();
            } catch (err: any) {
                const errorMessage = err?.response?.data?.message || 'Purchase failed';
                toast.error(errorMessage);
            }
        },
        [fetchStoreItems, fetchUserInventory]
    );

    const handleUse = useCallback(
        async (itemId: string) => {
            const item = storeItems.find(i => i.id === itemId);
            if (item?.type === StoreItemType.TIME_TRAVEL_TICKET) {
                setShowTimeTravelModal(true);
            } else {
                toast.success(`Item activated successfully! (ID: ${itemId})`);
            }
        },
        [storeItems]
    );

    const handleTimeTravelConfirm = useCallback(
        async (selectedDate: Date) => {
            try {
                const dateToFill = format(selectedDate, 'yyyy-MM-dd');
                const response = await storeService.useTimeTravelTicket({ dateToFill });
                toast.success(response.message);
                setShowTimeTravelModal(false);
                await fetchUserInventory();
                await fetchStoreItems();
            } catch (err: any) {
                const errorMessage = err?.response?.data?.message || 'Failed to use time travel ticket';
                toast.error(errorMessage);
            }
        },
        [fetchUserInventory, fetchStoreItems]
    );

    const closeTimeTravelModal = useCallback(() => {
        setShowTimeTravelModal(false);
    }, []);

    useEffect(() => {
        fetchStoreItems();
        fetchUserInventory();
    }, [fetchStoreItems, fetchUserInventory]);

    const enrichedStoreItems = useMemo(() => {
        if (!userInventory) {
            return storeItems;
        }

        return storeItems.map(item => {
            const inventoryItem = userInventory.items.find(inv => inv.itemId === item.id);
            if (inventoryItem) {
                return {
                    ...item,
                    isOwned: true,
                    quantity: inventoryItem.quantity,
                };
            }
            return item;
        });
    }, [storeItems, userInventory]);

    return {
        storeItems: enrichedStoreItems,
        userInventory,
        loading,
        error,
        showTimeTravelModal,
        handlePurchase,
        handleUse,
        handleTimeTravelConfirm,
        closeTimeTravelModal,
        fetchStoreItems,
    };
};

export default useStore;

