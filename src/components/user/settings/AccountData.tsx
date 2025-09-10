


import React, { useState } from 'react';
import { Save, Download, Trash2, AlertTriangle, BarChart3 } from 'lucide-react';

const AccountData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Mock usage data - replace with actual data from your UserProfile entity
  const usageStats = {
    totalProblems: 150,
    easyProblems: 75,
    mediumProblems: 50,
    hardProblems: 25,
    totalSubmissions: 300,
    acceptedSubmissions: 200,
    acceptanceRate: 67,
    currentStreak: 15,
    maxStreak: 30,
    activeDays: 120,
    contestRating: 1250,
    globalRank: 5420,
    coinBalance: 1500,
    badgesEarned: 8,
    joinDate: '2024-03-15'
  };

  const handleDataExport = async (type: 'all' | 'solutions' | 'stats') => {
    setIsLoading(true);
    try {
      console.log(`Exporting ${type} data...`);
      // API call to export data
      // await exportUserData(type);
    } catch (error) {
      console.error('Failed to export data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    
    setIsLoading(true);
    try {
      console.log('Deleting account...');
      // API call to delete account
      // await deleteUserAccount();
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Usage Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Usage Statistics</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your KoodeCode activity</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Problems Solved', value: usageStats.totalProblems },
            { label: 'Acceptance Rate', value: `${usageStats.acceptanceRate}%` },
            { label: 'Current Streak', value: usageStats.currentStreak },
            { label: 'Contest Rating', value: usageStats.contestRating },
            { label: 'Global Rank', value: `#${usageStats.globalRank}` },
            { label: 'Coins Earned', value: usageStats.coinBalance },
            { label: 'Badges Earned', value: usageStats.badgesEarned },
            { label: 'Active Days', value: usageStats.activeDays }
          ].map(stat => (
            <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Member since: {new Date(usageStats.joinDate).toLocaleDateString()}
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Export</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Download your personal data and activity</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleDataExport('all')}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">All Data</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Complete data export</div>
              </div>
            </button>

            <button
              onClick={() => handleDataExport('solutions')}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Solutions</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Your code solutions</div>
              </div>
            </button>

            <button
              onClick={() => handleDataExport('stats')}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Statistics</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Performance metrics</div>
              </div>
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <strong>Note:</strong> Data exports are generated in JSON format and may take a few minutes to process. 
            You'll receive an email when your export is ready for download.
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-red-500">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="text-red-600" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Danger Zone</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and data</p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
          <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">What happens when you delete your account:</h3>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            <li>• All your solutions and submissions will be permanently deleted</li>
            <li>• Your statistics and achievements will be lost</li>
            <li>• Your username will become available for others to use</li>
            <li>• This action cannot be undone</li>
          </ul>
        </div>

        <button
          onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Account
        </button>

        {showDeleteConfirm && (
          <div className="mt-4 p-4 border border-red-300 dark:border-red-600 rounded-md bg-red-50 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200 mb-3">
              To confirm account deletion, type <strong>DELETE</strong> in the field below:
            </p>
            <div className="flex space-x-3">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="flex-1 px-3 py-2 border border-red-300 dark:border-red-600 rounded-md focus:ring-red-500 focus:border-red-500"
              />
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Trash2 size={16} />
                <span>{isLoading ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountData;
