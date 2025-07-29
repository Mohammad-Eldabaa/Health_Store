import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

export const useExperiencesStore = create(
  persist(
    (set) => ({
      allExperiences: [],
      loading: false,
      error: null,

      getAllExperiences: async () => {
        set({ loading: true, error: null });
        try {
          let { data: experiences, error } = await supabase
            .from("experiences")
            .select("*");

          if (error) {
            console.log("get experiences error:", error);
            set({ error: error.message });
          } else {
            set({ allExperiences: experiences || [] });
          }
        } catch (err) {
          console.log("unexpected error:", err);
          set({ error: "Failed to fetch experiences" });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "experiences-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ allExperiences: state.allExperiences }),
    }
  )
);
