import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../home/index";
import Profile from "../profile";

const { Navigator, Screen } = createNativeStackNavigator();

export default function StackContainer() {
  return (
    <Navigator>
      <Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}
