'use client';
// components/Toggle.jsx

export default function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 w-10 h-[22px] rounded-full transition-all duration-200 focus:outline-none"
      style={{
        background: checked ? '#c9a84c' : '#141414',
        border: `1px solid ${checked ? '#c9a84c' : '#3a3428'}`,
      }}
    >
      <span
        className="absolute top-[3px] w-[14px] h-[14px] rounded-full transition-all duration-200"
        style={{
          left: checked ? '21px' : '3px',
          background: checked ? '#0a0a0a' : '#7a6e54',
        }}
      />
    </button>
  );
}
