'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Award, RotateCcw, Loader2 } from 'lucide-react';
import QuizCard from '@/components/QuizCard';
import { TEST_BANK, TOPIC_COLORS } from '@/lib/constants';
import { useProfile } from '@/hooks/useProfile';

export default function QuizPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || 'programming';
  const query = searchParams.get('q') || ''; // Specific subject being quizzed on
  const { profile, loading: profileLoading } = useProfile();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizzes, setQuizzes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizSource, setQuizSource] = useState(''); // 'dynamic' or 'static'

  // Fetch dynamic quiz questions from API
  useEffect(() => {
    if (profileLoading) return; // Wait for profile to load
    
    const fetchQuiz = async () => {
      try {
        const res = await fetch('/api/quiz-generator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            topic,
            query: query || topic, // Use specific subject if available
            adhd_mode: profile?.adhd_mode || false,
          }),
        });
        const data = await res.json();
        setQuizzes(data.questions || TEST_BANK[topic] || TEST_BANK.programming);
        setQuizSource(data.source || 'static');
      } catch (err) {
        console.error('Failed to fetch quiz:', err);
        // Fallback to static questions
        setQuizzes(TEST_BANK[topic] || TEST_BANK.programming);
        setQuizSource('static');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [topic, query, profile?.adhd_mode, profileLoading]);

  // Get quizzes for the topic
  const topicQuizzes = quizzes || [];
  const totalQuestions = topicQuizzes.length;
  const correctCount = Object.entries(answers).filter(
    ([idx, ans]) => ans === topicQuizzes[parseInt(idx)]?.correct
  ).length;

  const handleAnswer = (selectedIdx) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: selectedIdx }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setAnswers({});
    setShowResults(false);
  };

  const currentQuestion = topicQuizzes[currentIdx];
  const isAnswered = answers[currentIdx] !== undefined;
  const isCorrect = answers[currentIdx] === currentQuestion?.correct;
  
  // Get topic-specific colors for neurodivergent-friendly UI
  const topicColor = TOPIC_COLORS[topic] || TOPIC_COLORS.programming;

  // Loading state while fetching quiz
  if (loading) {
    return (
      <div className="max-w-[680px] mx-auto px-8 flex flex-col items-center justify-center min-h-screen" style={{ background: topicColor.bg }}>
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mb-4 mx-auto" style={{ color: topicColor.primary }} />
          <h2 className="text-xl font-medium text-aalim-text mb-2">Generating Quiz</h2>
          <p className="text-aalim-sub font-light text-sm">Preparing questions for {query || topic}...</p>
          {quizSource === 'dynamic' && (
            <p className="text-[0.75rem] mt-3" style={{ color: topicColor.primary }}>
              ✨ Using AI-generated questions
            </p>
          )}
          {profile?.adhd_mode && (
            <p className="text-[0.75rem] mt-2" style={{ color: topicColor.accent }}>
              🧠 ADHD-Friendly Mode: Fewer questions, simpler language
            </p>
          )}
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 70;

    return (
      <div className="max-w-[680px] mx-auto px-8 flex flex-col items-center justify-center min-h-screen py-12" style={{ background: topicColor.bg }}>
        <div className="text-center w-full max-w-md">
          {/* Score circle */}
          <div
            className="w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center font-display text-5xl font-semibold"
            style={{
              background: passed ? `${topicColor.primary}30` : 'rgba(239,68,68,0.1)',
              color: passed ? topicColor.primary : '#ef4444',
              border: passed ? `2px solid ${topicColor.primary}` : '2px solid #ef4444',
            }}
          >
            {percentage}%
          </div>

          <h2 className="text-2xl font-semibold text-aalim-text mb-2">
            {passed ? '🎉 Great Job!' : 'Keep Learning!'}
          </h2>
          <p className="text-aalim-sub mb-6 font-light">
            You answered <strong>{correctCount}</strong> out of <strong>{totalQuestions}</strong> correctly.
          </p>

          {!passed && (
            <p className="text-sm mb-8 px-4 py-3 rounded-lg" style={{ color: `${topicColor.accent}CC`, background: `${topicColor.primary}15` }}>
              Review the learning content and try again to improve your score.
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 flex-col">
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-lg font-medium text-sm transition-all duration-150 uppercase tracking-[0.08em] flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg,${topicColor.primary},${topicColor.accent})`,
                color: '#0a0a0a',
              }}
            >
              <RotateCcw size={14} /> Retake Quiz
            </button>
            <a
              href={`/learn?q=${encodeURIComponent(topic)}`}
              className="w-full py-3 rounded-lg font-medium text-sm transition-all duration-150 uppercase tracking-[0.08em] text-center"
              style={{
                background: topicColor.lighter,
                color: topicColor.primary,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${topicColor.primary}20`; e.currentTarget.style.color = topicColor.accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = topicColor.lighter; e.currentTarget.style.color = topicColor.primary; }}
            >
              Back to Learning
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto px-8 flex flex-col min-h-screen py-8" style={{ background: topicColor.bg }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.1em]" style={{ color: topicColor.primary }}>Quiz</span>
            <ChevronRight size={10} style={{ color: topicColor.primary }} />
            <span className="text-xs uppercase tracking-[0.1em] capitalize font-medium" style={{ color: topicColor.accent }}>{topic}</span>
            {quizSource === 'dynamic' && (
              <span className="ml-2 text-[0.65rem] uppercase tracking-[0.08em] px-2 py-1 rounded-full" style={{ background: `${topicColor.primary}20`, color: topicColor.primary }}>
                ✨ AI Generated
              </span>
            )}
            {profile?.adhd_mode && (
              <span className="ml-2 text-[0.65rem] uppercase tracking-[0.08em] px-2 py-1 rounded-full" style={{ background: `${topicColor.accent}20`, color: topicColor.accent }}>
                🧠 ADHD-Friendly
              </span>
            )}
          </div>
          <span className="text-xs font-medium" style={{ color: topicColor.primary }}>
            {currentIdx + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: topicColor.lighter }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((currentIdx + 1) / totalQuestions) * 100}%`,
              background: `linear-gradient(90deg,${topicColor.primary},${topicColor.accent})`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1">
        {currentQuestion && (
          <QuizCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            correct={currentQuestion.correct}
            onAnswer={handleAnswer}
            answered={isAnswered}
            isCorrect={isCorrect}
            topicColor={topicColor}
          />
        )}
      </div>

      {/* Navigation and explanation */}
      {isAnswered && currentQuestion?.explanation && (
        <div
          className="mb-6 p-4 rounded-lg text-sm font-light"
          style={{
            background: topicColor.lighter,
            borderLeft: `2px solid ${topicColor.primary}`,
            color: '#d4c5a9',
          }}
        >
          <strong className="block mb-2" style={{ color: topicColor.primary }}>💡 Explanation:</strong>
          {currentQuestion.explanation}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex-1 py-3 rounded-lg font-medium text-sm transition-all duration-150 uppercase tracking-[0.08em] flex items-center justify-center gap-2"
          style={{
            background: currentIdx === 0 ? topicColor.lighter : `${topicColor.primary}20`,
            color: currentIdx === 0 ? topicColor.primary : topicColor.accent,
            cursor: currentIdx === 0 ? 'default' : 'pointer',
          }}
        >
          <ChevronLeft size={14} /> Prev
        </button>

        {isAnswered && (
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-lg font-medium text-sm transition-all duration-150 uppercase tracking-[0.08em] flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg,${topicColor.primary},${topicColor.accent})`,
              color: '#0a0a0a',
            }}
          >
            {currentIdx === totalQuestions - 1 ? (
              <>
                <Award size={14} /> See Results
              </>
            ) : (
              <>
                Next <ChevronRight size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
