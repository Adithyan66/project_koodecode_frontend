

import httpClient from '../httpClient';
import type { StoreItem, UserInventory, CoinTransactionResponse, PurchaseRequest, MissedDaysResponse, UseTimeTravelTicketRequest, UseTimeTravelTicketResponse } from '../../../types/store';

export const storeService = {
    getStoreItems: async (): Promise<StoreItem[]> => {
        const response = await httpClient.get('/user/store/items');
        return response.data.data;
    },

    purchaseItem: async (purchaseData: PurchaseRequest): Promise<{ success: boolean; message: string }> => {
        const response = await httpClient.post('/user/store/purchase', purchaseData);
        return response.data;
    },

    getUserInventory: async (): Promise<UserInventory> => {
        const response = await httpClient.get('/user/store/inventory');
        return response.data.data;
    },

    checkItemOwnership: async (itemId: string, quantity: number = 1): Promise<boolean> => {
        const response = await httpClient.get(`/user/store/ownership/${itemId}?quantity=${quantity}`);
        return response.data.data.hasOwnership;
    },

    getCoinTransactions: async (page: number = 1, limit: number = 10): Promise<CoinTransactionResponse> => {
        const response = await httpClient.get(`/user/coins/transactions?page=${page}&limit=${limit}`);
        return response.data.data;
    },

    getCoinBalance : async ()=>{
        const response = await httpClient.get(`/user/coins/balance`)
        return response.data.data.balance
    },

    getMissedDays: async (): Promise<MissedDaysResponse> => {
        const response = await httpClient.get('/user/store/missed-days');
        return response.data.data;
    },

    useTimeTravelTicket: async (request: UseTimeTravelTicketRequest): Promise<UseTimeTravelTicketResponse> => {
        const response = await httpClient.post('/user/store/use-time-travel-ticket', request);
        return response.data;
    }
};
