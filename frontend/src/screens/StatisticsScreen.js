import React from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView, ScrollView } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";

export default function StatisticsScreen() {
  const screenWidth = Dimensions.get("window").width;

  // Datos de ejemplo para ingresos por categoría
  const ingresosData = [
    { name: "Salario", amount: 1200, color: "#4CAF50", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Freelance", amount: 800, color: "#2196F3", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Inversiones", amount: 500, color: "#FFC107", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  ];

  // Datos de ejemplo para egresos por categoría
  const egresosData = [
    { name: "Renta", amount: 900, color: "#F44336", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Comida", amount: 600, color: "#9C27B0", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "Transporte", amount: 200, color: "#FF9800", legendFontColor: "#7F7F7F", legendFontSize: 15 },
  ];

  // Datos para comparación ingresos vs egresos
  const comparacionData = {
    labels: ["Ingresos", "Egresos"],
    datasets: [
      {
        data: [
          ingresosData.reduce((sum, item) => sum + item.amount, 0),
          egresosData.reduce((sum, item) => sum + item.amount, 0)
        ]
      }
    ]
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.header}>Estadísticas</Text>

        {/* Ingresos por categoría */}
        <Text style={styles.chartTitle}>Ingresos por categoría</Text>
        <PieChart
          data={ingresosData}
          width={screenWidth - 20}
          height={240}
          chartConfig={chartConfig}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
        />

        {/* Egresos por categoría */}
        <Text style={styles.chartTitle}>Egresos por categoría</Text>
        <PieChart
          data={egresosData}
          width={screenWidth - 20}
          height={240}
          chartConfig={chartConfig}
          accessor={"amount"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
        />

        {/* Comparación ingresos vs egresos */}
        <Text style={styles.chartTitle}>Comparación Ingresos vs Egresos</Text>
        <BarChart
          data={comparacionData}
          width={screenWidth - 20}
          height={280}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
          style={styles.chart}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#000000"
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff"
  },
  container: {
    alignItems: "center"
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10
  },
  chart: {
    borderRadius: 16
  }
});
