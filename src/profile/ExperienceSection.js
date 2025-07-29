import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { mockData } from "./index";
import { useState } from "react";
import { useExperiencesStore } from "../store/experiences";

export const ExperienceSection = () => {
  const { allExperiences } = useExperiencesStore();

  const [expandedExperiences, setExpandedExperiences] = useState([]);
  const toggleExperience = (id) => {
    setExpandedExperiences((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Ionicons name="briefcase" size={20} color="#0097A7" />
        <Text style={styles.sectionTitle}>الخبرات العملية</Text>
      </View>

      {allExperiences.map((exp) => (
        <View key={exp.id} style={styles.experienceCard}>
          <TouchableOpacity
            style={styles.experienceHeader}
            onPress={() => toggleExperience(exp.id)}
          >
            <Text style={styles.experiencePosition}>{exp.position}</Text>
            <Ionicons
              name={
                expandedExperiences.includes(exp.id)
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={20}
              color="#0097A7"
            />
          </TouchableOpacity>

          <Text style={styles.experienceDetails}>
            {exp.hospital} | {exp.period}
          </Text>

          {expandedExperiences.includes(exp.id) && (
            <View style={styles.experienceDescription}>
              <Text style={styles.descriptionText}>{exp.description}</Text>
            </View>
          )}
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
    borderRadius: 12,
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
  experienceCard: {
    backgroundColor: "#E0F7FA",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#B2EBF2",
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  experiencePosition: {
    fontSize: 16,
    fontWeight: "600",
    color: "#006064",
    flex: 1,
  },
  experienceDetails: {
    fontSize: 14,
    color: "#0097A7",
    marginTop: 8,
  },
  experienceDescription: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#B2EBF2",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
