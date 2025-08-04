import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  I18nManager,
} from "react-native";
import useAuthStore from "../store/login";
import { useNavigation } from "@react-navigation/native";

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const PersonalProfilePage = ({ navigation }) => {
  const { CUemail, CUname, CUphone, CUaddress, logout } = useAuthStore();
  const { reset } = useNavigation();

  const userInfo = {
    fullName: CUname(),
    email: CUemail(),
    phone: CUphone(),
    address: CUaddress(),
  };

  const InfoCard = ({ label, value, multiline = false }) => (
    <View style={styles.infoCard}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0097A7" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userInfo.fullName
                .split(" ")
                .slice(0, 2)
                .map((name) => name[0])
                .join("")}
            </Text>
          </View>
          <Text style={styles.headerTitle}>الملف الشخصي</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <InfoCard label="الاسم الكامل" value={userInfo.fullName} />

          <InfoCard label="البريد الإلكتروني" value={userInfo.email} />

          <InfoCard label="رقم الهاتف" value={userInfo.phone} />

          <InfoCard label="العنوان" value={userInfo.address} multiline={true} />
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity
            onPress={() => {
              logout();
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            }}
            style={styles.optionItem}
          >
            <Text style={styles.optionArrow}>‹</Text>
            <Text style={styles.optionText}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#0097A7",
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#009688",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    fontFamily: "System",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#B2EBF2",
    opacity: 0.9,
    fontFamily: "System",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 25,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRightWidth: 4,
    borderRightColor: "#00BCD4",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
    marginBottom: 8,
    textAlign: "right",
    fontFamily: "System",
  },
  value: {
    fontSize: 16,
    color: "#212121",
    lineHeight: 22,
    textAlign: "right",
    fontFamily: "System",
  },
  optionsSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  optionItem: {
    backgroundColor: "#f8cfcfff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  optionText: {
    fontSize: 16,
    color: "#212121",
    fontWeight: "500",
    fontFamily: "System",
    flex: 1,
    textAlign: "right",
  },
  optionArrow: {
    fontSize: 24,
    color: "#000",
    fontWeight: "300",
    marginLeft: 10,
  },
});

export default PersonalProfilePage;
