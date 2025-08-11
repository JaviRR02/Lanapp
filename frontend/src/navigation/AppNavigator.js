import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../context/AuthContext";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import MainTabs from "../screens/MainTabs";
import TransactionsScreen from "../screens/TransactionsScreen";
import BudgetsScreen from "../screens/BudgetsScreen";
import FixedPaymentsScreen from "../screens/FixedPaymentsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import NotificationScreen from "../screens/NotificationScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: true, title: "Iniciar Sesión" }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: true, title: "Crear Cuenta" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Transactions"
              component={TransactionsScreen}
              options={{ headerShown: true, title: "Transacciones" }}
            />
            <Stack.Screen
              name="Budgets"
              component={BudgetsScreen}
              options={{ headerShown: true, title: "Presupuestos" }}
            />
            <Stack.Screen
              name="FixedPayments"
              component={FixedPaymentsScreen}
              options={{ headerShown: true, title: "Pagos Fijos" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: true, title: "Perfil" }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{ headerShown: true, title: "Cambiar Contraseña" }}
            />
            <Stack.Screen
              name="NotificationScreen"
              component={NotificationScreen}
              options={{ headerShown: true, title: "Notificaciones" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
