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
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const THEME = {
  primary: "#1A8A99",
  textDark: "#111827",
  textGray: "#6B7280",
  bgLight: "#FFFFFF",
  orange: "#F59E0B",
  blue: "#4D7EF1",
  green: "#10B981",
};

// Dummy data for demonstration since we are using dynamic routes
const UNIVERSITIES: Record<string, any> = {
  "1": {
    title: "University of Melbourne",
    location: "Melbourne, Australia",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
    ranking: "#33",
    acceptance: "42%",
    tuition: "$35k/yr",
    description: "The University of Melbourne is a public research university located in Melbourne, Australia. Founded in 1853, it is Australia's second oldest university and the oldest in Victoria. Known for its lush campus and exceptional educational parameters.",
    courses: ["Computer Science", "Business Administration", "Engineering", "Arts"],
  },
  "2": {
    title: "University of Toronto",
    location: "Toronto, Canada",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
    ranking: "#18",
    acceptance: "43%",
    tuition: "$42k/yr",
    description: "The University of Toronto is a globally top-ranked public research university in Toronto, Ontario, Canada on the grounds that surround Queen's Park. It offers world-class innovation and learning programs.",
    courses: ["Artificial Intelligence", "Life Sciences", "Economics", "Law"],
  },
};

export default function UniversityDetails() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("Overview");
  
  // Default to Melbourne if ID not found just for preview purposes
  const details = UNIVERSITIES[id as string] || UNIVERSITIES["1"];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Scrollable Content */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: details.image }} style={styles.heroImage} />
          
          {/* Header Controls (Overlay) */}
          <View style={styles.headerOverlay}>
            <View style={styles.headerSafePadding} />
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                <Feather name="chevron-left" size={24} color={THEME.textDark} />
              </TouchableOpacity>
              <View style={styles.headerRightActions}>
                 <TouchableOpacity style={[styles.iconButton, { marginRight: 12 }]}>
                   <Feather name="share-2" size={20} color={THEME.textDark} />
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.iconButton}>
                   <Feather name="bookmark" size={20} color={THEME.textDark} />
                 </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Content Body */}
        <View style={styles.bodyContainer}>
          <Text style={styles.title}>{details.title}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={THEME.orange} />
            <Text style={styles.locationText}>{details.location}</Text>
          </View>

          {/* Key Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
               <Feather name="award" size={24} color={THEME.primary} style={styles.statIcon} />
               <Text style={styles.statValue}>{details.ranking}</Text>
               <Text style={styles.statLabel}>Global Rank</Text>
            </View>
            <View style={styles.statBox}>
               <Feather name="bar-chart" size={24} color={THEME.primary} style={styles.statIcon} />
               <Text style={styles.statValue}>{details.acceptance}</Text>
               <Text style={styles.statLabel}>Acceptance</Text>
            </View>
            <View style={styles.statBox}>
               <Feather name="dollar-sign" size={24} color={THEME.primary} style={styles.statIcon} />
               <Text style={styles.statValue}>{details.tuition}</Text>
               <Text style={styles.statLabel}>P.A Tuition</Text>
            </View>
          </View>

          {/* Content Tabs */}
          <View style={styles.tabsRow}>
            {['Overview', 'Courses', 'Reviews'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Dynamic Content */}
          <View style={styles.tabContent}>
            {activeTab === 'Overview' && (
              <View>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.descriptionText}>{details.description}</Text>
              </View>
            )}

            {activeTab === 'Courses' && (
              <View>
                <Text style={styles.sectionTitle}>Popular Programs</Text>
                {details.courses.map((course: string, idx: number) => (
                  <View key={idx} style={styles.courseItem}>
                    <View style={styles.courseIconBox}>
                      <Ionicons name="school-outline" size={20} color={THEME.primary} />
                    </View>
                    <Text style={styles.courseText}>{course}</Text>
                    <Feather name="chevron-right" size={18} color={THEME.textGray} />
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'Reviews' && (
              <View style={styles.reviewStateWrapper}>
                 <Text style={styles.descriptionText}>No reviews available yet.</Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bgLight,
  },
  scrollContent: {
    flex: 1,
  },
  heroContainer: {
    width: width,
    height: 320,
    backgroundColor: "#E5E7EB",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  headerSafePadding: {
    height: Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRightActions: {
    flexDirection: "row",
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: THEME.bgLight,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 100, // accommodate sticky button
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: THEME.textDark,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  locationText: {
    fontSize: 14,
    color: THEME.textGray,
    marginLeft: 6,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: THEME.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: THEME.textGray,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  tabsRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: THEME.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: THEME.textGray,
  },
  tabTextActive: {
    color: THEME.primary,
    fontWeight: "bold",
  },
  tabContent: {
    minHeight: 200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.textDark,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: THEME.textGray,
  },
  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  courseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0FDFA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  courseText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: THEME.textDark,
  },
  reviewStateWrapper: {
    paddingVertical: 32,
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: THEME.bgLight,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  applyButton: {
    backgroundColor: THEME.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: THEME.bgLight,
  },
});
