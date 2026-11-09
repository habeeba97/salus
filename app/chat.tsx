import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { AppText } from "../src/components/AppText";

interface Message {
  id: string;
  sender: "user" | "bubbi";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "bubbi",
    text: "Hello! I am Bubbi, your wellness coach. How are you feeling physically and mentally right now?",
    timestamp: "Just now",
  },
];

const PROMPT_CHIPS = [
  "Feeling stressed 🌧️",
  "Need a gentle pause 🍃",
  "Trouble focusing 🎯",
  "Quick boost of energy ⚡",
];

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const sendResponse = (userText: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: "Just now",
    };

    let reply = "I hear you. Let us take a slow breath together. Remember, progress is not about rushing; it is about staying gentle with yourself.";
    const lower = userText.toLowerCase();

    if (lower.includes("stress") || lower.includes("anxious") || lower.includes("rain")) {
      reply = "When stress feels heavy, your nervous system is asking for safety. Try relaxing your shoulders and taking 3 long exhales.";
    } else if (lower.includes("pause") || lower.includes("tired")) {
      reply = "Rest is productive. Even sitting quietly with eyes closed for 60 seconds gives your brain a chance to recharge.";
    } else if (lower.includes("focus") || lower.includes("work")) {
      reply = "Break what you are doing into one single micro-step. Finish just that 5-minute task without checking notifications.";
    } else if (lower.includes("energy") || lower.includes("boost")) {
      reply = "Hydrate with a glass of cool water and stretch your spine upwards. Small movement creates instant vitality!";
    }

    const bubbiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bubbi",
      text: reply,
      timestamp: "Just now",
    };

    setMessages((prev) => [bubbiMsg, userMsg, ...prev]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    sendResponse(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090A10" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <AppText style={styles.backText}>‹ Back</AppText>
          </Pressable>
          <View style={styles.titleContainer}>
            <AppText style={styles.headerTitle}>Bubbi AI Coach</AppText>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <AppText style={styles.statusText}>Present & Listening</AppText>
            </View>
          </View>
        </View>

        {/* Quick Prompts */}
        <View style={styles.chipScroll}>
          {PROMPT_CHIPS.map((chip, idx) => (
            <Pressable
              key={idx}
              onPress={() => sendResponse(chip)}
              style={styles.chip}
            >
              <AppText style={styles.chipText}>{chip}</AppText>
            </Pressable>
          ))}
        </View>

        {/* Messages Feed */}
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isUser = item.sender === "user";
            return (
              <View
                style={[
                  styles.bubbleWrapper,
                  isUser ? styles.userWrapper : styles.bubbiWrapper,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.bubbiBubble,
                  ]}
                >
                  <AppText style={[styles.bubbleText, isUser && styles.userBubbleText]}>
                    {item.text}
                  </AppText>
                </View>
              </View>
            );
          }}
        />

        {/* Input Field */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Share how you are feeling..."
              placeholderTextColor="#64748B"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              style={styles.input}
            />
            <Pressable onPress={handleSend} style={styles.sendButton}>
              <AppText style={styles.sendText}>↑</AppText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090A10",
  },
  container: {
    flex: 1,
    backgroundColor: "#090A10",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2238",
  },
  backBtn: {
    paddingRight: 14,
    paddingVertical: 4,
  },
  backText: {
    fontSize: 20,
    color: "#818CF8",
    fontWeight: "700",
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  chipScroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#16192B",
  },
  chip: {
    backgroundColor: "#171A2E",
    borderWidth: 1,
    borderColor: "#2D3256",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 12,
    color: "#C7D2FE",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  bubbleWrapper: {
    width: "100%",
    flexDirection: "row",
  },
  userWrapper: {
    justifyContent: "flex-end",
  },
  bubbiWrapper: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    padding: 14,
    borderRadius: 18,
  },
  bubbiBubble: {
    backgroundColor: "#16192E",
    borderWidth: 1,
    borderColor: "#292E52",
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#4F46E5",
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#F1F5F9",
  },
  userBubbleText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1E2238",
    backgroundColor: "#0F111D",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#191C30",
    color: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2B3158",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  sendText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: -2,
  },
});
