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
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { supabase } from "./NursingBooking";
import { initialValues, validationSchema } from "../Booking/schema";
import useAppointmentStore from "../store/appointmentStore";

// Simple Error Boundary Component
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

const AppointmentItem = ({ item: appt, index, drag, isActive }) => {
  const { deleteAppointment, updateAppointment } = useAppointmentStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    date: appt.date || "",
    time: appt.time || "",
    status: appt.status || "في الإنتظار",
    reason: appt.reason || "",
    amount: appt.amount || "",
    doctor_id: appt.doctor_id || "",
  });
  const [doctors, setDoctors] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("id, name, fees");
      if (!error) setDoctors(data || []);
    };
    fetchDoctors();
  }, []);

  const handlePayment = (paymentGateway) => {
    // Placeholder for payment integration
    Alert.alert(
      "دفع أونلاين",
      `سيتم الدفع عبر ${paymentGateway}. (يتطلب تكامل SDK)`
    );
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
      ...(name === "doctor_id" && {
        amount: doctors.find((d) => String(d.id) === value)?.fees || "",
      }),
    }));
  };

  const renderItemContent = () => (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardId}>#{appt.id}</Text>
        <TouchableOpacity onPress={drag} style={styles.dragHandle}>
          <Icon name="drag-indicator" size={24} color="#6b7280" />
        </TouchableOpacity>
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
          <Text style={styles.cardValue}>{appt.doctorName || "غير محدد"}</Text>
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
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>حالة الدفع:</Text>
          <Text
            style={[
              styles.cardValue,
              styles.paymentBadge,
              appt.payment ? styles.paymentPaid : styles.paymentUnpaid,
            ]}
          >
            {appt.payment ? "مدفوع" : "غير مدفوع"}
          </Text>
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
        {!appt.payment && !appt.cancelled && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowPaymentModal(true)}
              accessibilityRole="button"
              accessibilityLabel={`دفع الموعد ${appt.id}`}
            >
              <Icon name="payment" size={24} color="#0891b2" />
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
            accessibilityRole="button"
            accessibilityLabel={`حذف الموعد ${appt.id}`}
          >
            <Icon name="delete" size={24} color="#dc2626" />
          </TouchableOpacity>
        )}
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
                    style={[
                      styles.input,
                      editFormData.doctor_id ? {} : styles.inputError,
                    ]}
                    accessibilityLabel="اختر الطبيب"
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
                    accessibilityLabel="اختر الحالة"
                  >
                    <Picker.Item label="في الإنتظار" value="في الإنتظار" />
                    <Picker.Item label="ملغى" value="ملغى" />
                    <Picker.Item label="تم" value="تم" />
                  </Picker>
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>الملاحظات</Text>
                  <TextInput
                    style={styles.input}
                    value={editFormData.reason}
                    onChangeText={(value) => handleEditChange("reason", value)}
                    multiline
                    numberOfLines={4}
                    placeholder="أضف ملاحظات (اختياري)..."
                    accessibilityLabel="الملاحظات"
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
                    accessibilityLabel="المبلغ"
                  />
                </View>
                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setIsEditing(false)}
                    accessibilityRole="button"
                    accessibilityLabel="إلغاء التعديل"
                  >
                    <Text style={styles.buttonText}>إلغاء</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleEditSubmit}
                    accessibilityRole="button"
                    accessibilityLabel="حفظ التغييرات"
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
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>حالة الدفع:</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      styles.paymentBadge,
                      appt.payment ? styles.paymentPaid : styles.paymentUnpaid,
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
                  accessibilityRole="button"
                  accessibilityLabel="تعديل الموعد"
                >
                  <Text style={styles.buttonText}>تعديل الموعد</Text>
                </TouchableOpacity>
              </View>
            )}
          </ErrorBoundary>
        </View>
      )}
      <Modal
        visible={showPaymentModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر طريقة الدفع</Text>
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
                accessibilityRole="button"
                accessibilityLabel="إغلاق نافذة الدفع"
              >
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.paymentButton}
                onPress={() => handlePayment("stripe")}
                accessibilityRole="button"
                accessibilityLabel="دفع عبر Stripe"
              >
                <Icon
                  name="credit-card"
                  size={20}
                  color="#fff"
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>دفع عبر Stripe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.paymentButton, { backgroundColor: "#0891b2" }]}
                onPress={() => handlePayment("paymob")}
                accessibilityRole="button"
                accessibilityLabel="دفع عبر Paymob"
              >
                <Icon name="phone" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>دفع عبر Paymob</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  return renderItemContent();
};

