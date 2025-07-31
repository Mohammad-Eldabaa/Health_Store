import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

export const useProfileStore = create(
  persist(
    (set) => ({
      doctorProfile: {},
      setDoctorProfile: (profile) => set({ doctorProfile: profile }),
      getDoctorProfile: async () => {
        const { data, error } = await supabase
          .from("DoctorProfile")
          .select("*")
          .single();

        if (error) {
          console.error("Error fetching doctor profile:", error);
          return null;
        }
        set({ doctorProfile: data });
        return data;
      },

      getDoctorImage: async (imagePath) => {
        if (!imagePath) return null;

        const { data } = supabase.storage
          .from("images")
          .getPublicUrl(imagePath);

        return data.publicUrl;
      },
    }),
    {
      name: "doc_profile",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ doctorProfile: state.doctorProfile }),
    }
  )
);
