import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { StyleSheet, Dimensions } from "react-native";
import { useProfileStore } from "../store/profile";
import { useEffect, useState } from "react";
import { setupRealtimeProfile } from "../store/realtime";
import { supabase } from "../store/supabase";

export const ProfileHeader = () => {
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
    <View style={styles.headerContainer}>
      <View style={styles.imageContainer}>
        {doctorProfile.image ? (
          <Image source={{ uri: doctorImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="person" size={60} color="#FFFFFF" />
          </View>
        )}
      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.doctorName}>{doctorProfile.name}</Text>
        <Text style={styles.specialty}>{doctorProfile.specialty}</Text>
      </View>

      <Text style={styles.bio}>{doctorProfile.bio}</Text>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#c9eef3ff",
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 24,
    // borderBottomRightRadius: 24,
    margin: 16,
  },

  imageContainer: {
    marginBottom: 20,
    shadowColor: "#0097A7",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#0097A7",
    backgroundColor: "#B2EBF2",
  },

  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0097A7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },

  nameContainer: {
    alignItems: "center",
    marginBottom: 16,
  },

  doctorName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
    fontFamily: "System",
  },

  specialty: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    backgroundColor: "#009688",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: "hidden",
  },

  bio: {
    fontSize: 15,
    lineHeight: 22,
    color: "#757575",
    textAlign: "center",
    paddingHorizontal: 4,
    fontWeight: "500",
    maxWidth: width - 40,
  },
});

export default styles;
