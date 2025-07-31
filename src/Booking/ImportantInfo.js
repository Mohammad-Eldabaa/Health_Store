import { Text, View } from "react-native";
import { styles } from "./styles";

export default ImportantInfo = () => (
  <View style={styles.infoContainer}>
    <Text style={styles.infoTitle}>معلومات مهمة</Text>
    <View style={styles.infoGrid}>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>ساعات العمل:</Text>
        <Text style={styles.infoText}>الاثنين-الجمعة: 8:00 ص - 6:00 م</Text>
        <Text style={styles.infoText}>السبت: 9:00 ص - 2:00 م</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>الطوارئ:</Text>
        <Text style={styles.infoText}>للحالات العاجلة، اتصل على</Text>
        <Text style={styles.infoText}>(555) 123-4567</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>التأكيد:</Text>
        <Text style={styles.infoText}>سنتصل بك خلال 24 ساعة</Text>
        <Text style={styles.infoText}>لتأكيد موعدك</Text>
      </View>
    </View>
  </View>
);
