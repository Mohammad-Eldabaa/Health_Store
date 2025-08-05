import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { supabase } from "../store/supabase";
import { Schema } from "./schema";
import Icon from "react-native-vector-icons/MaterialIcons";

const NursingPatientsList = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phoneNumber: "",
    address: "",
    bookingDate: "",
    visitType: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select(
            "id, fullName, age, phoneNumber, address, bookingDate, visitType, notes"
          )
          .order("id", { ascending: true });

        if (error) {
          console.error(
            "Error fetching patients:",
            error.message,
            error.details
          );
          setError(`فشل في جلب المرضى: ${error.message}`);
          return;
        }

        setPatients(data || []);
        setError(null);
      } catch (err) {
        console.error("Unexpected error fetching patients:", err);
        setError("حدث خطأ غير متوقع أثناء جلب المرضى.");
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const openEditModal = (patient) => {
    setCurrentPatient(patient);
    setFormData({
      fullName: patient.fullName,
      age: patient.age.toString(),
      phoneNumber: patient.phoneNumber,
      address: patient.address,
      bookingDate: patient.bookingDate,
      visitType: patient.visitType,
      notes: patient.notes || "",
    });
    setShowEditModal(true);
  };

  const updatePatient = async () => {
    try {
      const editSchema = Schema.omit(["amount"]);
      await editSchema.validate(formData, { abortEarly: false });

      const updatedPatient = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        bookingDate: formData.bookingDate,
        visitType: formData.visitType,
        notes: formData.notes || null,
      };

      const { error } = await supabase
        .from("patients")
        .update(updatedPatient)
        .eq("id", currentPatient.id);

      if (error) {
        console.error("Error updating patient:", error.message, error.details);
        Alert.alert("خطأ", `فشل في تحديث المريض: ${error.message}`);
        return;
      }

      setPatients((prev) =>
        prev.map((p) =>
          p.id === currentPatient.id ? { ...p, ...updatedPatient } : p
        )
      );
      setShowEditModal(false);
      setFormErrors({});
      Alert.alert("نجاح", "تم تحديث بيانات المريض بنجاح!");
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
      } else {
        console.error("Unexpected error updating patient:", err);
        Alert.alert("خطأ", "حدث خطأ غير متوقع أثناء تحديث المريض.");
      }
    }
  };

  const deletePatient = async (id) => {
    Alert.alert(
      "تأكيد الحذف",
      "هل أنت متأكد من حذف هذا المريض؟ سيتم حذف جميع المواعيد المرتبطة بهذا المريض.",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            try {
              const { error: appointmentError } = await supabase
                .from("appointments")
                .delete()
                .eq("patient_id", id);

              if (appointmentError) {
                console.error(
                  "Error deleting associated appointments:",
                  appointmentError.message,
                  appointmentError.details
                );
                Alert.alert(
                  "خطأ",
                  `فشل في حذف المواعيد المرتبطة: ${appointmentError.message}`
                );
                return;
              }

              const { error: patientError } = await supabase
                .from("patients")
                .delete()
                .eq("id", id);

              if (patientError) {
                console.error(
                  "Error deleting patient:",
                  patientError.message,
                  patientError.details
                );
                Alert.alert(
                  "خطأ",
                  `فشل في حذف المريض: ${patientError.message}`
                );
                return;
              }

              setPatients((prev) => prev.filter((p) => p.id !== id));
              Alert.alert("نجاح", "تم حذف المريض وجميع مواعيده بنجاح!");
            } catch (err) {
              console.error("Unexpected error deleting patient:", err);
              Alert.alert("خطأ", "حدث خطأ غير متوقع أثناء حذف المريض.");
            }
          },
        },
      ]
    );
  };

  const renderPatient = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardId}>#{item.id}</Text>
        <Text
          style={[
            styles.visitTypeBadge,
            item.visitType === "فحص"
              ? styles.visitTypeCheckup
              : item.visitType === "متابعة"
              ? styles.visitTypeFollowUp
              : styles.visitTypeConsultation,
          ]}
        >
          {item.visitType}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>الاسم:</Text>
          <Text style={styles.cardValue}>{item.fullName}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>العمر:</Text>
          <Text style={styles.cardValue}>{item.age}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>رقم الهاتف:</Text>
          <Text style={styles.cardValue}>{item.phoneNumber}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>العنوان:</Text>
          <Text style={styles.cardValue}>{item.address}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>تاريخ الحجز:</Text>
          <Text style={styles.cardValue}>
            {new Date(item.bookingDate).toLocaleDateString("ar-EG")}
          </Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert("تفاصيل", `عرض تفاصيل المريض ${item.fullName}`)
          }
        >
          <Icon name="visibility" size={24} color="#2563eb" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <Icon name="edit" size={24} color="#f59e0b" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => deletePatient(item.id)}
        >
          <Icon name="delete" size={24} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>المرضى</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Appointments")}>
          <Text style={styles.navLink}>المواعيد</Text>
        </TouchableOpacity>
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Icon
            name="error-outline"
            size={20}
            color="#dc2626"
            style={styles.errorIcon}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {patients.length === 0 && !error ? (
        <View style={styles.emptyContainer}>
          <Icon name="info-outline" size={40} color="#3b82f6" />
          <Text style={styles.emptyText}>لا توجد بيانات مرضى بعد.</Text>
        </View>
      ) : (
        <FlatList
          data={patients}
          renderItem={renderPatient}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <Modal visible={showEditModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تعديل بيانات المريض</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowEditModal(false);
                  setFormErrors({});
                }}
              >
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>اسم المريض</Text>
                <TextInput
                  style={[
                    styles.input,
                    formErrors.fullName && styles.inputError,
                  ]}
                  value={formData.fullName}
                  onChangeText={(value) => handleChange("fullName", value)}
                  placeholder="أدخل الاسم"
                />
                {formErrors.fullName && (
                  <Text style={styles.errorText}>{formErrors.fullName}</Text>
                )}
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>العمر</Text>
                <TextInput
                  style={[styles.input, formErrors.age && styles.inputError]}
                  value={formData.age}
                  onChangeText={(value) => handleChange("age", value)}
                  keyboardType="numeric"
                  placeholder="أدخل العمر"
                />
                {formErrors.age && (
                  <Text style={styles.errorText}>{formErrors.age}</Text>
                )}
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>رقم الهاتف</Text>
                <TextInput
                  style={[
                    styles.input,
                    formErrors.phoneNumber && styles.inputError,
                  ]}
                  value={formData.phoneNumber}
                  onChangeText={(value) => handleChange("phoneNumber", value)}
                  keyboardType="phone-pad"
                  placeholder="أدخل رقم الهاتف"
                />
                {formErrors.phoneNumber && (
                  <Text style={styles.errorText}>{formErrors.phoneNumber}</Text>
                )}
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>العنوان</Text>
                <TextInput
                  style={[
                    styles.input,
                    formErrors.address && styles.inputError,
                  ]}
                  value={formData.address}
                  onChangeText={(value) => handleChange("address", value)}
                  placeholder="أدخل العنوان"
                />
                {formErrors.address && (
                  <Text style={styles.errorText}>{formErrors.address}</Text>
                )}
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>تاريخ الحجز</Text>
                <TextInput
                  style={[
                    styles.input,
                    formErrors.bookingDate && styles.inputError,
                  ]}
                  value={formData.bookingDate}
                  onChangeText={(value) => handleChange("bookingDate", value)}
                  placeholder="YYYY-MM-DD"
                />
                {formErrors.bookingDate && (
                  <Text style={styles.errorText}>{formErrors.bookingDate}</Text>
                )}
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>نوع الزيارة</Text>
                <Picker
                  selectedValue={formData.visitType}
                  onValueChange={(value) => handleChange("visitType", value)}
                  style={[
                    styles.input,
                    formErrors.visitType && styles.inputError,
                  ]}
                >
                  <Picker.Item label="اختر نوع الزيارة" value="" />
                  <Picker.Item label="فحص" value="فحص" />
                  <Picker.Item label="متابعة" value="متابعة" />
                  <Picker.Item label="استشارة" value="استشارة" />
                </Picker>
                {formErrors.visitType && (
                  <Text style={styles.errorText}>{formErrors.visitType}</Text>
                )}
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>الملاحظات</Text>
                <TextInput
                  style={[
                    styles.input,
                    formErrors.notes && styles.inputError,
                    { height: 100 },
                  ]}
                  value={formData.notes}
                  onChangeText={(value) => handleChange("notes", value)}
                  multiline
                  placeholder="أضف ملاحظات (اختياري)..."
                />
                {formErrors.notes && (
                  <Text style={styles.errorText}>{formErrors.notes}</Text>
                )}
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowEditModal(false);
                    setFormErrors({});
                  }}
                >
                  <Text style={styles.buttonText}>إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={updatePatient}
                >
                  <Text style={styles.buttonText}>حفظ التعديلات</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
    padding: 16,
    direction: "rtl",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#164e63",
  },
  navLink: {
    fontSize: 16,
    color: "#0891b2",
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#3b82f6",
    marginTop: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4b5563",
  },
  visitTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  visitTypeCheckup: {
    backgroundColor: "#f3e8ff",
    color: "#6b21a8",
  },
  visitTypeFollowUp: {
    backgroundColor: "#e0f2fe",
    color: "#1e40af",
  },
  visitTypeConsultation: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
  cardContent: {
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
  },
  cardValue: {
    fontSize: 14,
    color: "#1f2937",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  actionButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#164e63",
  },
  form: {
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1f2937",
  },
  inputError: {
    borderColor: "#f87171",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: "#0891b2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default NursingPatientsList;
