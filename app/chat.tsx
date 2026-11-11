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
  ActivityIndicator,
} from "react-native";
import { AppText } from "../src/components/AppText";
import { askSalusCompanion } from "../src/services/gemini";

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
    text: "Hello, I am Bubbi — your grounded wellness companion. Take a gentle breath. How is your body feeling right now?",
    timestamp: "Just now",
  },
];

const PROMPT_CHIPS = [
  "😮‍💨 Reset my nervous system",
  "🍃 Gentle somatic stretch",
  "⚡ Shift low energy",
  "🌸 Cycle & luteal support",
  "🧘‍♀️ 2-minute breathwork",
];

function FormattedMessageText({ text, isUser }: { text: string; isUser: boolean }) {
  const lines = text.split("\n");

  return (
    <View style={styles.formattedTextContainer}>
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <View key={lineIdx} style={{ height: 6 }} />;
        }

        const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
        const content = isBullet ? trimmed.slice(2) : line;

        // Parse inline **bold** markers
        const parts = content.split(/(\*\*[^*]+\*\*)/g);

        return (
          <View key={lineIdx} style={isBullet ? styles.bulletRow : styles.textRow}>
            {isBullet && <AppText style={styles.bulletDot}>•</AppText>}
            <AppText
              style={[
                styles.bubbleText,
                isUser ? styles.userBubbleText : styles.bubbiBubbleText,
              ]}
            >
              {parts.map((part, partIdx) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <AppText
                      key={partIdx}
                      style={[
                        styles.boldText,
                        isUser ? styles.userBubbleText : styles.bubbiBoldText,
                      ]}
                    >
                      {part.slice(2, -2)}
                    </AppText>
                  );
                }
                return part;
              })}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendResponse = async (userText: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: timeNow,
    };

    setMessages((prev) => [userMsg, ...prev]);
    setLoading(true);

    const history = messages
      .slice(0, 10)
      .reverse()
      .map((msg) => ({
        role: (msg.sender === "user" ? "user" : "model") as "user" | "model",
        text: msg.text,
      }));

    const reply = await askSalusCompanion(userText, history);

    const bubbiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: "bubbi",
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [bubbiMsg, ...prev]);
    setLoading(false);
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    sendResponse(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#07090E" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <AppText style={styles.backText}>‹</AppText>
          </Pressable>
          <View style={styles.titleContainer}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerAvatar}>
                <AppText style={styles.headerAvatarText}>🌿</AppText>
              </View>
              <View>
                <AppText style={styles.headerTitle}>Bubbi Companion</AppText>
                <View style={styles.statusRow}>
                  <View style={[styles.onlineDot, loading && styles.pulsingDot]} />
                  <AppText style={styles.statusText}>
                    {loading ? "Tuning in & reflecting..." : "Present & Listening"}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Suggestion Chips */}
        <View style={styles.chipsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={PROMPT_CHIPS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.chip,
                  pressed && styles.chipPressed,
                ]}
                disabled={loading}
                onPress={() => sendResponse(item)}
              >
                <AppText style={styles.chipText}>{item}</AppText>
              </Pressable>
            )}
            contentContainerStyle={styles.chipsList}
          />
        </View>

        {/* Chat Stream */}
        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          ListHeaderComponent={
            loading ? (
              <View style={[styles.bubbleWrapper, styles.bubbiWrapper]}>
                <View style={[styles.bubble, styles.bubbiBubble, styles.loadingBubble]}>
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#10B981" />
                    <AppText style={styles.loadingText}>Bubbi is formulating gentle guidance...</AppText>
                  </View>
                </View>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isUser = item.sender === "user";
            return (
              <View
                style={[
                  styles.bubbleWrapper,
                  isUser ? styles.userWrapper : styles.bubbiWrapper,
                ]}
              >
                {!isUser && (
                  <View style={styles.bubbiMiniBadge}>
                    <AppText style={styles.bubbiMiniBadgeText}>🌿</AppText>
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.bubbiBubble,
                  ]}
                >
                  <FormattedMessageText text={item.text} isUser={isUser} />
                  <AppText
                    style={[
                      styles.timestamp,
                      isUser ? styles.userTimestamp : styles.bubbiTimestamp,
                    ]}
                  >
                    {item.timestamp}
                  </AppText>
                </View>
              </View>
            );
          }}
        />

        {/* Input Bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Share how you're feeling..."
              placeholderTextColor="#64748B"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!loading}
              multiline={false}
            />
            <Pressable
              style={[
                styles.sendBtn,
                (!input.trim() || loading) && styles.sendBtnDisabled,
              ]}
              onPress={handleSend}
              disabled={!input.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <AppText style={styles.sendBtnText}>↑</AppText>
              )}
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
    backgroundColor: "#07090E",
  },
  container: {
    flex: 1,
    backgroundColor: "#07090E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#151A28",
    backgroundColor: "#0B0E17",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#131724",
  },
  backText: {
    color: "#94A3B8",
    fontSize: 24,
    lineHeight: 28,
  },
  titleContainer: {
    alignItems: "center",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
    letterSpacing: 0.2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 6,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  pulsingDot: {
    backgroundColor: "#38BDF8",
  },
  statusText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  chipsContainer: {
    paddingVertical: 10,
    backgroundColor: "#0A0D15",
    borderBottomWidth: 1,
    borderBottomColor: "#131724",
  },
  chipsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: "#121724",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1E263B",
  },
  chipPressed: {
    backgroundColor: "#1A2236",
    borderColor: "#334155",
  },
  chipText: {
    color: "#CBD5E1",
    fontSize: 12.5,
    fontWeight: "500",
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  bubbleWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  userWrapper: {
    justifyContent: "flex-end",
  },
  bubbiWrapper: {
    justifyContent: "flex-start",
  },
  bubbiMiniBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  bubbiMiniBadgeText: {
    fontSize: 12,
  },
  bubble: {
    maxWidth: "84%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: "#1D4ED8",
    borderBottomRightRadius: 4,
  },
  bubbiBubble: {
    backgroundColor: "#121724",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#1C2337",
  },
  loadingBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#94A3B8",
    fontSize: 13,
    fontStyle: "italic",
  },
  formattedTextContainer: {
    flexDirection: "column",
  },
  textRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 2,
    paddingLeft: 2,
  },
  bulletDot: {
    color: "#10B981",
    fontSize: 14,
    marginRight: 6,
    lineHeight: 22,
  },
  bubbleText: {
    fontSize: 14.5,
    lineHeight: 22,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  userBubbleText: {
    color: "#FFFFFF",
  },
  bubbiBubbleText: {
    color: "#E2E8F0",
  },
  boldText: {
    fontWeight: "700",
  },
  bubbiBoldText: {
    color: "#F8FAFC",
    fontWeight: "700",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  bubbiTimestamp: {
    color: "#64748B",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#151A28",
    backgroundColor: "#0B0E17",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#121724",
    color: "#F8FAFC",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 11,
    fontSize: 14.5,
    borderWidth: 1,
    borderColor: "#1E263B",
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#182033",
    opacity: 0.5,
  },
  sendBtnText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },
});
