import React, { useState } from 'react';
import { 
  SafeAreaView, ScrollView, View, Text, TextInput, 
  StyleSheet, TouchableOpacity, Image, StatusBar, useColorScheme 
} from 'react-native';

export default function RegisterScreen({ navigation }) {
  const colorScheme = useColorScheme();

  // Estado para cada campo
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!nombre || !apellido || !email || !telefono || !password) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert('Por favor, ingresa un correo válido.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      alert(passwordError);
      return;
    }

    alert(`Registrando usuario: ${nombre} ${apellido}`);
  };
  
  // Función para validar contraseña segura
  function validatePassword(password) {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula.';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula.';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial.';
    }
    return null; // cumple con todas las reglas
  }

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={[styles.safeArea, colorScheme === 'dark' ? styles.darkBackground : styles.lightBackground]}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
            <Image 
              source={require('../../assets/logoLAPP.png')} 
              style={styles.logo} 
              resizeMode="cover" 
            />

            <Text style={[styles.title, colorScheme === 'dark' ? styles.titleDark : styles.titleLight]}>
              Crear Cuenta
            </Text>
            <Text style={[styles.subtitle, colorScheme === 'dark' ? styles.subtitleDark : styles.subtitleLight]}>
              Completa tus datos para registrarte
            </Text>

            <TextInput
              style={[styles.input, colorScheme === 'dark' ? styles.inputDark : styles.inputLight]}
              placeholder="Nombre"
              placeholderTextColor={colorScheme === 'dark' ? '#888' : '#aaa'}
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={[styles.input, colorScheme === 'dark' ? styles.inputDark : styles.inputLight]}
              placeholder="Apellido"
              placeholderTextColor={colorScheme === 'dark' ? '#888' : '#aaa'}
              value={apellido}
              onChangeText={setApellido}
            />
            <TextInput
              style={[styles.input, colorScheme === 'dark' ? styles.inputDark : styles.inputLight]}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colorScheme === 'dark' ? '#888' : '#aaa'}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={[styles.input, colorScheme === 'dark' ? styles.inputDark : styles.inputLight]}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              placeholderTextColor={colorScheme === 'dark' ? '#888' : '#aaa'}
              value={telefono}
              onChangeText={setTelefono}
            />
            <TextInput
              style={[styles.input, colorScheme === 'dark' ? styles.inputDark : styles.inputLight]}
              placeholder="Contraseña"
              secureTextEntry
              placeholderTextColor={colorScheme === 'dark' ? '#888' : '#aaa'}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.linkText, colorScheme === 'dark' ? styles.linkDark : styles.linkLight]}>
                ¿Ya tienes cuenta? Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  lightBackground: {
    backgroundColor: '#FFFFFF',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
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
  cardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardDark: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
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
  titleLight: {
    color: '#222',
  },
  titleDark: {
    color: '#eee',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  subtitleLight: {
    color: '#555',
  },
  subtitleDark: {
    color: '#bbb',
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  inputLight: {
    backgroundColor: '#F0F2F5',
    color: '#111',
  },
  inputDark: {
    backgroundColor: '#333',
    color: '#eee',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonPrimary: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  linkLight: {
    color: '#4CAF50',
  },
  linkDark: {
    color: '#90EE90',
  },
});
