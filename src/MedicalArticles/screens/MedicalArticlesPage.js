import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  I18nManager,
  Platform,
  StatusBar,
} from "react-native";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import FeaturedArticle from "../components/FeaturedArticle";
import ArticleCard from "../components/ArticleCard";
import NoResults from "../components/NoResults";

import medicalArticlesData from "../data/medicalArticlesData.json";

const MedicalArticlesPage = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFullContent, setShowFullContent] = useState({});
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    setArticles(medicalArticlesData.medicalArticles || []);
    setCategories(medicalArticlesData.categories || []);

    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
    }
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "الكل" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFullContent = (id) => {
    setShowFullContent((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const featured = filteredArticles.find((a) => a.featured);

  return (
    <View style={styles.wrapper}>
      <Header navigation={navigation} />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {featured && (
          <>
            <Text style={styles.sectionTitle}>المقال المميز</Text>
            <FeaturedArticle
              article={featured}
              toggleFullContent={toggleFullContent}
              showFull={!!showFullContent[featured.id]}
            />
          </>
        )}

        <Text style={styles.sectionTitle}>
          جميع المقالات ({filteredArticles.length})
        </Text>

        {filteredArticles.length > 0 ? (
          filteredArticles
            .filter((article) => !article.featured)
            .map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                toggleFullContent={toggleFullContent}
                showFull={!!showFullContent[article.id]}
              />
            ))
        ) : (
          <NoResults />
        )}
      </ScrollView>
    </View>
  );
};

export default MedicalArticlesPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0097a7",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 12,
    marginTop: 20,
    textAlign: "right",
    writingDirection: "rtl",
  },
  toggleButton: {
    alignSelf: "flex-end",
    backgroundColor: "#00BCD4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  toggleButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "right",
    writingDirection: "rtl",
  },
});
