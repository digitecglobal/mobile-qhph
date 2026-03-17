import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppState } from '../../src/lib/app-state';

type MapPoint = {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  startAt: string;
  coverImageUrl: string;
  venueName: string;
  priceMin: number | null;
  priceMax: number | null;
  priceLabel: string;
};

type WebMapMessage =
  | { type: 'marker_press'; eventId: string }
  | { type: 'viewport_changed'; visibleIds: string[] }
  | { type: 'map_moved' };

function formatCompactCop(value: number) {
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }

  return `${Math.round(value)}`;
}

function getPriceLabel(priceMin: number | null, priceMax: number | null) {
  if (priceMin === null && priceMax === null) {
    return 'N/A';
  }

  if (priceMin === 0 && priceMax === 0) {
    return 'Gratis';
  }

  const reference = priceMin ?? priceMax;
  if (reference === null) {
    return 'N/A';
  }

  return `$${formatCompactCop(reference)}`;
}

function getPriceLongLabel(priceMin: number | null, priceMax: number | null) {
  if (priceMin === null && priceMax === null) {
    return 'Precio por confirmar';
  }

  if (priceMin === 0 && priceMax === 0) {
    return 'Gratis';
  }

  if (priceMin !== null && priceMax !== null) {
    return `$${priceMin.toLocaleString('es-CO')} - $${priceMax.toLocaleString('es-CO')}`;
  }

  if (priceMin !== null) {
    return `Desde $${priceMin.toLocaleString('es-CO')}`;
  }

  return `Hasta $${(priceMax || 0).toLocaleString('es-CO')}`;
}

