import React from 'react';
import { RotateCcw } from 'lucide-react';

interface EditorControlsProps {
    selectedLanguage: string;
    languages: { value: string; label: string }[];
    handleLanguageChange: (newLanguage: string) => void;
    resetCode: () => void;
    timer?: React.ReactNode;
    disabled?: boolean;
    isCreator?: boolean; // New prop for room mode
}

const EditorControls: React.FC<EditorControlsProps> = ({ 
    selectedLanguage, 
    languages, 
    handleLanguageChange, 
    resetCode, 
    timer,
    disabled = false,
    isCreator = true
}) => (
    <div className="bg-black border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={disabled || !isCreator}
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
            </select>
            <button
                onClick={resetCode}
                disabled={disabled}
                className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reset Code"
            >
                <RotateCcw size={16} />
            </button>
        </div>
        {timer}
    </div>
);

export default EditorControls;
