import { redirect } from 'next/navigation';
import supabase from '../../../utils/supabaseClient';
import HamburgerMenu from '../../../components/HamburgerMenu';

export default async function AdminLayout({ children }) {
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard/customer');
  }

  return (
    <div style={{ padding: '1rem' }}>
      {children}
    </div>
  );
    }
