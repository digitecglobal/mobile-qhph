import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  bookmarkInApi,
  createOrganizerEvent,
  updateOrganizerEvent,
  deleteOrganizerEvent,
  getEventDetail,
  loadFeed,
  loadMapPins,
  loadOnboardingOptions,
  listOrganizerEvents,
  reportEvent,
  trackEvent,
  type MapPin,
} from './api';
import { MOCK_OPTIONS } from './mock';
import { DiscoveryFilters, EventCard, OnboardingOptions, OrganizerEventInput } from './types';

type OrganizerEventRow = {
  id: string;
  title: string;
  status: string;
  startAt: string;
  createdAt: string;
  // Full form fields for edit repopulation
  descriptionShort?: string;
  descriptionLong?: string;
  coverImageUrl?: string;
  ticketUrl?: string | null;
  address?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  categoryId?: string;
  venueId?: string;
  latitude?: number | null;
  longitude?: number | null;
  ageRestriction?: string[];
};

type AppStateValue = {
  events: EventCard[];
  isLoadingFeed: boolean;
  feedSource: 'api' | 'mock';
  filters: DiscoveryFilters;
  setFilters: (next: DiscoveryFilters) => void;
  clearFilters: () => void;
  refreshFeed: () => Promise<void>;
  savedIds: string[];
  toggleSaved: (eventId: string) => Promise<void>;
  getEventById: (eventId: string) => Promise<EventCard>;
  mapPins: MapPin[];
  isLoadingMap: boolean;
  refreshMap: () => Promise<void>;
  options: OnboardingOptions;
  apiToken: string;
  setApiToken: (token: string) => void;
  organizerEvents: OrganizerEventRow[];
  createOrganizerEventAction: (payload: OrganizerEventInput) => Promise<{ ok: boolean; message: string }>;
  updateOrganizerEventAction: (eventId: string, payload: Partial<OrganizerEventInput>) => Promise<{ ok: boolean; message: string }>;
  deleteOrganizerEventAction: (eventId: string) => Promise<{ ok: boolean; message: string }>;
  refreshOrganizerEvents: () => Promise<void>;
  reportEventAction: (eventId: string, reason: string, details?: string) => Promise<void>;
  user?: { avatarUrl?: string };
};

const AppStateContext = createContext<AppStateValue | null>(null);

const DEFAULT_FILTERS: DiscoveryFilters = {
  categories: [],
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mergeUniqueById<T extends { id: string }>(first: T[], second: T[]) {
  const map = new Map<string, T>();

  first.forEach((item) => map.set(item.id, item));
  second.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });

  return Array.from(map.values());
}

function eventMatchesFilters(event: EventCard, filters: DiscoveryFilters) {
  if (filters.categories.length && !filters.categories.includes(event.category.slug)) {
    return false;
  }

  const eventMin = event.priceMin ?? event.priceMax;
  const eventMax = event.priceMax ?? event.priceMin;

  if (filters.minPrice !== undefined && eventMax !== null && eventMax < filters.minPrice) {
    return false;
  }

  if (filters.maxPrice !== undefined && eventMin !== null && eventMin > filters.maxPrice) {
    return false;
  }

  return true;
}

function eventToMapPin(event: EventCard): MapPin | null {
  if (event.venue.latitude === null || event.venue.longitude === null) {
    return null;
  }

  return {
    id: event.id,
    title: event.title,
    category: event.category.slug,
    latitude: event.venue.latitude,
    longitude: event.venue.longitude,
    startAt: event.startAt,
    coverImageUrl: event.coverImageUrl,
    priceMin: event.priceMin,
    priceMax: event.priceMax,
  };
}

