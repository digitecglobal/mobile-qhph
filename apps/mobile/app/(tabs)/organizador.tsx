import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MiniMap } from '../../src/components/MiniMap';
import * as ImagePicker from 'expo-image-picker';
import { useAppState } from '../../src/lib/app-state';
import { OrganizerEventInput } from '../../src/lib/types';

// ─── Custom Date/Time Picker ──────────────────────────────────────────────
function DatePickerModal({
  visible,
  value,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}) {
  const now = new Date();
  const [year, setYear] = useState(value.getFullYear());
  const [month, setMonth] = useState(value.getMonth());
  const [day, setDay] = useState(value.getDate());
  const [hour, setHour] = useState(value.getHours());
  const [minute, setMinute] = useState(value.getMinutes());

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const confirm = () => {
    const d = new Date(year, month, Math.min(day, daysInMonth), hour, minute);
    onConfirm(d);
    onClose();
  };

  const Row = ({ label, val, onMinus, onPlus }: { label: string; val: string; onMinus: () => void; onPlus: () => void }) => (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Text style={{ color: '#94a3b8', fontSize: 11 }}>{label}</Text>
      <TouchableOpacity onPress={onPlus} style={{ padding: 6 }}>
        <Text style={{ color: '#22d3ee', fontSize: 20 }}>▲</Text>
      </TouchableOpacity>
      <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '700', minWidth: 44, textAlign: 'center' }}>{val}</Text>
      <TouchableOpacity onPress={onMinus} style={{ padding: 6 }}>
        <Text style={{ color: '#22d3ee', fontSize: 20 }}>▼</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: '#0b1729', borderRadius: 20, padding: 24, width: '100%', gap: 20, borderWidth: 1, borderColor: '#1e293b' }}>
          <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: '800', textAlign: 'center' }}>📅 Seleccionar fecha y hora</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Row label="Día" val={String(day).padStart(2, '0')}
              onPlus={() => setDay(d => d >= daysInMonth ? 1 : d + 1)}
              onMinus={() => setDay(d => d <= 1 ? daysInMonth : d - 1)} />
            <Row label="Mes" val={months[month]}
              onPlus={() => setMonth(m => m >= 11 ? 0 : m + 1)}
              onMinus={() => setMonth(m => m <= 0 ? 11 : m - 1)} />
            <Row label="Año" val={String(year)}
              onPlus={() => setYear(y => y + 1)}
              onMinus={() => setYear(y => y > now.getFullYear() ? y - 1 : y)} />
          </View>

          <View style={{ height: 1, backgroundColor: '#1e293b' }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <Row label="Hora" val={String(hour).padStart(2, '0')}
              onPlus={() => setHour(h => h >= 23 ? 0 : h + 1)}
              onMinus={() => setHour(h => h <= 0 ? 23 : h - 1)} />
            <Row label="Minutos" val={String(minute).padStart(2, '0')}
              onPlus={() => setMinute(m => m >= 55 ? 0 : m + 5)}
              onMinus={() => setMinute(m => m <= 0 ? 55 : m - 5)} />
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={onClose} style={{ flex: 1, borderRadius: 10, borderWidth: 1, borderColor: '#334155', paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#94a3b8', fontWeight: '700' }}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={confirm} style={{ flex: 1, borderRadius: 10, backgroundColor: '#22d3ee', paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#032a30', fontWeight: '800' }}>Confirmar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Design Tokens ─────────────────────────────────────────────────────────
const C = {
  bg: '#020617',
  card: '#0b1729',
  border: '#1e293b',
  borderActive: '#22d3ee',
  text: '#f8fafc',
  muted: '#94a3b8',
  labelText: '#e2e8f0',
  accent: '#22d3ee',
  accentBg: '#083344',
  danger: '#ef4444',
  success: '#22c55e',
  warn: '#f59e0b',
};

function FieldLabel({ label }: { label: string }) {
  return <Text style={{ color: C.labelText, fontWeight: '700', marginBottom: 4 }}>{label}</Text>;
}

function StyledInput({
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType,
  autoCapitalize,
  editable,
  numberOfLines,
  onBlur,
  onSubmitEditing,
  returnKeyType,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  editable?: boolean;
  numberOfLines?: number;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      onSubmitEditing={onSubmitEditing}
      placeholder={placeholder}
      placeholderTextColor="#475569"
      multiline={multiline}
      numberOfLines={numberOfLines}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize || 'sentences'}
      returnKeyType={returnKeyType}
      editable={editable !== false}
      style={{
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 10,
        color: C.text,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: multiline ? 80 : undefined,
        textAlignVertical: multiline ? 'top' : 'center',
        backgroundColor: '#0f172a',
        fontSize: 15,
      }}
    />
  );
}

function ChipSelector<T extends string>({
  options,
  value,
  onSelect,
  multiple,
  labelKey = 'name',
}: {
  options: any[];
  value: T | T[];
  onSelect: (val: T | T[]) => void;
  multiple?: boolean;
  labelKey?: string;
}) {
  const isSelected = (id: T) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(id);
    }
    return value === id;
  };

  const handlePress = (id: T) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      if (current.includes(id)) {
        onSelect(current.filter((v) => v !== id) as T[]);
      } else {
        onSelect([...current, id] as T[]);
      }
    } else {
      onSelect(id as T);
    }
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const active = isSelected(opt.id);
        return (
          <Pressable
            key={opt.id}
            onPress={() => handlePress(opt.id)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: active ? C.accent : C.border,
              backgroundColor: active ? C.accentBg : '#0f172a',
            }}
          >
            <Text style={{ color: C.text, fontWeight: active ? '700' : '400', fontSize: 13 }}>
              {opt[labelKey]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function AddressPicker({
  address,
  setAddress,
  latitude,
  longitude,
  onLocationChange,
}: {
  address: string;
  setAddress: (a: string) => void;
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const timerRef = useRef<any>(null);

  const parseCoordinates = (item: any) => {
    const lat = parseFloat(item?.lat);
    const lng = parseFloat(item?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }
    return { lat, lng };
  };

  const fetchSuggestions = async (text: string, limit = 5) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&limit=${limit}&addressdetails=1&countrycodes=co`,
      {
        headers: {
          'User-Agent': 'QHPH-Mobile-App/1.0',
        },
      }
    );

    const contentType = res.headers.get('content-type');
    if (!res.ok || !contentType || !contentType.includes('application/json')) {
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  };

  const searchAddress = async (text: string) => {
    setAddress(text);
    if (text.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const data = await fetchSuggestions(text, 5);
        setSuggestions(data);
        setShowSuggestions(data.length > 0);

        // Auto-ajuste del marcador con el primer resultado mientras escribe
        if (data[0]) {
          const coords = parseCoordinates(data[0]);
          if (coords) {
            onLocationChange(coords.lat, coords.lng);
          }
        }
      } catch (e) {
        console.error('Nominatim search error:', e);
      }
    }, 600); // 600ms debounce
  };

  const handleSelect = (item: any) => {
    const coords = parseCoordinates(item);
    if (!coords) {
      return;
    }
    setAddress(item.display_name);
    onLocationChange(coords.lat, coords.lng);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const resolveTypedAddress = async () => {
    const text = address.trim();
    if (text.length < 3) {
      return;
    }

    try {
      const first = suggestions[0] ?? (await fetchSuggestions(text, 1))[0];
      if (!first) {
        return;
      }
      handleSelect(first);
    } catch (e) {
      console.error('Resolve address error:', e);
    }
  };

  return (
    <View style={{ gap: 10 }}>
      <View style={{ zIndex: 10 }}>
        <StyledInput
          value={address}
          onChangeText={searchAddress}
          onBlur={resolveTypedAddress}
          onSubmitEditing={resolveTypedAddress}
          returnKeyType="search"
          placeholder="Busca una dirección o lugar..."
        />
        {showSuggestions && suggestions.length > 0 && (
          <View style={{
            position: 'absolute',
            top: 48,
            left: 0,
            right: 0,
            backgroundColor: '#1e293b',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: C.border,
            zIndex: 999,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 15,
            maxHeight: 250,
            overflow: 'hidden',
          }}>
            <ScrollView bounces={false}>
              {suggestions.map((item, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleSelect(item)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    backgroundColor: pressed ? '#334155' : 'transparent',
                    borderBottomWidth: idx === suggestions.length - 1 ? 0 : 1,
                    borderBottomColor: '#334155',
                    gap: 10,
                  })}
                >
                  <Text style={{ fontSize: 16 }}>📍</Text>
                  <Text style={{ color: C.text, fontSize: 13, flex: 1 }} numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={{
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: C.border,
        backgroundColor: '#1e293b'
      }}>
        <MiniMap
          latitude={latitude || 4.6097}
          longitude={longitude || -74.0817}
          draggable
          onLocationChange={onLocationChange}
          style={{ flex: 1 }}
        />
        <View style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          padding: 6,
          borderRadius: 6,
        }}>
          <Text style={{ color: C.muted, fontSize: 10, textAlign: 'center' }}>
            Toca el mapa o arrastra el marcador para ajustar la ubicación exacta.
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '',
  descriptionShort: '',
  descriptionLong: '',
  coverImageUrl: '',
  ticketUrl: '',
  address: '',
  priceMin: '',
  priceMax: '',
  ageRestriction: [] as string[],
  status: 'published' as 'draft' | 'published',
  startAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  latitude: null as number | null,
  longitude: null as number | null,
};

export default function OrganizerScreen() {
  const {
    options,
    apiToken,
    setApiToken,
    organizerEvents,
    createOrganizerEventAction,
    updateOrganizerEventAction,
    deleteOrganizerEventAction,
    refreshOrganizerEvents,
  } = useAppState();

  const defaultCategory = options.categories[0];
  const defaultVenue = options.venues[0];
  const defaultCity = options.cities[0];

  // ── Form State ──────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState(EMPTY_FORM.title);
  const [descriptionShort, setDescriptionShort] = useState(EMPTY_FORM.descriptionShort);
  const [descriptionLong, setDescriptionLong] = useState(EMPTY_FORM.descriptionLong);
  const [coverImageUrl, setCoverImageUrl] = useState(EMPTY_FORM.coverImageUrl);
  const [ticketUrl, setTicketUrl] = useState(EMPTY_FORM.ticketUrl);
  const [address, setAddress] = useState(EMPTY_FORM.address);
  const [priceMin, setPriceMin] = useState(EMPTY_FORM.priceMin);
  const [priceMax, setPriceMax] = useState(EMPTY_FORM.priceMax);
  const [status, setStatus] = useState<'draft' | 'published'>(EMPTY_FORM.status);
  const [startAt, setStartAt] = useState(EMPTY_FORM.startAt);
  const [categoryId, setCategoryId] = useState(defaultCategory?.id || '');
  const [ageRestriction, setAgeRestriction] = useState<string[]>(EMPTY_FORM.ageRestriction);
  const [latitude, setLatitude] = useState<number | null>(EMPTY_FORM.latitude);
  const [longitude, setLongitude] = useState<number | null>(EMPTY_FORM.longitude);

  // ── UI State ─────────────────────────────────────────────────────────────
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const cityId = defaultCity?.id || '11111111-1111-4111-8111-111111111111';

  // ── Validation ────────────────────────────────────────────────────────────
  const canSubmit = useMemo(
    () => !!title.trim() && !!descriptionShort.trim() && !!categoryId && ageRestriction.length > 0 && !!address.trim(),
    [categoryId, descriptionShort, title, ageRestriction, address],
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescriptionShort('');
    setDescriptionLong('');
    setCoverImageUrl('');
    setTicketUrl('');
    setAddress('');
    setPriceMin('');
    setPriceMax('');
    setAgeRestriction([]);
    setLatitude(null);
    setLongitude(null);
    setStatus('published');
    setStartAt(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000));
    setCategoryId(defaultCategory?.id || '');
    setMessage(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const loadEventIntoForm = (event: any) => {
    setEditingId(event.id);
    setTitle(event.title || '');
    setDescriptionShort(event.descriptionShort || '');
    setDescriptionLong(event.descriptionLong || '');
    setCoverImageUrl(event.coverImageUrl || '');
    setTicketUrl(event.ticketUrl || '');
    setAddress(event.address || '');
    setPriceMin(event.priceMin?.toString() || '');
    setPriceMax(event.priceMax?.toString() || '');
    setAgeRestriction(Array.isArray(event.ageRestriction) ? event.ageRestriction : []);
    setLatitude(event.latitude ?? null);
    setLongitude(event.longitude ?? null);
    setStatus(event.status as 'draft' | 'published');
    setStartAt(new Date(event.startAt));
    setCategoryId(event.categoryId || defaultCategory?.id || '');
    setMessage(null);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  // ── Image Picker ──────────────────────────────────────────────────────────
  const pickImage = useCallback(async () => {
    const { status: permStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permStatus !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para adjuntar imágenes.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.85,
      aspect: [16, 9],
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setCoverImageUrl(result.assets[0].uri);
    }
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const submit = async () => {
    if (!canSubmit) {
      setMessage({ text: 'Completa los campos requeridos.', ok: false });
      return;
    }
    setIsSubmitting(true);
    const payload: OrganizerEventInput = {
      title: title.trim(),
      descriptionShort: descriptionShort.trim(),
      descriptionLong: descriptionLong.trim() || undefined,
      coverImageUrl: coverImageUrl.trim() || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
      categoryId,
      cityId,
      countryCode: 'CO',
      timezone: 'America/Bogota',
      startAt: startAt.toISOString(),
      ticketUrl: ticketUrl.trim() || null,
      priceMin: priceMin ? parseFloat(priceMin) : null,
      priceMax: priceMax ? parseFloat(priceMax) : null,
      address: address.trim(),
      ageRestriction,
      latitude,
      longitude,
      status,
    };

    let result: { ok: boolean; message: string };
    if (editingId) {
      result = await updateOrganizerEventAction(editingId, payload);
    } else {
      result = await createOrganizerEventAction(payload);
    }

    setMessage({ text: result.message, ok: result.ok });
    setIsSubmitting(false);

    if (result.ok) {
      resetForm();
      await refreshOrganizerEvents();
    }
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const shareEvent = async (event: (typeof organizerEvents)[0]) => {
    try {
      await Share.share({
        message: `¡Mira este evento! 📅 ${event.title} — ${new Date(event.startAt).toLocaleDateString('es-CO')}. Descúbrelo en Que hay pa' hacer 🎉`,
        title: event.title,
      });
    } catch { }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = (event: (typeof organizerEvents)[0]) => {
    Alert.alert(
      'Eliminar evento',
      `¿Seguro que deseas eliminar "${event.title}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteOrganizerEventAction(event.id);
            setMessage({ text: result.message, ok: result.ok });
          },
        },
      ],
    );
  };

  const statusColor = (s: string) => {
    if (s === 'published') return C.success;
    if (s === 'draft') return C.warn;
    return C.muted;
  };

  const formTitle = editingId ? '✏️ Editar evento' : '➕ Nuevo evento';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 16, paddingBottom: 60, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View>
          <Text style={{ color: C.text, fontSize: 24, fontWeight: '800' }}>Portal organizador</Text>
          <Text style={{ color: C.muted, marginTop: 2 }}>
            Crea, edita y publica eventos. Sin token funciona en modo demo.
          </Text>
        </View>

        {/* API Token */}
        <View style={{ gap: 4 }}>
          <FieldLabel label="Bearer Token API (opcional)" />
          <StyledInput
            value={apiToken}
            onChangeText={setApiToken}
            placeholder="eyJhbGciOi..."
            autoCapitalize="none"
          />
        </View>

        {/* ── FORMULARIO ────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: C.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: C.border,
            padding: 16,
            gap: 14,
          }}
        >
          <Text style={{ color: C.text, fontSize: 18, fontWeight: '800' }}>{formTitle}</Text>

          {/* Cover Image */}
          <View style={{ gap: 6 }}>
            <FieldLabel label="Imagen de portada" />
            <Pressable
              onPress={pickImage}
              style={{
                height: 180,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: C.border,
                borderStyle: coverImageUrl ? 'solid' : 'dashed',
                backgroundColor: '#0f172a',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {coverImageUrl ? (
                <Image source={{ uri: coverImageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 36 }}>🖼️</Text>
                  <Text style={{ color: C.muted }}>Toca para elegir imagen desde la galería</Text>
                </View>
              )}
            </Pressable>
            {coverImageUrl ? (
              <Pressable onPress={() => setCoverImageUrl('')}>
                <Text style={{ color: C.danger, fontSize: 12, textAlign: 'right' }}>Quitar imagen</Text>
              </Pressable>
            ) : (
              <View style={{ gap: 4 }}>
                <Text style={{ color: C.muted, fontSize: 12 }}>O pega una URL:</Text>
                <StyledInput
                  value={coverImageUrl}
                  onChangeText={setCoverImageUrl}
                  placeholder="https://..."
                  autoCapitalize="none"
                />
              </View>
            )}
          </View>

          {/* Título */}
          <View style={{ gap: 4 }}>
            <FieldLabel label="Título *" />
            <StyledInput value={title} onChangeText={setTitle} placeholder="Ej: Festival Bogotá Vibra" />
          </View>

          {/* Descripción corta */}
          <View style={{ gap: 4 }}>
            <FieldLabel label="Descripción corta *" />
            <StyledInput
              value={descriptionShort}
              onChangeText={setDescriptionShort}
              placeholder="Describe el evento en 1-2 líneas"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Descripción larga / Recomendaciones */}
          <View style={{ gap: 4 }}>
            <FieldLabel label="Recomendaciones / Descripción completa" />
            <StyledInput
              value={descriptionLong}
              onChangeText={setDescriptionLong}
              placeholder="Restricciones de edad, qué llevar, cómo llegar, etc."
              multiline
              numberOfLines={5}
            />
          </View>



          {/* Fecha y Hora */}
          <View style={{ gap: 4 }}>
            <FieldLabel label="Fecha y hora de inicio *" />
            <Pressable
              onPress={() => setDatePickerVisible(true)}
              style={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                backgroundColor: '#0f172a',
                paddingHorizontal: 12,
                paddingVertical: 12,
              }}
            >
              <Text style={{ color: C.text, fontSize: 15 }}>
                📅{' '}
                {startAt.toLocaleString('es-CO', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </Text>
            </Pressable>
          </View>

          {/* Ticket URL */}
          <View style={{ gap: 4 }}>
            <FieldLabel label="URL de tickets (opcional)" />
            <StyledInput
              value={ticketUrl}
              onChangeText={setTicketUrl}
              placeholder="https://tuboletería.com/..."
              autoCapitalize="none"
            />
          </View>

          {/* Precios */}
          <View style={{ gap: 4 }}>
            <FieldLabel label="Precio (COP)" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ color: C.muted, fontSize: 12 }}>Desde</Text>
                <StyledInput
                  value={priceMin}
                  onChangeText={setPriceMin}
                  placeholder="0 = gratis"
                  keyboardType="decimal-pad"
                  autoCapitalize="none"
                />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ color: C.muted, fontSize: 12 }}>Hasta</Text>
                <StyledInput
                  value={priceMax}
                  onChangeText={setPriceMax}
                  placeholder="Ej: 80000"
                  keyboardType="decimal-pad"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Ubicación (Dirección y Mapa) */}
          <View style={{ gap: 6 }}>
            <FieldLabel label="Ubicación del evento *" />
            <AddressPicker
              address={address}
              setAddress={setAddress}
              latitude={latitude}
              longitude={longitude}
              onLocationChange={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
          </View>

          {/* Categoría */}
          <View style={{ gap: 6 }}>
            <FieldLabel label="Categoría *" />
            <ChipSelector options={options.categories} value={categoryId} onSelect={setCategoryId as any} />
          </View>

          {/* Restricción de Edad */}
          <View style={{ gap: 6 }}>
            <FieldLabel label="Edad permitida (Múltiple) *" />
            <ChipSelector
              multiple
              options={[
                { id: 'Todo público', name: 'Todo público' },
                { id: 'Mayores de 12', name: 'Mayores 12+' },
                { id: 'Mayores de 18', name: 'Mayores 18+' },
              ]}
              value={ageRestriction}
              onSelect={setAgeRestriction as any}
            />
          </View>

          {/* Estado */}
          <View style={{ gap: 6 }}>
            <FieldLabel label="Estado de publicación" />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['draft', 'published'] as const).map((val) => {
                const active = status === val;
                return (
                  <Pressable
                    key={val}
                    onPress={() => setStatus(val)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 10,
                      alignItems: 'center',
                      borderWidth: 1.5,
                      borderColor: active ? (val === 'published' ? C.success : C.warn) : C.border,
                      backgroundColor: active ? (val === 'published' ? '#052e16' : '#451a03') : '#0f172a',
                    }}
                  >
                    <Text style={{ color: active ? (val === 'published' ? C.success : C.warn) : C.muted, fontWeight: '700' }}>
                      {val === 'published' ? '✅ Publicado' : '📝 Borrador'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Mensaje de feedback */}
          {message && (
            <View
              style={{
                borderRadius: 10,
                padding: 12,
                backgroundColor: message.ok ? '#052e16' : '#450a0a',
                borderWidth: 1,
                borderColor: message.ok ? C.success : C.danger,
              }}
            >
              <Text style={{ color: message.ok ? C.success : C.danger, fontWeight: '600' }}>{message.text}</Text>
            </View>
          )}

          {/* Botones de acción */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            {/* Vista previa */}
            <Pressable
              onPress={() => setPreviewVisible(true)}
              disabled={!title.trim()}
              style={{
                flex: 1,
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: title.trim() ? C.accent : C.border,
                backgroundColor: 'transparent',
              }}
            >
              <Text style={{ color: title.trim() ? C.accent : C.muted, fontWeight: '700' }}>
                👁 Previsualizar
              </Text>
            </Pressable>

            {/* Submit */}
            <Pressable
              onPress={submit}
              disabled={!canSubmit || isSubmitting}
              style={{
                flex: 2,
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
                backgroundColor: canSubmit && !isSubmitting ? C.accent : '#1e293b',
              }}
            >
              <Text style={{ color: canSubmit && !isSubmitting ? '#032a30' : C.muted, fontWeight: '800', fontSize: 15 }}>
                {isSubmitting ? '⏳ Guardando...' : editingId ? '💾 Guardar cambios' : '🚀 Publicar evento'}
              </Text>
            </Pressable>
          </View>

          {editingId && (
            <Pressable onPress={resetForm} style={{ alignItems: 'center', paddingVertical: 8 }}>
              <Text style={{ color: C.muted, fontSize: 13 }}>✕ Cancelar edición</Text>
            </Pressable>
          )}
        </View>

        {/* ── MIS EVENTOS ─────────────────────────────────────────── */}
        <View style={{ gap: 10 }}>
          <Text style={{ color: C.text, fontSize: 18, fontWeight: '800' }}>Mis eventos</Text>
          {organizerEvents.length === 0 ? (
            <View
              style={{
                backgroundColor: C.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: C.border,
                padding: 24,
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 32 }}>🗒️</Text>
              <Text style={{ color: C.muted, textAlign: 'center' }}>
                Aún no tienes eventos. ¡Crea el primero arriba!
              </Text>
            </View>
          ) : (
            organizerEvents.map((event) => (
              <View
                key={event.id}
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: C.border,
                  backgroundColor: C.card,
                  padding: 14,
                  gap: 6,
                }}
              >
                {/* Info */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: C.text, fontWeight: '700', flex: 1, marginRight: 8 }} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <View
                    style={{
                      backgroundColor: event.status === 'published' ? '#052e16' : '#451a03',
                      borderRadius: 999,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                    }}
                  >
                    <Text style={{ color: statusColor(event.status), fontSize: 11, fontWeight: '700' }}>
                      {event.status === 'published' ? '✅ Publicado' : '📝 Borrador'}
                    </Text>
                  </View>
                </View>

                <Text style={{ color: C.muted, fontSize: 13 }}>
                  📅 {new Date(event.startAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                </Text>

                {/* Acciones */}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  <Pressable
                    onPress={() => loadEventIntoForm(event)}
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: C.accent,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: C.accent, fontWeight: '700', fontSize: 13 }}>✏️ Editar</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => shareEvent(event)}
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: C.border,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: C.muted, fontWeight: '700', fontSize: 13 }}>📤 Compartir</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => confirmDelete(event)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: C.danger,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: C.danger, fontWeight: '700', fontSize: 13 }}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* ── DATE PICKER MODAL ────────────────────────────────────── */}
      <DatePickerModal
        visible={datePickerVisible}
        value={startAt}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={(date) => setStartAt(date)}
      />

      {/* ── PREVIEW MODAL ────────────────────────────────────────── */}
      <Modal visible={previewVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: C.text, fontSize: 20, fontWeight: '800' }}>Vista previa</Text>
              <Pressable onPress={() => setPreviewVisible(false)}>
                <Text style={{ color: C.accent, fontSize: 16, fontWeight: '700' }}>Cerrar</Text>
              </Pressable>
            </View>

            {coverImageUrl && (
              <Image
                source={{ uri: coverImageUrl }}
                style={{ width: '100%', height: 200, borderRadius: 14 }}
                resizeMode="cover"
              />
            )}

            <Text style={{ color: C.text, fontSize: 22, fontWeight: '800' }}>{title || 'Sin título'}</Text>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ backgroundColor: C.accentBg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                <Text style={{ color: C.accent, fontWeight: '700', fontSize: 13 }}>
                  {options.categories.find((c) => c.id === categoryId)?.name || 'Categoría'}
                </Text>
              </View>
              {ageRestriction.length > 0 && (
                <View style={{ backgroundColor: '#1e293b', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                  <Text style={{ color: C.text, fontWeight: '600', fontSize: 13 }}>
                    🔞 {ageRestriction.join(', ')}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              {priceMin !== '' || priceMax !== '' ? (
                <View style={{ backgroundColor: '#1e293b', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                  <Text style={{ color: C.text, fontWeight: '600', fontSize: 13 }}>
                    💰 {priceMin || '0'} – {priceMax || '?'} COP
                  </Text>
                </View>
              ) : (
                <View style={{ backgroundColor: '#052e16', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 }}>
                  <Text style={{ color: C.success, fontWeight: '600', fontSize: 13 }}>🆓 Gratis</Text>
                </View>
              )}
            </View>

            <Text style={{ color: C.muted, fontSize: 14 }}>
              📅 {startAt.toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'short' })}
            </Text>

            {address.trim() && (
              <Text style={{ color: C.muted, fontSize: 14 }}>📍 {address}</Text>
            )}

            {latitude != null && longitude != null && (
              <View style={{ height: 150, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
                <MiniMap
                  latitude={latitude}
                  longitude={longitude}
                  style={{ flex: 1 }}
                />
              </View>
            )}

            <Text style={{ color: C.labelText, fontSize: 15, lineHeight: 22 }}>
              {descriptionShort || 'Sin descripción corta.'}
            </Text>

            {descriptionLong.trim() && (
              <View
                style={{
                  backgroundColor: C.card,
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: C.border,
                  gap: 6,
                }}
              >
                <Text style={{ color: C.text, fontWeight: '700' }}>💡 Recomendaciones</Text>
                <Text style={{ color: C.muted, lineHeight: 20 }}>{descriptionLong}</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
