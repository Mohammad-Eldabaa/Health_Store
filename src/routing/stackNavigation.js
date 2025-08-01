import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../home/index";
import Profile from "../profile";
import BottomNavigation from "./bottomNavigation";
import LoginScreen from "../Auth/screens/LoginScreen";
import RegisterScreen from "../Auth/screens/RegisterScreen";
import ForgotPasswordScreen from "../Auth/screens/ForgotPasswordScreen";
import useAuthStore from "../store/login";
import FirstAid from "../FirstAid/screens/FirstAid";
import FirstAidDetails from "../FirstAid/screens/FirstAidDetails";
import MedicalArticlesPage from "../MedicalArticles/screens/MedicalArticlesPage";
import ArticleDetailsScreen from "../MedicalArticles/screens/ArticleDetailsScreen";

const { Navigator, Screen } = createNativeStackNavigator();

export default function StackContainer() {
  const { current_user } = useAuthStore();
  return (
    <Navigator initialRouteName={current_user ? "BottomNavigation" : "Login"}>
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

      <Screen
        name="FirstAid"
        component={FirstAid}
        options={{
          // headerTitle: "الاسعافات الأولية",
          headerShown: false,
          // headerStyle: { backgroundColor: "#fff", height: 6 },
        }}
      />

      <Screen
        name="FirstAidDetails"
        component={FirstAidDetails}
        options={{ headerShown: false }}
      />

      <Screen
        name="MedicalArticlesPage"
        component={MedicalArticlesPage}
        options={{ headerShown: false }}
      />

      <Screen
        name="ArticleDetails"
        component={ArticleDetailsScreen}
        options={{ headerShown: false }}
      />
    </Navigator>
  );
}
