export type EventCard = {
  id: string;
  slug: string | null;
  title: string;
  descriptionShort: string;
  coverImageUrl: string;
  ticketUrl: string | null;
  startAt: string;
  endAt: string | null;
  timezone: string;
  category: {
    id: string;
    slug: string;
    name: string;
    icon: string | null;
  };
  venue: {
    id: string;
    name: string;
    addressLine: string;
    latitude: number | null;
    longitude: number | null;
  };
  organizer: {
    id: string;
    name: string;
    slug: string;
    isVerified: boolean;
  };
  priceMin: number | null;
  priceMax: number | null;
  distanceKm: number | null;
  rankingScore: number;
  isBookmarked: boolean;
  descriptionLong?: string | null;
  ageRestriction?: string[] | null;
  media?: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
  }>;
};

export type FeedResponse = {
  items: EventCard[];
  nextCursor: string | null;
  source: 'api' | 'mock';
};

export type DiscoveryFilters = {
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
};

export type OnboardingOptions = {
  cities: Array<{
    id: string;
    name: string;
    slug: string;
    countryCode: string;
    timezone: string;
  }>;
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    icon: string | null;
  }>;
  venues: Array<{
    id: string;
    cityId: string;
    name: string;
    addressLine: string;
    latitude: number | null;
    longitude: number | null;
  }>;
};

export type OrganizerEventInput = {
  title: string;
  descriptionShort: string;
  descriptionLong?: string;
  coverImageUrl: string;
  categoryId: string;
  cityId: string;
  venueId?: string;
  countryCode: string;
  timezone: string;
  startAt: string;
  endAt?: string | null;
  ticketUrl?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  address?: string;
  ageRestriction?: string[];
  latitude?: number | null;
  longitude?: number | null;
  status: 'draft' | 'published';
};
