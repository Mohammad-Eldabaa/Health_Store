import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ogaktuqoqomifmucsyqy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYWt0dXFvcW9taWZtdWNzeXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTU3NTQsImV4cCI6MjA2ODQzMTc1NH0.mbaVusnCj8CRrxp__wrkAjH59KivytxTtiZKiNd8Xic";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const addPatient = async (patientData, resetForm) => {
  const { error } = await supabase.from("Patients").insert(patientData);

  if (error) {
    console.error("Error adding patient:", error);
    alert("حدث خطأ أثناء الإرسال.");
  } else {
    alert("تم تقديم طلب الحجز بنجاح! سنتواصل معك قريباً لتأكيد الموعد.");
    if (resetForm) resetForm();
  }
};
