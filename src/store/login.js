import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";
import { Alert } from "react-native";

const useAuthStore = create(
  persist(
    (set, get) => ({
      current_user: null,
      user_email: null,
      setCurrentUserAsNull: () => set({ current_user: null }),

      login: async ({ email, password }, navigate, reset) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.log("Login error:", error.message);
          Alert.alert(
            "خطأ في تسجيل الدخول",
            "يرجى التأكد من الإيميل وكلمة المرور"
          );
        } else {
          set({ current_user: data?.user?.user_metadata });
          set({ user_email: email });
          Alert.alert(
            "تم تسجيل الدخول بنجاح",
            "مرحبًا بك",
            [
              {
                text: "OK",
                onPress: () => {
                  if (reset) {
                    reset({
                      index: 0,
                      routes: [{ name: "BottomNavigation" }],
                    });
                  }
                },
              },
            ],
            { cancelable: false }
          );
        }
      },
      register: async (
        { email, password, phone, name, address },
        navigation
      ) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone,
              address,
              role: "user",
            },
          },
        });

        if (error) {
          console.error("Signup error:", error.message);
          Alert.alert("خطأ في التسجيل", error.message);
        } else {
          set({ current_user: data?.user?.user_metadata });
          set({ user_email: email });

          Alert.alert(
            "تم التسجيل بنجاح",
            "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("Login");
                },
              },
            ],
            { cancelable: false }
          );
          navigation.navigate("Login");
        }
      },

      logout: async (reset) => {
        await supabase.auth.signOut();
        set({ current_user: null });
        Alert.alert("تم تسجيل الخروج بنجاح", "نأمل أن نراك قريبًا");
      },

      handleForgotPassword: async (email, navigation) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: "myapp://Register",
        });

        if (error) {
          console.error("Error sending reset email:", error.message);
          Alert.alert("حدث خطأ", error.message);
        } else {
          Alert.alert(
            "تم إرسال رابط إعادة تعيين كلمة المرور",
            "يرجى التحقق من بريدك الإلكتروني"
          );
          if (navigation) {
            navigation.navigate("Login");
          }
        }
      },

      updatePassword: async (newPassword, navigation) => {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) {
          console.error("Error updating password:", error.message);
          throw error;
        } else {
          if (navigation) {
            navigation.navigate("PasswordUpdated");
          }
        }
      },

      CUname: () => get().current_user?.full_name || "",
      CUaddress: () => get().current_user?.address || "",
      CUphone: () => get().current_user?.phone || "",
      CUrole: () => get().current_user?.role || "",
      CUemail: () => get().current_user?.email || "",
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ current_user: state.current_user }),
    }
  )
);

export default useAuthStore;
