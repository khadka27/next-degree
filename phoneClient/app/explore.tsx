import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Stack, Link } from "expo-router";
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#3366FF",
  secondary: "#0F172A",
  textGray: "#64748B",
  bgSubtle: "#F8FAFF",
  white: "#FFFFFF",
  accent: "#FF4D4D",
};

export default function ExploreScreen() {
  const [activeCountry, setActiveCountry] = useState("Canada");

  const countries = [
    { name: "Canada", flag: "🇨🇦" },
    { name: "USA", flag: "🇺🇸" },
    { name: "UK", flag: "🇬🇧" },
    { name: "Australia", flag: "🇦🇺" },
  ];

  const solutions = [
    { title: "GIC Program", icon: "briefcase", color: "#3366FF" },
    { title: "Foreign Exchange", icon: "dollar-sign", color: "#10B981" },
    { title: "Banking", icon: "credit-card", color: "#F59E0B" },
    { title: "Visa Services", icon: "file-text", color: "#EF4444" },
    { title: "Accommodations", icon: "home", color: "#6366F1" },
    { title: "Program Search", icon: "search", color: "#EC4899" },
    { title: "Applications", icon: "send", color: "#8B5CF6" },
    { title: "Language Tests", icon: "layers", color: "#06B6D4" },
  ];

  const universities = [
    {
      name: "University of Toronto",
      country: "Canada",
      location: "Toronto, CA",
      rank: "#1 Global",
      tuition: "$45k/yr",
      intake: "Sep '26",
      image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "UBC",
      country: "Canada",
      location: "Vancouver, CA",
      rank: "#3 Global",
      tuition: "$40k/yr",
      intake: "Sep '26",
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: "Explore", headerShown: true }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header (Simplified since Stack shows it) */}
        
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>YOUR GLOBAL FUTURE</Text>
          </View>
          <Text style={styles.heroTitle}>
            Your Path to {"\n"}
            <Text style={{ color: COLORS.primary }}>Studying Abroad</Text>
            {"\n"}Begins Here
          </Text>
          <Text style={styles.heroSubtitle}>
            Discover research programs, academic excellence, and global
            opportunities tailored for your specific career path.
          </Text>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <Feather name="arrow-right" size={20} color="white" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" }}
              style={styles.heroImage}
            />
          </View>
        </View>

        {/* Stats Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsStrip}
        >
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Feather name="globe" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statText}>160+ Countries</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Feather name="home" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statText}>1000+ Universities</Text>
          </View>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <Ionicons name="headset-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statText}>24/7 Support</Text>
          </View>
        </ScrollView>

        {/* Universities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Universities</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.universityList}
            snapToInterval={width * 0.85 + 20}
            decelerationRate="fast"
          >
            {universities.map((uni, index) => (
              <View key={index} style={styles.universityCard}>
                <Image source={{ uri: uni.image }} style={styles.uniImage} />
                <View style={styles.uniContent}>
                  <Text style={styles.uniName}>{uni.name}</Text>
                  <View style={styles.uniLocation}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textGray} />
                    <Text style={styles.uniLocationText}>{uni.location}</Text>
                  </View>
                  <TouchableOpacity style={styles.uniButton}>
                    <Text style={styles.uniButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  heroBadge: {
    backgroundColor: "rgba(51, 102, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: COLORS.secondary,
    lineHeight: 48,
    letterSpacing: -1,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textGray,
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: "90%",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 40,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  heroImageContainer: {
    position: "relative",
    width: "100%",
    height: 240,
    backgroundColor: COLORS.bgSubtle,
    borderRadius: 32,
    marginBottom: 40,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  statsStrip: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.bgSubtle,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(51, 102, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  statText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.secondary,
  },
  universityList: {
    gap: 20,
  },
  universityCard: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginRight: 20,
    borderWidth: 1,
    borderColor: COLORS.bgSubtle,
  },
  uniImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  uniContent: {
    padding: 20,
  },
  uniName: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.secondary,
    marginBottom: 4,
  },
  uniLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  uniLocationText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginLeft: 4,
  },
  uniButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  uniButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
