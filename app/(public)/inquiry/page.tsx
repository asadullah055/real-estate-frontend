'use client';

import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/constants';
import { useState } from 'react';

const PROPERTY_TYPES = [
  'Apartment',
  'Condo',
  'Single Family Home',
  'Townhouse',
  'Villa',
  'Office',
  'Commercial',
  'Land',
  'Other',
];

const TIMELINES = [
  { value: 'urgent', label: 'Immediately' },
  { value: 'within_3_months', label: 'Within 3 months' },
  { value: 'within_6_months', label: 'Within 6 months' },
  { value: 'flexible', label: 'Just exploring' },
];

interface FormState {
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  location: string;
  budget: string;
  timeline: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  phone: '',
  email: '',
  propertyType: '',
  location: '',
  budget: '',
  timeline: '',
  notes: '',
};

export default function PublicInquiryPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const normalizedBudget = form.budget.replace(/,/g, '').trim();
    const budgetValue = normalizedBudget ? Number(normalizedBudget) : undefined;
    const validBudget = typeof budgetValue === 'number' && Number.isFinite(budgetValue);

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      propertyType: form.propertyType || undefined,
      timeline: form.timeline || undefined,
      notes: form.notes.trim() || undefined,
      preferredAreas: form.location.trim() ? [form.location.trim()] : undefined,
      budget: validBudget
        ? {
            max: budgetValue,
          }
        : undefined,
    };

    try {
      await api.post(`${API_ROUTES.LEADS}/form`, payload);
      setSuccess(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#f8fafc_45%,_#ffffff_100%)] px-4">
        <div className="w-full max-w-md rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg shadow-emerald-100/60">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            DONE
          </div>
          <h2 className="text-xl font-bold text-slate-900">Thanks, we got your inquiry</h2>
          <p className="mt-2 text-sm text-slate-600">
            Our real estate specialist will contact you shortly.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-6 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Submit another inquiry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <div className="bg-[linear-gradient(120deg,_#0f172a_0%,_#1e293b_100%)] px-6 py-6 text-white sm:px-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Lead Collection</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Real Estate Inquiry Form</h1>
          <p className="mt-2 text-sm text-slate-300">
            Fill in a few details and we will share matching property options.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5 px-6 py-6 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name *">
              <input
                className={inputClass}
                placeholder="Your full name"
                value={form.name}
                onChange={setField('name')}
                required
              />
            </Field>

            <Field label="Phone Number *">
              <input
                className={inputClass}
                placeholder="+1 555 123 4567"
                type="tel"
                value={form.phone}
                onChange={setField('phone')}
                required
              />
            </Field>
          </div>

          <Field label="Email Address (Optional)">
            <input
              className={inputClass}
              placeholder="you@example.com"
              type="email"
              value={form.email}
              onChange={setField('email')}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Property Type">
              <select className={inputClass} value={form.propertyType} onChange={setField('propertyType')}>
                <option value="">Select property type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Preferred Area">
              <input
                className={inputClass}
                placeholder="e.g. Manhattan, New York"
                value={form.location}
                onChange={setField('location')}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Estimated Budget">
              <input
                className={inputClass}
                placeholder="e.g. 5000000"
                type="number"
                min={0}
                value={form.budget}
                onChange={setField('budget')}
              />
            </Field>

            <Field label="Purchase Timeline">
              <select className={inputClass} value={form.timeline} onChange={setField('timeline')}>
                <option value="">Select timeline</option>
                {TIMELINES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Additional Notes">
            <textarea
              className={inputClass}
              placeholder="Any specific requirement?"
              rows={4}
              value={form.notes}
              onChange={setField('notes')}
            />
          </Field>

          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';
