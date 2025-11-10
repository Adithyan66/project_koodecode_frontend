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
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-gray-200">
      {/* Visual Accessibility */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <Eye className="text-gray-300" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-400 to-green-500">Visual Accessibility</h2>
            <p className="text-sm text-gray-400">Customize visual elements for better readability</p>
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
                  <label className="text-sm font-medium text-white">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-400">{option.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessibility[option.key as keyof typeof accessibility] as boolean}
                    onChange={(e) => handleChange(option.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="h-6 w-11 rounded-full bg-white/10 transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/40 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:border-white peer-checked:bg-green-500"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Font Size */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Base Font Size: {accessibility.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={accessibility.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>

          {/* Line Height */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Line Height: {accessibility.lineHeight}
            </label>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.1"
              value={accessibility.lineHeight}
              onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Letter Spacing: {accessibility.letterSpacing}px
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.5"
              value={accessibility.letterSpacing}
              onChange={(e) => handleChange('letterSpacing', parseFloat(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <Keyboard className="text-gray-300" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-400 to-green-500">Keyboard Navigation</h2>
            <p className="text-sm text-gray-400">Customize keyboard interaction settings</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'keyboardNavigation', label: 'Enable Keyboard Navigation', description: 'Navigate the site using only keyboard' },
            { key: 'focusIndicators', label: 'Enhanced Focus Indicators', description: 'Show clear visual indicators for focused elements' }
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
                  checked={accessibility[option.key as keyof typeof accessibility] as boolean}
                  onChange={(e) => handleChange(option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="h-6 w-11 rounded-full bg-white/10 transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/40 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:border-white peer-checked:bg-green-500"></div>
              </label>
            </div>
          ))}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
          <h3 className="mb-3 font-medium text-white">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div className="flex justify-between text-gray-200">
              <span>Navigate problems</span>
              <kbd className="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-gray-200">↑ ↓</kbd>
            </div>
            <div className="flex justify-between text-gray-200">
              <span>Submit solution</span>
              <kbd className="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-gray-200">Ctrl + Enter</kbd>
            </div>
            <div className="flex justify-between text-gray-200">
              <span>Open settings</span>
              <kbd className="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-gray-200">Ctrl + ,</kbd>
            </div>
            <div className="flex justify-between text-gray-200">
              <span>Search problems</span>
              <kbd className="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-gray-200">Ctrl + K</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Reader Support */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <Volume2 className="text-gray-300" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-lime-400 to-green-500">Screen Reader Support</h2>
            <p className="text-sm text-gray-400">Optimize for assistive technologies</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">
                Screen Reader Optimization
              </label>
              <p className="text-xs text-gray-400">Add extra context and descriptions for screen readers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={accessibility.screenReader}
                onChange={(e) => handleChange('screenReader', e.target.checked)}
                className="sr-only peer"
              />
              <div className="h-6 w-11 rounded-full bg-white/10 transition-all peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white/40 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:border-white peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white transition hover:border-white/40 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isLoading ? 'Saving...' : 'Save Accessibility Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
