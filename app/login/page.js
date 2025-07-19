'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../utils/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  console.log('🔄 Attempting login with:', email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('✅ Login response:', data, error);

  if (error) {
    console.error('❌ Login error:', error.message);
    setError(error.message);
    setLoading(false);
    return;
  }

  // fetch profile
  const { data: userProfile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  console.log('📌 Profile fetch result:', userProfile, profileError);

  if (profileError) {
    console.error('❌ Profile fetch error:', profileError.message);
    setError('Failed to fetch profile');
    setLoading(false);
    return;
  }

  const role = userProfile?.role;
  console.log('🎯 Role found:', role);

  // navigate
  if (role === 'admin') {
    router.push('/dashboard/admin');
  } else if (role === 'creator') {
    router.push('/dashboard/creator');
  } else if (role === 'affiliate') {
    router.push('/dashboard/affiliate');
  } else {
    router.push('/dashboard/customer');
  }

  setLoading(false);
};

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        textAlign: 'center',
      }}
    >
      <h2 style={{ marginBottom: '1.5rem' }}>Login to Growstack</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '1rem' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
    }
