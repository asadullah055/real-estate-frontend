import Link from 'next/link';
import type { Property } from '../types/property.types';
import Table from '@/components/ui/Table';
import Badge, { workflowStatusBadgeVariant } from '@/components/ui/Badge';

export function PropertyTable({ properties, loading }: { properties: Property[]; loading?: boolean }) {
  return (
    <Table
      loading={loading}
      emptyMessage="No properties found."
      keyExtractor={(property) => property.id}
      data={properties}
      columns={[
        {
          header: 'Property',
          accessor: (property) => (
            <div>
              <p className="font-medium text-gray-900">{property.title}</p>
              <p className="text-xs text-gray-500">{property.city}, {property.country}</p>
            </div>
          ),
        },
        { header: 'Type', accessor: (property) => property.type },
        {
          header: 'Status',
          accessor: (property) => (
            <Badge variant={workflowStatusBadgeVariant(property.status)}>
              {property.status}
            </Badge>
          ),
        },
        { header: 'Price', accessor: (property) => `${property.currency} ${property.price}` },
        {
          header: '',
          accessor: (property) => (
            <Link href={`/dashboard/properties/${property.id}`} className="text-violet-600 hover:text-violet-700">
              View
            </Link>
          ),
        },
      ]}
    />
  );
}
