import httpClient from '../httpClient';

interface VapidPublicKeyResponse {
  data: {
    publicKey: string;
  };
}

interface SubscribeResponse {
  message: string;
  data?: any;
}

interface UnsubscribeResponse {
  message: string;
}

export const notificationsService = {
  async getVapidPublicKey(): Promise<string> {
    const response = await httpClient.get<VapidPublicKeyResponse>('/user/notifications/vapid-public-key');
    return response.data.data.publicKey;
  },

  async subscribe(subscriptionData: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
    userAgent: string;
  }): Promise<SubscribeResponse> {
    const response = await httpClient.post<SubscribeResponse>('/user/notifications/subscribe', subscriptionData);
    return response.data;
  },

  async unsubscribe(): Promise<UnsubscribeResponse> {
    const response = await httpClient.delete<UnsubscribeResponse>('/user/notifications/unsubscribe');
    return response.data;
  }
};

