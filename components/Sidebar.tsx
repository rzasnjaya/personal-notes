'use client';

import { useRouter } from 'next/navigation';

interface SidebarProps {
  onNewNote: () => void;
}

export default function Sidebar({ onNewNote }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 min-h-screen flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Notes</h1>
        </div>

        {/* New Note Button */}
        <button
          onClick={onNewNote}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg mb-8 transition-colors"
        >
          + New Note
        </button>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <a
            href="#"
            className="block px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
          >
            📋 All Notes
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
          >
            ⭐ Favorites
          </a>
          <a
            href="#"
            className="block px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
          >
            📦 Archived
          </a>
        </nav>
      </div>

      {/* Logout Button (Bottom) */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Logout
      </button>
    </aside>
  );
}
