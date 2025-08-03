import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Picker,
} from "react-native";
import useAppointmentStore from "../store/appointmentStore";
import { supabase } from "./NursingBooking";
import Icon from "react-native-vector-icons/MaterialIcons";

const AppointmentItem = ({ appt, index }) => {
  const { deleteAppointment, updateAppointment } = useAppointmentStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    date: appt.date || "",
    time: appt.time || "",
    status: appt.status || "في الإنتظار",
    reason: appt.reason || "",
    amount: appt.amount || null,
    doctor_id: appt.doctor_id || "",
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("id, name, fees");
      if (!error) setDoctors(data || []);
    };
    fetchDoctors();
  }, []);

  const handlePayment = async (paymentGateway) => {
    Alert.alert("ملاحظة", `دفع عبر ${paymentGateway} سيتم تنفيذه لاحقًا.`);
    setShowPaymentModal(false);
  };

  const handleEditSubmit = async () => {
    try {
      const updatedData = {
        date: editFormData.date,
        time: editFormData.time,
        status: editFormData.status,
        reason: editFormData.reason || null,
        amount: editFormData.amount ? parseFloat(editFormData.amount) : null,
        doctor_id: editFormData.doctor_id || null,
      };
      await updateAppointment(appt.id, updatedData);
      setIsEditing(false);
      setIsExpanded(false);
    } catch (err) {
      console.error("Error updating appointment:", err);
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث الموعد.");
    }
  };

  const handleEditChange = (name, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "doctor_id" && {
        amount: doctors.find((d) => String(d.id) === value)?.fees || null,
      }),
    }));
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardIndex}>{index + 1}</Text>
            <Text style={styles.cardValue}>
              {appt.patientName || "غير متوفر"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>الطبيب:</Text>
            <Text
              style={[
                styles.cardValue,
                styles.badge,
                { backgroundColor: "#e0f2fe", color: "#1e40af" },
              ]}
            >
              {appt.doctorName || "غير محدد"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>الحالة:</Text>
            <Text
              style={[
                styles.cardValue,
                styles.badge,
                appt.status === "في الإنتظار"
                  ? { backgroundColor: "#fef9c3", color: "#854d0e" }
                  : appt.status === "ملغى"
                  ? { backgroundColor: "#fee2e2", color: "#991b1b" }
                  : { backgroundColor: "#dcfce7", color: "#15803d" },
              ]}
            >
              {appt.status || "غير محدد"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>التاريخ:</Text>
            <Text style={styles.cardValue}>
              {appt.date
                ? new Date(appt.date).toLocaleDateString("ar-EG")
                : "غير متوفر"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>الوقت:</Text>
            <Text style={styles.cardValue}>{appt.time || "غير متوفر"}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>السبب:</Text>
            <Text style={styles.cardValue}>
              {appt.reason || "لا توجد ملاحظات"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>حالة الدفع:</Text>
            <Text
              style={[
                styles.cardValue,
                styles.badge,
                appt.payment
                  ? { backgroundColor: "#dcfce7", color: "#15803d" }
                  : { backgroundColor: "#fee2e2", color: "#991b1b" },
              ]}
            >
              {appt.payment ? "مدفوع" : "غير مدفوع"}
            </Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsExpanded((prev) => !prev)}
          >
            <Icon name="visibility" size={24} color="#2563eb" />
          </TouchableOpacity>
          {!appt.payment && !appt.cancelled && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowPaymentModal(true)}
              >
                <Icon name="payment" size={24} color="#2563eb" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  Alert.alert(
                    "تأكيد الحذف",
                    "هل أنت متأكد من حذف هذا الموعد؟",
                    [
                      { text: "إلغاء", style: "cancel" },
                      {
                        text: "حذف",
                        style: "destructive",
                        onPress: () => deleteAppointment(appt.id),
                      },
                    ]
                  );
                }}
              >
                <Icon name="delete" size={24} color="#dc2626" />
              </TouchableOpacity>
            </>
          )}
          {(appt.payment || appt.cancelled) && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذا الموعد؟", [
                  { text: "إلغاء", style: "cancel" },
                  {
                    text: "حذف",
                    style: "destructive",
                    onPress: () => deleteAppointment(appt.id),
                  },
                ]);
              }}
            >
              <Icon name="delete" size={24} color="#dc2626" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Modal visible={isExpanded} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تفاصيل الموعد</Text>
              <TouchableOpacity onPress={() => setIsExpanded(false)}>
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {isEditing ? (
              <View style={styles.form}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>التاريخ</Text>
                  <TextInput
                    style={styles.input}
                    value={editFormData.date}
                    onChangeText={(value) => handleEditChange("date", value)}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>الوقت</Text>
                  <TextInput
                    style={styles.input}
                    value={editFormData.time}
                    onChangeText={(value) => handleEditChange("time", value)}
                    placeholder="HH:MM"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>الطبيب</Text>
                  <Picker
                    selectedValue={editFormData.doctor_id}
                    onValueChange={(value) =>
                      handleEditChange("doctor_id", value)
                    }
                    style={styles.input}
                  >
                    <Picker.Item label="اختر الطبيب" value="" />
                    {doctors.map((doctor) => (
                      <Picker.Item
                        key={doctor.id}
                        label={`${doctor.name} (رسوم: ${doctor.fees} جنيه)`}
                        value={doctor.id}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>الحالة</Text>
                  <Picker
                    selectedValue={editFormData.status}
                    onValueChange={(value) => handleEditChange("status", value)}
                    style={styles.input}
                  >
                    <Picker.Item label="في الإنتظار" value="في الإنتظار" />
                    <Picker.Item label="ملغى" value="ملغى" />
                    <Picker.Item label="تم" value="تم" />
                  </Picker>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>الملاحظات</Text>
                  <TextInput
                    style={[styles.input, { height: 100 }]}
                    value={editFormData.reason}
                    onChangeText={(value) => handleEditChange("reason", value)}
                    multiline
                    placeholder="أضف ملاحظات..."
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>المبلغ</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: "#f3f4f6" }]}
                    value={
                      editFormData.amount ? editFormData.amount.toString() : ""
                    }
                    editable={false}
                  />
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={styles.buttonText}>إلغاء</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleEditSubmit}
                  >
                    <Text style={styles.buttonText}>حفظ التغييرات</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.detailContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>رقم الموعد:</Text>
                  <Text style={styles.detailValue}>
                    {appt.id || "غير متوفر"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>اسم المريض:</Text>
                  <Text style={styles.detailValue}>
                    {appt.patientName || "غير متوفر"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>الطبيب:</Text>
                  <Text style={styles.detailValue}>
                    {appt.doctorName || "غير محدد"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>الحالة:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      styles.badge,
                      appt.status === "في الإنتظار"
                        ? { backgroundColor: "#fef9c3", color: "#854d0e" }
                        : appt.status === "ملغى"
                        ? { backgroundColor: "#fee2e2", color: "#991b1b" }
                        : { backgroundColor: "#dcfce7", color: "#15803d" },
                    ]}
                  >
                    {appt.status || "غير محدد"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>التاريخ:</Text>
                  <Text style={styles.detailValue}>
                    {appt.date
                      ? new Date(appt.date).toLocaleDateString("ar-EG")
                      : "غير متوفر"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>الوقت:</Text>
                  <Text style={styles.detailValue}>
                    {appt.time || "غير متوفر"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>السبب:</Text>
                  <Text style={styles.detailValue}>
                    {appt.reason || "لا توجد ملاحظات"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>حالة الدفع:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      styles.badge,
                      appt.payment
                        ? { backgroundColor: "#dcfce7", color: "#15803d" }
                        : { backgroundColor: "#fee2e2", color: "#991b1b" },
                    ]}
                  >
                    {appt.payment ? "مدفوع" : "غير مدفوع"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>المبلغ:</Text>
                  <Text style={styles.detailValue}>
                    {appt.amount ? `${appt.amount} جنيه` : "غير محدد"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.buttonText}>تعديل الموعد</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر طريقة الدفع</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handlePayment("stripe")}
              >
                <Text style={styles.buttonText}>دفع عبر Stripe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handlePayment("paymob")}
              >
                <Text style={styles.buttonText}>دفع عبر Paymob</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
  cardContent: {
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardIndex: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4b5563",
    backgroundColor: "#cffafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
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
  modalActions: {
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#0891b2",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  detailContainer: {
    flexDirection: "column",
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
  },
  detailValue: {
    fontSize: 14,
    color: "#1f2937",
  },
});

export default AppointmentItem;
