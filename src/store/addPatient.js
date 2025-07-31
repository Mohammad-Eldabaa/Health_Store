import { Alert } from "react-native";
import { supabase } from "./supabase";

export const addPatient = async (patientData, resetForm) => {
  console.log("inside add patient)");
  const { error } = await supabase.from("patients").insert(patientData);

  if (error) {
    Alert.alert("حدث خطأو برجاء المحاولة لاحقا", [
      { text: "موافق", style: "default" },
    ]);
    console.error("Error adding patient:", error);
  } else {
    Alert.alert("تم إرسال الطلب", "سنتصل بك خلال 24 ساعة لتأكيد موعدك", [
      { text: "موافق", style: "default" },
    ]);
    resetForm();
  }
};
