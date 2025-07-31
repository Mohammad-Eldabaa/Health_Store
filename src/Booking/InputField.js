import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";
import { styles } from "./styles";

export default InputField = ({
  label,
  icon,
  field,
  form,
  placeholder,
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
        form.touched[field.name] && form.errors[field.name]
          ? styles.inputError
          : null,
      ]}
      value={field.value}
      onChangeText={form.handleChange(field.name)}
      onBlur={form.handleBlur(field.name)}
      placeholder={placeholder}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlign="right"
    />
    {form.touched[field.name] && form.errors[field.name] ? (
      <Text style={styles.errorText}>{form.errors[field.name]}</Text>
    ) : null}
  </View>
);
