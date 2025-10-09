export interface CoinPackage {
    coins: number;
    price: number;
    popular?: boolean;
}

export interface PaymentOrder {
    orderId: string;
    amount: number;
    coins: number;
    key: string;
}

export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}
