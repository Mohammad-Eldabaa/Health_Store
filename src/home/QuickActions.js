import { Linking, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useProfileStore } from "../store/profile";
import useAuthStore from "../store/login";

export default QuickActions = () => {
  const { doctorProfile } = useProfileStore();
  const { CUrole } = useAuthStore();

  const { navigate } = useNavigation();
  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>خدمات سريعة</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => {
          return (
            (action.role == "user" || action.role == CUrole()) && (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickActionCard,
                  { borderTopColor: action.color },
                ]}
                onPress={() => {
                  if (action.action == "Call")
                    Linking.openURL(`tel:${doctorProfile.phone}`);
                  else navigate(action.action);
                }}
              >
                <Icon name={action.icon} size={32} color={action.color} />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            )
          );
        })}
      </View>
    </View>
  );
};

const quickActions = [
  {
    title: "حجز موعد",
    icon: "event",
    color: "#0097A7",
    action: "Booking",
    role: "user",
  },
  {
    title: "الاسعافات الأولية",
    icon: "medical-services",
    color: "#8ae6f0ff",
    action: "FirstAid",
    role: "user",
  },
  {
    title: "المقالات الطبية",
    icon: "book",
    color: "#F44336",
    action: "MedicalArticlesPage",
    role: "user",
  },
  {
    title: "اتصل بنا",
    icon: "call",
    color: "#09c0adff",
    action: "Call",
    role: "user",
  },
  {
    title: "المواعيد المجدولة",
    icon: "menu-book",
    color: "#2461efff",
    action: "Appointments",
    role: "nurse",
  },
  {
    title: "السجل اليومى",
    icon: "bookmarks",
    color: "#4da1ebff",
    action: "PatientList",
    role: "nurse",
  },
];
