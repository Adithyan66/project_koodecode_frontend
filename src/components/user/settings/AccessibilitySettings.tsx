import React, { useState } from 'react';
import { Save, Eye, Keyboard, Volume2 } from 'lucide-react';

const AccessibilitySettings: React.FC = () => {
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    colorBlindSupport: false,
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: string, value: any) => {
    setAccessibility(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving accessibility settings:', accessibility);
      // await saveAccessibilitySettings(accessibility);
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Accessibility */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Eye className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Visual Accessibility</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize visual elements for better readability</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Toggle Options */}
          <div className="space-y-4">
            {[
              { key: 'highContrast', label: 'High Contrast Mode', description: 'Increase contrast for better visibility' },
              { key: 'largeText', label: 'Large Text', description: 'Increase default text size across the platform' },
              { key: 'reducedMotion', label: 'Reduce Motion', description: 'Minimize animations and transitions' },
              { key: 'colorBlindSupport', label: 'Color Blind Support', description: 'Use patterns and symbols in addition to colors' }
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
                    checked={accessibility[option.key as keyof typeof accessibility] as boolean}
                    onChange={(e) => handleChange(option.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base Font Size: {accessibility.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={accessibility.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Line Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Line Height: {accessibility.lineHeight}
            </label>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.1"
              value={accessibility.lineHeight}
              onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Letter Spacing: {accessibility.letterSpacing}px
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={accessibility.letterSpacing}
              onChange={(e) => handleChange('letterSpacing', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Keyboard className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Keyboard Navigation</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize keyboard interaction settings</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'keyboardNavigation', label: 'Enable Keyboard Navigation', description: 'Navigate the site using only keyboard' },
            { key: 'focusIndicators', label: 'Enhanced Focus Indicators', description: 'Show clear visual indicators for focused elements' }
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
                  checked={accessibility[option.key as keyof typeof accessibility] as boolean}
                  onChange={(e) => handleChange(option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Navigate problems</span>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">↑ ↓</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Submit solution</span>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl + Enter</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Open settings</span>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl + ,</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Search problems</span>
              <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">Ctrl + K</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Reader Support */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Volume2 className="text-blue-600" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Screen Reader Support</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Optimize for assistive technologies</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Screen Reader Optimization
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add extra context and descriptions for screen readers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={accessibility.screenReader}
                onChange={(e) => handleChange('screenReader', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isLoading ? 'Saving...' : 'Save Accessibility Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
