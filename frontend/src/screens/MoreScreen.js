import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

export default function MoreScreen() {
  const navigation = useNavigation();
  const { signOut, loading } = useContext(AuthContext);
  const screenWidth = Dimensions.get("window").width;
  const buttonWidth = (screenWidth * 4) / 7;

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: () => signOut() },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cerrando sesión...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          <Text style={styles.header}>Más opciones</Text>

          {/* Card Perfil */}
          <CardOption
            title="Ver / Editar perfil"
            subtitle="Accede a tu información personal y edítala"
            onPress={() => navigation.navigate("Profile")}
            cardStyle={cardStyle}
          />

          {/* Card Cambiar contraseña */}
          <CardOption
            title="Cambiar contraseña"
            subtitle="Actualiza tu contraseña para mayor seguridad"
            onPress={() => navigation.navigate("ChangePassword")}
            cardStyle={cardStyle}
          />

          {/* Card Notificaciones */}
          <CardOption
            title="Configurar notificaciones"
            subtitle="Ajusta tus alertas por SMS o email"
            onPress={() => navigation.navigate("NotificationScreen")}
            cardStyle={cardStyle}
          />
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

const CardOption = ({ title, subtitle, onPress, cardStyle }) => (
  <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={cardStyle}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111418" }}>{title}</Text>
          <Text style={{ fontSize: 16, color: "#60758a" }}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = {
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
};
