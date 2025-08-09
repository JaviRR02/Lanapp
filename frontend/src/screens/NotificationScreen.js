import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function NotificationScreen() {
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SMS</Text>
        </View>
        <View style={styles.notificationRow}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>SMS Notifications</Text>
            <Text style={styles.description}>
              Receive SMS notifications for important account updates.
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#223649", true: "#0d80f2" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#223649"
            onValueChange={setSmsEnabled}
            value={smsEnabled}
            style={styles.switch}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Email</Text>
        </View>
        <View style={styles.notificationRow}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Email Notifications</Text>
            <Text style={styles.description}>
              Receive email notifications for account activity and security alerts.
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#223649", true: "#0d80f2" }}
            thumbColor="#ffffff"
            ios_backgroundColor="#223649"
            onValueChange={setEmailEnabled}
            value={emailEnabled}
            style={styles.switch}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingVertical: 12,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f7f9fc", // similar to light #101a23 background but lighter
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    minHeight: 72,
    marginBottom: 12,
    shadowColor: "#00000015",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    color: "#607D8B",
    fontSize: 14,
    fontWeight: "400",
  },
  switch: {
    transform: [{ scale: 1 }],
  },
});
