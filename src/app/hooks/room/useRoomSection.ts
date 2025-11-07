import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../../services/axios/httpClient';
import type { PublicRoom } from '../../../types/room';

interface UseRoomSectionParams {
  status: 'active' | 'waiting';
}

interface FetchRoomsParams {
  page?: number;
  search?: string;
}

export const useRoomSection = ({ status }: UseRoomSectionParams) => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [joiningRoomId, setJoiningRoomId] = useState<string | null>(null);

  const fetchRooms = useCallback(async ({ page = 1, search = '' }: FetchRoomsParams = {}) => {
    setLoading(true);
    setError('');

    try {
      const response = await httpClient.get('/user/rooms/public', {
        params: {
          status,
          page,
          limit: 9,
          search: search.trim(),
        },
      });

      if (response.data.success) {
        setRooms(response.data.data.rooms);
        setCurrentPage(response.data.data.pagination.currentPage);
        setTotalPages(response.data.data.pagination.totalPages);
      } else {
        setError('Failed to load rooms');
      }
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchRooms({ page: 1, search: searchQuery });
  }, [fetchRooms]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(prev => (prev === 1 ? prev : 1));
      fetchRooms({ page: 1, search: searchQuery });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchRooms]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      fetchRooms({ page: newPage, search: searchQuery });
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    setJoiningRoomId(roomId);
    try {
      navigate(`/room/${roomId}`);
    } catch (joinError: any) {
      alert(joinError.response?.data?.message || 'Failed to join room');
    } finally {
      setJoiningRoomId(null);
    }
  };

  const retryFetch = () => {
    fetchRooms({ page: currentPage, search: searchQuery });
  };

  return {
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
  };
};

export type UseRoomSectionReturn = ReturnType<typeof useRoomSection>;

