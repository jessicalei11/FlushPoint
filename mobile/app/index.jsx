import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";
import COLORS from "../constants/colors";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Testing.</Text>
      <Link href = "/auth/signup">Signup</Link>
      <Link href = "/auth">Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})