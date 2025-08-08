import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../store/supabase";
import Icon from "react-native-vector-icons/MaterialIcons";
import useAppointmentStore from "./appointmentStore";

const AppointmentItem = ({ appt, index }) => {
  const { deleteAppointment, updateAppointment } = useAppointmentStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    date: appt?.date || "",
    time: appt?.time || "",
    status: appt?.status || "في الإنتظار",
    reason: appt?.reason || "",
    doctor_id: appt?.doctor_id || "",
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from("doctors").select("id, name");
      if (!error) setDoctors(data || []);
    };
    fetchDoctors();
  }, []);

  const handleEditSubmit = async () => {
    try {
      const updatedData = {
        date: editFormData.date,
        time: editFormData.time,
        status: editFormData.status,
        reason: editFormData.reason || null,
        doctor_id: editFormData.doctor_id || null,
      };
      await updateAppointment(appt?.id, updatedData);
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
    }));
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardIndex}>{index + 1}</Text>
            <Text style={styles.cardValue}>
              {appt?.patientName || "غير متوفر"}
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
              {appt?.doctorName || "غير محدد"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>الحالة:</Text>
            <Text
              style={[
                styles.cardValue,
                styles.badge,
                appt?.status === "في الإنتظار"
                  ? { backgroundColor: "#fef9c3", color: "#854d0e" }
                  : appt?.status === "ملغى"
                  ? { backgroundColor: "#fee2e2", color: "#991b1b" }
                  : { backgroundColor: "#dcfce7", color: "#15803d" },
              ]}
            >
              {appt?.status || "غير محدد"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>التاريخ:</Text>
            <Text style={styles.cardValue}>
              {appt?.date
                ? new Date(appt?.date).toLocaleDateString("ar-EG")
                : "غير متوفر"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>الوقت:</Text>
            <Text style={styles.cardValue}>{appt?.time || "غير متوفر"}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>السبب:</Text>
            <Text style={styles.cardValue}>
              {appt?.reason || "لا توجد ملاحظات"}
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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذا الموعد؟", [
                { text: "إلغاء", style: "cancel" },
                {
                  text: "حذف",
                  style: "destructive",
                  onPress: () => deleteAppointment(appt?.id),
                },
              ]);
            }}
          >
            <Icon name="delete" size={24} color="#dc2626" />
          </TouchableOpacity>
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
                        label={doctor.name}
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
                    {appt?.id || "غير متوفر"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>اسم المريض:</Text>
                  <Text style={styles.detailValue}>
                    {appt?.patientName || "غير متوفر"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>الطبيب:</Text>
                  <Text style={styles.detailValue}>
                    {appt?.doctorName || "غير محدد"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>الحالة:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      styles.badge,
                      appt?.status === "في الإنتظار"
                        ? { backgroundColor: "#fef9c3", color: "#854d0e" }
                        : appt?.status === "ملغى"
                        ? { backgroundColor: "#fee2e2", color: "#991b1b" }
                        : { backgroundColor: "#dcfce7", color: "#15803d" },
                    ]}
                  >
                    {appt?.status || "غير محدد"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>التاريخ:</Text>
                  <Text style={styles.detailValue}>
                    {appt?.date
                      ? new Date(appt?.date).toLocaleDateString("ar-EG")
                      : "غير متوفر"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>الوقت:</Text>
                  <Text style={styles.detailValue}>
                    {appt?.time || "غير متوفر"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>السبب:</Text>
                  <Text style={styles.detailValue}>
                    {appt?.reason || "لا توجد ملاحظات"}
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
    </>
  );
};

// Styles remain unchanged
export default React.memo(AppointmentItem);
