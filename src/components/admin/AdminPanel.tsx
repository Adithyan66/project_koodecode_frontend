import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Settings, Users, BookOpen, BarChart3, FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { ProblemListing } from "./problems/ProblemListing";
import { useNavigate } from "react-router-dom";


interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

interface AdminPanelProps {
    // children: React.ReactNode;

}


// Sidebar Item Component
const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);



// Admin Panel Layout Component
export const AdminPanel: React.FC<AdminPanelProps> = () => {


    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState('problems');

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={20} /> },
        { id: 'problems', label: 'Problems', icon: <BookOpen size={20} /> },
        { id: 'contests', label: 'contests', icon: <Users size={20} /> },
        { id: 'submissions', label: 'Submissions', icon: <FileText size={20} /> },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    ];


    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 shadow-xl flex-shrink-0">
                <div className="p-6">
                    <div className="text-white text-xl font-bold">KoodeCode Admin</div>
                    <div className="text-gray-400 text-sm mt-1">Management Portal</div>
                </div>
                <nav className="px-4 space-y-2">
                    {sidebarItems.map((item) => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeSection === item.id}
                            onClick={() => {
                                setActiveSection(item.id)
                                navigate(`/admin/${item.id}`)
                            }}
                        />
                    ))}
                </nav>
            </div>
        </div>
    );
};