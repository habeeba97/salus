import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafetyHelpButton } from '../../src/components/SafetyHelpButton';
import { fontFamilies } from '../../src/theme/fonts';
import { radius, layout } from '../../src/theme/tokens';
import { useTheme } from '../../src/theme/ThemeProvider';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(active: IconName, inactive: IconName, pillColor: string) {
  return function TabIcon({ focused, color, size }: { focused: boolean; color: ColorValue; size: number }) {
    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 4,
          borderRadius: radius.pill,
          backgroundColor: focused ? pillColor : 'transparent',
        }}
      >
        <Ionicons name={focused ? active : inactive} size={size} color={color} />
      </View>
    );
  };
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontFamily: fontFamilies.bodyBold },
        headerRight: () => (
          <View style={{ marginRight: 16 }}>
            <SafetyHelpButton />
          </View>
        ),
        tabBarActiveTintColor: colors.primaryDeep,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 13, fontFamily: fontFamilies.bodySemiBold },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: layout.tabBarBaseHeight + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline', colors.primarySoft) }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: 'Learn', tabBarIcon: tabIcon('book', 'book-outline', colors.primarySoft) }}
      />
      <Tabs.Screen
        name="practice"
        options={{ title: 'Practice', tabBarIcon: tabIcon('bulb', 'bulb-outline', colors.primarySoft) }}
      />
      <Tabs.Screen
        name="ask"
        options={{ title: 'Ask', tabBarIcon: tabIcon('chatbubbles', 'chatbubbles-outline', colors.primarySoft) }}
      />
      <Tabs.Screen
        name="me"
        options={{ title: 'Me', tabBarIcon: tabIcon('person', 'person-outline', colors.primarySoft) }}
      />
    </Tabs>
  );
}
