'use client';

import { FiSettings, FiClock, FiMail } from 'react-icons/fi';

const PLANNED_FEATURES = [
  'Global rate limiting & IP allowlist',
  'SMTP & email template configuration',
  'Maintenance mode toggle',
  'Audit log viewer',
  'Feature flag management',
  'Custom domain & branding',
];

export default function SystemSettingsPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-50">
          <FiSettings size={36} className="animate-spin-slow text-violet-500" style={{ animation: 'spin 8s linear infinite' }} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          This section is currently under active development. We&apos;re building
          powerful controls to give you full command of your platform.
        </p>

        {/* Progress bar */}
        <div className="mt-6 rounded-full bg-gray-100 h-2 overflow-hidden">
          <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-violet-500 to-violet-400" />
        </div>
        <p className="mt-2 text-xs text-gray-400">Approximately 40% complete</p>

        {/* Planned features */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Coming soon
          </p>
          <ul className="space-y-2.5">
            {PLANNED_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-50">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <FiClock size={12} /> Expected in next release
          </span>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1.5">
            <FiMail size={12} /> Notify your team when ready
          </span>
        </div>

      </div>
    </div>
  );
}
