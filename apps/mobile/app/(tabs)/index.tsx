import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAppState } from '../../src/lib/app-state';

function formatPrice(min: number | null, max: number | null) {
  if (min === null && max === null) {
    return 'Precio por confirmar';
  }

  if (min === 0 && max === 0) {
    return 'Gratis';
  }

  if (min !== null && max !== null) {
    return `$${min.toLocaleString('es-CO')} - $${max.toLocaleString('es-CO')}`;
  }

  if (min !== null) {
    return `Desde $${min.toLocaleString('es-CO')}`;
  }

  return `Hasta $${(max || 0).toLocaleString('es-CO')}`;
}

export default function FeedScreen() {
  const {
    events,
    isLoadingFeed,
    feedSource,
    filters,
    setFilters,
    clearFilters,
    refreshFeed,
    toggleSaved,
    options,
  } = useAppState();

  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');

  const selectedCategories = useMemo(() => new Set(filters.categories), [filters.categories]);

  const applyPrice = () => {
    setFilters({
      ...filters,
      minPrice: minInput ? Number(minInput) : undefined,
      maxPrice: maxInput ? Number(maxInput) : undefined,
    });
  };

  const toggleCategory = (slug: string) => {
    if (selectedCategories.has(slug)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter((item) => item !== slug),
      });
      return;
    }

    setFilters({
      ...filters,
      categories: [...filters.categories, slug],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        onRefresh={refreshFeed}
        refreshing={isLoadingFeed}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: '#f8fafc', fontSize: 24, fontWeight: '800' }}>Que hay pa' hacer</Text>
              <View
                style={{
                  backgroundColor: feedSource === 'api' ? '#0f766e' : '#334155',
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: '#f8fafc', fontSize: 12, fontWeight: '700' }}>
                  {feedSource === 'api' ? 'API' : 'DEMO'}
                </Text>
              </View>
            </View>

            <Text style={{ color: '#94a3b8' }}>Descubre eventos en Bogota por categoria y precio.</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {options.categories.map((category) => {
                const active = selectedCategories.has(category.slug);
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
                    <Text style={{ color: '#f8fafc', fontWeight: active ? '700' : '500' }}>{category.name}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                value={minInput}
                onChangeText={setMinInput}
                placeholder="Min"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#334155',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  color: '#f8fafc',
                }}
              />
              <TextInput
                value={maxInput}
                onChangeText={setMaxInput}
                placeholder="Max"
                placeholderTextColor="#64748b"
                keyboardType="number-pad"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#334155',
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  color: '#f8fafc',
                }}
              />
              <Pressable
                onPress={applyPrice}
                style={{
                  backgroundColor: '#0891b2',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#f8fafc', fontWeight: '700' }}>Aplicar</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setMinInput('');
                setMaxInput('');
                clearFilters();
              }}
            >
              <Text style={{ color: '#22d3ee', fontWeight: '700' }}>Limpiar filtros</Text>
            </Pressable>

            {isLoadingFeed ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator color="#22d3ee" />
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 14,
              borderRadius: 14,
              backgroundColor: '#0b1729',
              borderWidth: 1,
              borderColor: '#1e293b',
              overflow: 'hidden',
            }}
          >
            <Image source={{ uri: item.coverImageUrl }} style={{ width: '100%', height: 160 }} />

            <View style={{ padding: 12, gap: 8 }}>
              <Text style={{ color: '#22d3ee', fontSize: 12, fontWeight: '700' }}>{item.category.name}</Text>
              <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '800' }}>{item.title}</Text>
              <Text style={{ color: '#cbd5e1' }} numberOfLines={2}>
                {item.descriptionShort}
              </Text>
              <Text style={{ color: '#94a3b8' }}>
                {new Date(item.startAt).toLocaleString('es-CO')} · {item.venue.name}
              </Text>
              <Text style={{ color: '#94a3b8' }}>{formatPrice(item.priceMin, item.priceMax)}</Text>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
                <Link
                  href={{ pathname: '/event/[id]', params: { id: item.id } }}
                  style={{
                    backgroundColor: '#22d3ee',
                    color: '#042f2e',
                    fontWeight: '800',
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                >
                  Ver detalle
                </Link>

                <Pressable
                  onPress={() => toggleSaved(item.id)}
                  style={{
                    borderWidth: 1,
                    borderColor: item.isBookmarked ? '#f59e0b' : '#334155',
                    backgroundColor: item.isBookmarked ? '#451a03' : '#0f172a',
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#f8fafc', fontWeight: '700' }}>
                    {item.isBookmarked ? 'Guardado' : 'Guardar'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !isLoadingFeed ? (
            <View style={{ padding: 16 }}>
              <Text style={{ color: '#f8fafc' }}>No hay eventos con esos filtros.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
