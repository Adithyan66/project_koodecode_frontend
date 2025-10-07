

// src/components/user/rooms/RoomsSection.tsx
import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoomCard from './RoomCard';
import { roomService } from '../../../../services/axios/user/room';
import type { PublicRoom } from '../../../../types/room';
import httpClient from '../../../../services/axios/httpClient';

interface RoomsSectionProps {
  title: string;
  status: 'active' | 'waiting';
  accentColor?: string;
}

const RoomsSection: React.FC<RoomsSectionProps> = ({ 
  title, 
  status, 
  accentColor = 'green' 
}) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  const fetchRooms = async (page: number = 1, search: string = '') => {
    setLoading(true);
    setError('');

    try {
    //   const response = await roomService.getPublicRooms({
    //     status,
    //     page,
    //     limit: 9, // 3 rows × 3 cards
    //     search: search.trim()
    //   });

      const response = await httpClient.get('/user/rooms/public', { status,
        page,
        limit: 9,
        search: search.trim() });

      if (response.data.success) {
        setRooms(response.data.rooms);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError('Failed to load rooms');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  // Fetch rooms on component mount and when dependencies change
  useEffect(() => {
    fetchRooms(1, searchQuery);
  }, [status, searchQuery]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      fetchRooms(1, searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      fetchRooms(newPage, searchQuery);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    setJoiningRoomId(roomId);
    try {
      const response = await roomService.joinRoom(roomId);
      if (response.success) {
        // Navigate to the room
        navigate(`/room/${roomId}`);
      } else {
        alert(response.message || 'Failed to join room');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to join room');
    } finally {
      setJoiningRoomId(null);
    }
  };

  const getAccentClasses = () => {
    const classes = {
      green: 'text-green-400',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      orange: 'text-orange-400'
    };
    return classes[accentColor as keyof typeof classes] || classes.green;
  };

  return (
    <section className="px-6 py-16 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl font-bold mb-4 md:mb-0">
            {title.split(' ').map((word, index) => 
              index === title.split(' ').length - 1 ? (
                <span key={index} className={getAccentClasses()}>{word}</span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h2>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-gray-400">
              <Loader className="animate-spin" size={24} />
              <span className="text-lg">Loading rooms...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-red-400 mb-4">
                <AlertCircle size={24} />
                <span className="text-lg font-medium">Failed to load rooms</span>
              </div>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => fetchRooms(currentPage, searchQuery)}
                className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
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
                  : `${status === 'active' ? 'Active' : 'Scheduled'} rooms will appear here`
                }
              </p>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
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

            {/* Pagination */}
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
                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                          pageNum === currentPage
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
