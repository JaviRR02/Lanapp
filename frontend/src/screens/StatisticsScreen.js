import React, { useCallback } from "react"; // Cambié useEffect por useCallback para useFocusEffect
import { View, Text, StyleSheet, Dimensions, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function StatisticsScreen() {
  const screenWidth = Dimensions.get("window").width;

  const [ingresosData, setIngresosData] = React.useState([]);
  const [egresosData, setEgresosData] = React.useState([]);
  const [comparacionData, setComparacionData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  function generateColors(n) {
    const colors = [];
    const saturation = 70; // % de saturación
    const lightness = 50; // % de luminosidad

    for (let i = 0; i < n; i++) {
      const hue = Math.floor((360 / n) * i);
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }

  // Función para transformar el objeto de backend a array esperado por PieChart
  const formatPieData = (obj) => {
    if (!obj || typeof obj !== "object") {
      console.warn("Datos de entrada no válidos para formatPieData:", obj);
      return [];
    }
    const categories = Object.keys(obj);
    const amounts = Object.values(obj);
    const colors = generateColors(categories.length);

    return categories.map((name, i) => ({
      name: name || "Desconocido", // Fallback si name es undefined
      amount: Number(amounts[i]) || 0, // Asegura que amount sea número
      color: colors[i],
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));
  };

  // Carga datos desde backend
  const fetchData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("No se encontró token");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [ingresosRes, egresosRes, compRes] = await Promise.all([
        fetch("http://192.168.0.7:8000/api/graficas/ingresos-por-categoria", { headers }),
        fetch("http://192.168.0.7:8000/api/graficas/egresos-por-categoria", { headers }),
        fetch("http://192.168.0.7:8000/api/graficas/ingresos-vs-egresos", { headers }),
      ]);

      if (!ingresosRes.ok || !egresosRes.ok || !compRes.ok) {
        throw new Error(`Error en las respuestas: ${ingresosRes.status}, ${egresosRes.status}, ${compRes.status}`);
      }

      const ingresosJson = await ingresosRes.json();
      const egresosJson = await egresosRes.json();
      const compJson = await compRes.json();

      setIngresosData(formatPieData(ingresosJson.ingresos_por_categoria || {}));
      setEgresosData(formatPieData(egresosJson.egresos_por_categoria || {}));

      setComparacionData({
        labels: ["Ingresos", "Egresos"],
        datasets: [
          {
            data: [
              Number(compJson.ingresos_vs_egresos?.ingresos) || 0,
              Number(compJson.ingresos_vs_egresos?.egresos) || 0,
            ],
          },
        ],
      });
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Recarga datos cada vez que la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  // Función para renderizar la leyenda con monto y porcentaje
  const renderLegend = (data) => {
    if (!data || data.length === 0) {
      return (
        <View style={styles.legendItem}>
          <Text style={styles.legendText}>No hay datos disponibles</Text>
        </View>
      );
    }

    const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    return data.map((item, index) => {
      const percentage = total > 0 ? ((item.amount / total) * 100).toFixed(2) : "0.00";
      return (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: item.color || "#ccc" }]} />
          <Text style={styles.legendText}>
            {item.name}: ${item.amount.toFixed(2)} ({percentage}%)
          </Text>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Estadísticas</Text>

        <Text style={styles.chartTitle}>Ingresos por categoría</Text>
        {ingresosData.length > 0 ? (
          <PieChart
            data={ingresosData}
            width={screenWidth - 20}
            height={240}
            chartConfig={chartConfig}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No hay datos de ingresos</Text>
        )}
        {renderLegend(ingresosData)}

        <Text style={styles.chartTitle}>Egresos por categoría</Text>
        {egresosData.length > 0 ? (
          <PieChart
            data={egresosData}
            width={screenWidth - 20}
            height={240}
            chartConfig={chartConfig}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No hay datos de egresos</Text>
        )}
        {renderLegend(egresosData)}

        <Text style={styles.chartTitle}>Comparación Ingresos vs Egresos</Text>
        {comparacionData && comparacionData.datasets[0].data.some(val => val > 0) ? (
          <BarChart
            data={comparacionData}
            width={screenWidth - 20}
            height={280}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.chart}
          />
        ) : (
          <Text style={styles.noDataText}>No hay datos para comparar</Text>
        )}
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
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#000000",
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    alignItems: "center",
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  chart: {
    borderRadius: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  legendColor: {
    width: 15,
    height: 15,
    marginRight: 10,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
    textAlign: "center",
  },
});