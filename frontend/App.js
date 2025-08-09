import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MainTabs from "./src/screens/MainTabs";
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import BudgetsScreen from './src/screens/BudgetsScreen';
import FixedPaymentsScreen from './src/screens/FixedPaymentsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import NotificationScreen from './src/screens/NotificationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: true, title: 'Iniciar Sesión' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: true, title: 'Crear Cuenta' }}
        />
        {/* Registra MainTabs en el stack */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{ headerShown: true, title: 'Transacciones' }}
        />
        <Stack.Screen
          name="Budgets"
          component={BudgetsScreen}
          options={{ headerShown: true, title: 'Presupuestos' }}
        />
        <Stack.Screen
          name="FixedPayments"
          component={FixedPaymentsScreen}
          options={{ headerShown: true, title: 'Pagos Fijos' }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: true, title: 'Perfil' }}
        />

        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ headerShown: true, title: 'Cambiar Contraseña' }}
        />

        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{ headerShown: true, title: 'Notificaciones' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
