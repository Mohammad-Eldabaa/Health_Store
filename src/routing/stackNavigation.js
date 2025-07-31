import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../home/index";
import Profile from "../profile";
import BottomNavigation from "./bottomNavigation";
import LoginScreen from "../Auth/screens/LoginScreen";
import RegisterScreen from "../Auth/screens/RegisterScreen";
import ForgotPasswordScreen from "../Auth/screens/ForgotPasswordScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export default function StackContainer() {
  return (
    <Navigator
      options={
        {
          // animation: "slide_from_right",
          // presentation: "card",
        }
      }
    >
      <Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Screen
        name="BottomNavigation"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />

      <Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      <Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
    </Navigator>
  );
}
