export interface Property {
  id: string;
  title: string;
  status: string;
  type: string;
  price: number;
  currency: string;
  area: string;
  city: string;
  country: string;
  bedrooms?: number;
  bathrooms?: number;
  createdAt: string;
}
