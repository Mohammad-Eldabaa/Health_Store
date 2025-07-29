import { Ionicons } from "@expo/vector-icons";
import StackContainer from "./stackNavigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../profile";
import Booking from "../Booking";

export default function BottomNavigation() {
  const { Navigator, Screen } = createBottomTabNavigator();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Screen
        name="Home"
        component={StackContainer}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={"home"} size={size} color={color} />
          ),
        }}
      />

      <Screen name="Booking" component={Booking} />
      <Screen name="Profile" component={Profile} />
    </Navigator>
  );
}
