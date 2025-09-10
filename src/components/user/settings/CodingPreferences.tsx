

import React, { useState } from 'react';
import { Save } from 'lucide-react';

const CodingPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState({
    theme: 'vs-dark',
    fontSize: 14,
    tabSize: 4,
    wordWrap: true,
    autoSave: true,
    defaultLanguage: 'javascript',
    executionTimeout: 30,
    showLineNumbers: true,
    fontFamily: 'Fira Code',
  });

  const [isLoading, setIsLoading] = useState(false);

  const themes = [
    { value: 'vs', label: 'Light' },
    { value: 'vs-dark', label: 'Dark' },
    { value: 'hc-black', label: 'High Contrast Dark' },
  ];

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' },
    { value: 'typescript', label: 'TypeScript' },
  ];

  const fontFamilies = [
    'Fira Code',
    'Monaco',
    'Consolas',
    'Ubuntu Mono',
    'Source Code Pro',
  ];

  const handleChange = (name: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving coding preferences:', preferences);
      // await saveCodingPreferences(preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Coding Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Editor Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Editor Theme
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {themes.map(theme => (
                <option key={theme.value} value={theme.value}>{theme.label}</option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size: {preferences.fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={preferences.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Family
            </label>
            <select
              value={preferences.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Tab Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tab Size: {preferences.tabSize}
            </label>
            <input
              type="range"
              min="2"
              max="8"
              value={preferences.tabSize}
              onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Default Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Language
            </label>
            <select
              value={preferences.defaultLanguage}
              onChange={(e) => handleChange('defaultLanguage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Execution Timeout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Execution Timeout: {preferences.executionTimeout}s
            </label>
            <input
              type="range"
              min="5"
              max="60"
              value={preferences.executionTimeout}
              onChange={(e) => handleChange('executionTimeout', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Toggle Options */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Editor Options</h3>
          
          <div className="space-y-3">
            {[
              { key: 'wordWrap', label: 'Word Wrap', description: 'Wrap lines that exceed the viewport width' },
              { key: 'autoSave', label: 'Auto Save', description: 'Automatically save your code as you type' },
              { key: 'showLineNumbers', label: 'Show Line Numbers', description: 'Display line numbers in the editor' },
            ].map(option => (
              <div key={option.key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[option.key as keyof typeof preferences] as boolean}
                    onChange={(e) => handleChange(option.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingPreferences;
