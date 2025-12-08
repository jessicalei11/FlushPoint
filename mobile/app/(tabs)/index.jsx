import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native'; 
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocationStore } from '../../store/locationStore'; 
import { useAuthStore } from '../../store/authStore'; 
import { API_URL } from '../../constants/api'; 
import COLORS from '../../constants/colors';
import { useRouter } from 'expo-router';
import MapViewDirections from 'react-native-maps-directions';
import { Ionicons } from '@expo/vector-icons'; 
import styles from '../../assets/styles/map.styles'; 
import Constants from 'expo-constants';

const GOOGLE_MAPS_APIKEY = Constants.manifest.extra.googleMapsApiKey;

export default function MapScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { locations, setLocations } = useLocationStore(); 
    const { token } = useAuthStore();

    const [destination, setDestination] = useState(null);

    const fetchBathrooms = async () => {
        setLoading(true);
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/bathrooms`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.message || "Failed to fetch locations.";
                Alert.alert("Error", errorMsg);
                setLoading(false);
                return; 
            }

            const fetchedLocations = data.bathrooms.map(item => ({
                id: item._id, 
                name: item.name,
                description: item.description,
                image: item.image,
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
                address: item.address, 
                averageRating: parseFloat(item.averageRating || 0), 
                numOfReviews: parseInt(item.numOfReviews || 0),  
            }));

            setLocations(fetchedLocations); 

        } catch (error) {
            console.error("Fetch Error:", error);
            Alert.alert("Error", error.message || "Could not load bathrooms.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {

            fetchBathrooms();

            return () => {

            };
        }, [token]) 
    );

    const initialRegion = {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
    };

    const handleRefresh = () => {
        setDestination(null); 
        fetchBathrooms(); 
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text>Loading bathrooms...</Text>
            </View>
        );
    }

const handleCalloutPress = (location) => {
        router.push({
            pathname: "/details", 
            params: {
                id: location.id,
                name: location.name,
                address: location.address,
                averageRating: location.averageRating,
                numOfReviews: location.numOfReviews,
                description: location.description,
                image: location.image,
                latitude: location.latitude,
                longitude: location.longitude,
            }
        });
    };
    
    const stopNavigation = () => { 
      setDestination(null);
    };    
      
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                showsUserLocation
                showsMyLocationButton
                provider={PROVIDER_GOOGLE} 
                initialRegion={initialRegion}
            >
                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        coordinate={{ 
                            latitude: location.latitude, 
                            longitude: location.longitude 
                        }}
                        title={location.name}
                    >
                        <Callout tooltip onPress={() => handleCalloutPress(location)}>
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutTitle}>{location.name}</Text>
                                {location.image ? (
                                    <Image 
                                        source={{ uri: location.image }} 
                                        style={styles.calloutImage}
                                    />
                                ) : (
                                    <Text style={styles.calloutNoImage}>No Image</Text>
                                )}
                                <Text style={styles.calloutTapHint}>Tap here for directions</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            
            <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleRefresh}
                disabled={loading} 
            >
                {loading ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                    <Ionicons name="refresh-outline" size={24} color={COLORS.textPrimary} />
                )}
            </TouchableOpacity>
        </View>
    );
}