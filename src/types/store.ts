

export const StoreItemType = {
    PROFILE_FRAME: "profile_frame",
    TIME_TRAVEL_TICKET: "time_travel_ticket",
    PROBLEM_SUBMIT_TICKET: "problem_submit_ticket",
} as const;

export type StoreItemType = (typeof StoreItemType)[keyof typeof StoreItemType];

export interface StoreItem {
    id: string;
    name: string;
    type: StoreItemType;
    price: number;
    description: string;
    componentId: string;
    metadata?: Record<string, any>;
    isOwned?: boolean;
    quantity?: number;
}

export interface UserInventoryItem {
    id: string;
    itemId: string;
    name: string;
    type: StoreItemType;
    componentId: string;
    quantity: number;
    purchasedAt: Date;
    lastUsedAt?: Date;
}

export interface UserInventory {
    items: UserInventoryItem[];
    totalItems: number;
}

export interface CoinTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'earn' | 'spend';
    source: string;
    description: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

export interface CoinTransactionResponse {
    transactions: CoinTransaction[];
    totalTransactions: number;
    totalPages: number;
    currentPage: number;
}

export interface PurchaseRequest {
    itemId: string;
    quantity?: number;
}
