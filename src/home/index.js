import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialRef = useRef(null);

  const clinicInfo = {
    name: "عيادة الشفاء",
    doctor: "د. أحمد عبد العزيز",
    specialty: "استشاري باطنة وأمراض قلب",
    // image: require("./assets/doctor-ahmed.jpg"),
    experience: "15",
    patients: "10,000",
    phone: "+201144045412",
    emergencyPhone: "0402596012",
    address: "شارع الملك كليان امبابي كفرالزيات الغربيه",
  };

  const quickActions = [
    {
      title: "حجز موعد",
      icon: "event",
      color: "#0097A7",
      action: () => console.log("Book appointment"),
    },
    {
      title: "اتصل بنا",
      icon: "phone",
      color: "#009688",
      action: () => Linking.openURL(`tel:${clinicInfo.phone}`),
    },
    {
      title: "واتساب",
      icon: "chat",
      color: "#25D366",
      action: () =>
        Linking.openURL(`https://wa.me/${clinicInfo.phone.replace("+", "")}`),
    },
    {
      title: "الطوارئ",
      icon: "emergency",
      color: "#F44336",
      action: () => Linking.openURL(`tel:${clinicInfo.emergencyPhone}`),
    },
  ];

  const services = [
    {
      title: "الكشف الطبي العام",
      icon: "medical-services",
      description: "فحص شامل وتشخيص دقيق",
      color: "#0097A7",
    },
    {
      title: "أمراض القلب",
      icon: "favorite",
      description: "تشخيص وعلاج أمراض القلب",
      color: "#E91E63",
    },
    {
      title: "أمراض الصدر",
      icon: "air",
      description: "علاج أمراض الجهاز التنفسي",
      color: "#2196F3",
    },
    {
      title: "الضغط والسكري",
      icon: "monitor-heart",
      description: "متابعة الأمراض المزمنة",
      color: "#FF9800",
    },
    {
      title: "الفحوصات الدورية",
      icon: "assessment",
      description: "برامج فحص شامل",
      color: "#4CAF50",
    },
    {
      title: "استشارات عن بعد",
      icon: "video-call",
      description: "استشارات طبية أونلاين",
      color: "#9C27B0",
    },
  ];

  const testimonials = [
    {
      name: "محمد أحمد",
      comment:
        "الدكتور أحمد من أفضل الأطباء، شرح وافي ودقيق للحالة وقدم خطة علاج ممتازة.",
      rating: 5,
    },
    {
      name: "سارة خالد",
      comment:
        "الرعاية المقدمة ممتازة والطبيب محترف جداً في التشخيص والمتابعة.",
      rating: 5,
    },
    {
      name: "علي محمود",
      comment: "العيادة نظيفة والمواعيد دقيقة، الدكتور متابع لكل التفاصيل.",
      rating: 4,
    },
  ];

  const whyChooseUs = [
    {
      title: "طوارئ 24/7",
      icon: "access-time",
      description: "خدمة طوارئ متاحة على مدار الساعة",
    },
    {
      title: "أطباء معتمدون",
      icon: "verified",
      description: "فريق من الأطباء الاستشاريين المعتمدين",
    },
    {
      title: "تكنولوجيا متطورة",
      icon: "biotech",
      description: "أجهزة طبية حديثة وتقنيات متقدمة",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i < rating ? "star" : "star-o"}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const renderTestimonial = ({ item, index }) => (
    <View style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <FontAwesome name="user-circle" size={40} color="#0097A7" />
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
        </View>
      </View>
      <Text style={styles.testimonialComment}>"{item.comment}"</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header/Hero Section */}
      <LinearGradient
        colors={["#0097A7", "#009688"]}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.welcomeText}>مرحباً بك في</Text>
          <Text style={styles.clinicName}>{clinicInfo.name}</Text>
          <Text style={styles.heroSubtitle}>صحتك هي أولويتنا</Text>

          <View style={styles.doctorInfo}>
            <Image source={clinicInfo.image} style={styles.doctorImageSmall} />
            <View>
              <Text style={styles.doctorName}>{clinicInfo.doctor}</Text>
              <Text style={styles.doctorSpecialty}>{clinicInfo.specialty}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>خدمات سريعة</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionCard, { borderTopColor: action.color }]}
              onPress={action.action}
            >
              <Icon name={action.icon} size={32} color={action.color} />
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <LinearGradient
          colors={["#0097A7", "#009688"]}
          style={styles.statsGradient}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{clinicInfo.experience}+</Text>
              <Text style={styles.statLabel}>سنوات الخبرة</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{clinicInfo.patients}+</Text>
              <Text style={styles.statLabel}>مريض راضٍ</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>خدمة طوارئ</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Services Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>خدماتنا الطبية</Text>
        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <TouchableOpacity key={index} style={styles.serviceCard}>
              <View
                style={[
                  styles.serviceIcon,
                  { backgroundColor: `${service.color}15` },
                ]}
              >
                <Icon name={service.icon} size={28} color={service.color} />
              </View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceDescription}>
                {service.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Why Choose Us */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>لماذا تختارنا؟</Text>
        {whyChooseUs.map((item, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Icon name={item.icon} size={24} color="#0097A7" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Testimonials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>آراء المرضى</Text>
        <FlatList
          ref={testimonialRef}
          data={testimonials}
          renderItem={renderTestimonial}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={width - 40}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (width - 40)
            );
            setCurrentTestimonial(index);
          }}
        />

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {testimonials.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === currentTestimonial ? "#0097A7" : "#B2EBF2",
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Contact Section */}
      <LinearGradient
        colors={["#0097A7", "#009688"]}
        style={styles.contactSection}
      >
        <Text style={styles.contactTitle}>تواصل معنا</Text>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Icon name="location-on" size={20} color="#fff" />
            <Text style={styles.contactText}>{clinicInfo.address}</Text>
          </View>
          <View style={styles.contactItem}>
            <Icon name="phone" size={20} color="#fff" />
            <Text style={styles.contactText}>{clinicInfo.phone}</Text>
          </View>
        </View>

        <View style={styles.contactButtons}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:${clinicInfo.phone}`)}
          >
            <Icon name="phone" size={20} color="#0097A7" />
            <Text style={styles.contactButtonText}>اتصل الآن</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: "#25D366" }]}
            onPress={() =>
              Linking.openURL(
                `https://wa.me/${clinicInfo.phone.replace("+", "")}`
              )
            }
          >
            <FontAwesome name="whatsapp" size={20} color="#fff" />
            <Text style={[styles.contactButtonText, { color: "#fff" }]}>
              واتساب
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#B2EBF2",
    marginBottom: 5,
  },
  clinicName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#B2EBF2",
    marginBottom: 20,
  },
  doctorInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 15,
  },
  doctorImageSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#B2EBF2",
  },
  quickActionsContainer: {
    padding: 20,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: (width - 60) / 2,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 4,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGradient: {
    borderRadius: 15,
    padding: 1,
  },
  statsContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    flexDirection: "row",
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0097A7",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#757575",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0097A7",
    marginBottom: 15,
    textAlign: "right",
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
  },
  testimonialCard: {
    width: width - 60,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginRight: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  testimonialInfo: {
    marginLeft: 15,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: "row",
  },
  testimonialComment: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "right",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  contactSection: {
    margin: 20,
    borderRadius: 15,
    padding: 25,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
  contactButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.48,
    justifyContent: "center",
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0097A7",
    marginLeft: 8,
  },
  footer: {
    height: 20,
  },
});

export default Home;
