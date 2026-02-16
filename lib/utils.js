// lib/utils.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** TTS helper */
export function speak(text, enabled = true) {
  if (!enabled || typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

/** Calc badge progress percentage */
export function badgePct(prog, goal, unlocked) {
  if (unlocked) return 100;
  if (!prog || !goal) return 0;
  return Math.min(100, Math.round((prog / goal) * 100));
}
