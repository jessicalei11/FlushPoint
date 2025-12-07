import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocationStore } from '../../store/locationStore'; 
import { useAuthStore } from '../../store/authStore'; 
import { API_URL } from '../../constants/api'; 
import COLORS from '../../constants/colors';

export default function MapScreen() {
    const [loading, setLoading] = useState(true);
    // Use the store function to SET the locations array
    const { locations, setLocations } = useLocationStore(); 
    const { token } = useAuthStore();

    const fetchBathrooms = async () => {
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
                throw new Error(errorMsg);
            }

            // Map the fetched data and ensure coordinates are numbers
            const fetchedLocations = data.bathrooms.map(item => ({
                // Use the database _id as the unique key
                id: item._id, 
                name: item.name,
                description: item.description,
                image: item.image, // Include the image URL for the callout
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
            }));

            // Update the global store with all fetched locations
            setLocations(fetchedLocations); 

        } catch (error) {
            console.error("Fetch Error:", error);
            Alert.alert("Error", error.message || "Could not load bathrooms.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBathrooms();
    }, [token]); 

    // Define initial region (or center of New York)
    const initialRegion = {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text>Loading bathrooms...</Text>
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE} // Explicitly use Google Maps
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
                        {/* Custom Callout to show Image and Name */}
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutTitle}>{location.name}</Text>
                                {/* Display the image */}
                                {location.image ? (
                                    <Image 
                                        source={{ uri: location.image }} 
                                        style={styles.calloutImage}
                                    />
                                ) : (
                                    <Text style={styles.calloutNoImage}>No Image</Text>
                                )}
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    // --- Styles for Custom Callout ---
    calloutContainer: {
        width: 180, // Fixed width for callout box
        padding: 5,
        backgroundColor: COLORS.white,
        borderRadius: 6,
        alignItems: 'center',
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
        textAlign: 'center',
    },
    calloutImage: {
        width: 160,
        height: 100, // Fixed height for image preview
        resizeMode: 'cover',
        borderRadius: 4,
        marginTop: 5,
    },
    calloutNoImage: {
        fontSize: 12,
        color: COLORS.textSecondary,
    }
});