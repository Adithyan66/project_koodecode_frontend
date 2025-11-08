

import React, { useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import RoomCard from './RoomCard';
import { useRoomSection } from '../../../app/hooks/room/useRoomSection';

interface RoomsSectionProps {
  title: string;
  status: 'active' | 'waiting';
  accentColor?: string;
}

const accentThemes = {
  green: {
    glow: 'from-emerald-500/25 via-emerald-400/15 to-cyan-400/25',
    titleGradient: 'from-emerald-300 via-emerald-200 to-cyan-200',
  },
  blue: {
    glow: 'from-sky-500/25 via-blue-500/15 to-indigo-500/25',
    titleGradient: 'from-sky-300 via-blue-200 to-indigo-200',
  },
  purple: {
    glow: 'from-fuchsia-500/25 via-purple-500/15 to-indigo-500/25',
    titleGradient: 'from-fuchsia-300 via-purple-200 to-indigo-200',
  },
  orange: {
    glow: 'from-amber-500/25 via-orange-500/15 to-rose-500/25',
    titleGradient: 'from-amber-300 via-orange-200 to-rose-200',
  }
} as const;

const RoomsSection: React.FC<RoomsSectionProps> = ({
  title,
  status,
  accentColor = 'green'
}) => {
  const {
    rooms,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    joiningRoomId,
    handlePageChange,
    handleJoinRoom,
    retryFetch,
  } = useRoomSection({ status });

  const theme = useMemo(() => {
    const key = accentColor as keyof typeof accentThemes;
    return accentThemes[key] || accentThemes.green;
  }, [accentColor]);

  const renderTitle = () => {
    const words = title.split(' ');
    return words.map((word, index) => {
      const isLast = index === words.length - 1;
      if (isLast) {
        return (
          <span
            key={`${word}-${index}`}
            className={`bg-gradient-to-r ${theme.titleGradient} bg-clip-text text-transparent`}
          >
            {word}
          </span>
        );
      }
      return (
        <span key={`${word}-${index}`} className="text-white">
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <section className="relative px-6 py-16 bg-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-[-18rem] right-[-10rem] h-[28rem] w-[28rem] blur-3xl rounded-full bg-gradient-to-br ${theme.glow}`} />
        <div className="absolute bottom-[-16rem] left-[-12rem] h-[26rem] w-[26rem] blur-3xl rounded-full bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl font-bold mb-4 md:mb-0">
            {renderTitle()}
          </h2>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white pl-12 pr-4 pb-2 border-b border-gray-700 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-gray-400">
              <Loader className="animate-spin" size={24} />
              <span className="text-lg">Loading rooms...</span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-red-400 mb-4">
                <AlertCircle size={24} />
                <span className="text-lg font-medium">Failed to load rooms</span>
              </div>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={retryFetch}
                className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'No rooms found' : `No ${status} rooms yet`}
              </h3>
              <p>
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : `${status === 'active' ? 'Active' : 'Scheduled'} rooms will appear here`}
              </p>
            </div>
          </div>
        )}

        {!loading && !error && rooms.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onJoinRoom={handleJoinRoom}
                  isJoining={joiningRoomId === room.roomId}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${pageNum === currentPage
                            ? 'bg-green-500 text-black'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default RoomsSection;
