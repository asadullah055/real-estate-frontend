'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { propertyService, type Property } from '@/modules/property';
import Badge, { workflowStatusBadgeVariant } from '@/components/ui/Badge';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    propertyService.getById(id).then((res) => setProperty(res.data ?? null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-gray-500">Loading property...</p>;
  if (!property) return <p className="text-sm text-gray-500">Property not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
      <div className="rounded-xl border bg-white p-5 space-y-2">
        <p><span className="font-medium">Type:</span> {property.type}</p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <Badge variant={workflowStatusBadgeVariant(property.status)}>{property.status}</Badge>
        </p>
        <p><span className="font-medium">Price:</span> {property.currency} {property.price}</p>
        <p><span className="font-medium">Location:</span> {property.city}, {property.country}</p>
      </div>
    </div>
  );
}

