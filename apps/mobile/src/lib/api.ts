import Constants from 'expo-constants';
import { Linking, Platform } from 'react-native';
import { MOCK_EVENTS, MOCK_OPTIONS } from './mock';
import { DiscoveryFilters, EventCard, FeedResponse, OnboardingOptions, OrganizerEventInput } from './types';

declare const process:
  | {
    env?: Record<string, string | undefined>;
  }
  | undefined;

export type MapPin = {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  startAt: string;
  coverImageUrl: string;
  priceMin?: number | null;
  priceMax?: number | null;
};

// Obtenemos la IP desde la constante de Expo y fallbackeamos a 3000
const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process?.env?.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000/api/v1`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api/v1'; // standard fallback Android loopback
  }

  return 'http://localhost:3000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

type RequestOptions = {
  token?: string | null;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

async function request(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function loadFeed(filters: DiscoveryFilters): Promise<FeedResponse> {
  const params = new URLSearchParams();

  if (filters.categories.length) {
    params.set('categories', filters.categories.join(','));
  }

  if (filters.minPrice !== undefined) {
    params.set('minPrice', String(filters.minPrice));
  }

  if (filters.maxPrice !== undefined) {
    params.set('maxPrice', String(filters.maxPrice));
  }

  const query = params.toString();

  try {
    const data = await request(`/events${query ? `?${query}` : ''}`);

    if (Array.isArray(data.items) && data.items.length) {
      return {
        items: data.items,
        nextCursor: data.nextCursor || null,
        source: 'api',
      };
    }

    return {
      items: MOCK_EVENTS,
      nextCursor: null,
      source: 'mock',
    };
  } catch {
    return {
      items: MOCK_EVENTS,
      nextCursor: null,
      source: 'mock',
    };
  }
}

export async function getEventDetail(eventId: string): Promise<EventCard> {
  try {
    const data = await request(`/events/${eventId}`);
    return data as EventCard;
  } catch {
    const fromMock = MOCK_EVENTS.find((item) => item.id === eventId);
    if (!fromMock) {
      throw new Error('Evento no encontrado');
    }

    return {
      ...fromMock,
      descriptionLong:
        'Evento de demostracion para validar la experiencia mobile del MVP en modo local sin backend activo.',
    };
  }
}

export async function loadMapPins(): Promise<MapPin[]> {
  try {
    const data = await request('/events/map');
    if (Array.isArray(data.pins) && data.pins.length) {
      return data.pins as MapPin[];
    }
  } catch {
    // fallback below
  }

  return MOCK_EVENTS.filter(
    (event): event is EventCard & { venue: { latitude: number; longitude: number } } =>
      event.venue.latitude !== null && event.venue.longitude !== null,
  ).map((event) => ({
    id: event.id,
    title: event.title,
    category: event.category.slug,
    latitude: event.venue.latitude,
    longitude: event.venue.longitude,
    startAt: event.startAt,
    coverImageUrl: event.coverImageUrl,
    priceMin: event.priceMin,
    priceMax: event.priceMax,
  }));
}

export async function loadOnboardingOptions(): Promise<OnboardingOptions> {
  try {
    const data = await request('/onboarding/options');
    if (Array.isArray(data.cities) && Array.isArray(data.categories)) {
      return {
        cities: data.cities,
        categories: data.categories,
        venues: Array.isArray(data.venues) ? data.venues : MOCK_OPTIONS.venues,
      };
    }
  } catch {
    // fallback below
  }

  return MOCK_OPTIONS;
}

export async function trackEvent(token: string | null, eventName: string, properties?: Record<string, unknown>) {
  if (!token) {
    return { ok: false };
  }

  try {
    return await request('/analytics/events', {
      token,
      method: 'POST',
      body: {
        eventName,
        properties: properties || {},
      },
    });
  } catch {
    return { ok: false };
  }
}

export async function createOrganizerEvent(token: string | null, payload: OrganizerEventInput) {
  if (!token) {
    throw new Error('Se requiere token para crear en API. Puedes usar modo demo local.');
  }

  return request('/organizer/events', {
    token,
    method: 'POST',
    body: payload,
  });
}

export async function updateOrganizerEvent(token: string | null, eventId: string, payload: Partial<OrganizerEventInput>) {
  if (!token) {
    throw new Error('Se requiere token para actualizar en API. Puedes usar modo demo local.');
  }

  return request(`/organizer/events/${eventId}`, {
    token,
    method: 'PATCH',
    body: payload,
  });
}

export async function deleteOrganizerEvent(token: string | null, eventId: string) {
  if (!token) {
    throw new Error('Se requiere token para eliminar en API. Puedes usar modo demo local.');
  }

  return request(`/organizer/events/${eventId}`, {
    token,
    method: 'DELETE',
  });
}

export async function listOrganizerEvents(token: string | null) {
  if (!token) {
    return [];
  }

  try {
    const data = await request('/organizer/events', { token });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function bookmarkInApi(token: string | null, eventId: string, bookmarked: boolean) {
  if (!token) {
    return { bookmarked };
  }

  try {
    if (bookmarked) {
      return await request(`/events/${eventId}/bookmark`, {
        token,
        method: 'POST',
      });
    }

    return await request(`/events/${eventId}/bookmark`, {
      token,
      method: 'DELETE',
    });
  } catch {
    return { bookmarked };
  }
}

export async function reportEvent(token: string | null, eventId: string, reason: string, details?: string) {
  if (!token) {
    return { ok: false };
  }

  try {
    return await request(`/events/${eventId}/report`, {
      token,
      method: 'POST',
      body: {
        reason,
        details,
      },
    });
  } catch {
    return { ok: false };
  }
}

export async function openTicketLink(url: string | null) {
  if (!url) {
    return false;
  }

  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    return false;
  }

  await Linking.openURL(url);
  return true;
}
