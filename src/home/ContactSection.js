import { LinearGradient } from "expo-linear-gradient";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { styles } from "./styles";
import { useProfileStore } from "../store/profile";

export default ContactSection = () => {
  const { doctorProfile } = useProfileStore();

  return (
    <LinearGradient
      colors={["#0097A7", "#009688"]}
      style={styles.contactSection}
    >
      <Text style={styles.contactTitle}>تواصل معنا</Text>
      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <Icon name="location-on" size={20} color="#fff" />
          <Text style={styles.contactText}>{doctorProfile.address}</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="phone" size={20} color="#fff" />
          <Text style={styles.contactText}>{doctorProfile.phone}</Text>
        </View>
      </View>

      <View style={styles.contactButtons}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => Linking.openURL(`tel:+201017384273`)}
        >
          <Icon name="phone" size={20} color="#0097A7" />
          <Text style={styles.contactButtonText}>اتصل الآن</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: "#25D366" }]}
          onPress={() => Linking.openURL(`https://wa.me/+201017384273`)}
        >
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <Text style={[styles.contactButtonText, { color: "#fff" }]}>
            واتساب
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
