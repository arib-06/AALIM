'use client';

import { useState } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';

export default function QuizCard({ question, options, correct, onAnswer, answered, isCorrect, topicColor }) {
  const [selected, setSelected] = useState(null);
  
  // Default topic color if not provided
  const color = topicColor || {
    primary: '#c9a84c',
    light: '#e2c46a',
    lighter: 'rgba(201,168,76,0.1)',
    accent: '#d4a5f5',
  };

  const handleSelect = (idx) => {
    if (!answered) {
      setSelected(idx);
    }
  };

  const handleSubmit = () => {
    if (selected !== null && !answered) {
      onAnswer(selected);
    }
  };

  return (
    <div className="w-full">
      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-aalim-text mb-6 leading-relaxed">
          {question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = selected === idx;
            const isCorrectOption = idx === correct;
            const showResult = answered && (isSelected || isCorrectOption);

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all duration-150 font-light text-sm ${
                  answered
                    ? isCorrectOption
                      ? 'border-green-500/40'
                      : isSelected && !isCorrect
                      ? 'border-red-500/40'
                      : ''
                    : isSelected
                    ? ''
                    : 'hover:opacity-75 cursor-pointer'
                }`}
                style={{
                  background:
                    answered && isCorrectOption
                      ? `${color.primary}20`
                      : answered && isSelected && !isCorrect
                      ? 'rgba(239,68,68,0.1)'
                      : isSelected
                      ? `${color.lighter}`
                      : '#141414',
                  borderColor:
                    answered && isCorrectOption
                      ? color.primary
                      : answered && isSelected && !isCorrect
                      ? 'rgba(239,68,68,0.4)'
                      : isSelected
                      ? `${color.primary}60`
                      : 'rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                    style={{
                      borderColor: isSelected ? color.primary : 'rgba(255,255,255,0.2)',
                      background:
                        answered && isCorrectOption
                          ? `${color.primary}30`
                          : answered && isSelected && !isCorrect
                          ? 'rgba(239,68,68,0.3)'
                          : isSelected
                          ? `${color.primary}30`
                          : 'transparent',
                    }}
                  >
                    {answered && isCorrectOption && (
                      <Check size={14} style={{ color: color.primary }} />
                    )}
                    {answered && isSelected && !isCorrect && (
                      <X size={14} style={{ color: '#ef4444' }} />
                    )}
                  </div>
                  <span style={{ color: answered && isCorrectOption ? color.primary : answered && isSelected && !isCorrect ? '#fca5a5' : '#c5bba2' }}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit/Next button */}
      {!answered ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-3 rounded-lg font-medium text-sm transition-all duration-150 uppercase tracking-[0.08em]"
          style={{
            background:
              selected !== null
                ? `linear-gradient(135deg,${color.primary},${color.accent})`
                : 'rgba(255,255,255,0.06)',
            color: selected !== null ? '#0a0a0a' : 'rgba(255,255,255,0.2)',
            cursor: selected !== null ? 'pointer' : 'default',
          }}
        >
          Submit Answer
        </button>
      ) : (
        <div
          className="w-full py-4 px-4 rounded-lg text-center text-sm font-light"
          style={{
            background: isCorrect ? `${color.primary}20` : 'rgba(239,68,68,0.1)',
            borderLeft: isCorrect ? `3px solid ${color.primary}` : '3px solid #ef4444',
            color: isCorrect ? color.primary : '#fca5a5',
          }}
        >
          {isCorrect
            ? '✓ Correct! Great job.'
            : '✗ Not quite. Review the content and try again.'}
        </div>
      )}
    </div>
  );
}
