

import httpClient from '../httpClient';
import type { StoreItem, UserInventory, CoinTransactionResponse, PurchaseRequest } from '../../../types/store';

export const storeService = {
    // Get all store items with user ownership info
    getStoreItems: async (): Promise<StoreItem[]> => {
        const response = await httpClient.get('/user/store/items');
        return response.data.data;
    },

    // Purchase a store item
    purchaseItem: async (purchaseData: PurchaseRequest): Promise<{ success: boolean; message: string }> => {
        const response = await httpClient.post('/user/store/purchase', purchaseData);
        return response.data;
    },

    // Get user inventory
    getUserInventory: async (): Promise<UserInventory> => {
        const response = await httpClient.get('/user/store/inventory');
        return response.data.data;
    },

    // Check item ownership
    checkItemOwnership: async (itemId: string, quantity: number = 1): Promise<boolean> => {
        const response = await httpClient.get(`/user/store/ownership/${itemId}?quantity=${quantity}`);
        return response.data.data.hasOwnership;
    },

    // Get coin transactions
    getCoinTransactions: async (page: number = 1, limit: number = 10): Promise<CoinTransactionResponse> => {
        const response = await httpClient.get(`/user/coins/transactions?page=${page}&limit=${limit}`);
        return response.data.data;
    },

    getCoinBalance : async ()=>{
        const response = await httpClient.get(`/user/coins/balance`)
        return response.data.balance
    }
};
