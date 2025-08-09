import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, ScrollView, StyleSheet } from "react-native";

export default function ProfileScreen() {
  // Datos demo
  const [nombre, setNombre] = useState("Cortez");
  const [apellido, setApellido] = useState("Andres");
  const [telefono, setTelefono] = useState("4461594567");
  const email = "andres@gmail.com";
  const password = "1234567890";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
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
            value={"●".repeat(password.length)}
            editable={false}
            secureTextEntry={true}
            selectTextOnFocus={false}
          />
        </View>
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
});
