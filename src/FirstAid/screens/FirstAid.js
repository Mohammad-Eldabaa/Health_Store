import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  I18nManager,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFirstAidStore from "../store/firstaid";
import Card from "../components/Card";
import { TextInput, TouchableOpacity } from "react-native";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function FirstAid({ navigation }) {
  const { getAllStatusNames } = useFirstAidStore();
  const [cardTitles, setCardTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTitles = async () => {
      const titles = await getAllStatusNames();
      setCardTitles(titles || []);
    };
    fetchTitles();
  }, []);

  const filteredTitles = cardTitles.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // <SafeAreaView style={styles.safeArea}>
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingLeft: 16 }}
          >
            <Ionicons name="arrow-back" size={24} color="000" />
          </TouchableOpacity>
          <Text style={styles.title}>الإسعافات الأولية</Text>
        </View>
        <Text style={styles.subtitle}>
          دليلك الموثوق للتعامل مع الحالات الطارئة بسرعة وأمان
        </Text>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="ابحث باسم الإصابة..."
            style={styles.input}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#aaa"
            textAlign="right"
          />
          <TouchableOpacity onPress={() => console.log("Voice Search")}>
            <Ionicons name="mic-outline" size={24} color="#0097a7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* قائمة الكروت */}
      <FlatList
        data={filteredTitles}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <Card title={item.name} id={item.id} />}
        ListEmptyComponent={
          <Text style={styles.noResults}>لا توجد نتائج مطابقة</Text>
        }
      />
    </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0097a7",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
    marginRight: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#757575",
    textAlign: "right",
    writingDirection: "rtl",
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderColor: "#ddd",
    borderWidth: 2,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#333",
    writingDirection: "rtl",
  },
  listContent: {
    padding: 16,
  },
  noResults: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});
