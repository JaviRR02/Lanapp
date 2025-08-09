import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function DashboardScreen() {
  const navigation = useNavigation();

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111418" }}>
            Panel Principal
          </Text>
        </View>

        {/* Card 1 */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Transactions")}
            activeOpacity={0.8}
          >
            <View style={cardStyle}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYeDs1qYAp68KcEwJf0BvcgHzNWlsD4rWD1zfAIY67fiQzFWiWiR2hoXFcKufJrnuby_pW5do1VWVgF4pPmNb2XfYCnJexkVHekp5Z4eFO855w-vuk_RJhyppT0haO8krit0FSFSwlbS9YDPk2rpr1LBenyc9bgxOq4CrjH2TPiVLXfqhGtW6MvzDXkNmgq0jdS81qAZDsMct7eCrFEhuxrFPDPoFFfkBsWuH1w4a2ue_E6ya_VyjGQQyArxxXSnZw4iyOJZYRSc97",
                }}
                style={{ width: "100%", aspectRatio: 16 / 9 }}
                resizeMode="cover"
              />
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111418" }}>
                  Transacciones
                </Text>
                <Text style={{ fontSize: 16, color: "#60758a" }}>
                  Ver y administrar tus transacciones
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card 2 */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Budgets")}
            activeOpacity={0.8}
          >
            <View style={cardStyle}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOvnk2x-hVflCz27mlZOL_0p4NOp4YEMSpDyq-QcYacll3GOgqZkN_xPIoY-CoVcAExi-CeZtR4tOYG5tlx3RZwbp6w7fC3UMrrVkLMCki7LWQrEA5iYDlaOK95A--lN_CscN2MUmubiDSvWIk2R5SFNZ6xvcz9_V1D3srGEVqoBXwUbu3qtoc-IVCup8ThDJHYAFS8AcoDfc8mva4neliJRnZmP1ebXz2Is6BybKs6iHJofvkef4STpiABszoC85XaksmUEEn9qEg",
                }}
                style={{ width: "100%", aspectRatio: 16 / 9 }}
                resizeMode="cover"
              />
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111418" }}>
                  Presupuestos
                </Text>
                <Text style={{ fontSize: 16, color: "#60758a" }}>
                  Administra tus presupuestos
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card 3 */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("FixedPayments")}
            activeOpacity={0.8}
          >
            <View style={cardStyle}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1JA2698GT3-FpJG_5XE67bF_cLDI5LSjcNlD8UgDVJC075OEi-1lukKFADN0E6K_5KgWkO8du7lRBm0X_s2V4msdv2Gjc1picc6Eb9QIwJH5VsFgSmmIsfs58vHHxpGndjwgW2r2U5bB6ZPyJm5utW1EHUh8zBolF1bQeahSB-LprjPNrbpl1WiBPJAecvrXAGtBBZQJq4i153CSjsO1dZph4BcUO43OAx6Idofr4MImALrWayZBXYbwUJVX3HLKT7bdN8hAocMiZ",
                }}
                style={{ width: "100%", aspectRatio: 16 / 9 }}
                resizeMode="cover"
              />
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111418" }}>
                  Pagos Fijos
                </Text>
                <Text style={{ fontSize: 16, color: "#60758a" }}>
                  Administra tus pagos fijos
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
