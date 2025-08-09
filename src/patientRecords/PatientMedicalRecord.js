import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

function PatientMedicalRecord({ patient = {}, records = {} }) {
  const [activeTab, setActiveTab] = useState("prescriptions");

  useEffect(() => {
    // console.log("Patient data:", patient);
    // console.log("Records data:", records);
  }, [patient, records]);

  const prescriptions = records.prescriptions || [];
  const tests = records.test_requests || records.tests || [];
  const appointments = records.appointments || [];

  const allPrescriptions =
    prescriptions.length > 0
      ? prescriptions
      : records.visits?.flatMap((visit) => visit.prescriptions || []) || [];

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "تم":
      case "confirmed":
        return "#059669";
      case "ملغي":
      case "cancelled":
        return "#dc2626";
      case "في الإنتظار":
      case "في الانتظار":
      case "pending":
        return "#d97706";
      default:
        return "#374151";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "مؤكد";
      case "cancelled":
        return "ملغي";
      case "pending":
        return "في الانتظار";
      default:
        return status || "غير محدد";
    }
  };

  const tabs = [
    { key: "prescriptions", label: "الروشتات", icon: "medical" },
    { key: "tests", label: "التحاليل", icon: "flask" },
    { key: "appointments", label: "المواعيد", icon: "calendar" },
    { key: "notes", label: "الملاحظات", icon: "document-text" },
  ];

  const renderPrescriptions = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Ionicons name="medical" size={24} color="#0891b2" />
        <Text style={styles.sectionTitle}>سجل الروشتات</Text>
      </View>
      {allPrescriptions?.length ? (
        <View>
          {allPrescriptions.map((presc, idx) => (
            <View key={presc.id || idx} style={styles.prescriptionCard}>
              <View style={styles.prescriptionHeader}>
                <Text style={styles.prescriptionTitle}>
                  روشتة رقم #{idx + 1}
                </Text>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{formatDate(presc.date)}</Text>
                </View>
              </View>

              <View style={styles.prescriptionContent}>
                {presc.prescription_medications?.length ? (
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>
                        #
                      </Text>
                      <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                        اسم الدواء
                      </Text>
                      <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                        الجرعة
                      </Text>
                      <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                        المدة
                      </Text>
                    </View>
                    {presc.prescription_medications.map((med, i) => (
                      <View key={med.id || i} style={styles.tableRow}>
                        <Text style={[styles.tableCell, { flex: 0.5 }]}>
                          {i + 1}
                        </Text>
                        <Text
                          style={[
                            styles.tableCell,
                            { flex: 2, fontWeight: "500" },
                          ]}
                        >
                          {med.medication?.name || med.name || "دواء غير محدد"}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>
                          {med.dosage || "غير محدد"}
                        </Text>
                        <Text style={[styles.tableCell, { flex: 1 }]}>
                          {med.duration || "غير محدد"}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyText}>
                    لا توجد أدوية في هذه الروشتة
                  </Text>
                )}

                {presc.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>ملاحظات:</Text>
                    <Text style={styles.notesText}>{presc.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="medical" size={48} color="#9ca3af" />
          <Text style={styles.emptyMessage}>لا توجد روشتات مسجلة</Text>
        </View>
      )}
    </View>
  );

  const renderTests = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Ionicons name="flask" size={24} color="#0891b2" />
        <Text style={styles.sectionTitle}>سجل التحاليل</Text>
      </View>
      {tests?.length ? (
        <View>
          {tests.map((test, idx) => (
            <View key={test.id || idx} style={styles.testCard}>
              <View style={styles.testInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>التاريخ</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(test.date || test.created_at)}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>نوع التحليل</Text>
                  <Text style={styles.infoValue}>
                    {test.test?.name || test.type || "غير محدد"}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>النتيجة</Text>
                  <Text style={styles.infoValue}>
                    {test.result || "في الانتظار"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="flask" size={48} color="#9ca3af" />
          <Text style={styles.emptyMessage}>لا توجد تحاليل مسجلة</Text>
        </View>
      )}
    </View>
  );

  const renderAppointments = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Ionicons name="calendar" size={24} color="#0891b2" />
        <Text style={styles.sectionTitle}>مواعيد الحجز</Text>
      </View>
      {appointments?.length ? (
        <View>
          {appointments.map((appt, idx) => (
            <View key={appt.id || idx} style={styles.appointmentCard}>
              <View style={styles.appointmentInfo}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>التاريخ</Text>
                  <Text style={styles.infoValue}>{formatDate(appt.date)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>الوقت</Text>
                  <Text style={styles.infoValue}>
                    {appt.time || "غير محدد"}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>الحالة</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: getStatusColor(appt.status) },
                    ]}
                  >
                    {getStatusText(appt.status)}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>ملاحظات</Text>
                  <Text style={styles.infoValue}>
                    {appt.reason || "لا يوجد ملاحظات"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar" size={48} color="#9ca3af" />
          <Text style={styles.emptyMessage}>لا توجد مواعيد حجز</Text>
        </View>
      )}
    </View>
  );

  const renderNotes = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Ionicons name="document-text" size={24} color="#0891b2" />
        <Text style={styles.sectionTitle}>الملاحظات العامة</Text>
      </View>
      {records.notes ? (
        <View style={styles.notesCard}>
          <Text style={styles.generalNotes}>{records.notes}</Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text" size={48} color="#9ca3af" />
          <Text style={styles.emptyMessage}>لا توجد ملاحظات</Text>
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "prescriptions":
        return renderPrescriptions();
      case "tests":
        return renderTests();
      case "appointments":
        return renderAppointments();
      case "notes":
        return renderNotes();
      default:
        return renderPrescriptions();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {patient.fullName?.[0] ||
              patient.full_name?.[0] ||
              patient.name?.[0] ||
              "م"}
          </Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>
            {patient.fullName ||
              patient.full_name ||
              patient.name ||
              "مريض غير معروف"}
          </Text>
          <View style={styles.patientDetails}>
            <View style={styles.detailBadge}>
              <Text style={styles.detailText}>
                الهاتف: {patient.phoneNumber || patient.phone || "غير مسجل"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={activeTab === tab.key ? "white" : "#4b5563"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.content}>{renderContent()}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 16,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0891b2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  patientInfo: {
    flex: 1,
    marginRight: 10,
  },
  patientName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  patientDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  detailBadge: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  detailText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#0891b2",
  },
  tabContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    minWidth: 80,
  },
  activeTab: {
    backgroundColor: "#0891b2",
    borderRadius: 12,
    margin: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4b5563",
    marginTop: 4,
    textAlign: "center",
  },
  activeTabText: {
    color: "white",
  },
  contentContainer: {
    flex: 1,
    marginTop: 16,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 16,
    padding: 24,
    minHeight: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 8,
  },
  prescriptionCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  prescriptionHeader: {
    backgroundColor: "#0891b2",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prescriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  dateBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 12,
    color: "white",
  },
  prescriptionContent: {
    padding: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingHorizontal: 4,
  },
  tableCell: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    paddingVertical: 12,
  },
  notesContainer: {
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#b3e5fc",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0891b2",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  testCard: {
    backgroundColor: "linear-gradient(to right, #f0fdfa, #e0f2fe)",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  appointmentCard: {
    backgroundColor: "linear-gradient(to right, #e0f2fe, #f0fdfa)",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  testInfo: {
    flexDirection: "column",
    gap: 12,
  },
  appointmentInfo: {
    flexDirection: "column",
    gap: 12,
  },
  infoItem: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  notesCard: {
    backgroundColor: "linear-gradient(to right, #e0f2fe, #f0fdfa)",
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#b3e5fc",
  },
  generalNotes: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 16,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    paddingVertical: 16,
  },
});

export default PatientMedicalRecord;
