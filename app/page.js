'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Welcome to Growstack Marketplace 👋</h2>
      <p style={{ marginTop: '1rem' }}>
        Discover, promote, and earn from digital products like courses and ebooks.
      </p>


      <section style={{ marginTop: '3rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3>🔥 Featured Products</h3>
        <ul>
          <li>📘 Affiliate Marketing Crash Course</li>
          <li>📙 Guide to Building a Digital Product</li>
          <li>🎥 How to Create Faceless Videos</li>
        </ul>
      </section>
    </div>
  );
}

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#0070f3',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  cursor: 'pointer'
};
