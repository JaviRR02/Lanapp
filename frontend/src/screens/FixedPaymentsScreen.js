import React, { useState, useEffect } from "react";
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

const initialFixedPayments = [
  { id: 1, email: "javier@gmail.com", name: "prestamo", amount: 1000, day: 10 },
  { id: 2, email: "javier@gmail.com", name: "Comida", amount: 300, day: 1 },
  { id: 3, email: "carol@gmail.com", name: "Transporte", amount: 1000, day: 7 },
];

export default function FixedPaymentsScreen() {
  const [fixedPayments, setFixedPayments] = useState(initialFixedPayments);
  const [search, setSearch] = useState("");
  const [filteredPayments, setFilteredPayments] = useState(initialFixedPayments);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = fixedPayments.filter((p) =>
      p.name.toLowerCase().includes(lowerSearch)
    );
    setFilteredPayments(filtered);
  }, [search, fixedPayments]);

  const openNewPaymentModal = () => {
    setEditingPayment({ name: "", amount: "", day: "" }); // campos vacíos para crear
    setModalVisible(true);
  };

  const openEditPaymentModal = (payment) => {
    setEditingPayment({
      ...payment,
      amount: payment.amount.toString(),
      day: payment.day.toString(),
    }); // convertir a string para inputs
    setModalVisible(true);
  };

  const savePayment = () => {
    // Validaciones
    if (!editingPayment.name.trim()) {
      alert("Por favor ingresa un nombre");
      return;
    }
    if (
      !editingPayment.amount ||
      isNaN(Number(editingPayment.amount)) ||
      Number(editingPayment.amount) <= 0
    ) {
      alert("Por favor ingresa un monto válido");
      return;
    }
    if (
      !editingPayment.day ||
      isNaN(Number(editingPayment.day)) ||
      Number(editingPayment.day) < 1 ||
      Number(editingPayment.day) > 31
    ) {
      alert("Por favor ingresa un día válido (1-31)");
      return;
    }

    if (editingPayment.id) {
      // Editando existente
      setFixedPayments((prev) =>
        prev.map((p) =>
          p.id === editingPayment.id
            ? {
                ...p,
                name: editingPayment.name.trim(),
                amount: Number(editingPayment.amount),
                day: Number(editingPayment.day),
              }
            : p
        )
      );
    } else {
      // Nuevo pago fijo
      const newId =
        fixedPayments.length > 0
          ? Math.max(...fixedPayments.map((p) => p.id)) + 1
          : 1;
      setFixedPayments((prev) => [
        {
          id: newId,
          email: "default@example.com",
          name: editingPayment.name.trim(),
          amount: Number(editingPayment.amount),
          day: Number(editingPayment.day),
        },
        ...prev,
      ]);
    }

    setModalVisible(false);
    setEditingPayment(null);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Eliminar pago fijo",
      "¿Seguro que quieres eliminar este pago fijo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setFixedPayments((prev) =>
              prev.filter((p) => p.id !== editingPayment.id)
            );
            setModalVisible(false);
            setEditingPayment(null);
          },
        },
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
      <TouchableOpacity style={styles.floatingButton} onPress={openNewPaymentModal}>
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
