
import  httpClient  from '../httpClient';
import type  { PaymentOrder } from '../../../types/payment';

export const paymentService = {
    createOrder: async (coins: number): Promise<PaymentOrder> => {
        const response = await httpClient.post('/user/payments/create-order', { coins });
        return response.data.data;
    },

    verifyPayment: async (paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<{ success: boolean; message: string }> => {
        const response = await httpClient.post('/user/payments/complete', paymentData);
        return response.data;
    }
};
