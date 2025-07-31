import { NavigationContainer } from "@react-navigation/native";
import BottomNavigation from "./src/routing/bottomNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import StackContainer from "./src/routing/stackNavigation";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <StackContainer />
      </NavigationContainer>
    </SafeAreaView>
  );
}
