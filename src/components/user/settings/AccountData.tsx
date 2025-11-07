import React, { useState } from 'react';
import { Save, Download, Trash2, AlertTriangle, BarChart3 } from 'lucide-react';

const AccountData: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

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
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-gray-200">
      {/* Usage Statistics */}
      <div className="rounded-3xl border border-white/10 bg-black/65 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <BarChart3 className="text-gray-300" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-white">Usage Statistics</h2>
            <p className="text-sm text-gray-400">Overview of your KoodeCode activity</p>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
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
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/55 p-3 text-center">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-400">
          Member since: {new Date(usageStats.joinDate).toLocaleDateString()}
        </div>
      </div>

      {/* Data Export */}
      <div className="rounded-3xl border border-white/10 bg-black/65 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <Download className="text-gray-300" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-white">Data Export</h2>
            <p className="text-sm text-gray-400">Download your personal data and activity</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              onClick={() => handleDataExport('all')}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-black/45 p-4 transition-all hover:border-white/40 hover:bg-white/10 disabled:opacity-50"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-medium text-white">All Data</div>
                <div className="text-sm text-gray-400">Complete data export</div>
              </div>
            </button>

            <button
              onClick={() => handleDataExport('solutions')}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-black/45 p-4 transition-all hover:border-white/40 hover:bg-white/10 disabled:opacity-50"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-medium text-white">Solutions</div>
                <div className="text-sm text-gray-400">Your code solutions</div>
              </div>
            </button>

            <button
              onClick={() => handleDataExport('stats')}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-black/45 p-4 transition-all hover:border-white/40 hover:bg-white/10 disabled:opacity-50"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-medium text-white">Statistics</div>
                <div className="text-sm text-gray-400">Performance metrics</div>
              </div>
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-sm text-gray-200">
            <strong className="font-semibold text-white">Note:</strong> Data exports are generated in JSON format and may take a few minutes to process. 
            You'll receive an email when your export is ready for download.
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="rounded-3xl border border-red-500/30 bg-black/70 p-6 shadow-[0_20px_45px_rgba(248,113,113,0.25)] backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
            <p className="text-sm text-red-200/80">Permanently delete your account and data</p>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
          <h3 className="mb-2 font-medium text-red-200">What happens when you delete your account:</h3>
          <ul className="space-y-1 text-sm text-red-200/80">
            <li>• All your solutions and submissions will be permanently deleted</li>
            <li>• Your statistics and achievements will be lost</li>
            <li>• Your username will become available for others to use</li>
            <li>• This action cannot be undone</li>
          </ul>
        </div>

        <button
          onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
          className="rounded-full border border-red-500/50 bg-red-500/15 px-4 py-2 text-red-200 transition hover:border-red-400 hover:bg-red-500/25"
        >
          Delete Account
        </button>

        {showDeleteConfirm && (
          <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
            <p className="mb-3 text-sm text-red-200">
              To confirm account deletion, type <strong>DELETE</strong> in the field below:
            </p>
            <div className="flex space-x-3">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="flex-1 rounded-2xl border border-red-500/40 bg-black/60 px-3 py-2 text-red-200 focus:border-red-400 focus:outline-none"
              />
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isLoading}
                className="flex items-center gap-2 rounded-full border border-red-500/50 bg-red-500/20 px-4 py-2 text-red-200 transition hover:border-red-400 hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
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
