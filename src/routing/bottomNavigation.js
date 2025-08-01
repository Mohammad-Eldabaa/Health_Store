import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";
import Profile from "../profile";
import Booking from "../Booking";
import Home from "../home";
import NursingAppointments from "../nursing/Appointments";

export default function BottomNavigation() {
  const _renderIcon = (routeName, selectedTab) => {
    let icon = "";
    let color = selectedTab === routeName ? "#B2EBF2" : "#fff";

    switch (routeName) {
      case "Home":
        icon = "home";
        break;
      case "Booking":
        icon = "calendar";
        break;
      case "Profile":
        icon = "person";
        break;
      case "Nursing":
        icon = "medical";
        break;
    }

    return <Ionicons name={icon} size={25} color={color} />;
  };

  const renderTabBar = ({ routeName, selectedTab, navigate }) => {
    return (
      <TouchableOpacity
        onPress={() => navigate(routeName)}
        style={styles.tabbarItem}
      >
        {_renderIcon(routeName, selectedTab)}
      </TouchableOpacity>
    );
  };

  return (
    <CurvedBottomBar.Navigator
      type="DOWN"
      style={styles.bottomBar}
      shadowStyle={styles.shawdow}
      height={55}
      circleWidth={50}
      bgColor="#0097A7"
      initialRouteName="Home"
      borderTopLeftRight
      renderCircle={({ selectedTab, navigate }) => (
        <View style={styles.btnCircleUp}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigate("Home")}
          >
            <Ionicons
              name="home"
              color={selectedTab == "Home" ? "#fff" : "#fff"}
              size={25}
            />
          </TouchableOpacity>
        </View>
      )}
      tabBar={renderTabBar}
    >
      <CurvedBottomBar.Screen
        name="Home"
        position="CENTER"
        component={Home}
        options={{ headerShown: false }}
      />
      <CurvedBottomBar.Screen
        name="Profile"
        position="RIGHT"
        component={Profile}
        options={{ headerShown: false }}
      />
      <CurvedBottomBar.Screen
        name="Booking"
        position="LEFT"
        component={Booking}
        options={{ headerShown: false }}
      />
      <CurvedBottomBar.Screen
        name="Nursing"
        position="RIGHT"
        component={NursingAppointments}
        options={{ headerShown: false }}
      />
    </CurvedBottomBar.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0097A7",
    bottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  tabbarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shawdow: {
    shadowColor: "#DDDDDD",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});