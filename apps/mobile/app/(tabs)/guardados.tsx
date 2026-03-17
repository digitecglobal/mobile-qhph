import { Link } from 'expo-router';
import { FlatList, Pressable, SafeAreaView, Text, View } from 'react-native';
import { useAppState } from '../../src/lib/app-state';

export default function SavedScreen() {
  const { events, savedIds, toggleSaved } = useAppState();

  const savedEvents = events.filter((event) => savedIds.includes(event.id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
        <Text style={{ color: '#f8fafc', fontSize: 24, fontWeight: '800' }}>Guardados</Text>
        <Text style={{ color: '#94a3b8' }}>Tus eventos favoritos para no llegar tarde.</Text>
      </View>

      <FlatList
        data={savedEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, gap: 10 }}
        renderItem={({ item }) => (
          <View
            style={{
              borderRadius: 12,
              backgroundColor: '#0b1729',
              borderWidth: 1,
              borderColor: '#1e293b',
              padding: 12,
              gap: 8,
            }}
          >
            <Text style={{ color: '#22d3ee', fontWeight: '700' }}>{item.category.name}</Text>
            <Text style={{ color: '#f8fafc', fontSize: 17, fontWeight: '800' }}>{item.title}</Text>
            <Text style={{ color: '#cbd5e1' }}>{new Date(item.startAt).toLocaleString('es-CO')}</Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Link
                href={{ pathname: '/event/[id]', params: { id: item.id } }}
                style={{
                  backgroundColor: '#22d3ee',
                  color: '#042f2e',
                  fontWeight: '800',
                  paddingHorizontal: 12,
                  paddingVertical: 9,
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                Abrir detalle
              </Link>

              <Pressable
                onPress={() => toggleSaved(item.id)}
                style={{
                  borderWidth: 1,
                  borderColor: '#f59e0b',
                  backgroundColor: '#451a03',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#f8fafc', fontWeight: '700' }}>Quitar</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 14 }}>
            <Text style={{ color: '#cbd5e1' }}>Aun no has guardado eventos.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
