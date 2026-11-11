import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import { AppText } from "./AppText";
import { IndianRecipe } from "../data/indianRecipes";

const { height } = Dimensions.get("window");

interface RecipeModalProps {
  recipe: IndianRecipe | null;
  visible: boolean;
  onClose: () => void;
}

export function RecipeModal({ recipe, visible, onClose }: RecipeModalProps) {
  if (!recipe) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdropPress} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Top handle bar */}
          <View style={styles.dragBar} />

          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.iconCircle}>
              <AppText style={styles.recipeEmoji}>{recipe.emoji}</AppText>
            </View>
            <View style={styles.headerTitleWrap}>
              <AppText style={styles.recipeRegion}>{recipe.region}</AppText>
              <AppText style={styles.recipeName}>{recipe.name}</AppText>
              <View style={styles.badgeRow}>
                <View style={styles.badgePill}>
                  <AppText style={styles.badgePillText}>{recipe.badge}</AppText>
                </View>
                <AppText style={styles.metaText}>⏱ {recipe.time} • 🔥 {recipe.calories}</AppText>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
              <AppText style={styles.closeBtnText}>✕</AppText>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Somatic / Biological Healing Benefit */}
            <View style={styles.benefitCard}>
              <AppText style={styles.sectionHeader}>🌿 HEALING IMPACT</AppText>
              <AppText style={styles.benefitText}>{recipe.benefit}</AppText>
            </View>

            {/* Mindful Eating Anchor */}
            <View style={styles.somaticAnchorCard}>
              <AppText style={styles.somaticLabel}>✨ MINDFUL SENSORY MOMENT</AppText>
              <AppText style={styles.somaticText}>{recipe.somaticTip}</AppText>
            </View>

            {/* Wholesome Ingredients */}
            <View style={styles.sectionBox}>
              <AppText style={styles.sectionHeader}>🛒 WHOLESOME INGREDIENTS</AppText>
              {recipe.ingredients.map((item, idx) => (
                <View key={idx} style={styles.ingredientRow}>
                  <View style={styles.bulletDot} />
                  <AppText style={styles.ingredientText}>{item}</AppText>
                </View>
              ))}
            </View>

            {/* Preparation Steps */}
            <View style={styles.sectionBox}>
              <AppText style={styles.sectionHeader}>👩‍🍳 PREPARATION STEPS</AppText>
              {recipe.instructions.map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <View style={styles.stepNumberBadge}>
                    <AppText style={styles.stepNumberText}>{idx + 1}</AppText>
                  </View>
                  <AppText style={styles.stepText}>{step}</AppText>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Bottom Action Button */}
          <View style={styles.bottomBar}>
            <Pressable style={styles.saveBtn} onPress={onClose}>
              <AppText style={styles.saveBtnText}>Done • Nourish My Body</AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  backdropPress: {
    flex: 1,
  },
  sheetContainer: {
    height: height * 0.86,
    backgroundColor: "#111422",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "#252E48",
    paddingTop: 10,
  },
  dragBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#334155",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1B2236",
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  recipeEmoji: {
    fontSize: 26,
  },
  headerTitleWrap: {
    flex: 1,
  },
  recipeRegion: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F8FAFC",
    marginTop: 2,
    lineHeight: 24,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  badgePill: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  badgePillText: {
    color: "#34D399",
    fontSize: 10.5,
    fontWeight: "700",
  },
  metaText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1E263B",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  benefitCard: {
    backgroundColor: "#182033",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#252F4A",
  },
  sectionHeader: {
    color: "#FBBF24",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },
  benefitText: {
    color: "#E2E8F0",
    fontSize: 13.5,
    lineHeight: 21,
  },
  somaticAnchorCard: {
    backgroundColor: "rgba(99, 102, 241, 0.12)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  somaticLabel: {
    color: "#A5B4FC",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },
  somaticText: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 19,
    fontStyle: "italic",
  },
  sectionBox: {
    backgroundColor: "#151B2C",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E273F",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  ingredientText: {
    color: "#CBD5E1",
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 6,
    gap: 12,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepNumberText: {
    color: "#1E1B4B",
    fontSize: 11,
    fontWeight: "900",
  },
  stepText: {
    color: "#E2E8F0",
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#1B2236",
    backgroundColor: "#0D101C",
  },
  saveBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#022C22",
    fontSize: 14,
    fontWeight: "800",
  },
});
