import React, { useState } from "react";
import { styles } from "./styles.js";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const Booking = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    age: "",
    phoneNumber: "",
    bookingDate: new Date(),
    visitType: "",
    notes: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const visitTypes = [
    { label: "اختر نوع الزيارة", value: "" },
    { label: "فحص عام", value: "general-checkup" },
    { label: "استشارة", value: "consultation" },
    { label: "زيارة متابعة", value: "follow-up" },
    { label: "طوارئ", value: "emergency" },
    { label: "فحص دوري", value: "routine-screening" },
    { label: "إحالة إلى أخصائي", value: "specialist-referral" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    if (!formData.address.trim()) {
      newErrors.address = "العنوان مطلوب";
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = "يرجى إدخال عمر صحيح (1-120)";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "رقم الهاتف مطلوب";
    }

    if (!formData.visitType) {
      newErrors.visitType = "نوع الزيارة مطلوب";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (formData.bookingDate < today) {
      newErrors.bookingDate = "يجب أن يكون التاريخ في المستقبل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert("تم إرسال الطلب", "سنتصل بك خلال 24 ساعة لتأكيد موعدك", [
        { text: "موافق", style: "default" },
      ]);

      // Reset form after successful submission
      setFormData({
        fullName: "",
        address: "",
        age: "",
        phoneNumber: "",
        bookingDate: new Date(),
        visitType: "",
        notes: "",
      });
      setErrors({});
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.bookingDate;
    setShowDatePicker(Platform.OS === "ios");
    updateField("bookingDate", currentDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const FormHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Ionicons name="medical" size={32} color="#FFFFFF" />
        <Text style={styles.headerTitle}>عيادة الرعاية الصحية</Text>
      </View>
      <Text style={styles.headerSubtitle}>احجز موعدك</Text>
    </View>
  );

  const BookingFormHeader = () => (
    <View style={styles.formHeaderContainer}>
      <Text style={styles.formHeaderTitle}>حجز موعد جديد</Text>
      <Text style={styles.formHeaderSubtitle}>يرجى ملء بياناتك لحجز موعد</Text>
    </View>
  );

  const InputField = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    error,
    keyboardType = "default",
    multiline = false,
    numberOfLines = 1,
  }) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={20} color="#0097A7" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={[
          multiline ? styles.textArea : styles.textInput,
          error ? styles.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlign="right"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  const DatePickerField = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Ionicons name="calendar" size={20} color="#0097A7" />
        <Text style={styles.label}>التاريخ المفضل *</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.dateButton,
          errors.bookingDate ? styles.inputError : null,
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          {formatDate(formData.bookingDate)}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>
      {errors.bookingDate ? (
        <Text style={styles.errorText}>{errors.bookingDate}</Text>
      ) : null}

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={formData.bookingDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );

  const VisitTypeField = () => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Ionicons name="time" size={20} color="#0097A7" />
        <Text style={styles.label}>نوع الزيارة *</Text>
      </View>
      <View
        style={[
          styles.pickerContainer,
          errors.visitType ? styles.inputError : null,
        ]}
      >
        <Picker
          selectedValue={formData.visitType}
          style={styles.picker}
          onValueChange={(itemValue) => updateField("visitType", itemValue)}
        >
          {visitTypes.map((type) => (
            <Picker.Item
              key={type.value}
              label={type.label}
              value={type.value}
            />
          ))}
        </Picker>
      </View>
      {errors.visitType ? (
        <Text style={styles.errorText}>{errors.visitType}</Text>
      ) : null}
    </View>
  );

  const ImportantInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.infoTitle}>معلومات مهمة</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>ساعات العمل:</Text>
          <Text style={styles.infoText}>الاثنين-الجمعة: 8:00 ص - 6:00 م</Text>
          <Text style={styles.infoText}>السبت: 9:00 ص - 2:00 م</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>الطوارئ:</Text>
          <Text style={styles.infoText}>للحالات العاجلة، اتصل على</Text>
          <Text style={styles.infoText}>(555) 123-4567</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>التأكيد:</Text>
          <Text style={styles.infoText}>سنتصل بك خلال 24 ساعة</Text>
          <Text style={styles.infoText}>لتأكيد موعدك</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <FormHeader /> */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <BookingFormHeader />

          <View style={styles.formContent}>
            <InputField
              label="الاسم الكامل *"
              icon="person"
              value={formData.fullName}
              onChangeText={(value) => updateField("fullName", value)}
              placeholder="أدخل اسمك الكامل"
              error={errors.fullName}
            />

            <InputField
              label="العنوان *"
              icon="location"
              value={formData.address}
              onChangeText={(value) => updateField("address", value)}
              placeholder="أدخل عنوانك الكامل"
              error={errors.address}
            />

            <InputField
              label="العمر *"
              icon="calendar"
              value={formData.age}
              onChangeText={(value) => updateField("age", value)}
              placeholder="أدخل عمرك"
              keyboardType="numeric"
              error={errors.age}
            />

            <InputField
              label="رقم الهاتف *"
              icon="call"
              value={formData.phoneNumber}
              onChangeText={(value) => updateField("phoneNumber", value)}
              placeholder="أدخل رقم هاتفك"
              keyboardType="phone-pad"
              error={errors.phoneNumber}
            />

            <DatePickerField />

            <VisitTypeField />

            <InputField
              label="ملاحظات إضافية"
              icon="document-text"
              value={formData.notes}
              onChangeText={(value) => updateField("notes", value)}
              placeholder="يرجى وصف الأعراض أو أي مخاوف محددة..."
              multiline={true}
              numberOfLines={4}
              error={errors.notes}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>احجز الموعد</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ImportantInfo />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Booking;
