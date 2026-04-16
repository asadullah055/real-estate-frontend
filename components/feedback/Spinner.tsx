interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-2 border-gray-200 border-t-violet-600 ${sizeMap[size]} ${className}`}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex h-full min-h-75 items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
