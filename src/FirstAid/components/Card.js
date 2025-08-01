import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useFirstAidStore from '../store/firstaid';

export default function Card({ title, id }) {
  const navigation = useNavigation();
  const { setLastId } = useFirstAidStore();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setLastId(id);
        navigation.navigate("FirstAidDetails");
      }}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#00bcd4",
    padding: 12,
    borderRadius: 12,
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 60, 
    justifyContent: "center",
    elevation: 2,
  },
  title: { color: "#fff", fontSize: 18,fontWeight:600, textAlign: "center" },
});
