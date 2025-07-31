import { Text, View } from "react-native";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const visitTypes = [
  { label: "اختر نوع الزيارة", value: "" },
  { label: "فحص عام", value: "general-checkup" },
  { label: "استشارة", value: "consultation" },
  { label: "زيارة متابعة", value: "follow-up" },
];

export default VisitTypeField = ({ field, form }) => (
  <View style={styles.inputContainer}>
    <View style={styles.labelContainer}>
      <Ionicons name="time" size={20} color="#0097A7" />
      <Text style={styles.label}>نوع الزيارة *</Text>
    </View>
    <View
      style={[
        styles.pickerContainer,
        form.touched.visitType && form.errors.visitType
          ? styles.inputError
          : null,
      ]}
    >
      <Picker
        selectedValue={field.value}
        style={styles.picker}
        onValueChange={(itemValue) =>
          form.setFieldValue("visitType", itemValue)
        }
      >
        {visitTypes.map((type) => (
          <Picker.Item key={type.value} label={type.label} value={type.value} />
        ))}
      </Picker>
    </View>
    {form.touched.visitType && form.errors.visitType ? (
      <Text style={styles.errorText}>{form.errors.visitType}</Text>
    ) : null}
  </View>
);
