// app/page.js  — Landing Page
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2 } from 'lucide-react';
import LandingButton from '@/components/LandingButton';
import { speak } from '@/lib/utils';

export default function LandingPage() {
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
    <main
      className="min-h-screen flex flex-col items-center justify-center px-8 py-12 relative"
      style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(201,168,76,0.1) 0%, transparent 60%)',
      }}
    >
      {/* Vertical gold line top */}
      <div className="w-px h-20 mb-10" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))' }} />

      <div className="text-center max-w-lg fade-up">
        {/* Logo */}
        <h1 className="gold-shimmer font-display font-bold leading-none" style={{ fontSize: 'clamp(4rem, 12vw, 6rem)' }}>
          AALIM
        </h1>

        {/* Full name */}
        <p className="font-display italic text-aalim-sub mt-2 tracking-widest" style={{ fontSize: '1.1rem' }}>
          Adaptive Assistive Learning Interface Model
        </p>

        {/* Letter breakdown */}
        <div className="flex items-center justify-center gap-3 mt-1">
          {['A', 'A', 'L', 'I', 'M'].map((l, i) => (
            <span key={i} className="text-xs text-aalim-muted tracking-[0.2em] font-medium">{l}</span>
          ))}
        </div>

        {/* Divider */}
        <div className="w-9 h-px mx-auto mt-8 mb-8 opacity-40" style={{ background: '#c9a84c' }} />

        {/* Tagline */}
        <p className="text-aalim-sub font-light leading-relaxed mb-10" style={{ fontSize: '0.95rem' }}>
          Intelligent, adaptive education built around you.
          No labels. No diagnosis. Just learning, your way.
        </p>

        {/* CTA */}
        <LandingButton />

        <p className="text-aalim-muted text-xs mt-5">
          No account?{' '}
          <Link href="/signup" className="text-gold hover:text-gold-hi transition-colors">
            Sign up free
          </Link>
        </p>
      </div>

      {/* Vertical gold line bottom */}
      <div className="w-px h-20 mt-10" style={{ background: 'linear-gradient(to top, transparent, rgba(201,168,76,0.5))' }} />

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
  );
}
