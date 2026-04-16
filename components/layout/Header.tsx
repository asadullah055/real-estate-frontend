'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiBell, FiChevronDown, FiUser, FiMonitor, FiLogOut } from 'react-icons/fi';
import { toast } from 'sonner';
import { signOut, useSession } from '@/lib/auth-client';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import Avatar from '@/components/ui/Avatar';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { profile } = useAuth();
  const { data: session } = useSession();

  // Use profile data when available, fall back to Better Auth session instantly
  const displayName   = profile?.name  ?? session?.user?.name  ?? '';
  const displayEmail  = profile?.email ?? session?.user?.email ?? '';
  const displayAvatar = profile?.avatarUrl ?? (session?.user as { image?: string })?.image ?? null;
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleLogout() {
    try {
      await signOut();
      router.push('/login');
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      {/* Left: hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        aria-label="Open menu"
      >
        <FiMenu size={20} />
      </button>

      <div className="hidden lg:block" /> {/* spacer on desktop */}

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Notifications placeholder */}
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <FiBell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-500" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors"
            aria-expanded={dropdownOpen}
          >
            <Avatar name={displayName || '?'} src={displayAvatar} size="sm" />
            <span className="hidden max-w-32 truncate text-sm font-medium text-gray-700 sm:block">
              {displayName || <span className="text-gray-400">Loading…</span>}
            </span>
            <FiChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
              {/* User info */}
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
                <p className="truncate text-xs text-gray-500">{displayEmail}</p>
              </div>

              <Link
                href="/dashboard/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiUser size={15} /> Profile
              </Link>
              <Link
                href="/dashboard/sessions"
                onClick={() => setDropdownOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiMonitor size={15} /> Sessions
              </Link>

              <div className="my-1 border-t border-gray-100" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <FiLogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
