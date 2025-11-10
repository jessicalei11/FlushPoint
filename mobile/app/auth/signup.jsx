import { 
  View, 
  Text, 
  Platform, 
  KeyboardAvoidingView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image, 
  StyleSheet,
  Dimensions, 
} from "react-native";
import styles from "../../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useState } from "react";
import { useRouter, Link } from "expo-router";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {user, sayHello } = useAuthStore();

  console.log("user is here:", user);

  const router = useRouter(); 

  const handleSignup = () => {
    setUser({ name: "bob"});
  };

  return (
    <KeyboardAvoidingView
      style = {{flex: 1}}
      behavior= {Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style = {styles.container}>
        {/* Logo */}
        <View style = {styles.topIllustration}>
          <Image
            source = {require("../../assets/images/FlushPoint_Logo.png")}
            style = {styles.FlushPoint_Logo}
            resizeMode = "contain"
          />
        </View>

        <View style = {styles.formContainer}>
          {/* Username */}
          <View style = {styles.inputGroup}>
            <Text style = {styles.label}>Username</Text>
            <View style = {styles.inputContainer}>
              <Ionicons
                name = "person-outline"
                size = {20}
                color = {COLORS.primary}
                style = {styles.inputIcon}
              />
              <TextInput
                style = {styles.input}
                placeholder = "Username"
                placeholderTextColor = {COLORS.placeholderText}
                value = {username}
                onChangeText = {setUsername}
                autoCapitalize = "none"
              />
            </View>
          </View>

          {/* Email */}
          <View style = {styles.inputGroup}>
            <Text style = {styles.label}>Email</Text>
            <View style = {styles.inputContainer}>
              <Ionicons
                name = "mail-outline"
                size = {20}
                color = {COLORS.primary}
                style = {styles.inputIcon}
              />
              <TextInput
                style = {styles.input}
                placeholder = "Email"
                value = {email}
                placeholderTextColor = {COLORS.placeholderText}
                onChangeText = {setEmail}
                keyboardType = "email-address"
                autoCapitalize = "none"
              />
            </View>
          </View>

          {/* Password */}
          <View style = {styles.inputGroup}>
            <Text style = {styles.label}>Password</Text>
            <View style = {styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size = {20}
                color = {COLORS.primary}
                style = {styles.inputIcon}
              />
              <TextInput
                style = {styles.input}
                placeholder = "Password"
                placeholderTextColor = {COLORS.placeholderText}
                value = {password}
                onChangeText = {setPassword}
                secureTextEntry = {!showPassword}
              />
              <TouchableOpacity
                onPress = {() => setShowPassword(!showPassword)}
                style = {styles.eyeIcon}
              >
                <Ionicons
                  name = {showPassword ? "eye-outline" : "eye-off-outline"}
                  size = {20}
                  color = {COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>


          <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>          

            {/* Footer */}
            <View style = {styles.footer}>
              <Text style = {styles.footerText}>Already have an account?</Text>
              <Link href = "/auth" asChild>
                <TouchableOpacity>
                  <Text style = {styles.link}>Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}