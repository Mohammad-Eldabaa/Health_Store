import { Linking, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useProfileStore } from "../store/profile";

export default QuickActions = () => {
  const { doctorProfile } = useProfileStore();

  const { navigate } = useNavigation();
  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>خدمات سريعة</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.quickActionCard, { borderTopColor: action.color }]}
            onPress={() => {
              if (action.action == "Call")
                Linking.openURL(`tel:${doctorProfile.phone}`);
              else navigate(action.action);
            }}
          >
            <Icon name={action.icon} size={32} color={action.color} />
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
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
  },
  {
    title: "اتصل بنا",
    icon: "phone",
    color: "#009688",
    action: "Call",
  },
  {
    title: "الاسعافات الأولية",
    icon: "medical-services",
    color: "#8ae6f0ff",
    action: "FirstAid",
  },
  {
    title: "المقالات الطبية",
    icon: "book",
    color: "#F44336",
    action: "MedicalArticlesPage",
  },
  {
    title: "قسم التمريض",
    icon: "medical-services",
    color: "#8D6E63",
    action: "NursingHome",
  },
];
//  () => Linking.openURL(`tel:01012345678`)