function escapesForJs(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function buildWebMapHtml(
  points: MapPoint[],
  selectedId: string | null,
  userLocation: { lat: number; lng: number } | null,
) {
  const pointsJson = JSON.stringify(points).replace(/</g, '\\u003c');
  const selectedJson = JSON.stringify(selectedId).replace(/</g, '\\u003c');
  const userJson = JSON.stringify(userLocation).replace(/</g, '\\u003c');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
      body { background: #e2e8f0; }
      .pin {
        border: 1px solid #e2e8f0;
        border-radius: 999px;
        background: #0f172a;
        color: #f8fafc;
        font-size: 12px;
        font-weight: 800;
        line-height: 1;
        padding: 8px 10px;
        box-shadow: 0 8px 18px rgba(2, 6, 23, 0.24);
        white-space: nowrap;
      }
      .pin.selected {
        background: #22d3ee;
        color: #032a30;
        border-color: #0891b2;
        transform: scale(1.06);
      }
      .user-dot {
        width: 18px;
        height: 18px;
        border-radius: 999px;
        background: #2563eb;
        border: 2px solid #f8fafc;
        box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.22);
      }
      .leaflet-control-zoom {
        border: none !important;
        box-shadow: 0 8px 18px rgba(2, 6, 23, 0.22) !important;
      }
      .leaflet-control-zoom a {
        color: #0f172a !important;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const points = ${pointsJson};
      const preselectedId = ${selectedJson};
      const initialUserLocation = ${userJson};
      const markersById = {};
      let selectedId = null;
      let userMarker = null;

      function post(payload) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }
      }

      const defaultCenter = [4.6486, -74.0772];
      const map = L.map('map', { zoomControl: true }).setView(defaultCenter, 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      function buildPinIcon(label, active) {
        const className = active ? 'pin selected' : 'pin';
        return L.divIcon({
          html: '<div class="' + className + '">' + label + '</div>',
          className: '',
          iconSize: [72, 34],
          iconAnchor: [36, 17]
        });
      }

      function applySelection(nextId) {
        selectedId = nextId;
        Object.keys(markersById).forEach((id) => {
          const marker = markersById[id];
          const data = marker.__qhphData;
          const active = id === nextId;
          marker.setIcon(buildPinIcon(data.priceLabel, active));
          if (active) {
            marker.setZIndexOffset(1000);
          } else {
            marker.setZIndexOffset(0);
          }
        });
      }

      function focusMarker(id, animate) {
        const marker = markersById[id];
        if (!marker) return;
        applySelection(id);
        if (animate !== false) {
          map.panTo(marker.getLatLng(), { animate: true, duration: 0.35 });
        }
      }

      function publishViewport() {
        const bounds = map.getBounds();
        const visibleIds = points
          .filter((point) => bounds.contains([point.latitude, point.longitude]))
          .map((point) => point.id);

        post({ type: 'viewport_changed', visibleIds });
      }

      points.forEach((point) => {
        const marker = L.marker([point.latitude, point.longitude], {
          icon: buildPinIcon(point.priceLabel, false),
        }).addTo(map);

        marker.__qhphData = point;
        marker.on('click', () => {
          applySelection(point.id);
          post({ type: 'marker_press', eventId: point.id });
        });
        markersById[point.id] = marker;
      });

      const bounds = points.map((point) => [point.latitude, point.longitude]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      const firstId = points.length ? points[0].id : null;
      if (preselectedId && markersById[preselectedId]) {
        focusMarker(preselectedId, false);
      } else if (firstId) {
        applySelection(firstId);
      }

      map.on('moveend', () => {
        publishViewport();
        post({ type: 'map_moved' });
      });

      publishViewport();

      function setUserLocation(lat, lng) {
        const dot = L.divIcon({
          html: '<div class="user-dot"></div>',
          className: '',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        if (!userMarker) {
          userMarker = L.marker([lat, lng], { icon: dot, zIndexOffset: 1200 }).addTo(map);
        } else {
          userMarker.setLatLng([lat, lng]);
        }
      }

      function centerOnUser() {
        if (!userMarker) return false;
        map.flyTo(userMarker.getLatLng(), Math.max(map.getZoom(), 14), { duration: 0.5 });
        return true;
      }

      if (initialUserLocation && typeof initialUserLocation.lat === 'number' && typeof initialUserLocation.lng === 'number') {
        setUserLocation(initialUserLocation.lat, initialUserLocation.lng);
      }

      window.qhphMap = {
        focusMarker,
        setUserLocation,
        centerOnUser,
      };
    </script>
  </body>
</html>`;
}

export default function MapScreen() {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);

  const { mapPins, isLoadingMap, events, options, filters, setFilters } = useAppState();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewportIds, setViewportIds] = useState<string[]>([]);
  const [showViewportOnly, setShowViewportOnly] = useState(false);
  const [didMoveMap, setDidMoveMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [webMapReady, setWebMapReady] = useState(false);

  const eventsById = useMemo(() => new Map(events.map((event) => [event.id, event])), [events]);

  const mapPoints = useMemo<MapPoint[]>(
    () =>
      mapPins.map((pin) => {
        const event = eventsById.get(pin.id);
        const priceMin = event?.priceMin ?? pin.priceMin ?? null;
        const priceMax = event?.priceMax ?? pin.priceMax ?? null;
        return {
          id: pin.id,
          title: pin.title,
          category: event?.category.slug ?? pin.category,
          latitude: pin.latitude,
          longitude: pin.longitude,
          startAt: pin.startAt,
          coverImageUrl: event?.coverImageUrl ?? pin.coverImageUrl,
          venueName: event?.venue.name ?? 'Ubicacion por confirmar',
          priceMin,
          priceMax,
          priceLabel: getPriceLabel(priceMin, priceMax),
        };
      }),
    [eventsById, mapPins],
  );

  const filteredPoints = useMemo(
    () =>
      mapPoints.filter((point) => {
        if (filters.categories.length && !filters.categories.includes(point.category)) {
          return false;
        }

        const eventMin = point.priceMin ?? point.priceMax;
        const eventMax = point.priceMax ?? point.priceMin;

        if (filters.minPrice !== undefined && eventMax !== null && eventMax < filters.minPrice) {
          return false;
        }

        if (filters.maxPrice !== undefined && eventMin !== null && eventMin > filters.maxPrice) {
          return false;
        }

        return true;
      }),
    [filters.categories, filters.maxPrice, filters.minPrice, mapPoints],
  );

  const availablePointIds = useMemo(() => new Set(filteredPoints.map((point) => point.id)), [filteredPoints]);
  const visibleIdsSet = useMemo(() => new Set(viewportIds), [viewportIds]);

  const visiblePoints = useMemo(() => {
    if (!showViewportOnly) {
      return filteredPoints;
    }

    return filteredPoints.filter((point) => visibleIdsSet.has(point.id));
  }, [filteredPoints, showViewportOnly, visibleIdsSet]);

  const webMapHtml = useMemo(
    () => buildWebMapHtml(filteredPoints, selectedId, userLocation),
    [filteredPoints, selectedId, userLocation],
  );

  useEffect(() => {
    if (!selectedId || !availablePointIds.has(selectedId)) {
      setSelectedId(filteredPoints[0]?.id || null);
    }
  }, [availablePointIds, filteredPoints, selectedId]);

  useEffect(() => {
    setViewportIds(filteredPoints.map((point) => point.id));
    setShowViewportOnly(false);
    setDidMoveMap(false);
  }, [filteredPoints]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        lat: current.coords.latitude,
        lng: current.coords.longitude,
      });

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 20,
        },
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (!webMapReady || !userLocation || !webViewRef.current) {
      return;
    }

    webViewRef.current.injectJavaScript(
      `window.qhphMap && window.qhphMap.setUserLocation(${userLocation.lat}, ${userLocation.lng}); true;`,
    );
  }, [userLocation, webMapReady]);

  useEffect(() => {
    if (!webMapReady || !selectedId || !webViewRef.current) {
      return;
    }

    const safeId = escapesForJs(selectedId);
    webViewRef.current.injectJavaScript(`window.qhphMap && window.qhphMap.focusMarker('${safeId}', false); true;`);
  }, [selectedId, webMapReady]);

  const selectedPoint = useMemo(
    () => visiblePoints.find((point) => point.id === selectedId) || visiblePoints[0] || null,
    [selectedId, visiblePoints],
  );

  const handleWebMessage = (raw: string) => {
    try {
      const payload = JSON.parse(raw) as WebMapMessage;

      if (payload.type === 'marker_press') {
        setSelectedId(payload.eventId);
        return;
      }

      if (payload.type === 'viewport_changed') {
        setViewportIds(payload.visibleIds);
        return;
      }

      if (payload.type === 'map_moved') {
        setDidMoveMap(true);
      }
      return;
    } catch {
      if (raw) {
        setSelectedId(raw);
      }
    }
  };

  const toggleCategory = (slug: string) => {
    const selected = new Set(filters.categories);
    if (selected.has(slug)) {
      selected.delete(slug);
    } else {
      selected.add(slug);
    }

    setFilters({
      ...filters,
      categories: Array.from(selected),
    });
  };

  const centerOnUser = () => {
    webViewRef.current?.injectJavaScript('window.qhphMap && window.qhphMap.centerOnUser(); true;');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
        <Text style={{ color: '#f8fafc', fontSize: 24, fontWeight: '800' }}>Mapa estilo discovery</Text>
        <Text style={{ color: '#94a3b8' }}>
          {visiblePoints.length} eventos visibles {showViewportOnly ? 'en esta zona' : 'en la ciudad'}.
        </Text>
      </View>

      {isLoadingMap ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#22d3ee" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <WebView
            ref={webViewRef}
            style={{ flex: 1, backgroundColor: '#e2e8f0' }}
            source={{ html: webMapHtml }}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            onLoadEnd={() => setWebMapReady(true)}
            onMessage={(event) => handleWebMessage(event.nativeEvent.data)}
          />

          <View style={{ position: 'absolute', top: 10, left: 10, right: 10, gap: 8 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {options.categories.map((category) => {
                const active = filters.categories.includes(category.slug);
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => toggleCategory(category.slug)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: active ? '#22d3ee' : '#334155',
                      backgroundColor: active ? '#083344' : '#0f172a',
                    }}
                  >
                    <Text style={{ color: '#f8fafc', fontWeight: active ? '800' : '600' }}>{category.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {didMoveMap ? (
                <Pressable
                  onPress={() => {
                    setShowViewportOnly(true);
                    setDidMoveMap(false);
                  }}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 999,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Text style={{ color: '#0f172a', fontWeight: '800' }}>Buscar en esta zona</Text>
                </Pressable>
              ) : (
                <View />
              )}

              <Pressable
                onPress={centerOnUser}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: '#334155',
                }}
              >
                <Text style={{ color: '#f8fafc', fontWeight: '700' }}>Mi ubicacion</Text>
              </Pressable>
            </View>
          </View>

          <View
            style={{
              position: 'absolute',
              left: 10,
              right: 10,
              bottom: 10,
              gap: 8,
            }}
          >
            {showViewportOnly ? (
              <Pressable
                onPress={() => setShowViewportOnly(false)}
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#0f172a',
                  borderWidth: 1,
                  borderColor: '#334155',
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: '#f8fafc', fontWeight: '700' }}>Ver todos</Text>
              </Pressable>
            ) : null}

            <FlatList
              data={visiblePoints}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingRight: 8 }}
              renderItem={({ item }) => {
                const active = item.id === selectedPoint?.id;
                return (
                  <Pressable
                    onPress={() => {
                      setSelectedId(item.id);
                      const safeId = escapesForJs(item.id);
                      webViewRef.current?.injectJavaScript(
                        `window.qhphMap && window.qhphMap.focusMarker('${safeId}', true); true;`,
                      );
                    }}
                    style={{
                      width: 280,
                      backgroundColor: '#0f172a',
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: active ? '#22d3ee' : '#1e293b',
                      overflow: 'hidden',
                    }}
                  >
                    <Image source={{ uri: item.coverImageUrl }} style={{ width: '100%', height: 110 }} />
                    <View style={{ padding: 10, gap: 5 }}>
                      <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: '800' }} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={{ color: '#94a3b8' }} numberOfLines={1}>
                        {item.venueName}
                      </Text>
                      <Text style={{ color: '#94a3b8' }} numberOfLines={1}>
                        {new Date(item.startAt).toLocaleString('es-CO')}
                      </Text>
                      <Text style={{ color: '#22d3ee', fontWeight: '800' }}>
                        {getPriceLongLabel(item.priceMin, item.priceMax)}
                      </Text>
                      <Pressable
                        onPress={() => router.push({ pathname: '/event/[id]', params: { id: item.id } })}
                        style={{
                          marginTop: 4,
                          backgroundColor: '#22d3ee',
                          borderRadius: 10,
                          alignItems: 'center',
                          paddingVertical: 9,
                        }}
                      >
                        <Text style={{ color: '#032a30', fontWeight: '800' }}>Ver evento</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#1e293b',
                    padding: 12,
                  }}
                >
                  <Text style={{ color: '#f8fafc' }}>No hay eventos en esta zona con esos filtros.</Text>
                </View>
              }
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
