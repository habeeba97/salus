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
  const [loading, setLoading] = useState(false);

  const sendResponse = async (userText: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: "Just now",
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
      timestamp: "Just now",
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
      <StatusBar barStyle="light-content" backgroundColor="#090A10" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <AppText style={styles.backText}>‹ Back</AppText>
          </Pressable>
          <View style={styles.titleContainer}>
            <AppText style={styles.headerTitle}>Bubbi AI Coach</AppText>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <AppText style={styles.statusText}>
                {loading ? "Bubbi is thinking..." : "Present & Listening"}
              </AppText>
            </View>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.chipsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={PROMPT_CHIPS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={styles.chip}
                disabled={loading}
                onPress={() => sendResponse(item)}
              >
                <AppText style={styles.chipText}>{item}</AppText>
              </Pressable>
            )}
            contentContainerStyle={styles.chipsList}
          />
        </View>

        <FlatList
          inverted
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
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
                  <AppText
                    style={[
                      styles.bubbleText,
                      isUser ? styles.userBubbleText : styles.bubbiBubbleText,
                    ]}
                  >
                    {item.text}
                  </AppText>
                  <AppText style={styles.timestamp}>{item.timestamp}</AppText>
                </View>
              </View>
            );
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Ask Bubbi anything..."
              placeholderTextColor="#64748B"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!loading}
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
    backgroundColor: "#090A10",
  },
  container: {
    flex: 1,
    backgroundColor: "#090A10",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2235",
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backText: {
    color: "#60A5FA",
    fontSize: 16,
  },
  titleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 6,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  chipsContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#151926",
  },
  chipsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    backgroundColor: "#151926",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#252B42",
  },
  chipText: {
    color: "#CBD5E1",
    fontSize: 13,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#2563EB",
    borderBottomRightRadius: 4,
  },
  bubbiBubble: {
    backgroundColor: "#151926",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#22293F",
  },
  userBubbleText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },
  bubbiBubbleText: {
    color: "#E2E8F0",
    fontSize: 15,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    color: "#94A3B8",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1E2235",
    backgroundColor: "#0D0F18",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#151926",
    color: "#F8FAFC",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#252B42",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#1E293B",
    opacity: 0.6,
  },
  sendBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
