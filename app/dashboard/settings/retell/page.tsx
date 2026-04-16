'use client';

export default function RetellSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Retell Settings</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-600">
          Configure workspace-specific Retell API key, receptionist agent ID,
          and webhook secret from backend settings.
        </p>
      </div>
    </div>
  );
}
