'use client';
// app/(dashboard)/learn/page.js

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Volume2, ChevronRight, ChevronLeft, Code, Loader2, ClipboardList } from 'lucide-react';
import { TOPIC_COLORS } from '@/lib/constants';
import { useProfile } from '@/hooks/useProfile';

function LearnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query        = searchParams.get('q') || '';
  const topic        = searchParams.get('topic') || 'programming';
  const { profile, loading: profileLoading } = useProfile();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: query
        ? `I'll explain: **${query}**\n\nLet me break this down step by step for you.`
        : "Welcome to your learning session! Ask me anything about this topic and I'll explain it clearly, step by step.",
    },
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-fetch answer for initial query
  useEffect(() => {
    if (query) {
      fetchAnswer(query, []);
    }
  }, []);

  const fetchAnswer = async (userMessage, history) => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          topic,
          history,
          adhd_mode: profile?.adhd_mode || false,
        }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const userMsg  = input.trim();
    const newMsgs  = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMsgs);
    setInput('');
    fetchAnswer(userMsg, newMsgs.slice(-10));
  };

  const speakText = (text) => {
    if (profileLoading) {
      console.warn('Profile still loading, cannot play TTS');
      return;
    }
    
    console.log('TTS Enabled:', profile.tts_enabled);
    
    if (!profile.tts_enabled || typeof window === 'undefined') {
      console.log('TTS disabled or window unavailable');
      return;
    }
    
    if (!window.speechSynthesis) {
      console.error('Speech Synthesis API not available');
      return;
    }
    
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
      u.rate = 0.9;
      setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setSpeaking(false);
      };
      window.speechSynthesis.speak(u);
    } catch (error) {
      console.error('Error in speakText:', error);
      setSpeaking(false);
    }
  };

  // Get topic-specific colors for neurodivergent-friendly UI
  const topicColor = TOPIC_COLORS[topic] || TOPIC_COLORS.programming;

  return (
    <div className="flex flex-col h-screen max-h-screen" style={{ background: topicColor.bg }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: `${topicColor.primary}30` }}>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.1em]" style={{ color: topicColor.primary }}>Learning</span>
          <ChevronRight size={10} style={{ color: topicColor.primary }} />
          <span className="text-xs uppercase tracking-[0.1em] capitalize font-medium" style={{ color: topicColor.accent }}>{topic}</span>
        </div>
        <div className="flex items-center gap-3">
          {speaking && (
            <div className="flex items-center gap-1.5 text-xs speaking-pulse" style={{ color: topicColor.primary }}>
              <Volume2 size={12} /> Speaking
            </div>
          )}
          <button
            onClick={() => router.push(`/quiz?topic=${encodeURIComponent(topic)}&q=${encodeURIComponent(query || topic)}`)}            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.7rem] uppercase tracking-[0.08em] font-medium transition-all duration-150"
            style={{
              background: `${topicColor.primary}15`,
              color: topicColor.primary,
              border: `1px solid ${topicColor.primary}30`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${topicColor.primary}25`;
              e.currentTarget.style.color = topicColor.accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `${topicColor.primary}15`;
              e.currentTarget.style.color = topicColor.primary;
            }}
          >
            <ClipboardList size={11} /> Take Quiz
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              onClick={() => msg.role === 'assistant' && speakText(msg.content)}
              className={`max-w-[80%] rounded-xl px-5 py-4 text-sm leading-relaxed font-light ${
                msg.role === 'user'
                  ? 'border text-aalim-text ml-12'
                  : 'border text-aalim-sub cursor-pointer'
              }`}
              style={{
                background: msg.role === 'user' ? topicColor.lighter : `${topicColor.lighter}`,
                borderColor: msg.role === 'user' ? `${topicColor.primary}40` : `${topicColor.primary}30`,
              }}
            >
              {/* Render bold markdown + important highlights */}
              <div dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\[IMPORTANT\](.*?)\[\/IMPORTANT\]/g, `<mark style="background:${topicColor.primary}30;color:#f0e8d0;padding:0.2rem 0.4rem;border-radius:3px;font-weight:500;border-left:2px solid ${topicColor.primary};display:inline-block;padding-left:0.5rem">$1</mark>`)
                  .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${topicColor.primary};font-weight:600">$1</strong>`)
                  .replace(/\n/g, '<br/>')
                  .replace(/`(.*?)`/g, `<code style="background:${topicColor.lighter};color:${topicColor.primary};padding:0.1rem 0.35rem;border-radius:3px;font-family:monospace;font-size:0.85em">$1</code>`)
              }} />

              {msg.role === 'assistant' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(msg.content);
                  }}
                  className="mt-3 flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.08em] transition-colors font-medium"
                  style={{ color: topicColor.primary }}
                  onMouseEnter={e => e.currentTarget.style.color = topicColor.accent}
                  onMouseLeave={e => e.currentTarget.style.color = topicColor.primary}
                >
                  <Volume2 size={11} /> {speaking ? 'Reading...' : 'Read aloud'}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-xl px-5 py-4 border" style={{ background: '#181818', borderColor: 'rgba(255,255,255,0.07)' }}>
              <Loader2 size={16} className="animate-spin" style={{ color: '#c9a84c' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-6 pb-6 pt-2">
        <div
          className="flex items-end gap-3 rounded-xl px-4 py-4 transition-all duration-200"
          style={{ background: topicColor.lighter, border: `1px solid ${topicColor.primary}40` }}
          onFocusCapture={e => e.currentTarget.style.borderColor = `${topicColor.primary}60`}
          onBlurCapture={e  => e.currentTarget.style.borderColor = `${topicColor.primary}40`}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask a follow-up question…"
            className="flex-1 bg-transparent border-none outline-none font-light leading-relaxed"
            style={{ color: '#f0e8d0', fontSize: '0.9rem' }}
          />
          <button
            onClick={handleSend} disabled={loading || !input.trim()}
            className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: input.trim() && !loading ? `linear-gradient(135deg,${topicColor.primary},${topicColor.accent})` : 'rgba(255,255,255,0.06)',
              color: input.trim() && !loading ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
            }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <ArrowRight size={13} />}
          </button>
        </div>
        <p className="text-center text-[0.6rem] mt-2" style={{ color: topicColor.primary }}>
          AALIM can make mistakes. Verify important information independently.
        </p>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-aalim-sub">Loading…</div>}>
      <LearnContent />
    </Suspense>
  );
}
