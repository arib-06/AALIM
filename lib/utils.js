// lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** TTS helper */
export function speak(text, enabled = true) {
  if (!enabled || typeof window === 'undefined') {
    console.log('TTS disabled or window unavailable, skipping speech');
    return;
  }
  
  if (!window.speechSynthesis) {
    console.error('Speech Synthesis API not available');
    return;
  }
  
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };
    window.speechSynthesis.speak(u);
    console.log('Speech synthesis started for:', text.substring(0, 50) + '...');
  } catch (error) {
    console.error('Error in speak function:', error);
  }
}

/** Calc badge progress percentage */
export function badgePct(prog, goal, unlocked) {
  if (unlocked) return 100;
  if (!prog || !goal) return 0;
  return Math.min(100, Math.round((prog / goal) * 100));
}
