import { Alert } from "react-native";
import { supabase } from "./supabase";

export const addPatient = async (patientData, resetForm) => {
  const { phoneNumber, bookingDate, visitType } = patientData;

  try {
    const { data: existingPatient, error: selectError } = await supabase
      .from("patients")
      .select("id")
      .eq("phoneNumber", phoneNumber)
      .maybeSingle();

    if (selectError) {
      throw new Error("Error checking existing patient");
    }

    let patientId;

    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      const { data: newPatient, error: insertError } = await supabase
        .from("patients")
        .insert(patientData)
        .select()
        .single();

      if (insertError) {
        throw new Error("Error adding new patient");
      }

      patientId = newPatient.id;
    }

    const now = new Date();
    const { error: appointmentError } = await supabase
      .from("appointments")
      .insert([
        {
          date: bookingDate.toISOString().slice(0, 10),
          visitType,
          status: "في الإنتظار",
          doctor_id: 1,
          patient_id: patientId,
          time: now.toLocaleTimeString("en-US"),
          reason: patientData.notes,
        },
      ])
      .select();

    if (appointmentError) {
      showAlert("حدث خطأ أثناء التسجيل", appointmentError.message);
    } else {
      showAlert("تم حجز الموعد بنجاح", "سوف تصلك مكالمة لتأكيد الحجز");
      if (typeof resetForm === "function") resetForm();
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    showAlert("خطأ غير متوقع", "يرجى المحاولة لاحقاً أو التواصل مع الدعم");
  }
};

//-----------------------------------------------------
const showAlert = (title, message) => {
  Alert.alert(title, message);
};
