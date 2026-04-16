'use client';

import { Component, type ReactNode } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-100 bg-red-50 p-10 text-center">
        <FiAlertTriangle className="h-8 w-8 text-red-500" />
        <p className="text-sm font-medium text-red-700">{this.state.message || 'Something went wrong.'}</p>
        <button
          onClick={() => this.setState({ hasError: false, message: '' })}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <FiRefreshCw size={14} /> Try again
        </button>
      </div>
    );
  }
}
