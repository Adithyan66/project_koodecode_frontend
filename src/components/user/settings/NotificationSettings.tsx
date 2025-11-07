import React, { useState } from 'react';
import { Save, Mail, Bell, MessageSquare } from 'lucide-react';
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
    <div className="space-y-6 text-gray-200">
      {/* Browser Push Notifications */}
      <div className="rounded-3xl border border-white/10 bg-black/65 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <MessageSquare className="text-gray-300" size={24} />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">Browser Push Notifications</h2>
            <p className="text-sm text-gray-400">
              Receive push notifications even when the browser is closed
            </p>
          </div>
        </div>

        {!isPushSupported ? (
          <div className="rounded-2xl border border-yellow-300/40 bg-yellow-500/10 p-4 text-sm text-yellow-100">
            Push notifications are not supported in your browser. Please use a modern browser like Chrome, Firefox, or Edge.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-white">
                  Enable Push Notifications
                </label>
                <p className="text-xs text-gray-400">
                  {isPushSubscribed
                    ? 'You will receive browser notifications for important updates'
                    : 'Enable to receive notifications for contests, achievements, and more'}
                </p>
              </div>
              <button
                onClick={handlePushToggle}
                disabled={isPushLoading}
                className={`relative inline-flex h-7 w-12 items-center rounded-full border border-white/20 bg-white/10 transition ${
                  isPushSubscribed ? 'justify-end bg-blue-500/80' : 'justify-start'
                } ${isPushLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-white/40 hover:bg-white/20'}`}
              >
                <span className="m-1 inline-block h-5 w-5 rounded-full bg-white transition" />
              </button>
            </div>

            {pushError && (
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-xs text-red-100">
                {pushError}
              </div>
            )}

            {isPushSubscribed && (
              <div className="rounded-2xl border border-blue-400/40 bg-blue-500/10 p-3 text-xs text-blue-100">
                ✓ Push notifications are enabled for this browser
              </div>
            )}
          </div>
        )}
      </div>

      {notificationCategories.map(category => {
        const Icon = category.icon;
        const categoryState = notifications[category.key as keyof typeof notifications];
        return (
          <div key={category.key} className="rounded-3xl border border-white/10 bg-black/65 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <Icon className="text-gray-300" size={24} />
              <div>
                <h2 className="text-xl font-semibold text-white">{category.title}</h2>
                <p className="text-sm text-gray-400">{category.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {category.settings.map(setting => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">
                      {setting.label}
                    </label>
                    <p className="text-xs text-gray-400">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryState[setting.key as keyof typeof categoryState] as boolean}
                      onChange={(e) => handleNotificationChange(category.key, setting.key, e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-white/10 transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/40 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:border-white peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Quick Actions */}
      <div className="rounded-3xl border border-white/10 bg-black/65 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <h2 className="mb-4 text-xl font-semibold text-white">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const allEnabled = { ...notifications };
              Object.keys(allEnabled).forEach(category => {
                Object.keys(allEnabled[category as keyof typeof allEnabled]).forEach(key => {
                  (allEnabled[category as keyof typeof allEnabled] as any)[key] = true;
                });
              });
              setNotifications(allEnabled);
            }}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/20"
          >
            Enable All
          </button>
          <button
            onClick={() => {
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
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/20"
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
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white transition hover:border-white/40 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isLoading ? 'Saving...' : 'Save Notification Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
