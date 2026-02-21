// app/(dashboard)/layout.js
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseServer';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow access without login, but pass real user if logged in
  // if (!user) redirect('/login'); // Commented out to allow guest access

  return (
    <div className="flex min-h-screen bg-aalim-bg">
      <Sidebar user={user} />
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
