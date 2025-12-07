import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router'; // Import useRouter
import { useAuthStore } from "../../store/authStore"; // Import your auth store

// Assume you have a styles file or use inline styles for simplicity
const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#FF6347', // Tomato color for a striking sign-out button
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
};

export default function profile() {
  const router = useRouter();
  // Get the logout function from your store
  const { logout } = useAuthStore(); 

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Yes, Sign Out", 
          onPress: () => {
            // 1. Clear the token/user data from the store
            logout(); 
            
            // 2. Redirect the user to the login/home screen
            // Replace '/login' with your actual login route path
            router.replace('/auth/index'); 
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text>profile tab</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}