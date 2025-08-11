import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StatisticsScreen() {
  const screenWidth = Dimensions.get("window").width;

  const [ingresosData, setIngresosData] = useState([]);
  const [egresosData, setEgresosData] = useState([]);
  const [comparacionData, setComparacionData] = useState(null);
  const [loading, setLoading] = useState(true);

  function generateColors(n) {
    const colors = [];
    const saturation = 70; // % de saturación
    const lightness = 50; // % de luminosidad

    for (let i = 0; i < n; i++) {
      const hue = Math.floor((360 / n) * i); // distribuye el matiz de 0 a 360 grados
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  }

  // Función para transformar el objeto de backend a array esperado por PieChart
  const formatPieData = (obj) => {
  const categories = Object.keys(obj);
  const amounts = Object.values(obj);
  const colors = generateColors(categories.length);

  return categories.map((name, i) => ({
    name,
    amount: amounts[i],
    color: colors[i],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));
};


  // Carga datos desde backend
  const fetchData = async () => {
    try {
      setLoading(true);

      // Obtén token para autorización
      const token = await AsyncStorage.getItem("token");

      // Headers con bearer token
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Peticiones paralelas
      const [ingresosRes, egresosRes, compRes] = await Promise.all([
        fetch("http://192.168.0.5:8000/api/graficas/ingresos-por-categoria", { headers }),
        fetch("http://192.168.0.5:8000/api/graficas/egresos-por-categoria", { headers }),
        fetch("http://192.168.0.5:8000/api/graficas/ingresos-vs-egresos", { headers }),
      ]);

      if (!ingresosRes.ok || !egresosRes.ok || !compRes.ok) {
        throw new Error("Error al obtener datos");
      }

      const ingresosJson = await ingresosRes.json();
      const egresosJson = await egresosRes.json();
      const compJson = await compRes.json();

      // Formatear para PieChart
      setIngresosData(formatPieData(ingresosJson.ingresos_por_categoria));
      setEgresosData(formatPieData(egresosJson.egresos_por_categoria));

      // Formatear para BarChart
      setComparacionData({
        labels: ["Ingresos", "Egresos"],
        datasets: [
          {
            data: [
              compJson.ingresos_vs_egresos.ingresos,
              compJson.ingresos_vs_egresos.egresos,
            ],
          },
        ],
      });

    } catch (error) {
      console.error(error);
      // Aquí podrías mostrar alerta o mensaje de error en UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, {justifyContent: "center", alignItems: "center"}]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.header}>Estadísticas</Text>

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

        <Text style={styles.chartTitle}>Comparación Ingresos vs Egresos</Text>
        {comparacionData && (
          <BarChart
            data={comparacionData}
            width={screenWidth - 20}
            height={280}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.chart}
          />
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
});
