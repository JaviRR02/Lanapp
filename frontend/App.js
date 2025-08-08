import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

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
</Stack.Navigator>

    </NavigationContainer>
  );
}