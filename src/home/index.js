import { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { styles } from "./styles";
import HeroSection from "./HeroSection";
import QuickActions from "./QuickActions";
import { ServicesSection } from "./ServicesSection";
import ContactSection from "./ContactSection";
import { useProfileStore } from "../store/profile";
import { useExperiencesStore } from "../store/experiences";
import { useDoctorCertificatesStore } from "../store/certificateion";
import { supabase } from "../store/supabase";

const Home = () => {
  const { getDoctorProfile } = useProfileStore();
  const { getAllExperiences } = useExperiencesStore();
  const { fetchCertificates } = useDoctorCertificatesStore();

  useEffect(() => {
    getDoctorProfile();
    getAllExperiences();
    fetchCertificates();
  }, []);

  // useEffect(() => {
  //   const channel = supabase
  //     .channel("realtime:patients")
  //     .on(
  //       "postgres_changes",
  //       {
  //         event: "*",
  //         schema: "public",
  //         table: "patients",
  //       },
  //       (payload) => {
  //         // console.log("Change received!", payload);
  //         console.log("Change received!", payload);
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <HeroSection />
      <QuickActions />
      <ServicesSection />
      <ContactSection />
      <View style={{ height: 65 }} />
    </ScrollView>
  );
};

export default Home;
