import { Stack } from 'expo-router';
import { AppStateProvider } from '../src/lib/app-state';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#04111f' },
          headerTintColor: '#f8fafc',
          contentStyle: { backgroundColor: '#020617' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ title: 'Detalle del evento' }} />
        <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
      </Stack>
    </AppStateProvider>
  );
}
