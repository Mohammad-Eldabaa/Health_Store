import React, { useEffect, useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import { ProfileHeader } from "./ProfileHeader";
import { ContactInfo } from "./ContactInfo";
import { ExperienceSection } from "./ExperienceSection";
import { CertificatesSection } from "./CertificatesSection";
// import { useProfileStore } from "../store/profile";
// import { useExperiencesStore } from "../store/experiences";
// import { useDoctorCertificatesStore } from "../store/certificateion";
import { ImageModal } from "./ImageModal";
import { useProfileStore } from "../store/profile";

const Profile = () => {
  const [expandedImage, setExpandedImage] = useState(null);
  const { getDoctorImage, getDoctorProfile } = useProfileStore();
  const [ref, setRef] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={ref}
            onRefresh={() => {
              setRef(true);
              getDoctorProfile();
              getDoctorImage();
              console.log("refreash");
              setRef(false);
            }}
          />
        }
      >
        <ProfileHeader />
        <ContactInfo />
        <ExperienceSection />
        <CertificatesSection setExpandedImage={setExpandedImage} />
      </ScrollView>
      <ImageModal
        expandedImage={expandedImage}
        setExpandedImage={setExpandedImage}
      />
      <View style={{ height: 65 }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
});

export default Profile;
