import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity
} from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { token } = useContext(AuthContext);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("********");

  // Cargar perfil al montar
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://192.168.0.7:8000/api/usuarios/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error cargando perfil");
        const data = await res.json();
        setNombre(data.nombre || "");
        setApellido(data.apellido || "");
        setTelefono(data.telefono || "");
        setEmail(data.email || "");
      } catch (error) {
        Alert.alert("Error", error.message);
        console.error("Fetch profile error:", error);
      }
    };
    fetchProfile();
  }, [token]);

  const guardarPerfil = async () => {
    try {
      const res = await fetch("http://192.168.0.7:8000/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          apellido,
          telefono,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error actualizando perfil");
      }
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Update profile error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor="#90adcb"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={apellido}
            onChangeText={setApellido}
            placeholder="Apellido"
            placeholderTextColor="#90adcb"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            placeholder="Teléfono"
            placeholderTextColor="#90adcb"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
            selectTextOnFocus={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={password}
            editable={false}
            secureTextEntry={true}
            selectTextOnFocus={false}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={guardarPerfil} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Guardar Perfil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#2236491e",
    color: "#000",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
  },
  disabledInput: {
    opacity: 0.7,
  },
  button: {
    backgroundColor: "#0d80f2",
    borderRadius: 14,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#0d80f2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
