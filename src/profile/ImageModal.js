import { Ionicons } from "@expo/vector-icons";
import { Image, Modal, TouchableOpacity, View } from "react-native";
import { StyleSheet, Dimensions, I18nManager } from "react-native";
const { width, height } = Dimensions.get("window");

export const ImageModal = ({ expandedImage, setExpandedImage }) => (
  <Modal
    visible={!!expandedImage}
    transparent={true}
    animationType="fade"
    onRequestClose={() => setExpandedImage(null)}
  >
    <View style={styles.modalOverlay}>
      <TouchableOpacity
        style={styles.modalCloseArea}
        onPress={() => setExpandedImage(null)}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setExpandedImage(null)}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Image
            source={{ uri: expandedImage }}
            style={styles.expandedImage}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.9,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  expandedImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    [I18nManager.isRTL ? "left" : "right"]: 10,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    padding: 6,
  },
});
