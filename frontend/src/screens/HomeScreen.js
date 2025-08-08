import React from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, useColorScheme } from 'react-native';

export default function HomeScreen({ navigation }) {
  const colorScheme = useColorScheme();

  return (
    <>
      {/* Barra de estado adaptable */}
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={[styles.safeArea, colorScheme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
            {/* Logo */}
            <Image 
              source={require('../../assets/logoLAPP.png')} 
              style={styles.logo} 
              resizeMode="cover" 
            />

            {/* Títulos */}
            <Text style={[styles.title, colorScheme === 'dark' ? styles.titleDark : styles.titleLight]}>
              Bienvenido a LanaApp
            </Text>
            <Text style={[styles.subtitle, colorScheme === 'dark' ? styles.subtitleDark : styles.subtitleLight]}>
              Gestiona tus finanzas de forma fácil y rápida
            </Text>

            {/* Botones */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={[styles.buttonText, styles.buttonTextLight]}>Iniciar Sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Crear Cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  lightBackground: { backgroundColor: '#FFFFFF' },
  darkBackground: { backgroundColor: '#121212' },

  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLight: { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
  cardDark: { backgroundColor: 'rgba(30, 30, 30, 0.8)' },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  titleLight: { color: '#222' },
  titleDark: { color: '#eee' },

  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  subtitleLight: { color: '#555' },
  subtitleDark: { color: '#bbb' },

  buttonsContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
  },
  buttonSecondary: {
    backgroundColor: '#E9ECEF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextLight: {
    color: '#FFF',
  },
  buttonTextSecondary: {
    color: '#4CAF50',
  },
});
