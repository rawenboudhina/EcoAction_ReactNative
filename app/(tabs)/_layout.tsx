import { Tabs } from "expo-router";
import { CalendarCheck, Compass, UserCircle } from "lucide-react-native";
import React from "react";
import { Platform, Text, View } from "react-native";

interface TabIconProps {
    icon: React.ReactNode;
    label: string;
    focused: boolean;
    color: string;
}

function TabIcon({ icon, label, focused, color }: TabIconProps) {
    return (
        <View
            style={{
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 8,
                minWidth: 64,
            }}
        >
            <View
                style={{
                    backgroundColor: focused ? `${color}18` : "transparent",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 6,
                }}
            >
                {icon}
                {focused && (
                    <Text
                        style={{
                            fontSize: 12,
                            fontWeight: "800",
                            color: color,
                        }}
                    >
                        {label}
                    </Text>
                )}
            </View>
            {/* Active indicator dot */}
            <View
                style={{
                    width: 5,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: focused ? color : "transparent",
                    marginTop: 4,
                }}
            />
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: Platform.OS === "ios" ? 24 : 16,
                    left: 20,
                    right: 20,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 28,
                    height: 72,
                    borderTopWidth: 0,
                    shadowColor: "#0F172A",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.12,
                    shadowRadius: 24,
                    elevation: 16,
                    paddingBottom: 0,
                    paddingHorizontal: 8,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={
                                <Compass
                                    size={22}
                                    color={focused ? "#10B981" : "#94A3B8"}
                                    strokeWidth={focused ? 2.5 : 1.8}
                                />
                            }
                            label="Explorer"
                            focused={focused}
                            color="#10B981"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="my-missions"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={
                                <CalendarCheck
                                    size={22}
                                    color={focused ? "#0EA5E9" : "#94A3B8"}
                                    strokeWidth={focused ? 2.5 : 1.8}
                                />
                            }
                            label="Missions"
                            focused={focused}
                            color="#0EA5E9"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={
                                <UserCircle
                                    size={22}
                                    color={focused ? "#8B5CF6" : "#94A3B8"}
                                    strokeWidth={focused ? 2.5 : 1.8}
                                />
                            }
                            label="Profil"
                            focused={focused}
                            color="#8B5CF6"
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
