import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Polyline, Circle, Callout, PROVIDER_GOOGLE } from 'react-native-maps';

export default function App() {
  const mapRef = useRef(null);
  const [mapType, setMapType] = useState('standard');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [customMarkers, setCustomMarkers] = useState([]);

  // Yatay 240, Buenos Aires, Argentina coordinates
  const yatay240 = {
    latitude: -34.6037,
    longitude: -58.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Puntos de interés cerca de Yatay 240
  const markers = [
    {
      id: 1,
      coordinate: { latitude: -34.6037, longitude: -58.4194 },
      title: 'Yatay 240',
      description: 'Ubicación Principal',
      pinColor: 'red',
    },
    {
      id: 2,
      coordinate: { latitude: -34.6050, longitude: -58.4180 },
      title: 'Cafetería',
      description: 'Excelente lugar para café',
      pinColor: 'blue',
    },
    {
      id: 3,
      coordinate: { latitude: -34.6020, longitude: -58.4210 },
      title: 'Parque',
      description: 'Hermoso espacio verde',
      pinColor: 'green',
    },
  ];

  // Route example (polyline)
  const routeCoordinates = [
    { latitude: -34.6037, longitude: -58.4194 },
    { latitude: -34.6045, longitude: -58.4185 },
    { latitude: -34.6050, longitude: -58.4180 },
  ];

  // Function to animate to a marker
  const animateToMarker = (coordinate) => {
    mapRef.current?.animateToRegion({
      ...coordinate,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
  };

  // Function to change map type
  const toggleMapType = () => {
    const types = ['standard', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };

  // Function to zoom in/out
  const zoomIn = () => {
    mapRef.current?.getCamera().then((cam) => {
      cam.zoom += 1;
      mapRef.current?.animateCamera(cam, { duration: 300 });
    });
  };

  const zoomOut = () => {
    mapRef.current?.getCamera().then((cam) => {
      cam.zoom -= 1;
      mapRef.current?.animateCamera(cam, { duration: 300 });
    });
  };

  // Function to handle map press (add new marker)
  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    const newMarker = {
      id: `custom-${Date.now()}`,
      coordinate: coordinate,
      title: `Ubicación ${customMarkers.length + 1}`,
      description: 'Nueva ubicación añadida',
      pinColor: 'orange',
    };
    setCustomMarkers([...customMarkers, newMarker]);
  };

  // Function to remove last custom marker
  const removeLastMarker = () => {
    if (customMarkers.length > 0) {
      setCustomMarkers(customMarkers.slice(0, -1));
    }
  };

  // Function to clear all custom markers
  const clearAllCustomMarkers = () => {
    setCustomMarkers([]);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={yatay240}
        mapType={mapType}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={showTraffic}
        showsBuildings={true}
        showsIndoors={true}
        rotateEnabled={true}
        pitchEnabled={true}
        toolbarEnabled={true}
        onPress={handleMapPress}
      >
        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            pinColor={marker.pinColor}
            title={marker.title}
            description={marker.description}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Custom Markers added by user */}
        {customMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            pinColor={marker.pinColor}
            title={marker.title}
            description={marker.description}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{marker.title}</Text>
                <Text>{marker.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Polyline - Route example */}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF6B6B"
          strokeWidth={4}
          lineDashPattern={[1]}
        />

        {/* Circle - Area of interest */}
        <Circle
          center={{ latitude: -34.6037, longitude: -58.4194 }}
          radius={200}
          strokeColor="rgba(0, 122, 255, 0.5)"
          fillColor="rgba(0, 122, 255, 0.1)"
          strokeWidth={2}
        />
      </MapView>

      {/* Toggle Button - Always Visible */}
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={() => setShowPanel(!showPanel)}
      >
        <Text style={styles.toggleText}>{showPanel ? '✕' : '☰'}</Text>
      </TouchableOpacity>

      {/* Panel de Control */}
      {showPanel && (
        <View style={styles.controlPanel}>
        <Text style={styles.title}>Demo de Funciones Google Maps</Text>
        <Text style={styles.subtitle}>Centrado en Yatay 240, Buenos Aires</Text>
        
        <ScrollView style={styles.buttonContainer}>
          {/* Cambiar Tipo de Mapa */}
          <TouchableOpacity style={styles.button} onPress={toggleMapType}>
            <Text style={styles.buttonText}>
              Tipo de Mapa: {mapType.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* Alternar Tráfico */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setShowTraffic(!showTraffic)}
          >
            <Text style={styles.buttonText}>
              Tráfico: {showTraffic ? 'ACTIVADO' : 'DESACTIVADO'}
            </Text>
          </TouchableOpacity>

          {/* Add/Remove Markers Section */}
          <Text style={styles.sectionTitle}>Añadir Ubicaciones:</Text>
          <Text style={styles.instructionText}>
            👆 Toca el mapa para añadir marcadores
          </Text>
          {customMarkers.length > 0 && (
            <View>
              <Text style={styles.markerCount}>
                Marcadores añadidos: {customMarkers.length}
              </Text>
              <TouchableOpacity 
                style={[styles.button, styles.removeButton]} 
                onPress={removeLastMarker}
              >
                <Text style={styles.buttonText}>Eliminar Último</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.clearButton]} 
                onPress={clearAllCustomMarkers}
              >
                <Text style={styles.buttonText}>Limpiar Todos</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Zoom Controls */}
          <View style={styles.zoomContainer}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <Text style={styles.zoomText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <Text style={styles.zoomText}>-</Text>
            </TouchableOpacity>
          </View>

          {/* Botones de Navegación Rápida */}
          <Text style={styles.sectionTitle}>Navegación Rápida:</Text>
          {markers.map((marker) => (
            <TouchableOpacity
              key={marker.id}
              style={[styles.navButton, { backgroundColor: marker.pinColor }]}
              onPress={() => animateToMarker(marker.coordinate)}
            >
              <Text style={styles.navButtonText}>{marker.title}</Text>
            </TouchableOpacity>
          ))}

          {/* Lista de Funciones */}
          <Text style={styles.sectionTitle}>Funciones Activas:</Text>
          <Text style={styles.featureText}>✓ Marcadores Personalizados</Text>
          <Text style={styles.featureText}>✓ Información Emergente</Text>
          <Text style={styles.featureText}>✓ Ruta en Polilínea</Text>
          <Text style={styles.featureText}>✓ Círculo Superpuesto (200m)</Text>
          <Text style={styles.featureText}>✓ Ubicación del Usuario</Text>
          <Text style={styles.featureText}>✓ Edificios 3D</Text>
          <Text style={styles.featureText}>✓ Brújula y Escala</Text>
        </ScrollView>
      </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  controlPanel: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 10,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
    marginBottom: 10,
  },
  buttonContainer: {
    maxHeight: 400,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  zoomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  zoomButton: {
    backgroundColor: '#34C759',
    width: '48%',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  zoomText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 6,
  },
  navButton: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 5,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  featureText: {
    fontSize: 10,
    color: '#555',
    marginBottom: 3,
  },
  callout: {
    width: 150,
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  toggleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 11,
    color: '#007AFF',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  markerCount: {
    fontSize: 11,
    color: '#333',
    marginBottom: 6,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#FF9500',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
});
