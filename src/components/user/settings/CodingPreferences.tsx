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
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-gray-200">
      <div className="rounded-3xl border border-white/10 bg-black/65 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <h2 className="mb-6 text-xl font-semibold text-white">Coding Preferences</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Editor Theme */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Editor Theme
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
            >
              {themes.map(theme => (
                <option key={theme.value} value={theme.value}>{theme.label}</option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Font Size: {preferences.fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={preferences.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Font Family */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Font Family
            </label>
            <select
              value={preferences.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Tab Size */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Tab Size: {preferences.tabSize}
            </label>
            <input
              type="range"
              min="2"
              max="8"
              value={preferences.tabSize}
              onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Default Language */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Default Language
            </label>
            <select
              value={preferences.defaultLanguage}
              onChange={(e) => handleChange('defaultLanguage', e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Execution Timeout */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Execution Timeout: {preferences.executionTimeout}s
            </label>
            <input
              type="range"
              min="5"
              max="60"
              value={preferences.executionTimeout}
              onChange={(e) => handleChange('executionTimeout', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        {/* Toggle Options */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium text-white">Editor Options</h3>
          
          <div className="space-y-3">
            {[
              { key: 'wordWrap', label: 'Word Wrap', description: 'Wrap lines that exceed the viewport width' },
              { key: 'autoSave', label: 'Auto Save', description: 'Automatically save your code as you type' },
              { key: 'showLineNumbers', label: 'Show Line Numbers', description: 'Display line numbers in the editor' },
            ].map(option => (
              <div key={option.key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-400">{option.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences[option.key as keyof typeof preferences] as boolean}
                    onChange={(e) => handleChange(option.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-11 rounded-full bg-white/10 transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/40 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:border-white peer-checked:bg-blue-500"></div>
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
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white transition hover:border-white/40 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
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
