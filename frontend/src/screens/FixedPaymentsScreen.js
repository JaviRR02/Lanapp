import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Button,
  SafeAreaView,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function FixedPaymentsScreen() {
  const { token, user } = useContext(AuthContext);
  const email = user?.email || "";

  const [fixedPayments, setFixedPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [search, setSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  // Cargar pagos fijos al iniciar y cuando token/email cambian
  useEffect(() => {
    if (!token || !email) return;

    const fetchPayments = async () => {
      try {
        const res = await fetch("http://192.168.0.7:8000/api/pagos/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error cargando pagos fijos");
        const data = await res.json();
        setFixedPayments(data);
        setFilteredPayments(data);
      } catch (error) {
        Alert.alert("Error", error.message);
        console.error("Fetch fixed payments error:", error);
      }
    };
    fetchPayments();
  }, [token, email]);

  // Filtrar pagos según búsqueda
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = fixedPayments.filter((p) =>
      p.name.toLowerCase().includes(lowerSearch)
    );
    setFilteredPayments(filtered);
  }, [search, fixedPayments]);

  const openNewPaymentModal = () => {
    setEditingPayment({ name: "", amount: "", day: "" });
    setModalVisible(true);
  };

  const openEditPaymentModal = (payment) => {
    setEditingPayment({
      ...payment,
      amount: payment.amount.toString(),
      day: payment.day.toString(),
    });
    setModalVisible(true);
  };

  const savePayment = async () => {
    if (!editingPayment.name.trim()) {
      Alert.alert("Error", "Por favor ingresa un nombre");
      return;
    }
    if (
      !editingPayment.amount ||
      isNaN(Number(editingPayment.amount)) ||
      Number(editingPayment.amount) <= 0
    ) {
      Alert.alert("Error", "Por favor ingresa un monto válido");
      return;
    }
    if (
      !editingPayment.day ||
      isNaN(Number(editingPayment.day)) ||
      Number(editingPayment.day) < 1 ||
      Number(editingPayment.day) > 31
    ) {
      Alert.alert("Error", "Por favor ingresa un día válido (1-31)");
      return;
    }

    try {
      let res;
      const bodyData = {
        name: editingPayment.name.trim(),
        amount: Number(editingPayment.amount),
        day: Number(editingPayment.day),
        email, // el backend ignora y usa current_user.email
      };

      if (editingPayment.id) {
        // Editar pago existente
        res = await fetch(
          `http://192.168.0.7:8000/api/pagos/editar/${editingPayment.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bodyData),
          }
        );
      } else {
        // Crear nuevo pago
        res = await fetch("http://192.168.0.7:8000/api/pagos/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error guardando pago fijo");
      }

      // Recarga lista tras guardar
      const allRes = await fetch("http://192.168.0.7:8000/api/pagos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allData = await allRes.json();
      setFixedPayments(allData);
      setFilteredPayments(allData);

      setModalVisible(false);
      setEditingPayment(null);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Save payment error:", error);
    }
  };

  const deletePayment = async () => {
    try {
      const res = await fetch(
        `http://192.168.0.7:8000/api/pagos/eliminar/${editingPayment.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error eliminando pago fijo");
      }

      // Actualiza lista tras eliminar
      const allRes = await fetch("http://192.168.0.7:8000/api/pagos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allData = await allRes.json();
      setFixedPayments(allData);
      setFilteredPayments(allData);

      setModalVisible(false);
      setEditingPayment(null);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Delete payment error:", error);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Eliminar pago fijo",
      "¿Seguro que quieres eliminar este pago fijo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: deletePayment },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.paymentItem}
      onPress={() => openEditPaymentModal(item)}
    >
      <Text style={styles.paymentName}>{item.name}</Text>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.paymentAmount}>${item.amount.toLocaleString()}</Text>
        <Text style={styles.paymentDay}>Día {item.day}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <Text style={{ fontSize: 18, color: "#60758a" }}>🔍</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Lista de pagos fijos */}
      <FlatList
        data={filteredPayments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón flotante para nuevo pago fijo */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={openNewPaymentModal}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal para crear o editar pago fijo */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingPayment?.id ? "Editar Pago Fijo" : "Nuevo Pago Fijo"}
            </Text>

            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={editingPayment?.name || ""}
              onChangeText={(text) =>
                setEditingPayment((prev) => ({ ...prev, name: text }))
              }
            />

            <TextInput
              keyboardType="numeric"
              placeholder="Monto"
              style={styles.input}
              value={editingPayment?.amount?.toString() || ""}
              onChangeText={(text) =>
                setEditingPayment((prev) => ({ ...prev, amount: text }))
              }
            />

            <TextInput
              keyboardType="numeric"
              placeholder="Día (1-31)"
              style={styles.input}
              value={editingPayment?.day?.toString() || ""}
              onChangeText={(text) =>
                setEditingPayment((prev) => ({ ...prev, day: text }))
              }
            />

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              {editingPayment?.id && (
                <Button title="Eliminar" color="red" onPress={confirmDelete} />
              )}
              <Button title="Guardar" onPress={savePayment} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    marginHorizontal: 16,
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111418",
  },
  paymentItem: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#4a90e2",
    backgroundColor: "#fafafa",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 6,
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4a90e2",
  },
  paymentDay: {
    fontSize: 12,
    color: "#60758a",
    marginTop: 2,
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#4a90e2",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonText: {
    fontSize: 32,
    color: "#fff",
    lineHeight: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
