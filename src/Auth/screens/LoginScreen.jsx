// LoginScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  I18nManager,
} from "react-native";

import LoginSchema from "../validation/LoginSchema"; // التحقق من البيانات
import * as Yup from "yup"; // مهم علشان نتحكم في الأخطاء
import { useNavigation } from "@react-navigation/native";

// تفعيل RTL
I18nManager.forceRTL(true);

const LoginScreen = () => {
  const { navigate } = useNavigation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      await LoginSchema.validate(form, { abortEarly: false });
      setErrors({});
      console.log("✅ Login Data:", form);
      // هنا تضيف اللوجيك بتاعك
      // navigation.navigate("Home");
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
      }
      setErrors(validationErrors);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* صورة الدكتور */}
      <Image
        source={{
          uri: "https://img.pikbest.com/png-images/20241019/doctor-logo-vector-icon-illustration_10974092.png!w700wp",
        }}
        style={styles.avatar}
      />

      <Text style={styles.title}>تسجيل الدخول</Text>

      <TextInput
        style={styles.input}
        placeholder="ادخل البريد الالكتروني"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        secureTextEntry
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TouchableOpacity onPress={() => navigate("ForgotPassword")}>
        <Text style={styles.forgotPassword}>هل نسيت كلمة السر؟</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>تسجيل الدخول</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigate("BottomNavigation")}
      >
        <Text style={styles.buttonText}>الدخول بدون تسجيل</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>ليس لديك حساب؟ </Text>
        <TouchableOpacity onPress={() => navigate("Register")}>
          <Text style={styles.link}>سجل الآن</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    color: "#006064",
    fontWeight: "bold",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#B2EBF2",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "right",
  },
  button: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "column", // يخلي العناصر تحت بعض
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#004D40",
    marginBottom: 5,
  },
  link: {
    color: "#00796B",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-end",
    marginBottom: 8,
    marginTop: -5,
  },
  forgotPassword: {
    color: "#00796B",
    alignSelf: "flex-end",
    marginBottom: 10,
    fontWeight: "bold",
  },
});

export default LoginScreen;
