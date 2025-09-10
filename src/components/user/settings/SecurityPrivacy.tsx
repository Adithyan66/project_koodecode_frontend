

import React, { useState } from 'react';
import { Save, Eye, EyeOff, Smartphone, Trash2, Shield } from 'lucide-react';

const SecurityPrivacy: React.FC = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public' as 'public' | 'private',
    showEmail: false,
    showSolutions: true,
    showStats: true,
    allowDirectMessages: true
  });
  
  const [twoFactor, setTwoFactor] = useState({
    enabled: false,
    backupCodes: [] as string[]
  });

  const [activeSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, US', lastActive: '2 hours ago', current: true },
    { id: 2, device: 'Mobile App', location: 'New York, US', lastActive: '1 day ago', current: false },
    { id: 3, device: 'Firefox on Linux', location: 'California, US', lastActive: '3 days ago', current: false }
  ]);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: string, value: any) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSave = async () => {
    setIsLoading(true);
    try {
      console.log('Updating password...');
      // await updatePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Failed to update password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacySave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving privacy settings:', privacy);
      // await updatePrivacySettings(privacy);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const enable2FA = () => {
    setTwoFactor(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const terminateSession = (sessionId: number) => {
    console.log('Terminating session:', sessionId);
    // API call to terminate session
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Change Password</h2>
        
        <div className="space-y-4 max-w-md">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Two-Factor Authentication</h2>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="text-green-500" size={24} />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {twoFactor.enabled ? '2FA Enabled' : '2FA Disabled'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {twoFactor.enabled 
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
          </div>
          <button
            onClick={enable2FA}
            className={`px-4 py-2 rounded-md font-medium ${
              twoFactor.enabled
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {twoFactor.enabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>

        {twoFactor.enabled && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <Smartphone size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Authenticator App</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Use your authenticator app to generate verification codes
            </p>
          </div>
        )}
      </div>

      {/* Privacy Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h2>
        
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Visibility
            </label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Control who can see your profile information
            </p>
          </div>

          {/* Privacy Toggles */}
          <div className="space-y-4">
            {[
              { key: 'showEmail', label: 'Show Email Address', description: 'Display your email on your public profile' },
              { key: 'showSolutions', label: 'Show My Solutions', description: 'Allow others to view your problem solutions' },
              { key: 'showStats', label: 'Show Statistics', description: 'Display your coding statistics publicly' },
              { key: 'allowDirectMessages', label: 'Allow Direct Messages', description: 'Let other users send you messages' },
            ].map(option => (
              <div key={option.key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy[option.key as keyof typeof privacy] as boolean}
                    onChange={(e) => handlePrivacyChange(option.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrivacySave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isLoading ? 'Saving...' : 'Save Privacy Settings'}</span>
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Active Sessions</h2>
        
        <div className="space-y-3">
          {activeSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">{session.device}</h3>
                  {session.current && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Current</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{session.location}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Last active: {session.lastActive}</p>
              </div>
              {!session.current && (
                <button
                  onClick={() => terminateSession(session.id)}
                  className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  <Trash2 size={14} />
                  <span className="text-sm">Terminate</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
