import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  I18nManager,
} from "react-native";
import registerSchema from "../validation/registerSchema";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

I18nManager.forceRTL(true);

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await registerSchema.validate(form, { abortEarly: false });
      setErrors({});
      console.log("Register Data:", form);
      // API request or navigation logic here
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((e) => {
        validationErrors[e.path] = e.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      extraScrollHeight={20}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>إنشاء حساب</Text>

        <Text style={styles.label}>الاسم بالكامل</Text>
        <TextInput
          style={styles.input}
          placeholder="ادخل اسمك بالكامل"
          value={form.name}
          onChangeText={(value) => handleChange("name", value)}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        <Text style={styles.label}>البريد الالكتروني</Text>
        <TextInput
          style={styles.input}
          placeholder="ادخل بريدك الالكتروني"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(value) => handleChange("email", value)}
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <Text style={styles.label}>كلمة المرور</Text>
        <TextInput
          style={styles.input}
          placeholder="ادخل كلمة المرور"
          secureTextEntry
          value={form.password}
          onChangeText={(value) => handleChange("password", value)}
        />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <Text style={styles.label}>تأكيد كلمة المرور</Text>
        <TextInput
          style={styles.input}
          placeholder="تأكيد كلمة المرور"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
        />
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword}</Text>
        )}

        <Text style={styles.label}>العنوان</Text>
        <TextInput
          style={styles.input}
          placeholder="اكتب عنوانك هنا"
          value={form.address}
          onChangeText={(value) => handleChange("address", value)}
        />
        {errors.address && <Text style={styles.error}>{errors.address}</Text>}

        <Text style={styles.label}>رقم الهاتف</Text>
        <TextInput
          style={styles.input}
          placeholder="ادخل رقم الهاتف"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(value) => handleChange("phone", value)}
        />
        {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>سجل الآن</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>لديك حساب بالفعل؟ </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>سجل الدخول</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E0F7FA",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#006064",
  },
  label: {
    textAlign: "right",
    marginBottom: 5,
    fontWeight: "bold",
    color: "#004D40",
  },
  input: {
    borderWidth: 1,
    borderColor: "#B2EBF2",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    textAlign: "right",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "column", // خليهم تحت بعض
    alignItems: "center", // وحطهم في النص
    justifyContent: "center",
    marginTop: 20,
  },

  footerText: {
    color: "#004D40",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  link: {
    color: "#00796B",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});

export default RegisterScreen;
