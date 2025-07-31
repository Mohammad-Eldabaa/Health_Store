import React, { useEffect, useState } from "react";
import { ScrollView, SafeAreaView, StyleSheet, View } from "react-native";
import { ProfileHeader } from "./ProfileHeader";
import { ContactInfo } from "./ContactInfo";
import { ExperienceSection } from "./ExperienceSection";
import { CertificatesSection } from "./CertificatesSection";
// import { useProfileStore } from "../store/profile";
// import { useExperiencesStore } from "../store/experiences";
// import { useDoctorCertificatesStore } from "../store/certificateion";
import { ImageModal } from "./ImageModal";

const Profile = () => {
  const [expandedImage, setExpandedImage] = useState(null);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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
