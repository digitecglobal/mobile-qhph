import { Tabs } from 'expo-router';
import { Bookmark, Compass, Home, Store } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#04111f' },
        headerTintColor: '#f8fafc',
        tabBarStyle: {
          backgroundColor: '#04111f',
          borderTopColor: '#1e293b',
        },
        tabBarActiveTintColor: '#22d3ee',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="guardados"
        options={{
          title: 'Guardados',
          tabBarIcon: ({ color, size }) => <Bookmark color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="organizador"
        options={{
          title: 'Organizador',
          tabBarIcon: ({ color, size }) => <Store color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
