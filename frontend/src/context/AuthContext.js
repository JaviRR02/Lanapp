import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;


  // Al iniciar la app, carga datos guardados
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading storage data", error);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  // Función para login
  const signIn = async (email, password) => {
    setLoading(true);
    try {
        const response = await fetch("http://192.168.0.5:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en login:", errorData);
        throw new Error(errorData.detail || "Error en el inicio de sesión");
        }

        const data = await response.json();
        console.log("Login exitoso:", data);

        // Suponiendo que backend devuelve { access_token: "...", token_type: "bearer" }
        const accessToken = data.access_token;

        // Guarda token en estado y AsyncStorage
        setToken(accessToken);
        await AsyncStorage.setItem("token", accessToken);

        // Guarda info usuario en estado y AsyncStorage (aquí solo guardamos email)
        setUser({ email }); // si quieres más info, obténla en backend y pásala
        await AsyncStorage.setItem("user", JSON.stringify({ email }));

    } catch (err) {
        console.error("Error en signIn:", err.message);
        throw err; // para que LoginScreen capture y muestre el error
    } finally {
        setLoading(false);
    }
    };

  const register = async (userData) => {
    setLoading(true);
    try {
        await axios.post("http://192.168.0.5:8000/auth/register", userData);
        return true;
    } catch (error) {
        console.error("Error registrando usuario", error);
        throw new Error(error.response?.data?.detail || "Error al registrar usuario");
    } finally {
        setLoading(false);
    }
  };

  // Función para logout
  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Error cerrando sesión", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signOut,
        register,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};
