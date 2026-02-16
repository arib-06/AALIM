// app/layout.js
import './globals.css';

export const metadata = {
  title: 'AALIM — Adaptive Assistive Learning Interface Model',
  description: 'Intelligent, adaptive education built around you.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-aalim-bg text-aalim-text font-body antialiased">
        {children}
      </body>
    </html>
  );
}
