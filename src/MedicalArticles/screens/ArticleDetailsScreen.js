import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ArticleDetailsScreen = ({ route }) => {
  const { article } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backButtonText}>رجوع</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Image source={{ uri: article.image }} style={styles.image} />
        <Text style={styles.category}>{article.category}</Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.meta}>
          📅 {new Date(article.date).toLocaleDateString("ar-EG")} | ⏱️{" "}
          {article.readTime}
        </Text>
        <Text style={styles.author}>👤 {article.author}</Text>
        <Text style={styles.contentText}>{article.content}</Text>
      </ScrollView>
    </View>
  );
};

export default ArticleDetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0097a7",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0097a7",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },
  container: {
    flex: 1,
    backgroundColor: "#b2ebf2",
  },
  content: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  category: {
    backgroundColor: "#009688",
    color: "white",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 6,
    color: "#333",
  },
  meta: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
    textAlign: "right",
  },
  author: {
    fontSize: 13,
    color: "#757575",
    marginBottom: 16,
    textAlign: "right",
  },
  contentText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
    textAlign: "right",
  },
});
