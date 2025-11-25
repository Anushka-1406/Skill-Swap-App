import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { auth, db } from "../firebaseconfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function AccountScreen() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teachSkills, setTeachSkills] = useState("");
  const [learnSkills, setLearnSkills] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile(data);
          setName(data.name || "");
          setEmail(data.email || currentUser.email);
          setTeachSkills(
            Array.isArray(data.teachSkill) ? data.teachSkill.join(", ") : data.teachSkill || ""
          );
          setLearnSkills(
            Array.isArray(data.learnSkill) ? data.learnSkill.join(", ") : data.learnSkill || ""
          );
        }
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.uid), {
        name,
        email,
        teachSkill: teachSkills.split(",").map((s) => s.trim()).filter(Boolean),
        learnSkill: learnSkills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      alert("Profile updated successfully!");
    }
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="person-circle-outline" size={80} color="#6c63ff" style={styles.avatar} />

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />

      <Text style={styles.label}>I can teach (comma separated)</Text>
      <TextInput
        style={styles.input}
        value={teachSkills}
        onChangeText={setTeachSkills}
        placeholder="e.g. Cooking, Drawing, Painting"
      />

      <Text style={styles.label}>I want to learn (comma separated)</Text>
      <TextInput
        style={styles.input}
        value={learnSkills}
        onChangeText={setLearnSkills}
        placeholder="e.g. Java, UI Design, React"
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateText}>Update Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, backgroundColor: "#f0f4ff", alignItems: "center" },
  avatar: { marginBottom: 20 },
  label: { fontSize: 16, color: "#888", marginTop: 10, alignSelf: "flex-start" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    width: "100%",
    backgroundColor: "#fff",
    fontSize: 16,
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  updateText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  loading: { fontSize: 18, color: "#555", marginTop: 50 },
});