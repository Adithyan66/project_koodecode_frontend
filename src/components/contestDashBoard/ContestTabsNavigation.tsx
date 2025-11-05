import { Calendar, Search, TrendingUp } from 'lucide-react';

interface ContestTabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pastSearchTerm: string;
  onPastSearchChange: (value: string) => void;
}

const ContestTabsNavigation = ({
  activeTab,
  onTabChange,
  pastSearchTerm,
  onPastSearchChange,
}: ContestTabsNavigationProps) => {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-6">
      <div className="flex items-center gap-4 whitespace-nowrap">
        <button
          onClick={() => onTabChange('upcoming')}
          className={`relative px-6 py-3 font-bold text-lg rounded-xl transition-all duration-300 ${
            activeTab === 'upcoming'
              ? 'text-green-400 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500 shadow-lg shadow-green-500/20'
              : 'text-gray-400 hover:text-green-400 hover:bg-gray-800/50'
          }`}
        >
          {activeTab === 'upcoming' && (
            <span className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-sm"></span>
          )}
          <span className="relative flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming
          </span>
        </button>
        <button
          onClick={() => onTabChange('past')}
          className={`relative px-6 py-3 font-bold text-lg rounded-xl transition-all duration-300 ${
            activeTab === 'past'
              ? 'text-green-400 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500 shadow-lg shadow-green-500/20'
              : 'text-gray-400 hover:text-green-400 hover:bg-gray-800/50'
          }`}
        >
          {activeTab === 'past' && (
            <span className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl blur-sm"></span>
          )}
          <span className="relative flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Past
          </span>
        </button>
      </div>
      <div className="justify-self-end w-[320px] min-h-[48px] flex items-center">
        {activeTab === 'past' ? (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={pastSearchTerm}
              onChange={(e) => onPastSearchChange(e.target.value)}
              placeholder="Search past contests..."
              className="w-[320px] pl-10 pr-4 py-3 bg-gray-800/50 text-white border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        ) : (
          <div className="w-[320px] h-[48px]"></div>
        )}
      </div>
    </div>
  );
};

export default ContestTabsNavigation;

