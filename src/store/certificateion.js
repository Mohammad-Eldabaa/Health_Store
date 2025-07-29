import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

export const useDoctorCertificatesStore = create(
  persist(
    (set) => ({
      allCertificates: [],
      loading: false,
      error: null,

      fetchCertificates: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("certificates")
            .select("*");

          if (error) throw error;

          set({ allCertificates: data || [], loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error("Error fetching certificates:", error);
          return null;
        }
      },
    }),
    {
      name: "certifications",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ allCertificates: state.allCertificates }),
    }
  )
);
