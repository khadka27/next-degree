import React from "react";
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
  TextInput,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const THEME = {
  primary: "#1A8A99",
  secondary: "#004be3",
  textDark: "#111827",
  textGray: "#6B7280",
  bgLight: "#F8FAFF",
  orange: "#F59E0B",
  green: "#10B981",
  red: "#EF4444",
  white: "#FFFFFF",
};

const MATCHED_UNIVERSITIES = [
  {
    id: "1",
    name: "University College London",
    course: "MSc Computer Science",
    location: "LONDON, UK",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    rank: "#1 Global",
    duration: "1 Year",
    tuition: "$32,100 / yr",
    acceptanceRate: 75,
    recommended: true,
  },
  {
    id: "2",
    name: "Imperial College London",
    course: "MSc Artificial Intelligence",
    location: "LONDON, UK",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
    rank: "#3 Global",
    duration: "1 Year",
    tuition: "$35,500 / yr",
    acceptanceRate: 58,
    recommended: true,
  },
  {
    id: "3",
    name: "University of Oxford",
    course: "MSc Software Engineering",
    location: "OXFORD, UK",
    image: "https://images.unsplash.com/photo-1533667586627-9f5cb393304a?auto=format&fit=crop&q=80&w=800",
    rank: "#2 Global",
    duration: "1 Year",
    tuition: "$38,000 / yr",
    acceptanceRate: 25,
    recommended: true,
  },
];

const ProgressTracker = ({ percentage }: { percentage: number }) => {
  const getColor = (p: number) => {
    if (p >= 70) return THEME.green;
    if (p >= 50) return THEME.orange;
    return THEME.red;
  };

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%`, backgroundColor: getColor(percentage) }
          ]} 
        />
      </View>
      <Text style={[styles.progressText, { color: getColor(percentage) }]}>{percentage}%</Text>
    </View>
  );
};

export default function UniversitySelection() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Search and Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Find Universities That Match Your Profile</Text>
        <Text style={styles.subtitle}>
          Compare costs, admission chances, and visa success — all in one place
        </Text>

        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#94A3B8" />
          <TextInput 
            placeholder="Search universities, courses..." 
            style={styles.searchInput}
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="swap-vert" size={20} color={THEME.textDark} />
            <Text style={styles.actionButtonText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="options-outline" size={20} color={THEME.textDark} />
            <Text style={styles.actionButtonText}>Filters</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {MATCHED_UNIVERSITIES.map((uni) => (
          <TouchableOpacity 
            key={uni.id} 
            activeOpacity={0.95} 
            style={styles.card}
            onPress={() => router.push(`/university/${uni.id}`)}
          >
            {/* Banner Image */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: uni.image }} style={styles.cardImage} />
              <View style={styles.rankBadge}>
                <BlurView intensity={20} style={styles.rankBlur}>
                  <Ionicons name="trophy-outline" size={12} color="#004be3" />
                  <Text style={styles.rankText}>{uni.rank}</Text>
                </BlurView>
              </View>
            </View>

            {/* University Info */}
            <View style={styles.cardInfo}>
              <View style={styles.locationRow}>
                <View style={styles.locationLeft}>
                    <Ionicons name="location-outline" size={14} color="#64748B" />
                    <Text style={styles.locationText}>{uni.location}</Text>
                </View>
                {uni.recommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>Recommended</Text>
                  </View>
                )}
              </View>

              <View style={styles.nameRow}>
                <View style={styles.uniIconBox}>
                    <Ionicons name="school" size={20} color={THEME.secondary} />
                </View>
                <View style={styles.nameTexts}>
                    <Text style={styles.uniName}>{uni.name}</Text>
                    <Text style={styles.courseName}>{uni.course}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                    <Feather name="calendar" size={14} color="#64748B" />
                    <View style={styles.detailTextWrapper}>
                        <Text style={styles.detailLabel}>Duration</Text>
                        <Text style={styles.detailValue}>{uni.duration}</Text>
                    </View>
                </View>
                <View style={styles.detailItem}>
                    <Feather name="briefcase" size={14} color="#64748B" />
                    <View style={styles.detailTextWrapper}>
                        <Text style={styles.detailLabel}>Tuition</Text>
                        <Text style={styles.detailValue}>{uni.tuition}</Text>
                    </View>
                </View>
              </View>

              <View style={styles.acceptanceRow}>
                <View style={styles.acceptanceLabelBox}>
                    <Ionicons name="checkmark-done" size={14} color="#64748B" />
                    <Text style={styles.acceptanceLabel}>Acceptance Rate</Text>
                </View>
                <ProgressTracker percentage={uni.acceptanceRate} />
              </View>

              <TouchableOpacity 
                style={styles.selectButton}
                onPress={() => router.push("/(tabs)/explore")}
              >
                <Text style={styles.selectButtonText}>Select University</Text>
                <Feather name="arrow-right" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: THEME.white,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: THEME.textDark,
    lineHeight: 32,
    marginBottom: 8,
    marginTop: 30,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: "500",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: THEME.textDark,
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    height: 50,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textDark,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: THEME.white,
    borderRadius: 32,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  imageContainer: {
    height: 180,
    width: "100%",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  rankBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  rankBlur: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    gap: 4,
  },
  rankText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#004be3",
  },
  cardInfo: {
    padding: 24,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  locationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  recommendedBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#F97316",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  uniIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  nameTexts: {
    flex: 1,
  },
  uniName: {
    fontSize: 19,
    fontWeight: "800",
    color: THEME.textDark,
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366F1",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "48%",
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.textDark,
  },
  acceptanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  acceptanceLabelBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  acceptanceLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 0.8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    fontWeight: "900",
    width: 32,
    textAlign: "right",
  },
  selectButton: {
    backgroundColor: "#004be3", // Standard Academic Blue from Design MD
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#004be3",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  selectButtonText: {
    color: THEME.white,
    fontSize: 16,
    fontWeight: "800",
  },
});
