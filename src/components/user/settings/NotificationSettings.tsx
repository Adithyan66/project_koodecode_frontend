import React, { useState } from 'react';
import { Save, Mail, Bell, MessageSquare, Trophy } from 'lucide-react';
import { toast } from 'react-toastify';
import { usePushNotifications } from '../../../app/hooks/usePushNotifications';

const NotificationSettings: React.FC = () => {
  const {
    isSupported: isPushSupported,
    isSubscribed: isPushSubscribed,
    isLoading: isPushLoading,
    error: pushError,
    subscribe: subscribePush,
    unsubscribe: unsubscribePush
  } = usePushNotifications();

  const [notifications, setNotifications] = useState({
    email: {
      newProblems: true,
      achievements: true,
      contestReminders: true,
      discussionReplies: false,
      weeklyDigest: true,
      securityAlerts: true
    },
    inApp: {
      newProblems: true,
      achievements: true,
      contestReminders: true,
      discussionReplies: true,
      submissions: true,
      systemUpdates: false
    },
    push: {
      contestStart: true,
      achievements: false,
      directMessages: true,
      submissions: false
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handlePushToggle = async () => {
    if (isPushSubscribed) {
      const success = await unsubscribePush();
      if (success) {
        toast.success('Push notifications disabled');
      } else {
        toast.error(pushError || 'Failed to disable push notifications');
      }
    } else {
      const success = await subscribePush();
      if (success) {
        toast.success('Push notifications enabled');
      } else {
        toast.error(pushError || 'Failed to enable push notifications');
      }
    }
  };

  const handleNotificationChange = (category: string, key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving notification settings:', notifications);
      // await saveNotificationSettings(notifications);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const notificationCategories = [
    {
      key: 'email',
      title: 'Email Notifications',
      icon: Mail,
      description: 'Receive notifications via email',
      settings: [
        { key: 'newProblems', label: 'New Problems', description: 'When new coding problems are added' },
        { key: 'achievements', label: 'Achievements & Badges', description: 'When you earn new badges or achievements' },
        { key: 'contestReminders', label: 'Contest Reminders', description: 'Reminders about upcoming contests' },
        { key: 'discussionReplies', label: 'Discussion Replies', description: 'When someone replies to your discussions' },
        { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary of your coding activity' },
        { key: 'securityAlerts', label: 'Security Alerts', description: 'Important security-related notifications' }
      ]
    },
    {
      key: 'inApp',
      title: 'In-App Notifications',
      icon: Bell,
      description: 'Show notifications within the application',
      settings: [
        { key: 'newProblems', label: 'New Problems', description: 'When new coding problems are added' },
        { key: 'achievements', label: 'Achievements & Badges', description: 'When you earn new badges or achievements' },
        { key: 'contestReminders', label: 'Contest Reminders', description: 'Reminders about upcoming contests' },
        { key: 'discussionReplies', label: 'Discussion Replies', description: 'When someone replies to your discussions' },
        { key: 'submissions', label: 'Submission Results', description: 'When your code submissions are processed' },
        { key: 'systemUpdates', label: 'System Updates', description: 'Platform updates and maintenance notifications' }
      ]
    },
    {
      key: 'push',
      title: 'Push Notifications',
      icon: MessageSquare,
      description: 'Receive push notifications on your device',
      settings: [
        { key: 'contestStart', label: 'Contest Started', description: 'When contests you registered for begin' },
        { key: 'achievements', label: 'New Achievements', description: 'When you earn new badges or achievements' },
        { key: 'directMessages', label: 'Direct Messages', description: 'When someone sends you a direct message' },
        { key: 'submissions', label: 'Submission Results', description: 'When your code submissions are processed' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MessageSquare className="text-blue-600" size={24} />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Browser Push Notifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive push notifications even when the browser is closed
            </p>
          </div>
        </div>

        {!isPushSupported ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Push notifications are not supported in your browser. Please use a modern browser like Chrome, Firefox, or Edge.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable Push Notifications
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isPushSubscribed
                    ? 'You will receive browser notifications for important updates'
                    : 'Enable to receive notifications for contests, achievements, and more'}
                </p>
              </div>
              <button
                onClick={handlePushToggle}
                disabled={isPushLoading}
                className={`
                  relative inline-flex items-center h-6 rounded-full w-11 transition-colors
                  ${isPushSubscribed ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                  ${isPushLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span
                  className={`
                    inline-block w-4 h-4 transform rounded-full bg-white transition-transform
                    ${isPushSubscribed ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
            {pushError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-xs text-red-800 dark:text-red-200">{pushError}</p>
              </div>
            )}
            {isPushSubscribed && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                <p className="text-xs text-green-800 dark:text-green-200">
                  ✓ Push notifications are enabled for this browser
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {notificationCategories.map(category => {
        const Icon = category.icon;
        return (
          <div key={category.key} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Icon className="text-blue-600" size={24} />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{category.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {category.settings.map(setting => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {setting.label}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[category.key as keyof typeof notifications][setting.key as keyof any]}
                      onChange={(e) => handleNotificationChange(category.key, setting.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              // Enable all notifications
              const allEnabled = { ...notifications };
              Object.keys(allEnabled).forEach(category => {
                Object.keys(allEnabled[category as keyof typeof allEnabled]).forEach(key => {
                  (allEnabled[category as keyof typeof allEnabled] as any)[key] = true;
                });
              });
              setNotifications(allEnabled);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Enable All
          </button>
          <button
            onClick={() => {
              // Disable all notifications except security alerts
              const allDisabled = { ...notifications };
              Object.keys(allDisabled).forEach(category => {
                Object.keys(allDisabled[category as keyof typeof allDisabled]).forEach(key => {
                  if (key !== 'securityAlerts') {
                    (allDisabled[category as keyof typeof allDisabled] as any)[key] = false;
                  }
                });
              });
              setNotifications(allDisabled);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Disable All (Keep Security)
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isLoading ? 'Saving...' : 'Save Notification Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
