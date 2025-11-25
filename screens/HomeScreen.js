import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { auth, db } from "../firebaseconfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Swiper from "react-native-deck-swiper";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState("");
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;

    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          } else {
            setUserName(currentUser.email);
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", marginRight: 20 }}>
          <Ionicons
            name="person-circle-outline"
            size={28}
            color="#333"
            style={{ marginRight: 20 }}
            onPress={() => navigation.navigate("Account")}
          />
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={28}
            color="#333"
            onPress={() => navigation.navigate("Messages", { messages })}
          />
        </View>
      ),
    });
  }, [navigation, messages]);

  const handleSwipeRight = (cardIndex) => {
    const person = matches[cardIndex];
    if (person) {
      const msg = `Message sent: ${person.name} is interested in learning with you.`;
      Alert.alert("Match!", msg);
      setMessages((prev) => [...prev, msg]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Skill Swap</Text>
      <Text style={styles.welcome}>Welcome back, {userName}!</Text>
      <Text style={styles.subheader}>💡 Swipe to find people to learn/teach</Text>

      {matches.length > 0 ? (
        <Swiper
          cards={matches}
          renderCard={(item) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.label}>💡 Can teach:</Text>
              <Text style={styles.skill}>
                {Array.isArray(item.teachSkill) ? item.teachSkill.join(", ") : item.teachSkill}
              </Text>
              <Text style={styles.label}>📘 Wants to learn:</Text>
              <Text style={styles.skill}>
                {Array.isArray(item.learnSkill) ? item.learnSkill.join(", ") : item.learnSkill}
              </Text>
            </View>
          )}
          onSwipedRight={handleSwipeRight}
          backgroundColor={"#f0f4ff"}
          stackSize={3}
        />
      ) : (
        <Text style={{ marginTop: 20 }}>No matches found.</Text>
      )}
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