import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Platform, StyleSheet, Button, SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const initialTransactions = [
  {
    amount: 20000,
    category: "Tarjeta",
    date: "10/08/2025",
    description: "Sueldo",
    type: "ingreso",
    id: 7,
  },
  {
    amount: 19000,
    category: "Tarjeta",
    date: "10/08/2025",
    description: "Una mega propina",
    type: "ingreso",
    id: 14,
  },
  {
    amount: 10000,
    category: "pension",
    date: "10/07/2025",
    description: "pago de pension",
    type: "egreso",
    id: 8,
  },
  {
    amount: 500,
    category: "comida",
    date: "10/07/2025",
    description: "una rica pipza",
    type: "egreso",
    id: 9,
  },
  {
    amount: 1500,
    category: "Otro",
    date: "10/07/2025",
    description: "Mil quinientos",
    type: "egreso",
    id: 10,
  },
  {
    amount: 1500,
    category: "Otro",
    date: "10/07/2025",
    description: " Otra milky",
    type: "egreso",
    id: 11,
  },
  {
    amount: 150,
    category: "Comida",
    date: "10/07/2025",
    description: " Papas y refresco",
    type: "egreso",
    id: 12,
  },
  {
    amount: 450,
    category: "Otro",
    date: "10/07/2025",
    description: "Cine",
    type: "egreso",
    id: 13,
  },
  {
    amount: 600,
    category: "transporte",
    date: "10/07/2025",
    description: "",
    type: "egreso",
    id: 15,
  },
];

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState(
    initialTransactions
  );

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    category: "",
    date: new Date(),
    description: "",
    type: "ingreso",
  });

  // Date picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(lowerSearch) ||
        t.category.toLowerCase().includes(lowerSearch)
    );
    setFilteredTransactions(filtered);
  }, [search, transactions]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setNewTransaction((prev) => ({
        ...prev,
        date: selectedDate,
      }));
    }
  };

  const addTransaction = () => {
    if (
      !newTransaction.amount ||
      isNaN(Number(newTransaction.amount)) ||
      Number(newTransaction.amount) <= 0
    ) {
      alert("Por favor ingresa un monto válido");
      return;
    }
    if (!newTransaction.category.trim()) {
      alert("Por favor ingresa una categoría");
      return;
    }
    const newId =
      transactions.length > 0
        ? Math.max(...transactions.map((t) => t.id)) + 1
        : 1;

    const d = newTransaction.date;
    const formattedDate = `${d.getDate().toString().padStart(2, "0")}/${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;

    const transactionToAdd = {
      id: newId,
      amount: Number(newTransaction.amount),
      category: newTransaction.category.trim(),
      date: formattedDate,
      description: newTransaction.description.trim(),
      type: newTransaction.type,
    };

    setTransactions((prev) => [transactionToAdd, ...prev]);
    setModalVisible(false);
    setNewTransaction({
      amount: "",
      category: "",
      date: new Date(),
      description: "",
      type: "ingreso",
    });
  };

  const renderItem = ({ item }) => {
    const isIngreso = item.type === "ingreso";
    return (
      <View
        style={[
          styles.transactionItem,
          { borderLeftColor: isIngreso ? "green" : "red" },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.transactionDescription}>
            {item.description || "(Sin descripción)"}
          </Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={[
              styles.transactionAmount,
              { color: isIngreso ? "green" : "red" },
            ]}
          >
            {isIngreso ? "+" : "-"}${item.amount.toLocaleString()}
          </Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <Text style={{ fontSize: 18, color: "#60758a" }}>🔍</Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por descripción o categoría"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Transactions list */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Transacción</Text>

            <TextInput
              keyboardType="numeric"
              placeholder="Monto"
              style={styles.input}
              value={newTransaction.amount.toString()}
              onChangeText={(text) =>
                setNewTransaction((prev) => ({ ...prev, amount: text }))
              }
            />

            <TextInput
              placeholder="Categoría"
              style={styles.input}
              value={newTransaction.category}
              onChangeText={(text) =>
                setNewTransaction((prev) => ({ ...prev, category: text }))
              }
            />

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>
                Fecha:{" "}
                {newTransaction.date
                  ? `${newTransaction.date.getDate().toString().padStart(2, "0")}/${
                      (newTransaction.date.getMonth() + 1).toString().padStart(2, "0")
                    }/${newTransaction.date.getFullYear()}`
                  : "Selecciona una fecha"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newTransaction.date || new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date(2100, 12, 31)}
                minimumDate={new Date(2000, 0, 1)}
              />
            )}

            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={newTransaction.description}
              onChangeText={(text) =>
                setNewTransaction((prev) => ({ ...prev, description: text }))
              }
            />

            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === "ingreso" && styles.typeButtonSelected,
                ]}
                onPress={() =>
                  setNewTransaction((prev) => ({ ...prev, type: "ingreso" }))
                }
              >
                <Text
                  style={
                    newTransaction.type === "ingreso"
                      ? styles.typeButtonTextSelected
                      : styles.typeButtonText
                  }
                >
                  Ingreso
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === "egreso" && styles.typeButtonSelected,
                ]}
                onPress={() =>
                  setNewTransaction((prev) => ({ ...prev, type: "egreso" }))
                }
              >
                <Text
                  style={
                    newTransaction.type === "egreso"
                      ? styles.typeButtonTextSelected
                      : styles.typeButtonText
                  }
                >
                  Egreso
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Agregar" onPress={addTransaction} />
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderLeftWidth: 5,
    backgroundColor: "#fafafa",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 6,
    alignItems: "center",
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  transactionCategory: {
    fontSize: 12,
    color: "#60758a",
    marginTop: 2,
    textTransform: "capitalize",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  transactionDate: {
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
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4a90e2",
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 5,
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
    color: "white",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
