import { api } from '@/lib/api';

export interface Subscription {
  plan: 'free_trial' | 'pro';
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  hasPaymentMethod: boolean;
  billingEmail: string | null;
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  invoicePdf: string | null;
  description: string | null;
}

export const subscriptionService = {
  async getSubscription(): Promise<Subscription> {
    const res = await api.get<Subscription>('/api/subscription');
    return res.data!;
  },

  async getInvoices(): Promise<Invoice[]> {
    const res = await api.get<Invoice[]>('/api/subscription/invoices');
    return res.data ?? [];
  },

  async createCheckout(returnUrl: string): Promise<string> {
    const res = await api.post<{ url: string }>('/api/subscription/checkout', { returnUrl });
    return res.data!.url;
  },

  async createBillingPortal(returnUrl: string): Promise<string> {
    const res = await api.post<{ url: string }>('/api/subscription/billing-portal', { returnUrl });
    return res.data!.url;
  },

  async cancelSubscription(): Promise<Subscription> {
    const res = await api.post<Subscription>('/api/subscription/cancel');
    return res.data!;
  },

  async resumeSubscription(): Promise<Subscription> {
    const res = await api.post<Subscription>('/api/subscription/resume');
    return res.data!;
  },
};
