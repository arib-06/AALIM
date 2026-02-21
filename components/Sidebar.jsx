'use client';
// components/Sidebar.jsx

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  PenLine, Search, Layers, Trophy, BookOpen, SlidersHorizontal,
  ChevronRight, Plus, User, LogOut, DollarSign, Code,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const PROJECTS = [
  { label: 'Python Basics', Icon: Code },
  { label: 'Finance 101', Icon: DollarSign },
];

const NAV = [
  { href: '/home', label: 'New chat', Icon: PenLine },
  // { href: '/topics',   label: 'Topics',    Icon: Layers           }, // Temporarily disabled - has mouse event handlers in Server Component
  { href: '/badges', label: 'Badges', Icon: Trophy },
  { href: '/learn', label: 'Learn', Icon: BookOpen },
  { href: '/settings', label: 'Settings', Icon: SlidersHorizontal },
];

function NavItem({ href, label, Icon, active }) {
  return (
    <Link href={href} className={cn(
      'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150',
      active
        ? 'bg-white/[0.06] text-aalim-text'
        : 'text-aalim-sub hover:bg-white/[0.04] hover:text-[#c8bfa0]'
    )}>
      <Icon size={15} className={cn('flex-shrink-0', active ? 'opacity-100' : 'opacity-70')} />
      <span className="font-normal leading-none">{label}</span>
    </Link>
  );
}

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = getSupabase();
  const [showProjects, setShowProjects] = useState(true);
  const [showChats, setShowChats] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);

  // Fetch chat history from Supabase
  useEffect(() => {
    if (!user) return;
    
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setChatHistory(data);
      }
    };

    fetchChats();
    
    // Refresh chat history every 3 seconds to show new chats
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [user, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-aalim-sidebar border-r flex flex-col h-screen sticky top-0 overflow-y-auto"
      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div className="flex flex-col gap-0.5 p-2 flex-1">
        {/* Logo */}
        <div className="px-3 py-3 pb-4 font-display text-xl font-bold text-gold tracking-widest select-none">
          AALIM
        </div>

        {/* Main nav */}
        {NAV.map(({ href, label, Icon }) => (
          <NavItem key={href} href={href} label={label} Icon={Icon} active={pathname === href} />
        ))}

        {/* Divider */}
        <div className="my-2 mx-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Projects section */}
        <button
          onClick={() => setShowProjects(s => !s)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-md text-aalim-sub hover:text-aalim-text transition-colors text-sm"
        >
          <span className="font-medium text-xs uppercase tracking-[0.08em]">Projects</span>
          <ChevronRight size={13} className="transition-transform duration-200" style={{ transform: showProjects ? 'rotate(90deg)' : 'none' }} />
        </button>

        {showProjects && (
          <div className="ml-1">
            {PROJECTS.map(({ label, Icon: Ic }) => (
              <button key={label} className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-aalim-sub hover:bg-white/[0.04] hover:text-[#c8bfa0] transition-all">
                <Ic size={13} className="flex-shrink-0 opacity-60" />
                <span className="text-xs font-light truncate">{label}</span>
              </button>
            ))}
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-xs text-aalim-muted hover:text-aalim-sub transition-colors">
              <Plus size={12} /> New project
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="my-2 mx-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Your chats */}
        <button
          onClick={() => setShowChats(s => !s)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-md text-aalim-sub hover:text-aalim-text transition-colors text-sm"
        >
          <span className="font-medium text-xs uppercase tracking-[0.08em]">Your chats</span>
          <ChevronRight size={13} className="transition-transform duration-200" style={{ transform: showChats ? 'rotate(90deg)' : 'none' }} />
        </button>

        {showChats && (
          <div className="ml-1">
            {user && chatHistory.length > 0 ? (
              chatHistory.map(chat => (
                <button 
                  key={chat.id} 
                  onClick={() => router.push(`/learn?chatId=${chat.id}`)}
                  className="w-full text-left px-3 py-2 rounded-md text-xs text-aalim-sub hover:bg-white/[0.04] hover:text-[#c8bfa0] transition-all truncate font-light"
                >
                  {chat.title}
                </button>
              ))
            ) : user ? (
              <div className="px-3 py-2 text-xs text-aalim-muted font-light">
                No chats yet. Start a conversation!
              </div>
            ) : (
              <div className="px-3 py-2 text-xs text-aalim-muted font-light">
                Sign in to save chat history
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom user row */}
      <div className="p-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-aalim-sub hover:bg-white/[0.04] hover:text-aalim-text transition-all"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <User size={13} className="text-gold" />
          </div>
          <span className="text-sm font-light truncate flex-1">
            {user?.email?.split('@')[0] || 'Student'}
          </span>
          <LogOut size={13} className="opacity-40" />
        </button>
      </div>
    </aside>
  );
}
