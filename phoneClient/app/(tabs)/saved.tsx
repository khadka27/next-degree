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
  Platform,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const THEME = {
  primary: "#1A8A99",
  textDark: "#111827",
  textGray: "#6B7280",
  bgLight: "#FFFFFF",
  orange: "#F59E0B",
  blue: "#4D7EF1",
};

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
];

export default function SavedTab() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitleLarge}>Saved</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {UNIVERSITIES.map((item) => (
            <TouchableOpacity key={item.id} style={styles.cardContainer} activeOpacity={0.9}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <TouchableOpacity style={styles.bookmarkButton}>
                  <Feather name="bookmark" size={16} color={THEME.blue} />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={14} color={THEME.orange} />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bgLight,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 8,
    backgroundColor: THEME.bgLight,
  },
  headerTitleLarge: {
    fontSize: 32,
    fontWeight: "bold",
    color: THEME.textDark,
  },
  scrollContent: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  cardContainer: {
    width: (width - 48 - 16) / 2,
    marginBottom: 24,
  },
  imageContainer: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bookmarkButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: THEME.textDark,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 12,
    color: THEME.textGray,
    marginLeft: 4,
  },
});
