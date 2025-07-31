import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";

export const ServicesSection = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>خدماتنا الطبية</Text>
      <View style={styles.servicesGrid}>
        {services.map((service, index) => (
          <TouchableOpacity key={index} style={styles.serviceCard}>
            <View
              style={[
                styles.serviceIcon,
                { backgroundColor: `${service.color}15` },
              ]}
            >
              <Icon name={service.icon} size={28} color={service.color} />
            </View>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const services = [
  {
    title: "الكشف الطبي العام",
    icon: "medical-services",
    description: "فحص شامل وتشخيص دقيق",
    color: "#0097A7",
  },
  {
    title: "أمراض القلب",
    icon: "favorite",
    description: "تشخيص وعلاج أمراض القلب",
    color: "#E91E63",
  },
  {
    title: "أمراض الصدر",
    icon: "air",
    description: "علاج أمراض الجهاز التنفسي",
    color: "#2196F3",
  },
  {
    title: "الضغط والسكري",
    icon: "monitor-heart",
    description: "متابعة الأمراض المزمنة",
    color: "#FF9800",
  },
  {
    title: "الفحوصات الدورية",
    icon: "assessment",
    description: "برامج فحص شامل",
    color: "#4CAF50",
  },
  {
    title: "استشارات عن بعد",
    icon: "video-call",
    description: "استشارات طبية أونلاين",
    color: "#9C27B0",
  },
];
