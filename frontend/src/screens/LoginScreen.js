import React, { useState, useContext, useEffect } from 'react';
import { 
  Alert, SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, StatusBar, useColorScheme, KeyboardAvoidingView, Platform 
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  console.log('Navigation prop en LoginScreen:', navigation);
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, isAuthenticated } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    try {
      await signIn(email, password);
      // Navegación la maneja el contexto / app navigator
    } catch (error) {
      const msg = error.response?.data?.detail || "Credenciales inválidas";
      throw new Error(msg);
    }
  };

  useEffect(() => {
    if (isAuthenticated && navigation?.replace) {
      navigation.replace('MainTabs');
    }
  }, [isAuthenticated, navigation]);

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={[styles.safeArea, colorScheme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
              <Image
                source={require('../../assets/logoLAPP.png')}
                style={styles.logo}
                resizeMode="cover"
              />
              <Text style={[styles.title, colorScheme === 'dark' ? styles.titleDark : styles.titleLight]}>
                Iniciar Sesión
              </Text>
              <TextInput
                style={[styles.input, colorScheme === 'dark' ? styles.inputDark : styles.inputLight]}
                placeholder="Correo electrónico"
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#666'}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
              <TextInput
                style={[styles.input, colorScheme === 'dark' ? styles.inputDark : styles.inputLight]}
                placeholder="Contraseña"
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#666'}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={[styles.buttonText, styles.buttonTextLight]}>
                  {loading ? 'Ingresando...' : 'Entrar'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.linkText, colorScheme === 'dark' ? styles.titleDark : styles.titleLight]}>
                  ¿No tienes cuenta? Crear una
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  lightBackground: { backgroundColor: '#fff' },
  darkBackground: { backgroundColor: '#121212' },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 20,
    textAlign: 'center',
  },
  titleLight: { color: '#222' },
  titleDark: { color: '#eee' },

  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  inputLight: {
    borderColor: '#ccc',
    color: '#222',
  },
  inputDark: {
    borderColor: '#555',
    color: '#eee',
  },

  button: {
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 15,
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextLight: {
    color: '#fff',
  },

  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
