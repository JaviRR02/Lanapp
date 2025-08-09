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

const initialBudgets = [
  { category: "comida", limit: 4500, email: "andres@gmail.com" },
  { category: "otro", limit: 5000, email: "andres@gmail.com" },
  { category: "transporte", limit: 2000, email: "andres@gmail.com" },
];

export default function BudgetsScreen() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [search, setSearch] = useState("");
  const [filteredBudgets, setFilteredBudgets] = useState(initialBudgets);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = budgets.filter((b) =>
      b.category.toLowerCase().includes(lowerSearch)
    );
    setFilteredBudgets(filtered);
  }, [search, budgets]);

  const openNewBudgetModal = () => {
    setEditingBudget({ category: "", limit: "" });
    setModalVisible(true);
  };

  const openEditBudgetModal = (budget) => {
    setEditingBudget({
      ...budget,
      limit: budget.limit.toString(),
    });
    setModalVisible(true);
  };

  const saveBudget = () => {
    if (!editingBudget.category.trim()) {
      alert("Por favor ingresa una categoría");
      return;
    }
    if (
      !editingBudget.limit ||
      isNaN(Number(editingBudget.limit)) ||
      Number(editingBudget.limit) <= 0
    ) {
      alert("Por favor ingresa un límite válido");
      return;
    }

    if (editingBudget.email) {
      // Editar existente
      setBudgets((prev) =>
        prev.map((b) =>
          b.category === editingBudget.category
            ? {
                ...b,
                limit: Number(editingBudget.limit),
              }
            : b
        )
      );
    } else {
      // Nuevo presupuesto
      setBudgets((prev) => [
        { category: editingBudget.category.trim(), limit: Number(editingBudget.limit), email: "andres@gmail.com" },
        ...prev,
      ]);
    }

    setModalVisible(false);
    setEditingBudget(null);
  };

  const confirmDelete = () => {
    Alert.alert(
      "Eliminar presupuesto",
      "¿Seguro que quieres eliminar este presupuesto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setBudgets((prev) =>
              prev.filter((b) => b.category !== editingBudget.category)
            );
            setModalVisible(false);
            setEditingBudget(null);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.budgetItem} onPress={() => openEditBudgetModal(item)}>
      <Text style={styles.budgetCategory}>{item.category}</Text>
      <Text style={styles.budgetLimit}>${item.limit.toLocaleString()}</Text>
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
          placeholder="Buscar por categoría"
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Lista */}
      <FlatList
        data={filteredBudgets}
        keyExtractor={(item) => item.category}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón flotante */}
      <TouchableOpacity style={styles.floatingButton} onPress={openNewBudgetModal}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal para crear/editar */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingBudget?.email ? "Editar Presupuesto" : "Nuevo Presupuesto"}
            </Text>

            <TextInput
              placeholder="Categoría"
              style={styles.input}
              value={editingBudget?.category || ""}
              onChangeText={(text) =>
                setEditingBudget((prev) => ({ ...prev, category: text }))
              }
              editable={!editingBudget?.email} // No dejar editar categoría al modificar para evitar key duplicada
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Límite"
              style={styles.input}
              value={editingBudget?.limit?.toString() || ""}
              onChangeText={(text) =>
                setEditingBudget((prev) => ({ ...prev, limit: text }))
              }
            />

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              {editingBudget?.email && (
                <Button title="Eliminar" color="red" onPress={confirmDelete} />
              )}
              <Button title="Guardar" onPress={saveBudget} />
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
  budgetItem: {
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
  budgetCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    textTransform: "capitalize",
  },
  budgetLimit: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4a90e2",
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
