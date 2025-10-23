




import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  Image,
  Search,
  X,
  Plus,
  Minus,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import httpClient from '../../services/axios/httpClient';
import { ImageUploadService } from '../../services/ImageUploadService';
import { imageKitService } from '../../services/ImageKitService';
import { AdminPanel } from '../../components/admin/AdminPanel';

// Updated interfaces
interface Problem {
  id:string;
  problemNumber: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    problems: Problem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasMore: boolean;
      limit: number;
    };
  };
}

interface CoinReward {
  rank: number;
  coins: number;
}

interface ContestFormData {
  title: string;
  description: string;
  problemIds: number[]; // Changed to number[] to match problemNumber
  startTime: Date | null;
  endTime: Date | null;
  registrationDeadline: Date | null;
  problemTimeLimit: number;
  maxAttempts: number;
  wrongSubmissionPenalty: number;
  coinRewards: CoinReward[];
  thumbnail?: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  problemIds?: string;
  startTime?: string;
  endTime?: string;
  registrationDeadline?: string;
  problemTimeLimit?: string;
  maxAttempts?: string;
  wrongSubmissionPenalty?: string;
  coinRewards?: string;
}

const CreateContestPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload states
  const [thumbnailImage, setThumbnailImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Problem selection states with pagination
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [problemSearch, setProblemSearch] = useState('');
  const [loadingProblems, setLoadingProblems] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [itemsPerPage] = useState(10); // Fixed items per page

  // Throttling ref for search
  const searchTimeoutRef = useRef(null);

  // Coin rewards state
  const [coinRewards, setCoinRewards] = useState<CoinReward[]>([
    { rank: 1, coins: 1000 },
    { rank: 2, coins: 500 },
    { rank: 3, coins: 250 },
  ]);

  // Form state
  const [formData, setFormData] = useState<ContestFormData>({
    title: '',
    description: '',
    problemIds: [],
    startTime: null,
    endTime: null,
    registrationDeadline: null,
    problemTimeLimit: 90,
    maxAttempts: 3,
    wrongSubmissionPenalty: 50,
    coinRewards: coinRewards,
    thumbnail: '',
  });

  // Form errors state
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Validation function (keeping the same as before)
  const validateForm = (data: ContestFormData, tab: string): FormErrors => {
    const errors: FormErrors = {};

    if (tab === 'basic' || tab === 'all') {
      if (!data.title) {
        errors.title = 'Title is required';
      } else if (data.title.length > 100) {
        errors.title = 'Title must be less than 100 characters';
      }

      if (!data.description) {
        errors.description = 'Description is required';
      } else if (data.description.length > 1000) {
        errors.description = 'Description must be less than 1000 characters';
      }
    }

    if (tab === 'problems' || tab === 'all') {
      if (data.problemIds.length === 0) {
        errors.problemIds = 'At least one problem must be selected';
      }
    }

    if (tab === 'settings' || tab === 'all') {
      if (!data.registrationDeadline) {
        errors.registrationDeadline = 'Registration deadline is required';
      }
      if (!data.startTime) {
        errors.startTime = 'Start time is required';
      }
      if (!data.endTime) {
        errors.endTime = 'End time is required';
      }
      if (data.registrationDeadline && data.startTime && data.registrationDeadline >= data.startTime) {
        errors.registrationDeadline = 'Registration deadline must be before start time';
      }
      if (data.startTime && data.endTime && data.startTime >= data.endTime) {
        errors.endTime = 'End time must be after start time';
      }
      if (data.problemTimeLimit < 1) {
        errors.problemTimeLimit = 'Problem time limit must be at least 1 minute';
      } else if (data.problemTimeLimit > 300) {
        errors.problemTimeLimit = 'Problem time limit cannot exceed 300 minutes';
      }
      if (data.maxAttempts < 1) {
        errors.maxAttempts = 'Max attempts must be at least 1';
      } else if (data.maxAttempts > 10) {
        errors.maxAttempts = 'Max attempts cannot exceed 10';
      }
      if (data.wrongSubmissionPenalty < 0) {
        errors.wrongSubmissionPenalty = 'Penalty cannot be negative';
      } else if (data.wrongSubmissionPenalty > 1000) {
        errors.wrongSubmissionPenalty = 'Penalty cannot exceed 1000 points';
      }
    }

    if (tab === 'rewards' || tab === 'all') {
      if (data.coinRewards.length === 0) {
        errors.coinRewards = 'At least one reward must be defined';
      } else {
        data.coinRewards.forEach((reward, index) => {
          if (reward.rank < 1) {
            errors.coinRewards = `Rank at position ${index + 1} must be at least 1`;
          }
          if (reward.coins < 0) {
            errors.coinRewards = `Coins at position ${index + 1} cannot be negative`;
          }
        });
      }
    }

    return errors;
  };

  // Throttled fetch problems function
  const fetchProblems = useCallback(async (page: number = 1, search: string = '') => {
    setLoadingProblems(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...(search.trim() && { search: search.trim() })
      });

      const response = await httpClient.get<ApiResponse>(`/user/problems/problem-names?${params}`);
      
      if (response.data.success) {
        const { problems: fetchedProblems, pagination } = response.data.data;
        
        setProblems(fetchedProblems);
        setCurrentPage(pagination.currentPage);
        setTotalPages(pagination.totalPages);
        setTotalItems(pagination.totalItems);
        setHasMore(pagination.hasMore);
      } else {
        toast.error('Failed to fetch problems');
      }
    } catch (error) {
      toast.error('Failed to fetch problems');
      console.error('Error fetching problems:', error);
    } finally {
      setLoadingProblems(false);
    }
  }, [itemsPerPage]);

  // Throttled search handler
  const handleSearchChange = useCallback((searchTerm: string) => {
    setProblemSearch(searchTerm);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for throttling
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      fetchProblems(1, searchTerm);
    }, 500); // 500ms throttle delay
  }, [fetchProblems]);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchProblems(page, problemSearch);
    }
  }, [currentPage, totalPages, fetchProblems, problemSearch]);

  // Initial load
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Problem toggle handler
  const handleProblemToggle = useCallback((problem: Problem) => {
    const isSelected = selectedProblems.find((p) => p.problemNumber === problem.problemNumber);

    if (isSelected) {
      const updated = selectedProblems.filter((p) => p.problemNumber !== problem.problemNumber);
      setSelectedProblems(updated);
      setFormData((prev) => ({ 
        ...prev, 
        problemIds: updated.map((p) => p.problemNumber) 
      }));
    } else {
      const updated = [...selectedProblems, problem];
      setSelectedProblems(updated);
      setFormData((prev) => ({ 
        ...prev, 
        problemIds: updated.map((p) => p.problemNumber) 
      }));
    }
  }, [selectedProblems]);

  // Rest of the component methods remain the same...
  // const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   if (!file.type.startsWith('image/')) {
  //     toast.error('Please select an image file');
  //     return;
  //   }

  //   setIsUploading(true);
  //   setUploadProgress(0);

  //   try {
  //     const imageKey = await ImageUploadService.uploadContestThumbnail(file, (progress) => {
  //       setUploadProgress(progress);
  //     });

  //     console.log("keyyyyyyyyyyyyyyyyyy",imageKey);
      

  //     const optimizedUrl = imageKitService.getProfileImageUrl(imageKey, 400, 200, { radius: "8" });

  //     setThumbnailImage(optimizedUrl);
  //     setFormData((prev) => ({ ...prev, thumbnail: imageKey }));

  //     toast.success('Contest thumbnail uploaded successfully!');
  //   } catch (error: any) {
  //     console.error('Upload failed:', error);
  //     toast.error(error.message || 'Failed to upload thumbnail');
  //   } finally {
  //     setIsUploading(false);
  //     setUploadProgress(0);
  //   }
  // };

  
  const addCoinReward = () => {
    const newRank = coinRewards.length + 1;
    const newRewards = [...coinRewards, { rank: newRank, coins: 100 }];
    setCoinRewards(newRewards);
    setFormData((prev) => ({ ...prev, coinRewards: newRewards }));
  };

  const removeCoinReward = (index: number) => {
    if (coinRewards.length <= 1) {
      toast.error('At least one reward must be defined');
      return;
    }
    const newRewards = coinRewards.filter((_, i) => i !== index);
    setCoinRewards(newRewards);
    setFormData((prev) => ({ ...prev, coinRewards: newRewards }));
  };

  const updateCoinReward = (index: number, field: 'rank' | 'coins', value: number) => {
    const newRewards = coinRewards.map((reward, i) =>
      i === index ? { ...reward, [field]: value } : reward
    );
    setCoinRewards(newRewards);
    setFormData((prev) => ({ ...prev, coinRewards: newRewards }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Date | null,
    field: keyof ContestFormData
  ) => {
    if (e instanceof Date) {
      setFormData((prev) => ({ ...prev, [field]: e }));
    } else if (e && 'target' in e) {
      const value = e.target.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleNext = () => {
    const tabs = ['basic', 'problems', 'settings', 'rewards'];
    const currentIndex = tabs.indexOf(activeTab);
    const errors = validateForm(formData, activeTab);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix errors in the current tab before proceeding.');
      return;
    }

    setFormErrors({});
    setActiveTab(tabs[currentIndex + 1]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm(formData, 'all');

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Please fix all errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const contestData = {
        ...formData,
        problemIds: selectedProblems.map((p) => p.id),
        coinRewards: coinRewards,
      };

      await httpClient.post('/admin/contests/create', contestData);

      toast.success('Contest created successfully!');
      navigate('/admin/contests');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create contest');
      console.error('Error creating contest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Calendar },
    { id: 'problems', label: 'Problems', icon: Users },
    { id: 'settings', label: 'Settings', icon: Clock },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100">
        <AdminPanel />
      </div>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Contest</h1>
            <p className="mt-2 text-gray-600">Set up a new coding contest for participants</p>
          </div>

          <form onSubmit={onSubmit}>
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {/* Basic Information Tab - Keep existing implementation */}
              {activeTab === 'basic' && (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Contest Details</h3>
                    <p className="text-sm text-gray-500 mt-1">Provide basic information about your contest</p>
                  </div>
                  <div className="px-6 py-4 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Contest Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange(e, 'title')}
                        placeholder="Enter contest title"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.title && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.title}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange(e, 'description')}
                        placeholder="Describe your contest..."
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                          formErrors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.description && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.description}
                        </p>
                      )}
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="space-y-2">
                      <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                        Contest Thumbnail
                      </label>
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              id="thumbnail"
                              type="file"
                              accept="image/*"
                              onChange={handleThumbnailUpload}
                              disabled={isUploading}
                              className="hidden"
                            />
                            <label
                              htmlFor="thumbnail"
                              className={`cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors ${
                                isUploading
                                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              {isUploading ? (
                                <div className="text-center">
                                  <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                        {thumbnailImage && (
                          <div className="relative">
                            <img
                              src={thumbnailImage}
                              alt="Contest thumbnail"
                              className="w-32 h-20 object-cover rounded-md border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setThumbnailImage('');
                                setFormData((prev) => ({ ...prev, thumbnail: '' }));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Problems Selection Tab - Updated with pagination */}
              {activeTab === 'problems' && (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Select Problems</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose problems for this contest ({totalItems} problems available)
                    </p>
                  </div>
                  <div className="px-6 py-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search problems by name or number..."
                        value={problemSearch}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Selected Problems */}
                    {selectedProblems.length > 0 && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Selected Problems ({selectedProblems.length})
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProblems.map((problem) => (
                            <div
                              key={problem.problemNumber}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200"
                            >
                              <span>#{problem.problemNumber}</span>
                              <span>{problem.title}</span>
                              <button
                                type="button"
                                onClick={() => handleProblemToggle(problem)}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Problems List */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">
                          Available Problems (Page {currentPage} of {totalPages})
                        </label>
                      </div>
                      
                      {loadingProblems ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                          <span className="ml-2 text-gray-600">Loading problems...</span>
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                          {problems.map((problem) => {
                            const isSelected = selectedProblems.find((p) => p.problemNumber === problem.problemNumber);
                            return (
                              <div
                                key={problem.problemNumber}
                                className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                                  isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => handleProblemToggle(problem)}
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    checked={!!isSelected}
                                    onChange={() => handleProblemToggle(problem)}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                                  />
                                  {isSelected && (
                                    <CheckCircle className="absolute -top-1 -right-1 h-3 w-3 text-blue-600" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">#{problem.problemNumber}</span>
                                    <span className="text-gray-700">{problem.title}</span>
                                    <span
                                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                                        problem.difficulty
                                      )}`}
                                    >
                                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {problems.length === 0 && !loadingProblems && (
                            <div className="text-center py-8 text-gray-500">
                              No problems found matching your search
                            </div>
                          )}
                        </div>
                      )}

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
                          <div className="flex items-center text-sm text-gray-700">
                            <span>
                              Showing {Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems)} to{' '}
                              {Math.min(itemsPerPage * currentPage, totalItems)} of {totalItems} problems
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Previous
                            </button>

                            {generatePageNumbers().map((page) => (
                              <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 text-sm rounded-md ${
                                  currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {page}
                              </button>
                            ))}

                            <button
                              type="button"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {formErrors.problemIds && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {formErrors.problemIds}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Settings Tab - Keep existing implementation */}
              {/* Rewards Tab - Keep existing implementation */}
              {/* ... (other tabs remain the same) ... */}




               {/* Settings Tab */}
             {activeTab === 'settings' && (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Contest Settings</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Configure timing and attempt settings for your contest
                    </p>
                  </div>
                  <div className="px-6 py-4 space-y-6">
                     {/* Date Time Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                           Registration Deadline *
                        </label>
                         <DatePicker
                           selected={formData.registrationDeadline}
                           onChange={(date) => handleInputChange(date, 'registrationDeadline')}
                           showTimeSelect
                          dateFormat="MMM d, yyyy h:mm aa"
                           className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors.registrationDeadline ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholderText="Select registration deadline"
                            minDate={new Date()}
                          />
                          {formErrors.registrationDeadline && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {formErrors.registrationDeadline}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Contest Start Time *
                          </label>
                          <DatePicker
                            selected={formData.startTime}
                            onChange={(date) => handleInputChange(date, 'startTime')}
                            showTimeSelect
                            dateFormat="MMM d, yyyy h:mm aa"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors.startTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholderText="Select start time"
                            minDate={new Date()}
                          />
                          {formErrors.startTime && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {formErrors.startTime}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Contest End Time *
                          </label>
                          <DatePicker
                            selected={formData.endTime}
                            onChange={(date) => handleInputChange(date, 'endTime')}
                            showTimeSelect
                            dateFormat="MMM d, yyyy h:mm aa"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors.endTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholderText="Select end time"
                            minDate={formData.startTime || new Date()}
                          />
                          {formErrors.endTime && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {formErrors.endTime}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Numeric Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="problemTimeLimit" className="block text-sm font-medium text-gray-700">
                            Problem Time Limit (minutes) *
                          </label>
                          <input
                            id="problemTimeLimit"
                            type="number"
                            min="1"
                            max="300"
                            value={formData.problemTimeLimit}
                            onChange={(e) => handleInputChange(e, 'problemTimeLimit')}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors.problemTimeLimit ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.problemTimeLimit && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {formErrors.problemTimeLimit}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700">
                            Max Attempts *
                          </label>
                          <input
                            id="maxAttempts"
                            type="number"
                            min="1"
                            max="10"
                            value={formData.maxAttempts}
                            onChange={(e) => handleInputChange(e, 'maxAttempts')}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors.maxAttempts ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.maxAttempts && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {formErrors.maxAttempts}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="wrongSubmissionPenalty" className="block text-sm font-medium text-gray-700">
                            Wrong Submission Penalty (points) *
                          </label>
                          <input
                            id="wrongSubmissionPenalty"
                            type="number"
                            min="0"
                            max="1000"
                            value={formData.wrongSubmissionPenalty}
                            onChange={(e) => handleInputChange(e, 'wrongSubmissionPenalty')}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              formErrors.wrongSubmissionPenalty ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.wrongSubmissionPenalty && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              {formErrors.wrongSubmissionPenalty}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rewards Tab */}
                {activeTab === 'rewards' && (
                  <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Coin Rewards</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Set up coin rewards for different ranks
                      </p>
                    </div>
                    <div className="px-6 py-4 space-y-4">
                      {coinRewards.map((reward, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <span className="font-medium text-gray-700">Rank</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            value={reward.rank}
                            onChange={(e) => updateCoinReward(index, 'rank', parseInt(e.target.value) || 1)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="text-gray-600">gets</span>
                          <input
                            type="number"
                            min="0"
                            value={reward.coins}
                            onChange={(e) => updateCoinReward(index, 'coins', parseInt(e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <span className="text-gray-600">coins</span>
                          <button
                            type="button"
                            onClick={() => removeCoinReward(index)}
                            disabled={coinRewards.length <= 1}
                            className={`p-1 rounded-md transition-colors ${
                              coinRewards.length <= 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                            }`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addCoinReward}
                        className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        Add Reward Rank
                      </button>

                      {formErrors.coinRewards && (
                        <p className="text-sm text-red-500 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {formErrors.coinRewards}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              {/* </div> */}

            </div>

            {/* Action Buttons - Keep existing implementation */}
            <div className="flex justify-between pt-6 bg-white px-6 py-4 border-t border-gray-200 rounded-b-lg">
              <button
                type="button"
                onClick={() => navigate('/admin/contests')}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>

              <div className="flex space-x-4">
                {activeTab !== 'basic' && (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = ['basic', 'problems', 'settings', 'rewards'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                )}

                {activeTab !== 'rewards' ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedProblems.length === 0}
                    className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Contest...
                      </>
                    ) : (
                      'Create Contest'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateContestPage;
