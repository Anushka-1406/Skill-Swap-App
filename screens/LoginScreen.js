import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseconfig";
import { db } from "../firebaseconfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [teachSkill, setTeachSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    navigation.navigate("Home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    //✅ Store additional user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      teachSkill,
      learnSkill,
      email,
      createdAt: new Date(),
    });

    alert("Account created and data saved!");

      // You can also store name, teachSkill, learnSkill in Firestore here
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: "#f0f4ff" }]}>
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? "Login to SkillSwap" : "Join the Learning Community"}</Text>

        {!isLogin && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Skill You Can Teach"
              value={teachSkill}
              onChangeText={setTeachSkill}
            />
            <TextInput
              style={styles.input}
              placeholder="Skill You Want to Learn"
              value={learnSkill}
              onChangeText={setLearnSkill}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#6c63ff" }]}
          onPress={isLogin ? handleLogin : handleSignUp}
        >
          <Text style={styles.buttonText}>{isLogin ? "Login" : "Register"}</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setError("");
            setIsLogin(!isLogin);
          }}
        >
          <Text style={styles.link}>{isLogin ? "Register here" : "Login here"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  toggleText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  link: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 8,
    color: "#6c63ff",
  },
});