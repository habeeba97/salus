import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { AppText } from "./AppText";
import { INDIAN_RECIPES, IndianRecipe } from "../data/indianRecipes";
import { RecipeModal } from "./RecipeModal";

export function IndianNourishSection() {
  const [selectedRecipe, setSelectedRecipe] = useState<IndianRecipe | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View>
          <AppText style={styles.subheading}>ANCIENT INDIAN NOURISHMENT</AppText>
          <AppText style={styles.heading}>Healing Indian Kitchen 🍲</AppText>
        </View>
        <View style={styles.tagBadge}>
          <AppText style={styles.tagText}>Pan-India</AppText>
        </View>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={INDIAN_RECIPES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardsList}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.recipeCard,
              pressed && styles.recipeCardPressed,
            ]}
            onPress={() => setSelectedRecipe(item)}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.emojiCircle}>
                <AppText style={styles.cardEmoji}>{item.emoji}</AppText>
              </View>
              <View style={styles.timeTag}>
                <AppText style={styles.timeText}>{item.time}</AppText>
              </View>
            </View>

            <View style={styles.cardMiddle}>
              <AppText style={styles.regionName}>{item.region}</AppText>
              <AppText style={styles.recipeTitle} numberOfLines={2}>
                {item.name}
              </AppText>
              <AppText style={styles.badgeLabel} numberOfLines={1}>
                {item.badge}
              </AppText>
            </View>

            <View style={styles.cardFooter}>
              <AppText style={styles.viewRecipeBtn}>View Recipe & Ritual →</AppText>
            </View>
          </Pressable>
        )}
      />

      {/* Pop-up Recipe Sheet */}
      <RecipeModal
        recipe={selectedRecipe}
        visible={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 19,
    fontWeight: "800",
    color: "#F8FAFC",
    marginTop: 2,
  },
  tagBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  tagText: {
    color: "#34D399",
    fontSize: 11,
    fontWeight: "700",
  },
  cardsList: {
    paddingHorizontal: 18,
    gap: 14,
  },
  recipeCard: {
    width: 220,
    backgroundColor: "#131826",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#20283E",
    justifyContent: "space-between",
  },
  recipeCardPressed: {
    transform: [{ scale: 0.98 }],
    borderColor: "#3B82F6",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: {
    fontSize: 24,
  },
  timeTag: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 10.5,
    color: "#94A3B8",
    fontWeight: "600",
  },
  cardMiddle: {
    marginVertical: 12,
  },
  regionName: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  recipeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 3,
    lineHeight: 20,
  },
  badgeLabel: {
    fontSize: 11,
    color: "#FBBF24",
    marginTop: 6,
    fontWeight: "600",
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#1B2236",
    paddingTop: 10,
  },
  viewRecipeBtn: {
    fontSize: 11.5,
    color: "#60A5FA",
    fontWeight: "700",
  },
});
