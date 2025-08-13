import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext"; // Ajusta la ruta si es necesario

export default function ChangePasswordScreen() {
  const { user } = useContext(AuthContext); // Obtiene el usuario del contexto
  const [email, setEmail] = useState(""); // Estado para el email
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(true); // Estado para manejar la carga inicial

  // Carga el email desde AsyncStorage si no está en el contexto
  useEffect(() => {
    const loadEmail = async () => {
      try {
        if (user?.email) {
          setEmail(user.email); // Usa el email del contexto si está disponible
        } else {
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setEmail(parsedUser.email || ""); // Usa el email de AsyncStorage
          }
        }
      } catch (error) {
        console.error("Error cargando el email:", error);
        Alert.alert("Error", "No se pudo cargar el email del usuario.");
      } finally {
        setLoading(false);
      }
    };
    loadEmail();
  }, [user]);

  const isPasswordStrong = (password) => {
    const minLength = 8;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    return (
      password.length >= minLength &&
      uppercase.test(password) &&
      lowercase.test(password) &&
      number.test(password) &&
      specialChar.test(password)
    );
  };

  const handleChangePassword = async () => {
    if (!email) {
      Alert.alert("Error", "No se encontró el email del usuario.");
      return;
    }

    if (!currentPassword) {
      Alert.alert("Error", "Por favor, ingresa tu contraseña actual.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    if (!isPasswordStrong(newPassword)) {
      Alert.alert(
        "Contraseña insegura",
        "La nueva contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos especiales."
      );
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "No estás autenticado.");
        return;
      }

      const response = await fetch(
        "http://192.168.0.7:8000/api/usuarios/cambiarpassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email, // Incluye el email en la solicitud
            password_actual: currentPassword,
            password_nuevo: newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Error", errorData.detail || "Error cambiando la contraseña");
        return;
      }

      Alert.alert("Éxito", "La contraseña ha sido actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#0d80f2" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={email}
            editable={false}
            selectTextOnFocus={false}
            placeholder="Cargando email..."
            placeholderTextColor="#90adcb"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña actual</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={true}
            placeholder="Ingresa tu contraseña actual"
            placeholderTextColor="#90adcb"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Nueva contraseña"
            placeholderTextColor="#90adcb"
            secureTextEntry={true}
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar nueva contraseña</Text>
          <TextInput
            style={styles.input}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            placeholder="Confirmar nueva contraseña"
            placeholderTextColor="#90adcb"
            secureTextEntry={true}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleChangePassword}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cargando..." : "Confirmar cambio"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  contentContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#000000ff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#2236491e",
    color: "#000000ff",
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
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },
});