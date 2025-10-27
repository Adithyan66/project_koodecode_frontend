
import  httpClient  from '../httpClient';
import type  { PaymentOrder } from '../../../types/payment';

export const paymentService = {
    createOrder: async (coins: number): Promise<PaymentOrder> => {
        const response = await httpClient.post('/user/coins/create-order', { coins });
        return response.data.data.order;
    },

    verifyPayment: async (paymentData: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }): Promise<{
        data: boolean; success: boolean; message: string 
}> => {
        const response = await httpClient.post('/user/coins/complete', paymentData);
        return response.data;
    }
};
