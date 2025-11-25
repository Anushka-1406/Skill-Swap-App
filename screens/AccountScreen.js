import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { auth, db } from "../firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AccountScreen() {
  const [profile, setProfile] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigation.navigate("Login");
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="person-circle-outline" size={80} color="#6c63ff" style={styles.avatar} />
      <Text style={styles.label}>Name</Text>
      <Text style={styles.value}>{profile.name}</Text>

      <Text style={styles.label}>I can teach</Text>
      <Text style={styles.value}>{profile.teachSkill}</Text>

      <Text style={styles.label}>I want to learn</Text>
      <Text style={styles.value}>{profile.learnSkill}</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{profile.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: "#f0f4ff", alignItems: "center" },
  avatar: { marginBottom: 20 },
  label: { fontSize: 16, color: "#888", marginTop: 10 },
  value: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 10 },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loading: { fontSize: 18, color: "#555", marginTop: 50 },
});