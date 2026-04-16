import type { Role } from '@/types/common.types';

export interface NavItem {
  label: string;
  href: string;
  icon: string; // icon name from react-icons/fi
}

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  'super-admin': [
    { label: 'Leads',            href: '/dashboard/leads',           icon: 'FiFileText' },
    { label: 'Calls',            href: '/dashboard/calls',           icon: 'FiPhone' },
    { label: 'Meetings',         href: '/dashboard/meetings',        icon: 'FiCalendar' },
    { label: 'Followups',        href: '/dashboard/followups',       icon: 'FiCheckSquare' },
    { label: 'Notifications',    href: '/dashboard/notifications',   icon: 'FiBell' },
    // { label: 'Analytics',        href: '/dashboard/analytics',       icon: 'FiBarChart2' },
    { label: 'Retell Settings',  href: '/dashboard/settings/retell', icon: 'FiSettings' },
    // { label: 'Dashboard',       href: '/dashboard',                icon: 'FiGrid' },
    // { label: 'Properties',      href: '/dashboard/properties',     icon: 'FiMapPin' },
    // { label: 'Users',           href: '/dashboard/users',          icon: 'FiUsers' },
    // { label: 'Admins',          href: '/dashboard/admins',         icon: 'FiShield' },
    // { label: 'System Settings', href: '/dashboard/system',         icon: 'FiSettings' },
    // { label: 'Billing',         href: '/dashboard/billing',        icon: 'FiCreditCard' },
  ],
  admin: [
    { label: 'Leads',            href: '/dashboard/leads',           icon: 'FiFileText' },
    { label: 'Calls',            href: '/dashboard/calls',           icon: 'FiPhone' },
    { label: 'Meetings',         href: '/dashboard/meetings',        icon: 'FiCalendar' },
    { label: 'Followups',        href: '/dashboard/followups',       icon: 'FiCheckSquare' },
    { label: 'Notifications',    href: '/dashboard/notifications',   icon: 'FiBell' },
    // { label: 'Analytics',        href: '/dashboard/analytics',       icon: 'FiBarChart2' },
    { label: 'Retell Settings',  href: '/dashboard/settings/retell', icon: 'FiSettings' },
    // { label: 'Dashboard',       href: '/dashboard',                icon: 'FiGrid' },
    // { label: 'Properties',      href: '/dashboard/properties',     icon: 'FiMapPin' },
    // { label: 'Users',           href: '/dashboard/users',          icon: 'FiUsers' },
  ],
  user: [
    { label: 'Leads',            href: '/dashboard/leads',           icon: 'FiFileText' },
    { label: 'Calls',            href: '/dashboard/calls',           icon: 'FiPhone' },
    { label: 'Meetings',         href: '/dashboard/meetings',        icon: 'FiCalendar' },
    { label: 'Followups',        href: '/dashboard/followups',       icon: 'FiCheckSquare' },
    { label: 'Notifications',    href: '/dashboard/notifications',   icon: 'FiBell' },
    // { label: 'Analytics',        href: '/dashboard/analytics',       icon: 'FiBarChart2' },
    { label: 'Retell Settings',  href: '/dashboard/settings/retell', icon: 'FiSettings' },
    // { label: 'Dashboard',       href: '/dashboard',                icon: 'FiGrid' },
    // { label: 'Profile',         href: '/dashboard/profile',        icon: 'FiUser' },
    // { label: 'Subscription',    href: '/dashboard/subscription',   icon: 'FiCreditCard' },
  ],
};

// Items always shown in bottom section regardless of role
export const BOTTOM_NAV: NavItem[] = [
  // { label: 'Profile',  href: '/dashboard/profile',  icon: 'FiUser' },
  // { label: 'Sessions', href: '/dashboard/sessions', icon: 'FiMonitor' },
];
