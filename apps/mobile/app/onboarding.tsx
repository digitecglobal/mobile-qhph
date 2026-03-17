import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useAppState } from '../src/lib/app-state';

export default function OnboardingScreen() {
  const router = useRouter();
  const { options, filters, setFilters } = useAppState();

  const selectedCategories = useMemo(() => new Set(filters.categories), [filters.categories]);

  const toggleCategory = (slug: string) => {
    if (selectedCategories.has(slug)) {
      setFilters({ ...filters, categories: filters.categories.filter((item) => item !== slug) });
      return;
    }

    setFilters({ ...filters, categories: [...filters.categories, slug] });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text style={{ color: '#f8fafc', fontSize: 26, fontWeight: '800' }}>Bienvenido a Que hay pa' hacer</Text>
        <Text style={{ color: '#94a3b8' }}>Selecciona tus intereses iniciales para priorizar el feed.</Text>

        <View style={{ gap: 8 }}>
          {options.categories.map((category) => {
            const active = selectedCategories.has(category.slug);
            return (
              <Pressable
                key={category.id}
                onPress={() => toggleCategory(category.slug)}
                style={{
                  borderWidth: 1,
                  borderColor: active ? '#22d3ee' : '#334155',
                  backgroundColor: active ? '#083344' : '#0f172a',
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: '#f8fafc', fontWeight: active ? '700' : '500' }}>{category.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => router.replace('/(tabs)')}
          style={{
            marginTop: 8,
            backgroundColor: '#22d3ee',
            borderRadius: 10,
            paddingVertical: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#032a30', fontWeight: '800' }}>Continuar al feed</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
