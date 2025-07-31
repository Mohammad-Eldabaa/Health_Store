import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { useProfileStore } from "../store/profile";
import { useNavigation } from "@react-navigation/native";

export default HeroSection = () => {
  const { navigate } = useNavigation();

  const { doctorProfile, getDoctorImage } = useProfileStore();
  const [doctorImage, setDoctorImage] = useState(null);

  const fetchDoctorImage = async () => {
    if (doctorProfile.image) {
      const imageUrl = await getDoctorImage(doctorProfile.image);
      setDoctorImage(imageUrl);
    }
  };
  useEffect(() => {
    fetchDoctorImage();
  }, [doctorProfile.image]);
  return (
    <LinearGradient colors={["#0097A7", "#009688"]} style={styles.heroSection}>
      <View style={styles.heroContent}>
        {/* <Text style={styles.welcomeText}>مرحباً بك في</Text> */}
        <Text style={styles.clinicName}>{"عيادة الشفاء"}</Text>
        <Text style={styles.heroSubtitle}>صحتك هي أولويتنا</Text>

        <TouchableOpacity
          style={styles.doctorInfo}
          onPress={() => {
            navigate("Profile");
          }}
        >
          <Image
            source={{ uri: doctorImage }}
            style={styles.doctorImageSmall}
          />
          <View>
            <Text style={styles.doctorName}>{doctorProfile.name}</Text>
            <Text style={styles.doctorSpecialty}>
              {doctorProfile.specialty}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
