import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const THEME = {
  primary: "#1A8A99",
  textDark: "#111827",
  textGray: "#6B7280",
  bgLight: "#FFFFFF",
};

export default function SearchTab() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitleLarge}>Search</Text>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color={THEME.textGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search universities, courses..."
            placeholderTextColor={THEME.textGray}
          />
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.categoryGrid}>
          {["Engineering", "Business", "Computer Science", "Medicine", "Arts & Design", "Law"].map(
            (cat, i) => (
              <TouchableOpacity key={i} style={styles.categoryCard} activeOpacity={0.8}>
                <Text style={styles.categoryText}>{cat}</Text>
              </TouchableOpacity>
            )
          )}
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
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: THEME.textDark,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME.textDark,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  categoryText: {
    fontWeight: "600",
    color: THEME.primary,
  },
});
