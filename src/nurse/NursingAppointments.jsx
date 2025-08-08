import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { supabase } from "../store/supabase";
import { Schema, initialValues } from "./schema";
import useAppointmentStore from "./appointmentStore";

const ErrorBoundary = ({ children }) => {
  try {
    return children;
  } catch (error) {
    console.error("ErrorBoundary caught:", error);
    return (
      <View style={styles.errorContainer}>
        <Icon
          name="error-outline"
          size={20}
          color="#dc2626"
          style={styles.errorIcon}
        />
        <Text style={styles.errorText}>
          حدث خطأ. فشل في عرض تفاصيل الموعد. يرجى المحاولة مرة أخرى.
        </Text>
      </View>
    );
  }
};

const AppointmentItem = ({ item: appt }) => {
  const { deleteAppointment, updateAppointment } = useAppointmentStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    date: appt.date || "",
    time: appt.time || "",
    status: appt.status || "في الإنتظار",
    reason: appt.reason || "",
    doctor_id: appt.doctor_id || "",
  });
  const [doctors, setDoctors] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
      await updateAppointment(appt.id, updatedData);
      setIsEditing(false);
      setIsExpanded(false);
      Alert.alert("نجاح", "تم تحديث الموعد بنجاح!");
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
    <View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>#{appt.id}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>المريض:</Text>
            <Text style={styles.cardValue}>
              {appt.patientName || "غير متوفر"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>الطبيب:</Text>
            <Text style={styles.cardValue}>
              {appt.doctorName || "غير محدد"}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>الحالة:</Text>
            <Text
              style={[
                styles.cardValue,
                styles.statusBadge,
                appt.status === "في الإنتظار"
                  ? styles.statusPending
                  : appt.status === "ملغى"
                  ? styles.statusCancelled
                  : styles.statusCompleted,
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
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsExpanded(!isExpanded)}
            accessibilityRole="button"
            accessibilityLabel={`عرض تفاصيل الموعد ${appt.id}`}
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
                  onPress: () => deleteAppointment(appt.id),
                },
              ]);
            }}
            accessibilityRole="button"
            accessibilityLabel={`حذف الموعد ${appt.id}`}
          >
            <Icon name="delete" size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
      {isExpanded && (
        <View style={styles.expandedContent}>
          <ErrorBoundary>
            {isEditing ? (
              <View style={styles.editForm}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>التاريخ</Text>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      editFormData.date ? {} : styles.inputError,
                    ]}
                    onPress={() => setShowDatePicker(true)}
                    accessibilityRole="button"
                    accessibilityLabel="اختر تاريخ الموعد"
                  >
                    <Text style={styles.inputText}>
                      {editFormData.date || "اختر التاريخ"}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={
                        editFormData.date
                          ? new Date(editFormData.date)
                          : new Date()
                      }
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          handleEditChange(
                            "date",
                            selectedDate.toISOString().split("T")[0]
                          );
                        }
                      }}
                    />
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>الوقت</Text>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      editFormData.time ? {} : styles.inputError,
                    ]}
                    onPress={() => setShowTimePicker(true)}
                    accessibilityRole="button"
                    accessibilityLabel="اختر وقت الموعد"
                  >
                    <Text style={styles.inputText}>
                      {editFormData.time || "اختر الوقت"}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={
                        editFormData.time
                          ? new Date(`1970-01-01T${editFormData.time}:00`)
                          : new Date()
                      }
                      mode="time"
                      display="default"
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          const timeString = selectedTime
                            .toISOString()
                            .split("T")[1]
                            .substring(0, 5);
                          handleEditChange("time", timeString);
                        }
                      }}
                    />
                  )}
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
                <View style={styles.formActions}>
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
                  <Text style={styles.detailValue}>{appt.id}</Text>
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
                      styles.statusBadge,
                      appt.status === "في الإنتظار"
                        ? styles.statusPending
                        : appt.status === "ملغى"
                        ? styles.statusCancelled
                        : styles.statusCompleted,
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
                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setIsExpanded(false)}
                  >
                    <Text style={styles.buttonText}>إلغاء</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.buttonText}>تعديل الموعد</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ErrorBoundary>
        </View>
      )}
    </View>
  );
};

