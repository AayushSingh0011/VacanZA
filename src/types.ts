export type PropertyStatus = 'vacant' | 'full';

export type PropertyType = 'House' | 'Apartment' | 'Flat' | 'Room' | 'PG';

export type BHK = 'Studio' | '1' | '2' | '3' | '4+';

export type FurnishedType = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export interface Property {
  id: string;
  title: string;
  propertyType: PropertyType;
  bhk: BHK;
  rent: number;
  deposit: number;
  area: string;
  city: string;
  state: string;
  images: string[];
  description: string;
  amenities: string[];
  status: PropertyStatus;
  lastUpdated: number; // timestamp in ms
  ownerName: string;
  ownerPhone: string;
  furnished: FurnishedType;
  bathrooms: number;
  parking: boolean;
  coordinates: { x: number; y: number }; // 0-100 for map positioning
  distanceKm: number;
}

export type Page =
  | 'landing'
  | 'renter'
  | 'property-details'
  | 'owner'
  | 'add-property'
  | 'manage-property'
  | 'saved';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
