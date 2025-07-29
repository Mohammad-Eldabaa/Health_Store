import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDoctorCertificatesStore } from "../store/certificateion";
// import { mockData } from "./index";

export const CertificatesSection = ({ setExpandedImage }) => {
  const { allCertificates } = useDoctorCertificatesStore();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="school" size={20} color="#0097A7" />
        <Text style={styles.sectionTitle}>الشهادات والمؤهلات</Text>
      </View>

      {allCertificates.map((cert) => (
        <View key={cert.id} style={styles.certificateCard}>
          <View style={styles.certificateContent}>
            {cert.image ? (
              <TouchableOpacity onPress={() => setExpandedImage(cert.image)}>
                <Image
                  source={{ uri: cert.image }}
                  style={styles.certificateImage}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.certificatePlaceholder}>
                <Ionicons name="school" size={30} color="#FFFFFF" />
              </View>
            )}

            <View style={styles.certificateInfo}>
              <Text style={styles.certificateName}>{cert.name}</Text>
              <Text style={styles.certificateInstitution}>
                {cert.institution}
              </Text>
              <Text style={styles.certificateYear}>{cert.year}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 0,
    padding: 16,
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
  certificateCard: {
    backgroundColor: "#E0F7FA",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#B2EBF2",
  },
  certificateContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  certificateImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  certificatePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#0097A7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  certificateInfo: {
    flex: 1,
    marginRight: 12,
    marginTop: 4,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#006064",
    marginBottom: 4,
  },
  certificateInstitution: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  certificateYear: {
    fontSize: 14,
    color: "#0097A7",
    fontWeight: "500",
  },
});
