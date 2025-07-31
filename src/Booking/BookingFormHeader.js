import { Text, View } from "react-native";
import { styles } from "./styles";

export default BookingFormHeader = () => (
  <View style={styles.formHeaderContainer}>
    <Text style={styles.formHeaderTitle}>حجز موعد جديد</Text>
    <Text style={styles.formHeaderSubtitle}>يرجى ملء بياناتك لحجز موعد</Text>
  </View>
);
