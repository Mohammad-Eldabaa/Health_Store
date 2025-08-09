import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getQueuePosition } from "../store/patientService";

function QueueStatus({ patientId, doctorId = null, refreshInterval = 30000 }) {
  const [queueInfo, setQueueInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  const fetchQueueInfo = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      setError(null);
      const info = await getQueuePosition(patientId, doctorId);
      setQueueInfo(info);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error fetching queue info:", err);
      setError("حدث خطأ في جلب معلومات الانتظار");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    Alert.alert("إعادة التحديث", "هل تريد تحديث معلومات الانتظار؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "تحديث", onPress: fetchQueueInfo },
    ]);
  };

  useEffect(() => {
    fetchQueueInfo();

    const interval = setInterval(fetchQueueInfo, refreshInterval);

    return () => clearInterval(interval);
  }, [patientId, doctorId, refreshInterval]);

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "غير محدد";
    return timeString;
  };

  if (loading && !queueInfo) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="small" color="#14b8a6" />
          <Text style={styles.loadingText}>جاري تحميل معلومات الانتظار...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchQueueInfo}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!queueInfo?.nextAppointment) {
    return (
      <View style={styles.noAppointmentContainer}>
        <View style={styles.noAppointmentContent}>
          <Ionicons name="calendar-outline" size={32} color="#f59e0b" />
          <Text style={styles.noAppointmentText}>لا توجد مواعيد حجز قادمة</Text>
        </View>
      </View>
    );
  }

  const { nextAppointment, queuePosition, totalQueue } = queueInfo;
  const estimatedWaitTime = Math.max(0, queuePosition * 15);
  const progressPercentage = ((totalQueue - queuePosition) / totalQueue) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar" size={24} color="#14b8a6" />
          <View style={styles.appointmentInfo}>
            <Text style={styles.headerTitle}>الموعد القادم</Text>
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentDetail}>
                {formatDate(nextAppointment.date)}
              </Text>
              <Text style={styles.appointmentDetail}>
                {formatTime(nextAppointment.time)}
              </Text>
              {nextAppointment.doctor?.name && (
                <Text style={styles.appointmentDetail}>
                  {nextAppointment.doctor.name}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRetry}
          disabled={loading}
        >
          <Ionicons
            name="refresh"
            size={20}
            color="#14b8a6"
            style={loading && styles.spinning}
          />
        </TouchableOpacity>
      </View>

      {/* Queue Status */}
      {queuePosition > 0 ? (
        <View>
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: "#f97316" }]}>
                {queuePosition}
              </Text>
              <Text style={styles.statLabel}>مواعيد في الانتظار</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: "#3b82f6" }]}>
                {totalQueue}
              </Text>
              <Text style={styles.statLabel}>إجمالي المواعيد اليوم</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: "#14b8a6" }]}>
                {estimatedWaitTime}
              </Text>
              <Text style={styles.statLabel}>دقيقة متوقعة</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>تقدم الدور</Text>
              <Text style={styles.progressText}>
                {totalQueue - queuePosition} من {totalQueue}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.nextPatientContainer}>
          <View style={styles.nextPatientCard}>
            <Text style={styles.nextPatientText}>
              موعدك هو التالي! يرجى الاستعداد والتوجه للطبيب
            </Text>
          </View>
        </View>
      )}

      {/* Last Update */}
      {lastUpdate && (
        <View style={styles.lastUpdateContainer}>
          <Text style={styles.lastUpdateText}>
            آخر تحديث: {lastUpdate.toLocaleTimeString("ar-EG")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 12,
    padding: 16,
  },
  loadingContainer: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#4b5563",
  },
  errorContainer: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    padding: 16,
  },
  errorContent: {
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#fecaca",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: 12,
    color: "#dc2626",
  },
  noAppointmentContainer: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 12,
    padding: 16,
  },
  noAppointmentContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  noAppointmentText: {
    fontSize: 14,
    color: "#d97706",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    flex: 1,
  },
  appointmentInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#065f46",
    marginBottom: 4,
  },
  appointmentDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  appointmentDetail: {
    fontSize: 12,
    fontWeight: "500",
    color: "#047857",
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(20, 184, 166, 0.1)",
  },
  spinning: {
    // Add rotation animation if needed
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: "#4b5563",
    fontWeight: "500",
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "#047857",
    fontWeight: "500",
  },
  progressText: {
    fontSize: 12,
    color: "#047857",
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#a7f3d0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#14b8a6",
    borderRadius: 6,
  },
  nextPatientContainer: {
    marginBottom: 16,
  },
  nextPatientCard: {
    backgroundColor: "#d1fae5",
    borderWidth: 1,
    borderColor: "#86efac",
    borderRadius: 8,
    padding: 16,
  },
  nextPatientText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#065f46",
    textAlign: "center",
  },
  lastUpdateContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#a7f3d0",
    alignItems: "center",
  },
  lastUpdateText: {
    fontSize: 11,
    color: "#14b8a6",
  },
});

export default QueueStatus;
