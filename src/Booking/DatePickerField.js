import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { styles } from "./styles";
import { useState } from "react";

const formatDate = (date) => {
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default DatePickerField = ({ field, form }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Ionicons name="calendar" size={20} color="#0097A7" />
        <Text style={styles.label}>التاريخ المفضل *</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.dateButton,
          form.touched.bookingDate && form.errors.bookingDate
            ? styles.inputError
            : null,
        ]}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>{formatDate(field.value)}</Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>
      {form.touched.bookingDate && form.errors.bookingDate ? (
        <Text style={styles.errorText}>{form.errors.bookingDate}</Text>
      ) : null}

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={field.value}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || field.value;
            setShowDatePicker(false);
            form.setFieldValue("bookingDate", currentDate);
          }}
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
        />
      )}
    </View>
  );
};
