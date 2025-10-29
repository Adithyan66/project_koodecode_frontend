


import React from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';

interface EditorControlsProps {
    selectedLanguage: string;
    languages: { value: string; label: string }[];
    handleLanguageChange: (newLanguage: string) => void;
    resetCode: () => void;
    timer?: React.ReactNode;
}

const EditorControls: React.FC<EditorControlsProps> = ({ selectedLanguage, languages, handleLanguageChange, resetCode, timer }) => (
    
    <div className="bg-black border-b border-gray-700/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="relative group">
                <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="appearance-none bg-gray-800 text-white border border-gray-600 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 hover:border-gray-500 transition-all cursor-pointer"
                >
                    {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-300 transition-colors" />
            </div>
            {timer}
        </div>
        <button
            onClick={resetCode}
            className="group flex items-center space-x-1.5 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all text-xs font-medium"
            title="Reset Code"
        >
            <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            <span>Reset</span>
        </button>
    </div>
);
        
export default EditorControls;