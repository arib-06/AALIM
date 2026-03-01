'use client';
// app/(dashboard)/layout.js
import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
// import { getSupabase } from '@/lib/supabase'; // DISABLED FOR TESTING
import { speak } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  // const supabase = getSupabase(); // DISABLED FOR TESTING
  const [user, setUser] = useState(null);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [speakPosition, setSpeakPosition] = useState({ x: 0, y: 0 });
  const [showSpeakBtn, setShowSpeakBtn] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [colorBlindMode, setColorBlindMode] = useState('none');
  const [greyscaleMode, setGreyscaleMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [largeTargets, setLargeTargets] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const loadDyslexicFont = async () => {
    try {
      // SUPABASE DISABLED - Using localStorage only for testing
      setUser(null);
      
      let shouldEnableDyslexic = false;
      let ttsStatus = true;
      let colorBlindStatus = 'none';
      let greyscaleStatus = false;
      let highContrastStatus = false;
      let focusModeStatus = false;
      let largeTargetsStatus = false;
      let reduceMotionStatus = false;
      
      // Load from localStorage only
      const stored = localStorage.getItem('aalim_prefs');
      if (stored) {
        const prefs = JSON.parse(stored);
        if (prefs.dyslexia_font) shouldEnableDyslexic = true;
        if (prefs.tts_enabled !== undefined) ttsStatus = prefs.tts_enabled;
        if (prefs.color_blind_mode) colorBlindStatus = prefs.color_blind_mode;
        if (prefs.greyscale !== undefined) greyscaleStatus = prefs.greyscale;
        if (prefs.high_contrast !== undefined) highContrastStatus = prefs.high_contrast;
        if (prefs.focus_mode !== undefined) focusModeStatus = prefs.focus_mode;
        if (prefs.large_targets !== undefined) largeTargetsStatus = prefs.large_targets;
        if (prefs.reduce_motion !== undefined) reduceMotionStatus = prefs.reduce_motion;
      }
      
      // Apply all settings
      if (shouldEnableDyslexic) {
        setDyslexicFont(true);
        document.body.classList.add('dyslexic-font');
      } else {
        setDyslexicFont(false);
        document.body.classList.remove('dyslexic-font');
      }
      
      // Apply new accessibility features
      document.body.classList.toggle('high-contrast', highContrastStatus);
      document.body.classList.toggle('focus-mode', focusModeStatus);
      document.body.classList.toggle('large-targets', largeTargetsStatus);
      document.body.classList.toggle('reduce-motion', reduceMotionStatus);
      
      setTtsEnabled(ttsStatus);
      setColorBlindMode(colorBlindStatus);
      setGreyscaleMode(greyscaleStatus);
      setHighContrast(highContrastStatus);
      setFocusMode(focusModeStatus);
      setLargeTargets(largeTargetsStatus);
      setReduceMotion(reduceMotionStatus);
      
      // Apply color blind and greyscale filters
      applyAccessibilityFilters(colorBlindStatus, greyscaleStatus);
    } catch (error) {
      console.log('Settings loaded from localStorage');
    }
  };

  const applyAccessibilityFilters = (colorBlind, greyscale) => {
    const root = document.documentElement;
    let filter = '';
    
    if (greyscale) {
      filter = 'saturate(0%)';
    } else if (colorBlind !== 'none') {
      // Color blind filters based on type
      switch (colorBlind) {
        case 'protanopia':
          // Red-blind filter
          filter = 'url(#protanopia-filter)';
          break;
        case 'deuteranopia':
          // Green-blind filter
          filter = 'url(#deuteranopia-filter)';
          break;
        case 'tritanopia':
          // Blue-yellow blind filter
          filter = 'url(#tritanopia-filter)';
          break;
        case 'monochromacy':
          // Complete color blindness
          filter = 'saturate(0%)';
          break;
        default:
          filter = 'none';
      }
    }
    
    root.style.filter = filter || 'none';
  };

  // Handle text selection for global TTS
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text.length > 0) {
        setSelectedText(text);
        
        // Get position of selection
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSpeakPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
        setShowSpeakBtn(true);
      } else {
        setShowSpeakBtn(false);
      }
    };

    const handleMouseUp = () => {
      setTimeout(handleTextSelection, 0);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    loadDyslexicFont();
    
    // Re-check when tab becomes visible (user returns from settings)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDyslexicFont();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []); // Removed supabase dependency

  const handleSpeak = () => {
    if (selectedText) {
      speak(selectedText, ttsEnabled);
      setShowSpeakBtn(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-aalim-bg">
      {/* SVG Filters for Color Blindness Simulation */}
      <svg style={{ display: 'none' }} width="0" height="0">
        <defs>
          {/* Protanopia (Red-blind) */}
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567 0.433 0.000 0 0
                      0.558 0.442 0.000 0 0
                      0.000 0.242 0.758 0 0
                      0.000 0.000 0.000 1 0"
            />
          </filter>
          {/* Deuteranopia (Green-blind) */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625 0.375 0.000 0 0
                      0.700 0.300 0.000 0 0
                      0.000 0.300 0.700 0 0
                      0.000 0.000 0.000 1 0"
            />
          </filter>
          {/* Tritanopia (Blue-yellow blind) */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.950 0.050 0.000 0 0
                      0.000 0.433 0.567 0 0
                      0.000 0.475 0.525 0 0
                      0.000 0.000 0.000 1 0"
            />
          </filter>
        </defs>
      </svg>

      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto min-h-screen relative">
        {children}
        
        {/* Global Text-to-Speech Button */}
        {showSpeakBtn && ttsEnabled && selectedText && (
          <button
            onClick={handleSpeak}
            className="fixed flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs uppercase tracking-[0.08em] transition-all duration-150 z-50"
            style={{
              left: `${speakPosition.x}px`,
              top: `${speakPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              background: 'linear-gradient(135deg, #c9a84c, #e2c46a)',
              color: '#0a0a0a',
              boxShadow: '0 8px 24px rgba(201, 168, 76, 0.3)',
              pointerEvents: 'auto',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translate(-50%, -100%) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(201, 168, 76, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translate(-50%, -100%)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(201, 168, 76, 0.3)';
            }}
          >
            <Volume2 size={13} />
            Speak
          </button>
        )}
      </main>
    </div>
  );
}