const NursingAppointments = () => {
  const {
    appointments,
    addAppointment,
    reorderAppointments,
    fetchAppointments,
    error,
  } = useAppointmentStore();
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showBookingDatePicker, setShowBookingDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAppointments();
      const { data, error } = await supabase
        .from("doctors")
        .select("id, name, fees");
      if (!error) setDoctors(data || []);
      setLoading(false);
    };
    loadData();

    const subscription = supabase
      .channel("appointments-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchAppointments]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let filtered = appointments;

    if (searchQuery) {
      filtered = filtered.filter((appt) =>
        appt.patientName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "today":
        filtered = filtered.filter(
          (appt) =>
            appt.date &&
            new Date(appt.date).toDateString() === today.toDateString()
        );
        break;
      case "tomorrow":
        filtered = filtered.filter(
          (appt) =>
            appt.date &&
            new Date(appt.date).toDateString() === tomorrow.toDateString()
        );
        break;
      case "week":
        filtered = filtered.filter(
          (appt) =>
            appt.date &&
            new Date(appt.date) >= startOfWeek &&
            new Date(appt.date) <= endOfWeek
        );
        break;
      case "month":
        filtered = filtered.filter(
          (appt) =>
            appt.date &&
            new Date(appt.date) >= startOfMonth &&
            new Date(appt.date) <= endOfMonth
        );
        break;
      default:
        filtered = filtered;
    }

    setFilteredAppointments(filtered);
  }, [appointments, filter, searchQuery]);

  const handleChange = (name, value) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      if (name === "doctor_id") {
        const selectedDoctor = doctors.find(
          (doctor) => String(doctor.id) === value
        );
        updatedFormData.amount = selectedDoctor ? selectedDoctor.fees : "";
      }
      return updatedFormData;
    });
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setFormErrors({});

      const { data: existingPatient, error: patientCheckError } = await supabase
        .from("patients")
        .select("id")
        .eq("phoneNumber", formData.phoneNumber)
        .single();

      let patientId;

      if (patientCheckError && patientCheckError.code !== "PGRST116") {
        console.error("Error checking patient:", patientCheckError);
        Alert.alert("خطأ", "فشل في التحقق من وجود المريض.");
        return;
      }

      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        const patientData = {
          fullName: formData.fullName,
          age: parseInt(formData.age),
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          bookingDate: formData.bookingDate,
          visitType: formData.visitType,
          notes: formData.notes || null,
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

      const appointmentData = {
        date: formData.date,
        time: formData.time,
        status: formData.status,
        reason: formData.notes || null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        patient_id: patientId,
        doctor_id: formData.doctor_id || null,
      };

      await addAppointment(appointmentData);
      setFormData(initialValues);
      setShowModal(false);
      Alert.alert("نجاح", "تم إضافة الموعد بنجاح!");
    } catch (err) {
      if (err.name === "ValidationError") {
        const errors = {};
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
      } else {
        console.error("Error submitting appointment:", err);
        Alert.alert("خطأ", "حدث خطأ أثناء إضافة الموعد.");
      }
    }
  };

  const renderItem = ({ item, index, drag, isActive }) => (
    <AppointmentItem
      item={item}
      index={index}
      drag={drag}
      isActive={isActive}
    />
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Icon name="event" size={32} color="#0891b2" />
            <View>
              <Text style={styles.headerText}>المواعيد المجدولة</Text>
              <Text style={styles.headerSubText}>
                إدارة جميع مواعيد العيادة
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowModal(true)}
            accessibilityRole="button"
            accessibilityLabel="إضافة موعد"
          >
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.buttonText}>إضافة موعد</Text>
          </TouchableOpacity>
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
          <DraggableFlatList
            data={filteredAppointments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onDragEnd={({ data, from, to }) => {
              setFilteredAppointments(data);
              reorderAppointments(from, to);
            }}
            contentContainerStyle={styles.listContainer}
          />
        )}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowModal(false);
            setFormErrors({});
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>إضافة موعد</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(false);
                    setFormErrors({});
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="إغلاق نافذة إضافة الموعد"
                >
                  <Icon name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <View style={styles.form}>
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
                    accessibilityLabel="رقم الهاتف"
                  />
                  {formErrors.phoneNumber && (
                    <Text style={styles.errorText}>
                      {formErrors.phoneNumber}
                    </Text>
                  )}
                </View>
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
                    accessibilityLabel="اسم المريض"
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
                    accessibilityLabel="العمر"
                  />
                  {formErrors.age && (
                    <Text style={styles.errorText}>{formErrors.age}</Text>
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
                    accessibilityLabel="العنوان"
                  />
                  {formErrors.address && (
                    <Text style={styles.errorText}>{formErrors.address}</Text>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>تاريخ الحجز</Text>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      formErrors.bookingDate && styles.inputError,
                    ]}
                    onPress={() => setShowBookingDatePicker(true)}
                    accessibilityRole="button"
                    accessibilityLabel="اختر تاريخ الحجز"
                  >
                    <Text style={styles.inputText}>
                      {formData.bookingDate || "اختر التاريخ"}
                    </Text>
                  </TouchableOpacity>
                  {showBookingDatePicker && (
                    <DateTimePicker
                      value={
                        formData.bookingDate
                          ? new Date(formData.bookingDate)
                          : new Date()
                      }
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowBookingDatePicker(false);
                        if (selectedDate) {
                          handleChange(
                            "bookingDate",
                            selectedDate.toISOString().split("T")[0]
                          );
                        }
                      }}
                    />
                  )}
                  {formErrors.bookingDate && (
                    <Text style={styles.errorText}>
                      {formErrors.bookingDate}
                    </Text>
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
                    accessibilityLabel="نوع الزيارة"
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
                  <Text style={styles.label}>الطبيب</Text>
                  <Picker
                    selectedValue={formData.doctor_id}
                    onValueChange={(value) => handleChange("doctor_id", value)}
                    style={[
                      styles.input,
                      formErrors.doctor_id && styles.inputError,
                    ]}
                    accessibilityLabel="اختر الطبيب"
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
                  {formErrors.doctor_id && (
                    <Text style={styles.errorText}>{formErrors.doctor_id}</Text>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>المبلغ (جنيه مصري)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: "#f3f4f6" }]}
                    value={formData.amount ? formData.amount.toString() : ""}
                    editable={false}
                    accessibilityLabel="المبلغ"
                  />
                  {formErrors.amount && (
                    <Text style={styles.errorText}>{formErrors.amount}</Text>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>التاريخ</Text>
                  <TouchableOpacity
                    style={[styles.input, formErrors.date && styles.inputError]}
                    onPress={() => setShowDatePicker(true)}
                    accessibilityRole="button"
                    accessibilityLabel="اختر تاريخ الموعد"
                  >
                    <Text style={styles.inputText}>
                      {formData.date || "اختر التاريخ"}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={
                        formData.date ? new Date(formData.date) : new Date()
                      }
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          handleChange(
                            "date",
                            selectedDate.toISOString().split("T")[0]
                          );
                        }
                      }}
                    />
                  )}
                  {formErrors.date && (
                    <Text style={styles.errorText}>{formErrors.date}</Text>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>الوقت</Text>
                  <TouchableOpacity
                    style={[styles.input, formErrors.time && styles.inputError]}
                    onPress={() => setShowTimePicker(true)}
                    accessibilityRole="button"
                    accessibilityLabel="اختر وقت الموعد"
                  >
                    <Text style={styles.inputText}>
                      {formData.time || "اختر الوقت"}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={
                        formData.time
                          ? new Date(`1970-01-01T${formData.time}:00`)
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
                          handleChange("time", timeString);
                        }
                      }}
                    />
                  )}
                  {formErrors.time && (
                    <Text style={styles.errorText}>{formErrors.time}</Text>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>الحالة</Text>
                  <Picker
                    selectedValue={formData.status}
                    onValueChange={(value) => handleChange("status", value)}
                    style={styles.input}
                    accessibilityLabel="اختر الحالة"
                  >
                    <Picker.Item label="في الإنتظار" value="في الإنتظار" />
                    <Picker.Item label="ملغى" value="ملغى" />
                    <Picker.Item label="تم" value="تم" />
                  </Picker>
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
                    accessibilityLabel="الملاحظات"
                  />
                  {formErrors.notes && (
                    <Text style={styles.errorText}>{formErrors.notes}</Text>
                  )}
                </View>
                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowModal(false);
                      setFormErrors({});
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="إلغاء الإضافة"
                  >
                    <Text style={styles.buttonText}>إلغاء</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    accessibilityRole="button"
                    accessibilityLabel="إضافة الموعد"
                  >
                    <Text style={styles.buttonText}>إضافة الموعد</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#164e63",
  },
  headerSubText: {
    fontSize: 14,
    color: "#6b7280",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0891b2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: "#0891b2",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
    marginBottom: 16,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#0891b2",
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3b82f6",
    marginTop: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#3b82f6",
    marginTop: 4,
    textAlign: "center",
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
  cardActive: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0891b2",
    backgroundColor: "#ecfeff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dragHandle: {
    padding: 4,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  statusPending: {
    backgroundColor: "#fefce8",
    color: "#b45309",
  },
  statusCancelled: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },
  statusCompleted: {
    backgroundColor: "#f0fdf4",
    color: "#15803d",
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  paymentPaid: {
    backgroundColor: "#f0fdf4",
    color: "#15803d",
  },
  paymentUnpaid: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  expandedContent: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  editForm: {
    gap: 16,
  },
  detailContainer: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
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
    maxWidth: 400,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#164e63",
  },
  form: {
    gap: 16,
  },
  formGroup: {
    marginBottom: 8,
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
  inputText: {
    fontSize: 14,
    color: "#1f2937",
  },
  errorText: {
    color: "#f87171",
    fontSize: 12,
    marginTop: 4,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#0891b2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  paymentButton: {
    backgroundColor: "#9333ea",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
});

export default NursingAppointments;
