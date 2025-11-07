import React, { useState } from 'react';
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
            <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black flex items-center justify-center text-white">
                <div className="w-full max-w-6xl h-[90vh] rounded-3xl border border-white/10 bg-black/70 shadow-[0_25px_60px_rgba(15,15,15,0.45)] backdrop-blur-2xl overflow-hidden">
                    <div className="lg:hidden bg-black/85 border-b border-white/10 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Settings</p>
                                <h1 className="text-xl font-semibold text-white">Control Center</h1>
                            </div>
                            <button
                                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                                className="p-2 rounded-full border border-white/20 bg-white/10 text-gray-200 transition hover:border-white/40 hover:bg-white/20"
                            >
                                {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex h-[calc(100%-64px)]">
                        <aside
                            className={`
                                tiny-scrollbar fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-white/10 bg-black/85 px-5 py-8 backdrop-blur-xl transition-transform duration-300 lg:static lg:h-full lg:w-72 lg:translate-x-0
                                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                            `}
                        >
                            <div className="hidden lg:flex flex-col">
                                <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Settings</p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">Control Center</h2>
                                <p className="mt-3 text-sm text-gray-400">
                                    Tailor your profile, privacy, and workflow preferences in one place.
                                </p>
                            </div>
                            <nav className="mt-6 flex flex-col gap-2">
                                {settingsCategories.map((category) => {
                                    const Icon = category.icon;
                                    const isActive = activeTab === category.id;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => {
                                                setActiveTab(category.id);
                                                setIsMobileSidebarOpen(false);
                                            }}
                                            className={`
                                                group flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all duration-200
                                                ${
                                                    isActive
                                                        ? 'border-white/40 bg-white/10 text-white shadow-[0_12px_28px_rgba(255,255,255,0.12)]'
                                                        : 'border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10 hover:text-white'
                                                }
                                            `}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className={`rounded-xl border px-2.5 py-2 transition ${isActive ? 'border-white/50 bg-white/10' : 'border-white/10 bg-white/5 group-hover:border-white/30 group-hover:bg-white/10'}`}>
                                                    <Icon size={18} />
                                                </span>
                                                <span className="font-medium">{category.name}</span>
                                            </span>
                                            <span className={`h-2 w-2 rounded-full transition ${isActive ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]' : 'bg-white/20 group-hover:bg-white group-hover:shadow-[0_0_12px_rgba(255,255,255,0.6)]'}`} />
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>
                        {isMobileSidebarOpen && (
                            <div
                                className="fixed inset-0 z-30 bg-black/70 lg:hidden"
                                onClick={() => setIsMobileSidebarOpen(false)}
                            />
                        )}
                        <div className="flex-1 bg-gradient-to-br from-black/85 via-black/70 to-black/60">
                            <div className="tiny-scrollbar h-full overflow-y-auto p-6">
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
