'use client';
// app/(dashboard)/learn/page.js

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Volume2, ChevronRight, ChevronLeft, Code, Loader2 } from 'lucide-react';

function LearnContent() {
  const searchParams = useSearchParams();
  const query        = searchParams.get('q') || '';
  const topic        = searchParams.get('topic') || 'programming';

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
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
    u.rate = 0.9;
    setSpeaking(true);
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <span className="text-xs uppercase tracking-[0.1em]" style={{ color: '#3a3428' }}>Learning</span>
        <ChevronRight size={10} style={{ color: '#3a3428' }} />
        <span className="text-xs uppercase tracking-[0.1em] text-gold capitalize">{topic}</span>
        {speaking && (
          <div className="ml-auto flex items-center gap-1.5 text-gold text-xs speaking-pulse">
            <Volume2 size={12} /> Speaking
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-xl px-5 py-4 text-sm leading-relaxed font-light ${
                msg.role === 'user'
                  ? 'bg-gold/10 border border-gold/20 text-aalim-text ml-12'
                  : 'border text-aalim-sub'
              }`}
              style={{
                background: msg.role === 'user' ? 'rgba(201,168,76,0.08)' : '#181818',
                borderColor: msg.role === 'user' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.07)',
              }}
            >
              {/* Render bold markdown */}
              <div dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#c9a84c;font-weight:600">$1</strong>')
                  .replace(/\n/g, '<br/>')
                  .replace(/`(.*?)`/g, '<code style="background:rgba(201,168,76,0.1);color:#c9a84c;padding:0.1rem 0.35rem;border-radius:3px;font-family:monospace;font-size:0.85em">$1</code>')
              }} />

              {msg.role === 'assistant' && (
                <button
                  onClick={() => speakText(msg.content)}
                  className="mt-3 flex items-center gap-1.5 text-[0.68rem] uppercase tracking-[0.08em] transition-colors font-medium"
                  style={{ color: '#3a3428' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9a84c'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3a3428'}
                >
                  <Volume2 size={11} /> Read aloud
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
          style={{ background: '#181818', border: '1px solid rgba(255,255,255,0.07)' }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'}
          onBlurCapture={e  => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
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
              background: input.trim() && !loading ? 'linear-gradient(135deg,#c9a84c,#e2c46a)' : 'rgba(255,255,255,0.06)',
              color: input.trim() && !loading ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
            }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <ArrowRight size={13} />}
          </button>
        </div>
        <p className="text-center text-[0.6rem] mt-2" style={{ color: '#3a3428' }}>
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
