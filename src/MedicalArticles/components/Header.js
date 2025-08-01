import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <View style={{ display: "flex", flexDirection: "row" }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ paddingLeft: 16 }}
      >
        <Ionicons name="arrow-back" size={24} color="000" />
      </TouchableOpacity>
      <Text style={styles.title}>المقالات الطبية</Text>
    </View>

    <Text style={styles.subtitle}>
      مصدرك الموثوق للمعلومات الطبية والصحية المفيدة
    </Text>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  header: {
    marginTop: 15,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#009688",
    textAlign: "right",
    writingDirection: "rtl",
    flex: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#757575",
    textAlign: "right",
    writingDirection: "rtl",
  },
});
