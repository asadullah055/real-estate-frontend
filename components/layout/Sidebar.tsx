"use client";

import { BOTTOM_NAV, NAV_CONFIG, type NavItem } from "@/config/siteConfig";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import type { Role } from "@/types/common.types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiCheckSquare,
  FiCreditCard,
  FiFileText,
  FiGlobe,
  FiGrid,
  FiMapPin,
  FiMonitor,
  FiPhone,
  FiSettings,
  FiShield,
  FiUser,
  FiUserPlus,
  FiUsers,
  FiX,
} from "react-icons/fi";

const ICON_MAP: Record<string, React.ReactNode> = {
  FiGrid: <FiGrid size={18} />,
  FiUsers: <FiUsers size={18} />,
  FiShield: <FiShield size={18} />,
  FiGlobe: <FiGlobe size={18} />,
  FiBarChart2: <FiBarChart2 size={18} />,
  FiSettings: <FiSettings size={18} />,
  FiCreditCard: <FiCreditCard size={18} />,
  FiUser: <FiUser size={18} />,
  FiMonitor: <FiMonitor size={18} />,
  FiFileText: <FiFileText size={18} />,
  FiUserPlus: <FiUserPlus size={18} />,
  FiCheckSquare: <FiCheckSquare size={18} />,
  FiPhone: <FiPhone size={18} />,
  FiCalendar: <FiCalendar size={18} />,
  FiBell: <FiBell size={18} />,
  FiMapPin: <FiMapPin size={18} />,
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-violet-600 text-white shadow-sm"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {ICON_MAP[item.icon]}
      {item.label}
    </Link>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { profile } = useAuth();

  const role = (profile?.role ?? "user") as Role;
  const visibleItems = NAV_CONFIG[role] ?? NAV_CONFIG.user;

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-900">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-white/10">
          <Image
            src="/logo.webp"
            alt="NebulaNexus logo"
            fill
            sizes="36px"
            className="object-cover"
            priority
          />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          NebulaNexus
        </span>
        {/* Close button - mobile only */}
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1 text-slate-400 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Role badge */}
      {/* {profile && (
        <div className="mx-4 mb-3 rounded-lg bg-white/5 px-3 py-2">
          <p className="text-xs font-medium text-slate-400">Signed in as</p>
          <p className="truncate text-sm font-semibold text-white">
            {profile.name}
          </p>
          <span className="mt-0.5 inline-block rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">
            {profile.role}
          </span>
        </div>
      )} */}

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Menu
        </p>
        {visibleItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            }
          />
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-white/10 px-3 py-3 space-y-0.5">
        {BOTTOM_NAV.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:flex flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
