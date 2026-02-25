'use client';
// app/(auth)/layout.js
import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { speak } from '@/lib/utils';

export default function AuthLayout({ children }) {
  const [selectedText, setSelectedText] = useState('');
  const [speakPosition, setSpeakPosition] = useState({ x: 0, y: 0 });
  const [showSpeakBtn, setShowSpeakBtn] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);

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

    // Load TTS setting from localStorage
    const stored = localStorage.getItem('aalim_prefs');
    if (stored) {
      const prefs = JSON.parse(stored);
      setTtsEnabled(prefs.tts_enabled !== false);
    }

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const handleSpeak = () => {
    if (selectedText) {
      speak(selectedText, ttsEnabled);
      setShowSpeakBtn(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 60%)' }}
    >
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
    </div>
  );
}
