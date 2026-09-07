'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by trying to fetch notes
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/notes');
        if (response.status === 401) {
          // Not authenticated
          router.push('/login');
        } else if (response.ok) {
          // Authenticated
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleNewNote = () => {
    // Will be handled by MainContent
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar onNewNote={handleNewNote} />
      <MainContent onNewNote={handleNewNote} />
    </div>
  );
}
