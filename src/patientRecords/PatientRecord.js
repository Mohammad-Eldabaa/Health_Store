import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import PatientMedicalRecord from "./PatientMedicalRecord";
import QueueStatus from "./QueueStatus";
import { fetchPatientMedicalRecordByPhone } from "../store/patientService";
import useAuthStore from "../store/login";

function PatientRecordContainer() {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { CUphone } = useAuthStore();
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const loadPatientDataByPhone = async (phone) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading patient data for phone:", phone);

      const data = await fetchPatientMedicalRecordByPhone(phone);

      const formattedData = {
        ...data,
        allPrescriptions:
          data.visits?.flatMap((visit) =>
            (visit.prescriptions || []).map((prescription) => ({
              ...prescription,
              visitDate: visit.date,
              visitId: visit.id,
            }))
          ) || [],
      };

      console.log("Formatted patient data:", formattedData);
      setPatientData(formattedData);
    } catch (err) {
      console.error("Error loading patient data:", err);
      if (err.message.includes("Patient not found")) {
        setError(`لم يتم العثور على مريض برقم الهاتف: ${phone}`);
      } else {
        setError(err.message || "خطأ في تحميل بيانات المريض");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    const userPhone = CUphone();
    if (userPhone) {
      loadPatientDataByPhone(userPhone);
    } else {
      setRefreshing(false);
    }
  };

  const handleRetry = () => {
    const userPhone = CUphone();
    if (userPhone) {
      loadPatientDataByPhone(userPhone);
    }
  };

  useEffect(() => {
    const userPhone = CUphone();
    console.log("User phone from store:", userPhone);

    if (userPhone) {
      loadPatientDataByPhone(userPhone);
    } else {
      setError("لا يوجد رقم هاتف مسجل في بياناتك");
    }
  }, []);

  if (loading && !patientData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891b2" />
        <Text style={styles.loadingText}>جاري تحميل بياناتك الطبية...</Text>
        <Text style={styles.loadingSubText}>
          يتم البحث برقم الهاتف: {CUphone()}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>خطأ في تحميل البيانات</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
          <Text style={styles.phoneNumber}>
            رقم الهاتف المستخدم: {CUphone() || "غير محدد"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>سجلك الطبي</Text>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Queue Status Section */}
      {patientData?.queueInfo && (
        <View style={styles.queueSection}>
          <QueueStatus
            patientId={patientData.id}
            doctorId={patientData.queueInfo.nextAppointment?.doctor_id || null}
          />
        </View>
      )}

      {/* Patient Data Display */}
      {patientData ? (
        <PatientMedicalRecord
          patient={patientData}
          records={{
            visits: patientData.visits || [],
            prescriptions: patientData.allPrescriptions || [],
            tests:
              patientData.test_requests?.map((tr) => ({
                id: tr.id,
                date: tr.created_at?.split("T")[0] || "",
                type: tr.test?.name || "تحليل غير محدد",
                result: tr.result || "في الانتظار",
                status: tr.status || "pending",
              })) || [],
            appointments: patientData.appointments || [],
            notes: patientData.notes || patientData.medical_notes || "",
          }}
          queueInfo={patientData?.queueInfo}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <View style={styles.noDataCard}>
            <Text style={styles.noDataIcon}>👤</Text>
            <Text style={styles.noDataTitle}>لا توجد بيانات طبية</Text>
            <Text style={styles.noDataMessage}>
              لم يتم العثور على سجل طبي مرتبط برقم هاتفك
            </Text>
            <Text style={styles.phoneNumber}>رقم الهاتف: {CUphone()}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    direction: "rtl",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#4b5563",
    marginTop: 16,
    textAlign: "center",
  },
  loadingSubText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  errorCard: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    padding: 32,
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#991b1b",
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#dc2626",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  phoneNumber: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  header: {
    backgroundColor: "#0891b2",
    borderRadius: 12,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    padding: 8,
  },
  queueSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  noDataContainer: {
    padding: 16,
  },
  noDataCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  noDataIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  noDataMessage: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default PatientRecordContainer;
