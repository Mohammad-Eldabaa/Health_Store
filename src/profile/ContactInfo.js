import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { useProfileStore } from "../store/profile";

export const ContactInfo = () => {
  const { doctorProfile } = useProfileStore();
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="school" size={20} color="#0097A7" />
        <Text style={styles.sectionTitle}>الشهادات والمؤهلات</Text>
      </View>
      <View style={styles.contactItem}>
        <Ionicons name="call" size={20} color="#0097A7" />
        <Text style={styles.contactText}>{doctorProfile.phone}</Text>
      </View>

      <View style={styles.contactItem}>
        <Ionicons name="location" size={20} color="#0097A7" />
        <Text style={styles.contactText}>{doctorProfile.address}</Text>
      </View>

      <View style={styles.contactItem}>
        <Ionicons name="time" size={20} color="#0097A7" />
        <Text style={styles.contactText}>{doctorProfile.workingHours}</Text>
      </View>

      <View style={styles.contactItem}>
        <Ionicons name="language" size={20} color="#0097A7" />
        <Text style={styles.contactText}>
          {doctorProfile.languages?.join("، ")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginHorizontal: 8,
    marginVertical: 0,
    direction: "rtl",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0097A7",
    marginLeft: 8,
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#E0F7FA",
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#0097A7",
    minHeight: 50,
  },

  contactText: {
    fontSize: 16,
    color: "#2C2C2C",
    marginLeft: 12,
    marginRight: 12,
    flex: 1,
    lineHeight: 22,
    fontWeight: "500",
    textAlign: "left",
  },

  alternativeContactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    marginBottom: 0,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginLeft: 12,
  },

  contactItemHover: {
    backgroundColor: "#E0F7FA",
  },

  sectionContainerDark: {
    backgroundColor: "#1E1E1E",
    borderColor: "#333333",
  },

  sectionTitleDark: {
    color: "#FFFFFF",
  },

  contactItemDark: {
    backgroundColor: "#2A2A2A",
  },

  contactTextDark: {
    color: "#E0E0E0",
  },
});

export default styles;
