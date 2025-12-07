import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React from 'react'
import { useState } from "react";
import { useRouter } from 'expo-router';
import styles from "../../assets/styles/create.styles"; 
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors"; 
import { useAuthStore } from "../../store/authStore";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import { API_URL } from "../../constants/api";

export default function create() {
  const [locationName, setLocationName] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [address, setAddress] = useState(""); 
  const [latitude, setLatitude] = useState(""); 
  const [longitude, setLongitude] = useState(""); 
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  const [image, setImage] = useState(null); 
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = useAuthStore(); 

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, 
        base64: true,
      });

      if (!result.canceled){
        setImage(result.assets[0].uri);

        if (result.assets[0].base64){
          setImageBase64(result.assets[0].base64);
        } else {
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  };

  const handleGeocode = async () => {
    if (!address) {
      Alert.alert("Input Required", "Please enter a street address first.");
      return;
    }

    setGeocodingLoading(true);
    setLatitude(""); 
    setLongitude("");

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Permission to access location is needed for geocoding.");
        setGeocodingLoading(false);
        return;
      }

      const geocodedLocation = await Location.geocodeAsync(address);

      if (geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];
        setLatitude(latitude.toString());
        setLongitude(longitude.toString());
        Alert.alert("Success", "Coordinates found and set!");
      } else {
        Alert.alert("Not Found", "Could not find coordinates for that address.");
      }
    } catch (error) {
      console.error("Geocoding Error:", error);
      Alert.alert("Error", "Failed to retrieve coordinates.");
    } finally {
      setGeocodingLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!locationName || !description || !latitude || !longitude || !imageBase64) { 
      Alert.alert("Error", "Please fill in all fields (including coordinates/address) and select an image.");
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) {
      Alert.alert("Error", "Latitude and Longitude must be valid numbers.");
      return;
    }
    
    let imageDataUrl = null;
    if (image && imageBase64) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1]; 
        const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
        imageDataUrl = `data:${imageType};base64,${imageBase64}`;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/bathrooms`, { 
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: locationName, 
          description,
          latitude: lat, 
          longitude: lon, 
          image: imageDataUrl,
        }),
      });

      let data;
      try {
          data = await response.json();
      } catch (error) {
          throw new Error(`Server returned non-JSON response: Status ${response.status}`);
      }
      
      if (!response.ok) {
        const errorMsg = data.message || data.error || "The server rejected the submission (e.g., invalid data).";
        throw new Error(errorMsg);
      }

      Alert.alert("Success", "Your bathroom location has been posted!"); 
      
      setLocationName("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setImage(null);
      setImageBase64(null);
      router.push("/"); // Navigate back to the map tab
    } catch (error) {
      console.error("Error creating location post:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style = {{ flex: 1}}
      behavior= {Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style = {styles.card}>
          {/* Header */}
          <View style = {styles.header}>
            <Text style = {styles.title}> Add Bathroom Location</Text>
            <Text style = {styles.subtitle}>Help others find accessible public bathrooms</Text>
          </View>

          <View style = {styles.form}>
            {/* Bathroom name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location Name</Text> 
              <View style={styles.inputContainer}>
                <Ionicons
                  name="map-outline" 
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Central Park Restroom"
                  placeholderTextColor={COLORS.placeholderText}
                  value={locationName} 
                  onChangeText={setLocationName} 
                />
              </View>
            </View>

            {/* Street Address */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Street Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]} 
                  placeholder="Enter full address to find coordinates"
                  placeholderTextColor={COLORS.placeholderText}
                  value={address}
                  onChangeText={setAddress}
                />
                <TouchableOpacity 
                    style={styles.geocodeButton} 
                    onPress={handleGeocode} 
                    disabled={geocodingLoading}
                >
                    {geocodingLoading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Ionicons name="search-outline" size={20} color={COLORS.white} />
                    )}
                </TouchableOpacity>
              </View>
            </View>

            {/* latitude */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Latitude</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="pin-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: latitude ? COLORS.textPrimary : COLORS.placeholderText }]}
                  placeholder="Latitude (Auto-filled or manual)"
                  placeholderTextColor={COLORS.placeholderText}
                  value={latitude}
                  onChangeText={setLatitude} 
                  keyboardType="numeric" 
                />
              </View>
            </View>

            {/* longitude */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Longitude</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="pin-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: longitude ? COLORS.textPrimary : COLORS.placeholderText }]}
                  placeholder="Longitude (Auto-filled or manual)"
                  placeholderTextColor={COLORS.placeholderText}
                  value={longitude} 
                  onChangeText={setLongitude} 
                  keyboardType="numeric" 
                />
              </View>
            </View>

            {/* Image */}
            <View style = {styles.formGroup}>
              <Text style = {styles.label}>Bathroom Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
                    <Text style={styles.placeholderText}>Tap to select image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View style = {styles.formGroup}>
              <Text style = {styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Details about accessibility, operating hours, required key, etc."
                placeholderTextColor={COLORS.placeholderText}
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style = {styles.button} onPress = {handleSubmit} disabled = {loading}>
                {loading ? (
                  <ActivityIndicator color = {COLORS.white}/>
                ): (
                  <>
                    <Ionicons
                      name = "cloud-upload-outline"
                      size = {20}
                      color = {COLORS.white}
                      style = {styles.buttonIcon}
                    />
                    <Text style = {styles.buttonText}>Submit</Text>
                  </>
                )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}