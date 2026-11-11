export interface IndianRecipe {
  id: string;
  name: string;
  region: string;
  badge: string;
  time: string;
  calories: string;
  benefit: string;
  emoji: string;
  ingredients: string[];
  instructions: string[];
  somaticTip: string;
}

export const INDIAN_RECIPES: IndianRecipe[] = [
  {
    id: "moringa-rasam",
    name: "Moringa Drumstick Rasam",
    region: "South India (Tamil Nadu / Kerala)",
    badge: "Vagus Nerve • Anti-Inflammatory",
    time: "15 mins",
    calories: "90 kcal",
    emoji: "🥣",
    benefit: "Rich in bioactive polyphenols and bioavailable iron. Drumstick pods stimulate digestive agni while warm black pepper and cumin support vagal regulation.",
    ingredients: [
      "2 fresh drumsticks (cut into 2-inch pieces)",
      "2 ripe tomatoes (crushed)",
      "1/2 tsp crushed black pepper & cumin seeds",
      "1/4 tsp turmeric & pinch of hing (asafoetida)",
      "Fresh coriander & curry leaves",
      "1 tsp pure cold-pressed sesame oil or ghee"
    ],
    instructions: [
      "Boil drumstick pieces in 2 cups of water with turmeric and salt until tender.",
      "In a small pan, temper mustard seeds, curry leaves, hing, and crushed pepper-cumin.",
      "Add crushed tomatoes and sauté until soft, then pour into the simmering drumstick broth.",
      "Simmer for 3 minutes, garnish with fresh coriander, and serve warm in a cup."
    ],
    somaticTip: "Inhale the warm herbal aroma before your first sip to trigger parasympathetic salivation."
  },
  {
    id: "moong-khichdi",
    name: "Moong Dal & Palak Khichdi",
    region: "West India (Gujarat / Maharashtra)",
    badge: "Gut Lining Reset • Tridoshic",
    time: "20 mins",
    calories: "210 kcal",
    emoji: "🍲",
    benefit: "The ultimate Ayurvedic gut reset. Yellow split moong provides easily assimilable plant amino acids, while spinach supplies folate for cellular repair.",
    ingredients: [
      "1/2 cup yellow split moong dal (soaked 20 mins)",
      "1/2 cup whole grain rice or quinoa",
      "1 cup finely chopped fresh spinach (palak)",
      "1/2 tsp grated ginger & 1/4 tsp turmeric",
      "1 tsp A2 cow ghee",
      "Pinch of rock salt (sendha namak) & roasted jeera"
    ],
    instructions: [
      "Rinse soaked moong dal and grains thoroughly.",
      "In a pot, warm ghee and add cumin seeds, ginger, and turmeric.",
      "Add dal, grains, and 3 cups of water; pressure cook or simmer until porridge-like.",
      "Fold in fresh chopped spinach in the last 3 minutes so it retains chlorophyll and enzymes."
    ],
    somaticTip: "Eat slowly with your hands or spoon, placing both feet firmly on the floor to remain grounded."
  },
  {
    id: "sattu-cooler",
    name: "Roasted Sattu Chaas Cooler",
    region: "North & East India (Bihar / UP / Bengal)",
    badge: "Cooling • Sustained Energy",
    time: "5 mins",
    calories: "140 kcal",
    emoji: "🥛",
    benefit: "A low-glycemic, gut-cooling superfood packed with insoluble fiber, magnesium, and plant protein that prevents energy crashes during demanding days.",
    ingredients: [
      "3 tbsp roasted Bengal gram flour (chana sattu)",
      "1 cup fresh light buttermilk or room-temp water",
      "1/2 tsp roasted cumin powder (bhuna jeera)",
      "1/4 tsp black salt (kala namak)",
      "Fresh crushed mint leaves & squeeze of lemon"
    ],
    instructions: [
      "Add roasted sattu flour to a tall glass.",
      "Pour a splash of buttermilk and whisk into a smooth, lump-free paste.",
      "Top with remaining buttermilk, roasted cumin, black salt, and lemon juice.",
      "Stir vigorously, garnish with mint, and enjoy fresh."
    ],
    somaticTip: "Take 3 conscious sips, pausing between each to feel the cooling sensation travel downward."
  },
  {
    id: "ragi-ambali",
    name: "Deccan Ragi Ambali Porridge",
    region: "Deccan / Central India (Telangana / Karnataka)",
    badge: "Hormone Harmony • High Calcium",
    time: "12 mins",
    calories: "130 kcal",
    emoji: "🥣",
    benefit: "Finger millet provides 344mg calcium per 100g along with complex resistant starch. Ideal during the luteal phase for hormonal equilibrium and sustained stamina.",
    ingredients: [
      "2 tbsp pure sprouted ragi flour",
      "1.5 cups water",
      "1/2 cup fresh curd or probiotic whey",
      "1 small shallot / green chili (finely minced)",
      "Pinch of sea salt & curry leaves"
    ],
    instructions: [
      "Dissolve ragi flour in 1/2 cup cold water without lumps.",
      "Boil 1 cup water with salt and curry leaves, then slowly stir in the ragi slurry.",
      "Cook on low heat for 5-6 minutes until thick and glossy; let it cool to room temperature.",
      "Whisk in fresh curd, minced shallots, and serve as a soothing morning tonic."
    ],
    somaticTip: "Notice the earthy taste of the millet as an anchor for grounding busy morning thoughts."
  },
  {
    id: "kashmiri-kahwa",
    name: "Saffron & Almond Kahwa",
    region: "Kashmir & Himalayan Foothills",
    badge: "Nervous System Tonic • Calming",
    time: "10 mins",
    calories: "65 kcal",
    emoji: "☕",
    benefit: "Pure saffron contains safranal and crocin, which modulate serotonin receptors. Green tea catechins combined with crushed almonds soothe evening hyperarousal.",
    ingredients: [
      "1 tsp Kashmiri green tea leaves",
      "4-5 strands of pure saffron (kesar)",
      "1 green cardamom pod (lightly crushed)",
      "1 small piece of cinnamon stick",
      "4 blanched almonds (thinly slivered)",
      "1/2 tsp raw honey (added after cooling slightly)"
    ],
    instructions: [
      "Boil 1.5 cups of water with crushed cardamom, cinnamon, and saffron until aromatic.",
      "Turn off the heat, add green tea leaves, cover, and steep gently for 2 minutes.",
      "Strain into a delicate cup, drop slivered almonds into the bottom, and stir in honey."
    ],
    somaticTip: "Hold the warm cup with both palms, taking long exhales as the warmth softens tension in your fingers."
  }
];
