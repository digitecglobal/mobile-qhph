import { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface MiniMapProps {
  latitude: number;
  longitude: number;
  draggable?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  style?: any;
}

export function MiniMap({ latitude, longitude, draggable, onLocationChange, style }: MiniMapProps) {
  const webViewRef = useRef<WebView>(null);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #0f172a; }
          .leaflet-control-attribution { display: none; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const map = L.map('map', { 
            zoomControl: false,
            attributionControl: false 
          }).setView([${latitude}, ${longitude}], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          let marker = L.marker([${latitude}, ${longitude}], {
            draggable: ${!!draggable}
          }).addTo(map);

          if (${!!draggable}) {
            marker.on('dragend', function(event) {
              const position = marker.getLatLng();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'locationChange',
                lat: position.lat,
                lng: position.lng
              }));
            });

            map.on('click', function(e) {
              const lat = e.latlng.lat;
              const lng = e.latlng.lng;
              marker.setLatLng([lat, lng]);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'locationChange',
                lat: lat,
                lng: lng
              }));
            });
          }

          window.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'updateCoords') {
              const newPos = [data.lat, data.lng];
              marker.setLatLng(newPos);
              map.setView(newPos, map.getZoom(), { animate: true });
            }
          });
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'updateCoords',
        lat: latitude,
        lng: longitude
      }));
    }
  }, [latitude, longitude]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'locationChange' && onLocationChange) {
              onLocationChange(data.lat, data.lng);
            }
          } catch (e) {
            console.error('MiniMap message error:', e);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
