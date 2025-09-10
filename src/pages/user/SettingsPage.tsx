





import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    User,
    Code,
    Shield,
    Bell,
    Accessibility,
    Database,
    Menu,
    X
} from 'lucide-react';

import ProfileSettings from '../../components/user/settings/ProfileSettings';
import CodingPreferences from '../../components/user/settings/CodingPreferences';
import SecurityPrivacy from '../../components/user/settings/SecurityPrivacy';
import NotificationSettings from '../../components/user/settings/NotificationSettings';
import AccessibilitySettings from '../../components/user/settings/AccessibilitySettings';
import AccountData from '../../components/user/settings/AccountData';
import Navbar from '../../components/user/Navbar';

interface SettingsProps { }

const SettingsPage: React.FC<SettingsProps> = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const settingsCategories = [
        {
            id: 'profile',
            name: 'Profile Settings',
            icon: User,
            component: ProfileSettings
        },
        {
            id: 'coding',
            name: 'Coding Preferences',
            icon: Code,
            component: CodingPreferences
        },
        {
            id: 'security',
            name: 'Security & Privacy',
            icon: Shield,
            component: SecurityPrivacy
        },
        {
            id: 'notifications',
            name: 'Notifications',
            icon: Bell,
            component: NotificationSettings
        },
        {
            id: 'accessibility',
            name: 'Accessibility',
            icon: Accessibility,
            component: AccessibilitySettings
        },
        {
            id: 'account',
            name: 'Account & Data',
            icon: Database,
            component: AccountData
        }
    ];

    const ActiveComponent = settingsCategories.find(cat => cat.id === activeTab)?.component || ProfileSettings;

    return (
    <>
        <Navbar />

        <div className="min-h-screen bg-black flex items-center justify-center">
  <div className="w-full max-w-6xl h-[90vh] bg-black rounded-2xl shadow-lg overflow-hidden">

    {/* Mobile Header */}
    <div className="lg:hidden bg-gray-900 px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-md text-gray-300 hover:bg-gray-700"
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>

    <div className="flex h-[calc(100%-64px)]">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 lg:h-full
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="hidden lg:block p-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your KoodeCode preferences
          </p>
        </div>

        <nav className="p-4 space-y-2 lg:mt-0 mt-4">
          {settingsCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setActiveTab(category.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                  ${
                    activeTab === category.id
                      ? 'bg-blue-900/30 text-blue-300'
                      : 'text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 bg-black overflow-y-auto">
        <div className="p-6">
          <ActiveComponent />
        </div>
      </div>
    </div>
  </div>
</div>

</>

    );
};

export default SettingsPage;
