




import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Settings, Users, BookOpen, BarChart3, FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


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



// Problem Listing Content Component (used internally by AdminPanel)
export const ProblemListing: React.FC<{ problems: Problem[] }> = ({ problems }) => {



    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const itemsPerPage = 8;

    const filteredProblems = useMemo(() => {
        return problems.filter(problem => {
            const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                problem.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
            const matchesStatus = statusFilter === 'All' || problem.status === statusFilter;
            return matchesSearch && matchesDifficulty && matchesStatus;
        });
    }, [problems, searchTerm, difficultyFilter, statusFilter]);

    const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProblems = filteredProblems.slice(startIndex, startIndex + itemsPerPage);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-600 bg-green-100';
            case 'Medium': return 'text-yellow-600 bg-yellow-100';
            case 'Hard': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'text-green-600 bg-green-100';
            case 'Draft': return 'text-blue-600 bg-blue-100';
            case 'Archived': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Problem Management</h1>
                    <p className="text-gray-600 mt-1">Manage coding problems and challenges</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                onClick={()=>navigate("/admin/problems/addProblem")}
                >
                    <Plus size={16} />
                    Add Problem
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search problems by title or category..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={difficultyFilter}
                            onChange={(e) => {
                                setDifficultyFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Archived">Archived</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredProblems.length} of {problems.length} problems
                </div>
            </div>

            {/* Problems Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Problem</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Difficulty</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Acceptance</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Submissions</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Created</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProblems.map((problem) => (
                                <tr key={problem.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div>
                                            <div className="font-semibold text-gray-900">{problem.title}</div>
                                            <div className="text-sm text-gray-500">ID: {problem.id}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-700">{problem.category}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <span className="text-gray-900 font-medium">{problem.acceptance}%</span>
                                            <div className="ml-3 w-16 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${problem.acceptance}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-700">{problem.submissions.toLocaleString()}</td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(problem.status)}`}>
                                            {problem.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{problem.createdAt}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProblems.length)} of {filteredProblems.length} results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                                    if (pageNum > totalPages) return null;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};