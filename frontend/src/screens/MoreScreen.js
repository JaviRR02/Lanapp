import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function MoreScreen() {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const buttonWidth = (screenWidth * 4) / 7; // 4/7 de la pantalla

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 0,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: () => console.log("Sesión cerrada") },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          {/* HEADER */}
          <Text style={styles.header}>Más opciones</Text>

          {/* Card Perfil */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")} activeOpacity={0.8}>
              <View style={cardStyle}>
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111418" }}>
                    Ver / Editar perfil
                  </Text>
                  <Text style={{ fontSize: 16, color: "#60758a" }}>
                    Accede a tu información personal y edítala
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Card Cambiar contraseña */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <TouchableOpacity onPress={() => navigation.navigate("ChangePassword")} activeOpacity={0.8}>
              <View style={cardStyle}>
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111418" }}>
                    Cambiar contraseña
                  </Text>
                  <Text style={{ fontSize: 16, color: "#60758a" }}>
                    Actualiza tu contraseña para mayor seguridad
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Card Notificaciones */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <TouchableOpacity onPress={() => navigation.navigate("NotificationScreen")} activeOpacity={0.8}>
              <View style={cardStyle}>
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111418" }}>
                    Configurar notificaciones
                  </Text>
                  <Text style={{ fontSize: 16, color: "#60758a" }}>
                    Ajusta tus alertas por SMS o email
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Botón Cerrar sesión */}
        <View style={{ alignItems: "center", paddingVertical: 16 }}>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            style={{
              backgroundColor: "#dc2626",
              paddingVertical: 14,
              width: buttonWidth,
              borderRadius: 30,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
};
