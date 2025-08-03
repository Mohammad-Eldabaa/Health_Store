import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const NursingHome = () => {
  const navigation = useNavigation();

  const nursingFeatures = [
    {
      title: "إدارة المواعيد",
      icon: "event",
      screen: "NursingAppointments",
      color: "#0097A7",
    },
    {
      title: "قائمة المرضى",
      icon: "people",
      screen: "NursingPatientsList",
      color: "#4CAF50",
    },
    {
      title: "السجلات الطبية",
      icon: "medical-services",
      screen: "MedicalRecords",
      color: "#FF9800",
    },
    {
      title: "التقارير",
      icon: "assessment",
      screen: "Reports",
      color: "#9C27B0",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>قسم التمريض</Text>
      <View style={styles.grid}>
        {nursingFeatures.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderTopColor: feature.color }]}
            onPress={() => navigation.navigate(feature.screen)}
          >
            <Icon name={feature.icon} size={30} color={feature.color} />
            <Text style={styles.cardText}>{feature.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    borderTopWidth: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});

export default NursingHome;
