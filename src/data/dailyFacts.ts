export interface DailyFact {
  id: number;
  fact: string;
  source: string;
  category: string;
  tip: string;
}

export const DAILY_FACTS: DailyFact[] = [
  {
    id: 1,
    fact: "Two quick inhales followed by an extended sigh instantly offloads carbon dioxide and resets vagal tone.",
    category: "Nervous System • Somatic Reset",
    source: "Autonomic Neuroscience",
    tip: "Try 3 physiological sighs right now to release shoulder tension."
  },
  {
    id: 2,
    fact: "Prolonged high cortisol reduces neuroplasticity in the hippocampus, making focus feel like an uphill battle.",
    category: "Endocrinology • Brain Health",
    source: "Neurobiology of Stress",
    tip: "A gentle 5-minute floor stretch lowers cortisol faster than intense scrolling."
  },
  {
    id: 3,
    fact: "During the luteal phase, resting metabolic rate increases by 2-10%, naturally requiring more calories and rest.",
    category: "Women's Cycle • Hormone Health",
    source: "Clinical Sports Medicine",
    tip: "Honor lower energy in this phase with restorative somatic movement rather than intense cardio."
  },
  {
    id: 4,
    fact: "Grounding barefoot or feeling the floor under your feet activates mechanoreceptors that downregulate sympathetic fight-or-flight.",
    category: "Somatic Grounding • Vagus Nerve",
    source: "Polyvagal Theory",
    tip: "Drop your weight into your heels and notice 3 contact points with the floor."
  },
  {
    id: 5,
    fact: "Unclenching your jaw sends an immediate neural signal to the amygdala that you are in a safe environment.",
    category: "Micro-Somatic • Muscle Release",
    source: "Cranial Nerve Studies",
    tip: "Separate your teeth, soften your tongue from the roof of your mouth, and inhale deeply."
  },
  {
    id: 6,
    fact: "Looking at a wide, panoramic horizon shifts your vision out of narrow spotlight focus and quiets anxiety circuits.",
    category: "Optic Reflex • Stress Relief",
    source: "Neuroscience of Vision",
    tip: "Gently soften your gaze and expand your peripheral vision to the edges of the room."
  },
  {
    id: 7,
    fact: "Shaking out your limbs after an intense moment allows your body to complete the biological stress cycle.",
    category: "Somatic Discharge • Nervous System",
    source: "Somatic Experiencing",
    tip: "Stand up and gently shake your wrists and calves for 15 seconds."
  }
];

export function getTodayFact(): DailyFact {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - startOfYear.getTime()) + ((startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  const factIndex = dayOfYear % DAILY_FACTS.length;
  return DAILY_FACTS[factIndex];
}
