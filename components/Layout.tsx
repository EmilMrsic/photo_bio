import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMemberstack } from '../hooks/useMemberstack';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { member, logout, role } = useMemberstack();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Generate AI avatar for user
  useEffect(() => {
    const generateAvatar = async () => {
      if (!member?.id) return;

      // Check if we already have an avatar cached in localStorage
      const cachedAvatar = localStorage.getItem(`avatar-${member.id}`);
      if (cachedAvatar) {
        setAvatarUrl(cachedAvatar);
        return;
      }

      // Generate new avatar
      setLoadingAvatar(true);
      try {
        const response = await fetch('/api/generate-profile-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: member.id }),
        });

        if (response.ok) {
          const data = await response.json();
          setAvatarUrl(data.imageUrl);
          // Cache the avatar URL
          localStorage.setItem(`avatar-${member.id}`, data.imageUrl);
        }
      } catch (error) {
        console.error('Error generating avatar:', error);
      } finally {
        setLoadingAvatar(false);
      }
    };

    if (member) {
      generateAvatar();
    }
  }, [member]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold" style={{ color: '#4F47E6' }}>
                  TPBM Protocols
                </Link>
              </div>
              {member && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    href="/clients"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Home
                  </Link>
                </div>
              )}
            </div>
            {member ? (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : loadingAvatar ? (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 flex items-center justify-center text-white text-xs font-semibold">
                      {member.customFields?.['first-name']?.charAt(0)?.toUpperCase() || member.customFields?.name?.charAt(0)?.toUpperCase() || member.auth?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="ml-2 text-gray-700 font-medium">
                    {member.customFields?.name || member?.email || member?.auth?.email}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-500 hover:text-gray-700 ml-2"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  href="/login"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Page Header */}
      {title && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
      )}

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