// Rest of the NursingAppointments component (form and list rendering)
const NursingAppointments = () => {
  const { appointments, error, loading, fetchAppointments, addAppointment } =
    useAppointmentStore();
  const [formData, setFormData] = useState(initialValues);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from("doctors").select("id, name");
      if (!error) setDoctors(data || []);
    };
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("id, fullName");
      if (!error) setPatients(data || []);
    };
    fetchDoctors();
    fetchPatients();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch = appt.patientName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const apptDate = new Date(appt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const weekStart = new Date(today);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (filter === "today")
      return matchesSearch && apptDate.toDateString() === today.toDateString();
    if (filter === "tomorrow")
      return (
        matchesSearch && apptDate.toDateString() === tomorrow.toDateString()
      );
    if (filter === "week")
      return matchesSearch && apptDate >= weekStart && apptDate <= weekEnd;
    if (filter === "month")
      return matchesSearch && apptDate >= monthStart && apptDate <= monthEnd;
    return matchesSearch;
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const appointmentSchema = Schema.omit(["amount"]);
      const formDataToValidate = {
        ...formData,
        bookingDate: formData.date,
        visitType: formData.status,
        notes: formData.reason,
      };
      await appointmentSchema.validate(formDataToValidate, {
        abortEarly: false,
      });

      let patientId = formData.patient_id;
      if (!patientId) {
        const existingPatient = patients.find(
          (p) => p.fullName.toLowerCase() === formData.fullName.toLowerCase()
        );
        if (existingPatient) {
          patientId = existingPatient.id;
        } else {
          const patientData = {
            fullName: formData.fullName,
            age: parseInt(formData.age),
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            bookingDate: formData.date,
            visitType: formData.status,
            notes: formData.reason || null,
          };

          const { data: newPatient, error: patientError } = await supabase
            .from("patients")
            .insert([patientData])
            .select("id")
            .single();

          if (patientError) {
            console.error("Error adding patient:", patientError);
            Alert.alert("خطأ", "فشل في إضافة المريض.");
            return;
          }

          patientId = newPatient.id;
        }
      }

      const appointmentData = {
        date: formData.date,
        time: formData.time,
        status: formData.status,
        reason: formData.reason || null,
        patient_id: patientId,
        doctor_id: formData.doctor_id || null,
      };

      await addAppointment(appointmentData);
      setFormData(initialValues);
      Alert.alert("نجاح", "تم إضافة الموعد بنجاح!");
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        console.log("Validation errors:", errors);
      } else {
        console.error("Error submitting appointment:", err);
        Alert.alert("خطأ", "حدث خطأ أثناء إضافة الموعد.");
      }
    }
  };

  const renderItem = ({ item }) => <AppointmentItem item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="event" size={32} color="#0891b2" />
          <View>
            <Text style={styles.headerText}>المواعيد المجدولة</Text>
            <Text style={styles.headerSubText}>إدارة جميع مواعيد العيادة</Text>
          </View>
        </View>
      </View>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="ابحث عن مواعيد المرضى بالاسم..."
        accessibilityLabel="البحث عن مواعيد"
      />
      <View style={styles.filterContainer}>
        {[
          { value: "all", label: "الكل" },
          { value: "today", label: "اليوم" },
          { value: "tomorrow", label: "غدًا" },
          { value: "week", label: "هذا الأسبوع" },
          { value: "month", label: "هذا الشهر" },
        ].map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.filterButton,
              filter === value && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(value)}
            accessibilityRole="button"
            accessibilityLabel={label}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === value && styles.filterButtonTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
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
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0891b2" />
          <Text style={styles.loadingText}>جارٍ التحميل...</Text>
        </View>
      )}
      {filteredAppointments.length === 0 && !error && !loading ? (
        <View style={styles.emptyContainer}>
          <Icon name="info-outline" size={40} color="#3b82f6" />
          <Text style={styles.emptyText}>لا توجد مواعيد مجدولة بعد</Text>
          <Text style={styles.emptySubText}>
            اضغط على زر "إضافة موعد" لبدء جدولة المواعيد
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

// Styles remain unchanged
export default NursingAppointments;
