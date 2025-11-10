import { useState, useEffect, useCallback } from 'react';
import { tokenManager } from '../../utils/tokenManager';
import { notificationsService } from '../../services/axios/user/notifications';
import {
  registerServiceWorker,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  checkSubscriptionStatus
} from '../../utils/pushNotifications';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);

  useEffect(() => {
    const supported = 
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;
    
    setIsSupported(supported);

    if (supported) {
      checkSubscriptionStatus()
        .then(setIsSubscribed)
        .catch((err: any) => {
          console.error('Subscription status check error:', err);
          setError(err?.message || 'Failed to check push subscription status');
          setIsSubscribed(false);
        })
        .finally(() => setHasCheckedSubscription(true));
    } else {
      setHasCheckedSubscription(true);
    }
  }, []);

  const subscribe = useCallback(async (): Promise<boolean> => {
    const token = tokenManager.getToken();
    if (!token) {
      setError('User not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await registerServiceWorker();
      const vapidPublicKey = await notificationsService.getVapidPublicKey();
      await subscribeToPushNotifications(API_BASE_URL, token, vapidPublicKey);
      setIsSubscribed(true);
      setHasCheckedSubscription(true);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to subscribe to push notifications';
      setError(errorMessage);
      console.error('Subscribe error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    const token = tokenManager.getToken();
    if (!token) {
      setError('User not authenticated');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await unsubscribeFromPushNotifications(API_BASE_URL, token);
      setIsSubscribed(false);
      setHasCheckedSubscription(true);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to unsubscribe from push notifications';
      setError(errorMessage);
      console.error('Unsubscribe error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    error,
    hasCheckedSubscription,
    subscribe,
    unsubscribe
  };
}

