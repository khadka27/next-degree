import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  ScrollView,
  StatusBar,
  ImageBackground,
} from "react-native";
import { Stack, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#33BFFF",
  teal: "rgb(41, 142, 168)",
  textDark: "#0F172A",
  textGray: "#64748B",
  white: "#FFFFFF",
  glassBase: "rgba(255, 255, 255, 0.8)",
  peach: "rgba(250, 199, 154, 0.9)", // Warm tone from design
};

export default function FinancialSelection() {
  const [budget, setBudget] = useState(12000);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ImageBackground
        source={require("../../assets/images/onboarding-bg-4k.png")}
        style={styles.background}
        imageStyle={{ top: -140, height: height + 140 }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={28} color={COLORS.textDark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Financial</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.questionText}>What is your estimated budget per year?</Text>

            {/* Finance Illustration Banner */}
            <View style={styles.bannerContainer}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1579621970588-a3528b18868f?auto=format&fit=crop&q=80&w=800" }} 
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>

            {/* Slider Section */}
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={50000}
                step={1000}
                value={budget}
                onValueChange={setBudget}
                minimumTrackTintColor={COLORS.teal}
                maximumTrackTintColor="rgba(0, 0, 0, 0.1)"
                thumbTintColor={COLORS.teal}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.labelText}>$0</Text>
                <Text style={styles.labelText}>$50,000</Text>
              </View>
            </View>

            {/* Selected Value Card */}
            <View style={styles.selectedCard}>
              <Image 
                source={require("../../assets/images/onboarding-bg-4k.png")}
                style={[styles.glassImageBackground, { top: -600 }]}
                blurRadius={30}
              />
              <View style={[styles.glassOverlay, { backgroundColor: COLORS.peach }]} />
              <Text style={styles.selectedValueText}>
                ${budget.toLocaleString()} per year
              </Text>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.continueButton, { marginTop: 40 }]}
              onPress={() => router.push("/explore")}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  safeArea: {
    flex: 1,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  questionText: {
    fontSize: 16,
    color: COLORS.textGray,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 32,
    fontWeight: "500",
  },
  bannerContainer: {
    width: "100%",
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  sliderContainer: {
    marginBottom: 40,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: -5,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  selectedCard: {
    backgroundColor: "transparent",
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  glassImageBackground: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    top: -460,
    left: -20,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  selectedValueText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    zIndex: 1,
  },
  continueButton: {
    backgroundColor: COLORS.teal,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.teal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
