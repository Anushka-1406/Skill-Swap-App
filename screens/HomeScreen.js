import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { auth, db } from "../firebaseconfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function HomeScreen() {
  const [userName, setUserName] = useState("");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
  const currentUser = auth.currentUser;

  const fetchUserData = async () => {
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name); // ✅ use Firestore name
        } else {
          setUserName(currentUser.email); // fallback if no name stored
        }
      } catch (err) {
        console.log("Error fetching user data:", err);
        setUserName(currentUser.email);
      }
    }
  };

  const fetchMatches = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const allUsers = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.email !== currentUser?.email) {
        allUsers.push(data);
      }
    });
    setMatches(allUsers);
  };

  fetchUserData();
  fetchMatches();
}, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Skill Swap</Text>
      <Text style={styles.welcome}>Welcome back, {userName}!</Text>
      <Text style={styles.subheader}>💡 People who can teach what you want to learn</Text>

      <FlatList
        data={matches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.label}>💡 Can teach:</Text>
            <Text style={styles.skill}>{item.teachSkill}</Text>
            <Text style={styles.label}>📘 Wants to learn:</Text>
            <Text style={styles.skill}>{item.learnSkill}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f4ff" },
  header: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  welcome: { fontSize: 18, textAlign: "center", marginBottom: 20 },
  subheader: { fontSize: 16, marginBottom: 10, color: "#555", textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  label: { fontSize: 14, color: "#888" },
  skill: { fontSize: 16, marginBottom: 6 },
});