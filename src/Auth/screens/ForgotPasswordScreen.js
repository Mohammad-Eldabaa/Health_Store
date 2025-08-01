import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
import useAuthStore from "../../store/login";

const ForgotPasswordScreen = ({ navigation }) => {
  const { handleForgotPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSend = async () => {
    try {
      await forgotPasswordSchema.validate({ email });
      setEmailError("");
      handleForgotPassword(email, navigation);
    } catch (error) {
      setEmailError(error.message);
    }
  };

  const handleBlur = async () => {
    try {
      await forgotPasswordSchema.validate({ email });
      setEmailError("");
    } catch (error) {
      setEmailError(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: "https://icons.veryicon.com/png/o/miscellaneous/conventional-use/password-lock-12.png",
        }}
        style={styles.avatar}
      />
      <Text style={styles.title}>نسيت كلمة المرور؟</Text>

      <TextInput
        placeholder="أدخل بريدك الإلكتروني"
        value={email}
        onChangeText={setEmail}
        onBlur={handleBlur}
        keyboardType="email-address"
        style={[styles.input, emailError && styles.inputError]}
        placeholderTextColor="#888"
      />

      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TouchableOpacity onPress={handleSend} style={styles.button}>
        <Text style={styles.buttonText}>إرسال</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E0F7FA",
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
    borderWidth: 1,
    borderColor: "#B2EBF2",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    textAlign: "right",
  },
  inputError: {
    borderColor: "#FF4D4D",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-end",
    marginBottom: 8,
    marginTop: -5,
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
});
