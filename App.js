import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import StackContainer from "./src/routing/stackNavigation";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0097A7" }}>
      <NavigationContainer>
        <StackContainer />
      </NavigationContainer>
    </SafeAreaView>
  );
}
