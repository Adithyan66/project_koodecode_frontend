import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Settings, Users, BookOpen, BarChart3, FileText, Plus, Edit, Trash2, Eye, TrendingUp, Award, Clock, Calendar, Activity, Code, Target, Zap } from 'lucide-react';
import { AdminPanel } from '../../components/admin/AdminPanel';

// Types
interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  acceptance: number;
  submissions: number;
  createdAt: string;
  status: 'Active' | 'Draft' | 'Archived';
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface AdminPanelProps {
  children: React.ReactNode;
  title?: string;
}

// Dashboard Component
const DashboardContent: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock dashboard data
  const dashboardStats = {
    totalProblems: 1247,
    activeUsers: 52431,
    todaySubmissions: 12567,
    successRate: 68.2,
    totalSubmissions: 2489753,
    averageRating: 1578,
    contests: 156,
    premiumUsers: 8432
  };

  const recentActivity = [
    { id: 1, user: "alice_codes", action: "Solved", problem: "Two Sum", difficulty: "Easy", time: "2 minutes ago" },
    { id: 2, user: "bob_dev", action: "Attempted", problem: "Median of Two Sorted Arrays", difficulty: "Hard", time: "5 minutes ago" },
    { id: 3, user: "charlie_py", action: "Solved", problem: "Valid Parentheses", difficulty: "Easy", time: "8 minutes ago" },
    { id: 4, user: "diana_js", action: "Solved", problem: "Merge Two Sorted Lists", difficulty: "Easy", time: "12 minutes ago" },
    { id: 5, user: "eve_cpp", action: "Attempted", problem: "Regular Expression Matching", difficulty: "Hard", time: "15 minutes ago" },
  ];

  const topUsers = [
    { rank: 1, name: "CodeMaster2024", rating: 2847, solved: 1456, badge: "🏆" },
    { rank: 2, name: "AlgoNinja", rating: 2731, solved: 1387, badge: "🥈" },
    { rank: 3, name: "DataStructGuru", rating: 2698, solved: 1299, badge: "🥉" },
    { rank: 4, name: "DPExpert", rating: 2567, solved: 1201, badge: "⭐" },
    { rank: 5, name: "GraphWizard", rating: 2489, solved: 1156, badge: "⭐" },
  ];

  const problemStats = [
    { difficulty: "Easy", total: 487, solved: 412, percentage: 84.6, color: "bg-green-500" },
    { difficulty: "Medium", total: 563, solved: 287, percentage: 51.0, color: "bg-yellow-500" },
    { difficulty: "Hard", total: 197, solved: 45, percentage: 22.8, color: "bg-red-500" },
  ];

  const submissionData = [
    { date: "Mon", submissions: 8400 },
    { date: "Tue", submissions: 9200 },
    { date: "Wed", submissions: 8800 },
    { date: "Thu", submissions: 10100 },
    { date: "Fri", submissions: 11500 },
    { date: "Sat", submissions: 13200 },
    { date: "Sun", submissions: 12100 },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and analytics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Problems</p>
              <p className="text-3xl font-bold mt-1">{dashboardStats.totalProblems.toLocaleString()}</p>
              <p className="text-blue-100 text-sm mt-2">+47 this week</p>
            </div>
            <BookOpen size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold mt-1">{dashboardStats.activeUsers.toLocaleString()}</p>
              <p className="text-green-100 text-sm mt-2">+2.1k today</p>
            </div>
            <Users size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Submissions Today</p>
              <p className="text-3xl font-bold mt-1">{dashboardStats.todaySubmissions.toLocaleString()}</p>
              <p className="text-purple-100 text-sm mt-2">+18% vs yesterday</p>
            </div>
            <Code size={32} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Success Rate</p>
              <p className="text-3xl font-bold mt-1">{dashboardStats.successRate}%</p>
              <p className="text-orange-100 text-sm mt-2">+2.3% this week</p>
            </div>
            <Target size={32} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Submissions</p>
              <p className="text-xl font-bold text-gray-900">{dashboardStats.totalSubmissions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Avg Rating</p>
              <p className="text-xl font-bold text-gray-900">{dashboardStats.averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Contests</p>
              <p className="text-xl font-bold text-gray-900">{dashboardStats.contests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Premium Users</p>
              <p className="text-xl font-bold text-gray-900">{dashboardStats.premiumUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submission Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Daily Submissions</h3>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <div className="space-y-4">
            {submissionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-12">{item.date}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(item.submissions / 14000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  {item.submissions.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Problem Difficulty Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Problem Difficulty Distribution</h3>
          <div className="space-y-6">
            {problemStats.map((stat) => (
              <div key={stat.difficulty}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{stat.difficulty}</span>
                  <span className="text-sm text-gray-600">{stat.solved}/{stat.total} ({stat.percentage}%)</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${stat.color}`}
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.action === 'Solved' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="text-blue-600">{activity.user}</span> {activity.action.toLowerCase()}
                      <span className="font-semibold"> {activity.problem}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                        {activity.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performers</h3>
          <div className="space-y-4">
            {topUsers.map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{user.badge}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">Rating: {user.rating}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">#{user.rank}</p>
                  <p className="text-xs text-gray-500">{user.solved} solved</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



export const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100">
        <AdminPanel />
      </div>
      <div className="flex-1 p-4">
        <DashboardContent />
      </div>
    </div>
  );
};


