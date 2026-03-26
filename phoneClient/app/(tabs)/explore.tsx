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
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const THEME = {
  primary: "#238B9B", // Teal from the button/search
  textDark: "#111827",
  textGray: "#6B7280",
  bgLight: "#FFFFFF",
  orange: "#F59E0B",
  blue: "#4D7EF1",
  heroBg: "#FDF5ED", // Light beige/cream
};

const DESTINATIONS = [
  { name: "India", flag: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" },
  { name: "Korea", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Flag_of_South_Korea.svg/1200px-Flag_of_South_Korea.svg.png" },
  { name: "Australia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Australia.svg/1200px-Flag_of_Australia.svg.png" },
  { name: "Canada", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Canada.svg/1200px-Flag_of_Canada.svg.png" },
];

const DEGREES = ["Bachelor's", "Master's", "PHD", "Diploma"];

const UNIVERSITIES = [
  {
    id: "1",
    title: "University of Melbourne",
    location: "Melbourne, Australia",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    title: "University of Melbourne",
    location: "Melbourne, Australia",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    title: "University of Melbourne",
    location: "Melbourne, Australia",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
  },
];

export default function ExploreTab() {
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={() => router.push(("/category/" + title) as any)}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.locationLabel}>location</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={THEME.orange} />
            <Text style={styles.locationText}>New York, USA</Text>
            <Feather name="chevron-down" size={16} color={THEME.textDark} style={{ marginLeft: 4 }} />
          </View>
        </View>
        <TouchableOpacity>
          <Image 
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color={"#9CA3AF"} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search university or courses"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="sliders" size={20} color={THEME.bgLight} />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Find Your Ideal University</Text>
            <Text style={styles.heroSubtitle}>
              Explore universities worldwide and discover programs that match your goal and budget.
            </Text>
            <TouchableOpacity style={styles.heroButton} onPress={() => router.push("/search")}>
              <Text style={styles.heroButtonText}>Start Exploring</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroImageContainer}>
            <Image
              source={{ uri: "https://png.pngtree.com/png-vector/20231109/ourmid/pngtree-global-education-and-online-learning-concept-png-image_10522191.png" }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Popular Destinations */}
        <SectionHeader title="Popular Destinations" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {DESTINATIONS.map((dest, i) => (
            <TouchableOpacity key={i} style={styles.destinationItem} onPress={() => router.push(("/category/" + dest.name) as any)}>
              <View style={styles.destinationIconWrap}>
                 <Image source={{ uri: dest.flag }} style={styles.destinationImage} />
              </View>
              <Text style={styles.destinationText}>{dest.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended For You */}
        <SectionHeader title="Recommended For You" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {UNIVERSITIES.map((u) => (
            <TouchableOpacity key={u.id} style={styles.cardContainerHorizontal} activeOpacity={0.9} onPress={() => router.push(("/university/" + u.id) as any)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: u.image }} style={styles.cardImage} />
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {u.title}
              </Text>
              <View style={styles.cardLocationBox}>
                <Ionicons name="location" size={14} color={THEME.orange} />
                <Text style={styles.cardLocationText} numberOfLines={1}>
                  {u.location}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Browse by Degree */}
        <SectionHeader title="Browse by Degree" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {DEGREES.map((degree) => (
            <TouchableOpacity key={degree} style={styles.degreeItem} onPress={() => router.push(("/category/" + degree) as any)}>
              <View style={styles.degreeIconWrap}>
                <MaterialCommunityIcons name="certificate" size={32} color={THEME.bgLight} />
              </View>
              <Text style={styles.degreeText}>{degree}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Fields */}
        <SectionHeader title="Trending Fields" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {/* Mocked short pills for Trending Fields as implied by missing content in screenshot */}
          {["Computer Science", "Business Admin", "Medicine", "AI & Data"].map((field, i) => (
            <TouchableOpacity key={i} style={styles.trendingPill} onPress={() => router.push(("/category/" + field) as any)}>
              <Text style={styles.trendingPillText}>{field}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Top Ranked Universities */}
        <SectionHeader title="Top Ranked Universities" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.horizontalList, { paddingBottom: 24 }]}>
          {UNIVERSITIES.map((u) => (
            <TouchableOpacity key={`top-${u.id}`} style={styles.cardContainerHorizontal} activeOpacity={0.9} onPress={() => router.push(("/university/" + u.id) as any)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: u.image }} style={styles.cardImage} />
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {u.title}
              </Text>
              <View style={styles.cardLocationBox}>
                <Ionicons name="location" size={14} color={THEME.orange} />
                <Text style={styles.cardLocationText} numberOfLines={1}>
                  {u.location}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bgLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 64 : 44, // Generous padding 
    paddingBottom: 16,
    backgroundColor: THEME.bgLight,
  },
  headerLeft: {
    flexDirection: "column",
  },
  locationLabel: {
    fontSize: 12,
    color: THEME.textDark,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 15,
    fontWeight: "bold",
    color: THEME.textDark,
    marginLeft: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: THEME.textDark,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  heroBanner: {
    marginHorizontal: 24,
    backgroundColor: THEME.heroBg,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    flexDirection: "row",
    position: "relative",
    overflow: "hidden", // In case illustrations bleed
  },
  heroContent: {
    flex: 1,
    paddingRight: 40,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  heroSubtitle: {
    fontSize: 11,
    color: THEME.textDark,
    lineHeight: 16,
    marginBottom: 20,
    opacity: 0.8,
  },
  heroButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: THEME.bgLight,
    fontWeight: "bold",
    fontSize: 12,
  },
  heroImageContainer: {
    position: "absolute",
    right: -20,
    bottom: -15,
    width: 140,
    height: 140,
    zIndex: 1,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  seeAllText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: "500",
  },
  horizontalList: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  destinationItem: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  destinationIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.bgLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden", // Keep image inside circle
  },
  destinationImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  destinationText: {
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: "500",
  },
  degreeItem: {
    alignItems: "center",
    marginHorizontal: 12,
  },
  degreeIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#111827", // Dark badge style from mock
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  degreeText: {
    fontSize: 13,
    color: THEME.textDark,
    fontWeight: "500",
  },
  trendingPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    marginHorizontal: 6,
  },
  trendingPillText: {
    color: THEME.textDark,
    fontWeight: "500",
    fontSize: 13,
  },
  cardContainerHorizontal: {
    width: 170, // Horizontal scrolling card width
    marginHorizontal: 8,
  },
  imageContainer: {
    width: "100%",
    height: 110,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#F3F4F6",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: THEME.textDark,
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  cardLocationBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  cardLocationText: {
    fontSize: 11,
    color: THEME.textGray,
    marginLeft: 4,
  },
});
