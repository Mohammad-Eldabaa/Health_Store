import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import useFirstAidStore from "../store/firstaid";

export default function FirstAidDetails() {
  const [htmlContent, setHtmlContent] = useState("");
  const [video, setVedeo] = useState("");
  const { getStateById, lastId } = useFirstAidStore();
  const navigation = useNavigation();

  useEffect(() => {
    if (lastId) {
      const fetchData = async () => {
        const html = await getStateById(lastId);
        setVedeo(html.video || "");
        setHtmlContent(html?.detail || "<p>لا توجد بيانات</p>");
      };
      fetchData();
    }
  }, [lastId]);

  return (
    // <SafeAreaView style={styles.safeArea}>
    <View style={styles.wrapper}>
      {/* 🔙 زر الرجوع */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>تفاصيل الإسعاف</Text>
      </View>

      <View style={styles.videoContainer}>
        <WebView
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          source={{ uri: video }}
          style={styles.webview}
        />
      </View>

      <WebView
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        source={{
          html: `
              <html dir="rtl">
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { font-family: Arial; background-color: #b2ebf2; direction: rtl; text-align: right; color: #333; line-height: 1.2; }
                    h1 { font-size: 20px; margin-bottom: 12px; }
                    h3 { font-size: 16px; color: #00796B; margin-top: 16px; margin-bottom: 8px; }
                    p { font-size: 14px; color: #444; margin-bottom: 8px; line-height: 1.6; }
                  </style>
                </head>
                <body>${htmlContent}</body>
              </html>
            `,
        }}
        style={styles.htmlContainer}
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
    backgroundColor: "#b2ebf2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0097a7",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  videoContainer: {
    height: 220,
    backgroundColor: "#ddd",
  },
  webview: {
    flex: 1,
  },
  htmlContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "transparent",
    margin: 8,
  },
});
