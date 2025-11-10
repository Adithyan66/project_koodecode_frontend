import React, { useState } from 'react';
import { Save, Eye, EyeOff, Smartphone, Trash2, Shield } from 'lucide-react';
import { authAPI } from '../../../services/axios/auth/authService';
import { toast } from 'react-toastify';

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
      const res = await authAPI.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success(res.message);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Failed to update password:', error);
      toast.error(error?.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacySave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving privacy settings:', privacy);
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
  };

  return (
    <div className="space-y-6 text-gray-200">
      {/* Change Password */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <h2 className="mb-6 text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-400 to-green-500">Change Password</h2>

        <div className="space-y-4 max-w-md">
          {/* Current Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 pr-10 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 transition hover:text-white"
              >
                {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 pr-10 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 transition hover:text-white"
              >
                {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 pr-10 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 transition hover:text-white"
              >
                {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordSave}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white transition hover:border-white/40 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <h2 className="mb-6 text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-400 to-green-500">Two-Factor Authentication</h2>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="text-gray-300" size={24} />
            <div>
              <h3 className="font-medium text-white">
                {twoFactor.enabled ? '2FA Enabled' : '2FA Disabled'}
              </h3>
              <p className="text-sm text-gray-400">
                {twoFactor.enabled
                  ? 'Your account is protected with two-factor authentication'
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
          </div>
          <button
            onClick={enable2FA}
            className={`rounded-full border px-4 py-2 font-medium transition ${twoFactor.enabled
              ? 'border-red-500/50 bg-red-500/15 text-red-200 hover:border-red-400 hover:bg-red-500/25'
              : 'border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20'
              }`}
          >
            {twoFactor.enabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>

        {twoFactor.enabled && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="mb-2 flex items-center space-x-2">
              <Smartphone size={16} className="text-gray-200" />
              <span className="text-sm font-medium text-white">Authenticator App</span>
            </div>
            <p className="text-sm text-gray-200/80">
              Use your authenticator app to generate verification codes
            </p>
          </div>
        )}
      </div>

      {/* Privacy Settings */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <h2 className="mb-6 text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-400 to-green-500">Privacy Settings</h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Profile Visibility
            </label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full max-w-xs rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <p className="mt-1 text-xs text-gray-400">
              Control who can see your profile information
            </p>
          </div>

          <div className="space-y-4">
            {[
              { key: 'showEmail', label: 'Show Email Address', description: 'Display your email on your public profile' },
              { key: 'showSolutions', label: 'Show My Solutions', description: 'Allow others to view your problem solutions' },
              { key: 'showStats', label: 'Show Statistics', description: 'Display your coding statistics publicly' },
              { key: 'allowDirectMessages', label: 'Allow Direct Messages', description: 'Let other users send you messages' },
            ].map(option => (
              <div key={option.key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-400">{option.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy[option.key as keyof typeof privacy] as boolean}
                    onChange={(e) => handlePrivacyChange(option.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-11 rounded-full bg-white/10 transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/40 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:border-white peer-checked:bg-green-500"></div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrivacySave}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white transition hover:border-white/40 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isLoading ? 'Saving...' : 'Save Privacy Settings'}</span>
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <h2 className="mb-6 text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-400 to-green-500">Active Sessions</h2>

        <div className="space-y-3">
          {activeSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-white">{session.device}</h3>
                  {session.current && (
                    <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white">Current</span>
                  )}
                </div>
                <p className="text-sm text-gray-300">{session.location}</p>
                <p className="text-xs text-gray-400">Last active: {session.lastActive}</p>
              </div>
              {!session.current && (
                <button
                  onClick={() => terminateSession(session.id)}
                  className="flex items-center space-x-1 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-200 transition hover:border-red-400 hover:bg-red-500/20"
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
