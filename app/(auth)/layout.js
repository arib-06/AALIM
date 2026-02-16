// app/(auth)/layout.js
export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 60%)' }}
    >
      {children}
    </div>
  );
}
