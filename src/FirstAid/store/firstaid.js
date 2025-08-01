import { create } from "zustand";
import { supabase } from "../supaBase/booking";

const useFirstAidStore = create((set, get) => ({
  lastId: 0,

  getStateById: async (id) => {
    const { data, error } = await supabase
      .from("FirstAid")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching FirstAid record:", error.message);
      return "";
    }
    return data || "";
  },

  getAllStatusNames: async () => {
    const { data, error } = await supabase.from("FirstAid").select("id, name");

    if (error) {
      console.error("Error fetching FirstAid names:", error.message);
      return [];
    }
    return data || [];
  },

  setLastId: (id) => {
    set({ lastId: id });
  },
}));

export default useFirstAidStore;
