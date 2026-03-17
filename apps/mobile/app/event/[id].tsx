import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { MiniMap } from '../../src/components/MiniMap';
import { openTicketLink } from '../../src/lib/api';
import { useAppState } from '../../src/lib/app-state';
import { EventCard } from '../../src/lib/types';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEventById, toggleSaved, savedIds, reportEventAction } = useAppState();

  const [event, setEvent] = useState<EventCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportDone, setReportDone] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!id) {
        return;
      }

      setLoading(true);
      const detail = await getEventById(id);
      if (mounted) {
        setEvent(detail);
        setLoading(false);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [getEventById, id]);

  if (loading || !event) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator color="#22d3ee" />
      </SafeAreaView>
    );
  }

  const isSaved = savedIds.includes(event.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Image source={{ uri: event.coverImageUrl }} style={{ width: '100%', height: 240 }} />

        <View style={{ padding: 16, gap: 10 }}>
          <Text style={{ color: '#22d3ee', fontWeight: '700' }}>{event.category.name}</Text>
          <Text style={{ color: '#f8fafc', fontSize: 28, fontWeight: '800' }}>{event.title}</Text>

          <Text style={{ color: '#cbd5e1' }}>{event.descriptionLong || event.descriptionShort}</Text>

          <Text style={{ color: '#94a3b8' }}>
            {new Date(event.startAt).toLocaleString('es-CO')} · {event.venue.name}
          </Text>
          <Text style={{ color: '#94a3b8' }}>{event.venue.addressLine}</Text>

          {event.venue.latitude && event.venue.longitude && (
            <View style={{ height: 180, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#334155', marginTop: 8 }}>
              <MiniMap
                latitude={event.venue.latitude}
                longitude={event.venue.longitude}
                style={{ flex: 1 }}
              />
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <Pressable
              onPress={() => toggleSaved(event.id)}
              style={{
                backgroundColor: isSaved ? '#451a03' : '#0f172a',
                borderWidth: 1,
                borderColor: isSaved ? '#f59e0b' : '#334155',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: '#f8fafc', fontWeight: '700' }}>{isSaved ? 'Guardado' : 'Guardar'}</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void openTicketLink(event.ticketUrl);
              }}
              style={{
                backgroundColor: '#22d3ee',
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: '#032a30', fontWeight: '800' }}>Entradas</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={async () => {
              await reportEventAction(event.id, 'Contenido desactualizado', 'Reporte enviado desde app mobile');
              setReportDone(true);
            }}
            style={{
              marginTop: 8,
              borderWidth: 1,
              borderColor: '#334155',
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#e2e8f0', fontWeight: '700' }}>Reportar evento</Text>
          </Pressable>

          {reportDone ? <Text style={{ color: '#86efac' }}>Reporte enviado.</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
