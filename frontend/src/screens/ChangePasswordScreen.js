import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChangePasswordScreen() {
  const email = "andres@gmail.com"; // opcional mostrar o no
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

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
      const token = await AsyncStorage.getItem("token"); // Obtén tu token guardado

      if (!token) {
        Alert.alert("Error", "No estás autenticado.");
        return;
      }

      const response = await fetch(
        "http://192.168.0.5:8000/api/usuarios/cambiarpassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
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
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

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
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Confirmar cambio</Text>
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
