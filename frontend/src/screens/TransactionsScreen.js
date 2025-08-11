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

export default function TransactionsScreen() {
  const { token, user } = useContext(AuthContext);
  const email = user?.email;
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);


  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const apiUrl = "http://192.168.0.5:8000/api/transacciones";

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = transactions.filter(
      (t) =>
        t.category.toLowerCase().includes(lowerSearch) ||
        t.description.toLowerCase().includes(lowerSearch) ||
        t.type.toLowerCase().includes(lowerSearch)
    );
    setFilteredTransactions(filtered);
  }, [search, transactions]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${apiUrl}/historial`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error cargando transacciones");
      const data = await res.json();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Fetch transactions error:", error);
    }
  };

  const openNewTransactionModal = () => {
    setEditingTransaction({
      amount: "",
      category: "",
      date: "",
      description: "",
      type: "ingreso",
    });
    setModalVisible(true);
  };

  const openEditTransactionModal = (transaction) => {
    setEditingTransaction({
      ...transaction,
      amount: transaction.amount.toString(),
    });
    setModalVisible(true);
  };

  const saveTransaction = async () => {
    const t = editingTransaction;

    if (!t.category.trim()) {
      Alert.alert("Error", "Por favor ingresa una categoría");
      return;
    }
    if (!t.date.trim()) {
      Alert.alert("Error", "Por favor ingresa una fecha");
      return;
    }
    if (!t.amount || isNaN(Number(t.amount)) || Number(t.amount) <= 0) {
      Alert.alert("Error", "Por favor ingresa un monto válido");
      return;
    }
    if (!t.type || (t.type !== "ingreso" && t.type !== "egreso")) {
      Alert.alert("Error", "Por favor selecciona un tipo válido");
      return;
    }
    if (!email) {
      Alert.alert("Error", "No se encontró el correo del usuario. Por favor inicia sesión de nuevo.");
      return;
    }

    const bodyData = {
      email: email,
      category: t.category.trim(),
      date: t.date.trim(),
      amount: Number(t.amount),
      description: t.description.trim(),
      type: t.type,
    };

    try {
      let res;
      if (t.id) {
        // Actualizar transacción
        res = await fetch(`${apiUrl}/${t.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        });
      } else {
        // Crear transacción
        res = await fetch(`${apiUrl}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        });
      }

      if (!res.ok) {
        let errorMessage = `Error ${t.id ? "actualizando" : "creando"} transacción`;
        try {
          const errorData = await res.json();
          errorMessage += ": " + (errorData.message || JSON.stringify(errorData));
        } catch {
          const errorText = await res.text();
          errorMessage += ": " + errorText;
        }
        throw new Error(errorMessage);
      }

      await fetchTransactions();
      setModalVisible(false);
      setEditingTransaction(null);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Save transaction error:", error);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Eliminar transacción",
      "¿Seguro que quieres eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: deleteTransaction,
        },
      ]
    );
  };

  const deleteTransaction = async () => {
    try {
      const res = await fetch(`${apiUrl}/eliminar/${editingTransaction.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error eliminando transacción");

      await fetchTransactions();
      setModalVisible(false);
      setEditingTransaction(null);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error("Delete transaction error:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => openEditTransactionModal(item)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.transactionDescription}>
          {item.description || "Sin descripción"}
        </Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === "ingreso" ? "#4caf50" : "#f44336" },
        ]}
      >
        {item.type === "egreso" ? "-" : "+"}${Number(item.amount).toLocaleString()}
      </Text>
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
          placeholder="Buscar por categoría, descripción o tipo"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Lista */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón flotante */}
      <TouchableOpacity style={styles.floatingButton} onPress={openNewTransactionModal}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal para crear/editar */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTransaction?.id ? "Editar Transacción" : "Nueva Transacción"}
            </Text>

            <TextInput
              placeholder="Categoría"
              style={styles.input}
              value={editingTransaction?.category || ""}
              onChangeText={(text) =>
                setEditingTransaction((prev) => ({ ...prev, category: text }))
              }
            />
            <TextInput
              placeholder="Fecha (DD/MM/YYYY)"
              style={styles.input}
              value={editingTransaction?.date || ""}
              onChangeText={(text) =>
                setEditingTransaction((prev) => ({ ...prev, date: text }))
              }
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Monto"
              style={styles.input}
              value={editingTransaction?.amount?.toString() || ""}
              onChangeText={(text) =>
                setEditingTransaction((prev) => ({ ...prev, amount: text }))
              }
            />
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={editingTransaction?.description || ""}
              onChangeText={(text) =>
                setEditingTransaction((prev) => ({ ...prev, description: text }))
              }
            />
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  editingTransaction?.type === "ingreso" && styles.typeButtonSelected,
                ]}
                onPress={() => setEditingTransaction((prev) => ({ ...prev, type: "ingreso" }))}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    editingTransaction?.type === "ingreso" && styles.typeButtonTextSelected,
                  ]}
                >
                  Ingreso
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  editingTransaction?.type === "egreso" && styles.typeButtonSelected,
                ]}
                onPress={() => setEditingTransaction((prev) => ({ ...prev, type: "egreso" }))}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    editingTransaction?.type === "egreso" && styles.typeButtonTextSelected,
                  ]}
                >
                  Egreso
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              {editingTransaction?.id && (
                <Button title="Eliminar" color="red" onPress={confirmDelete} />
              )}
              <Button title="Guardar" onPress={saveTransaction} />
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
  transactionItem: {
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
  transactionCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    textTransform: "capitalize",
  },
  transactionDescription: {
    fontSize: 13,
    color: "#666",
  },
  transactionDate: {
    fontSize: 12,
    color: "#60758a",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#4a90e2",
    alignItems: "center",
  },
  typeButtonSelected: {
    backgroundColor: "#4a90e2",
  },
  typeButtonText: {
    color: "#4a90e2",
    fontWeight: "600",
  },
  typeButtonTextSelected: {
    color: "#fff",
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
    textAlign: "center",
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
