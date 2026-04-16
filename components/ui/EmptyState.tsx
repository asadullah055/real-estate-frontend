import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
  message?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  message = 'Nothing here yet.',
  description,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center text-gray-400">
      {icon ?? <FiInbox className="h-8 w-8 opacity-40" />}
      <p className="text-sm font-medium">{message}</p>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  );
}
