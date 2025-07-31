import { supabase } from "./supabase";

export const setupRealtimeProfile = (setDoctorProfile) => {
  const channel = supabase
    .channel("realtime:DoctorProfile")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "DoctorProfile",
      },
      (payload) => {
        console.log("🔁 Realtime triggered:", payload);

        const { eventType, new: newProfile } = payload;

        if (eventType === "UPDATE" && newProfile) {
          setDoctorProfile(newProfile);
          console.log("Updated doctor profile:", newProfile);
        }
      }
    )
    .subscribe();

  return channel;
};