function toEventCard(
  eventId: string,
  payload: OrganizerEventInput & { geocodedLat?: number | null; geocodedLng?: number | null; addressLine?: string },
  options: OnboardingOptions,
  organizer: EventCard['organizer'],
): EventCard {
  const category =
    options.categories.find((item) => item.id === payload.categoryId) || ({
      id: payload.categoryId,
      slug: 'otros',
      name: 'Otros',
      icon: null,
    } as const);

  const knownVenue = payload.venueId ? options.venues.find((item) => item.id === payload.venueId) : null;
  const venue = {
    id: payload.venueId || 'custom',
    name: payload.addressLine || knownVenue?.name || 'Lugar por definir',
    addressLine: payload.addressLine || knownVenue?.addressLine || 'Por definir',
    latitude: payload.latitude ?? payload.geocodedLat ?? knownVenue?.latitude ?? null,
    longitude: payload.longitude ?? payload.geocodedLng ?? knownVenue?.longitude ?? null,
  };

  return {
    id: eventId,
    slug: slugify(payload.title),
    title: payload.title,
    descriptionShort: payload.descriptionShort,
    descriptionLong: payload.descriptionLong || payload.descriptionShort,
    ageRestriction: payload.ageRestriction || null,
    coverImageUrl: payload.coverImageUrl,
    ticketUrl: payload.ticketUrl || null,
    startAt: payload.startAt,
    endAt: payload.endAt || null,
    timezone: payload.timezone,
    category: {
      id: category.id,
      slug: category.slug,
      name: category.name,
      icon: category.icon,
    },
    venue,
    organizer,
    priceMin: payload.priceMin ?? null,
    priceMax: payload.priceMax ?? null,
    distanceKm: null,
    rankingScore: 0.5,
    isBookmarked: false,
  };
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address.trim()) return null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=co`,
      {
        headers: {
          'User-Agent': 'QHPH-Mobile-App/1.0',
        },
      }
    );

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } else {
      console.warn('Geocode API error or non-json:', res.status);
    }
  } catch (e) {
    console.error('Geocoding error:', e);
  }
  return null;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [rawEvents, setRawEvents] = useState<EventCard[]>([]);
  const [localPublishedEvents, setLocalPublishedEvents] = useState<EventCard[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [feedSource, setFeedSource] = useState<'api' | 'mock'>('mock');
  const [filters, setFilters] = useState<DiscoveryFilters>(DEFAULT_FILTERS);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const [mapPins, setMapPins] = useState<MapPin[]>([]);
  const [isLoadingMap, setIsLoadingMap] = useState(true);

  const [options, setOptions] = useState<OnboardingOptions>(MOCK_OPTIONS);

  const [apiToken, setApiToken] = useState('');
  const [organizerEvents, setOrganizerEvents] = useState<OrganizerEventRow[]>([]);

  const localOrganizer = useMemo<EventCard['organizer']>(() => ({
    id: apiToken ? 'org-api' : 'org-demo-local',
    name: apiToken ? 'Organizador API' : "Que hay pa' hacer Demo",
    slug: apiToken ? 'organizador-api' : 'qhph-demo-local',
    isVerified: !!apiToken,
  }), [apiToken]);

  const mergedEvents = useMemo(() => mergeUniqueById(localPublishedEvents, rawEvents), [localPublishedEvents, rawEvents]);

  const events = useMemo(
    () =>
      mergedEvents
        .filter((event) => eventMatchesFilters(event, filters))
        .map((event) => ({
          ...event,
          isBookmarked: savedIds.includes(event.id),
        })),
    [filters, mergedEvents, savedIds],
  );

  const mergedMapPins = useMemo(() => {
    const localPins = localPublishedEvents
      .map(eventToMapPin)
      .filter((pin): pin is MapPin => pin !== null);

    return mergeUniqueById(localPins, mapPins);
  }, [localPublishedEvents, mapPins]);

  const refreshFeed = useCallback(async () => {
    setIsLoadingFeed(true);
    try {
      const feed = await loadFeed(filters);
      setRawEvents(feed.items);
      setFeedSource(feed.source);

      await trackEvent(apiToken || null, 'feed_loaded', {
        count: feed.items.length,
        source: feed.source,
      });
    } finally {
      setIsLoadingFeed(false);
    }
  }, [apiToken, filters]);

  const refreshMap = useCallback(async () => {
    setIsLoadingMap(true);
    try {
      const pins = await loadMapPins();
      setMapPins(pins);
    } finally {
      setIsLoadingMap(false);
    }
  }, []);

  const refreshOptions = useCallback(async () => {
    const next = await loadOnboardingOptions();
    setOptions(next);
  }, []);

  const refreshOrganizerEvents = useCallback(async () => {
    if (!apiToken) {
      return;
    }

    const rows = await listOrganizerEvents(apiToken);

    setOrganizerEvents(
      rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        status: row.status,
        startAt: row.startAt,
        createdAt: row.createdAt,
      })),
    );
  }, [apiToken]);

  useEffect(() => {
    void refreshFeed();
  }, [refreshFeed]);

  useEffect(() => {
    void refreshMap();
    void refreshOptions();
  }, [refreshMap, refreshOptions]);

  useEffect(() => {
    void refreshOrganizerEvents();
  }, [refreshOrganizerEvents]);

  const toggleSaved = useCallback(
    async (eventId: string) => {
      const isSaved = savedIds.includes(eventId);
      const next = isSaved ? savedIds.filter((id) => id !== eventId) : [...savedIds, eventId];
      setSavedIds(next);

      await bookmarkInApi(apiToken || null, eventId, !isSaved);
      await trackEvent(apiToken || null, 'event_bookmarked', {
        eventId,
        bookmarked: !isSaved,
      });
    },
    [apiToken, savedIds],
  );

  const getEventById = useCallback(
    async (eventId: string) => {
      const local = events.find((event) => event.id === eventId);
      if (local) {
        return local;
      }

      const detail = await getEventDetail(eventId);
      return {
        ...detail,
        isBookmarked: savedIds.includes(detail.id),
      };
    },
    [events, savedIds],
  );

  const createOrganizerEventAction = useCallback(
    async (payload: OrganizerEventInput) => {

      const coords = payload.latitude != null && payload.longitude != null
        ? { lat: payload.latitude, lng: payload.longitude }
        : payload.address ? await geocodeAddress(payload.address) : null;

      if (!apiToken) {
        const localId = `local-${Date.now()}`;
        const localEvent = toEventCard(localId, {
          ...payload,
          geocodedLat: coords?.lat,
          geocodedLng: coords?.lng,
          addressLine: payload.address
        }, options, localOrganizer);

        setOrganizerEvents((prev) => [
          {
            id: localId,
            createdAt: new Date().toISOString(),
            ...payload,
            latitude: coords?.lat ?? null,
            longitude: coords?.lng ?? null,
            ticketUrl: payload.ticketUrl ?? null,
          },
          ...prev,
        ]);

        if (payload.status === 'published') {
          setLocalPublishedEvents((prev) => mergeUniqueById([localEvent], prev));
          refreshFeed();
        }

        return { ok: true, message: 'Evento creado en modo demo local' };
      }

      try {
        const created = await createOrganizerEvent(apiToken, payload);

        setOrganizerEvents((prev) => [
          {
            id: created.id,
            createdAt: created.createdAt,
            ...payload,
            latitude: coords?.lat ?? null,
            longitude: coords?.lng ?? null,
            ticketUrl: payload.ticketUrl ?? null,
          },
          ...prev,
        ]);

        if (payload.status === 'published') {
          const createdId = created?.id || `api-${Date.now()}`;
          const publishedEvent = toEventCard(
            createdId,
            {
              ...payload,
              startAt: created?.startAt || payload.startAt,
              endAt: created?.endAt ?? payload.endAt ?? null,
              geocodedLat: coords?.lat,
              geocodedLng: coords?.lng,
              addressLine: payload.address
            },
            options,
            localOrganizer,
          );

          setLocalPublishedEvents((prev) => mergeUniqueById([publishedEvent], prev));
          refreshFeed();

          await trackEvent(apiToken, 'organizer_event_published', {
            eventId: created.id,
          });
        }

        return { ok: true, message: 'Evento creado en API' };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : 'No se pudo crear el evento',
        };
      }
    },
    [apiToken, options, refreshFeed, localOrganizer]
  );

  const reportEventAction = useCallback(
    async (eventId: string, reason: string, details?: string) => {
      await reportEvent(apiToken || null, eventId, reason, details);
    },
    [apiToken],
  );

  const updateOrganizerEventAction = useCallback(
    async (eventId: string, payload: Partial<OrganizerEventInput>) => {
      const coords = payload.latitude != null && payload.longitude != null
        ? { lat: payload.latitude, lng: payload.longitude }
        : payload.address ? await geocodeAddress(payload.address) : null;

      if (!apiToken) {
        // In local/mock mode: update in-memory
        setOrganizerEvents((prev) =>
          prev.map((ev) =>
            ev.id === eventId
              ? {
                ...ev,
                ...payload,
                latitude: payload.latitude ?? coords?.lat ?? ev.latitude,
                longitude: payload.longitude ?? coords?.lng ?? ev.longitude,
              }
              : ev,
          ),
        );
        if (payload.status === 'published' || (payload.title || payload.address || payload.startAt)) {
          setLocalPublishedEvents((prev) =>
            prev.map((ev) =>
              ev.id === eventId ? {
                ...ev,
                ...payload,
                title: payload.title ?? ev.title,
                venue: {
                  ...ev.venue,
                  addressLine: payload.address ?? ev.venue.addressLine,
                  latitude: coords?.lat ?? ev.venue.latitude,
                  longitude: coords?.lng ?? ev.venue.longitude,
                }
              } as any : ev,
            ),
          );
          refreshFeed();
        }
        return { ok: true, message: 'Evento actualizado en modo demo local' };
      }
      try {
        await updateOrganizerEvent(apiToken, eventId, payload);
        await refreshOrganizerEvents();
        return { ok: true, message: 'Evento actualizado en API' };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : 'No se pudo actualizar el evento',
        };
      }
    },
    [apiToken, refreshOrganizerEvents, refreshFeed, organizerEvents, localOrganizer, options],
  );

  const deleteOrganizerEventAction = useCallback(
    async (eventId: string) => {
      if (!apiToken) {
        setOrganizerEvents((prev) => prev.filter((ev) => ev.id !== eventId));
        setLocalPublishedEvents((prev) => prev.filter((ev) => ev.id !== eventId));
        return { ok: true, message: 'Evento eliminado en modo demo local' };
      }
      try {
        await deleteOrganizerEvent(apiToken, eventId);
        setOrganizerEvents((prev) => prev.filter((ev) => ev.id !== eventId));
        return { ok: true, message: 'Evento eliminado' };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : 'No se pudo eliminar el evento',
        };
      }
    },
    [apiToken],
  );

  const value: AppStateValue = {
    events,
    isLoadingFeed,
    feedSource,
    filters,
    setFilters,
    clearFilters: () => setFilters(DEFAULT_FILTERS),
    refreshFeed,
    savedIds,
    toggleSaved,
    getEventById,
    mapPins: mergedMapPins,
    isLoadingMap,
    refreshMap,
    options,
    apiToken,
    setApiToken,
    organizerEvents,
    createOrganizerEventAction,
    updateOrganizerEventAction,
    deleteOrganizerEventAction,
    refreshOrganizerEvents,
    reportEventAction,
    user: undefined,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return context;
}
