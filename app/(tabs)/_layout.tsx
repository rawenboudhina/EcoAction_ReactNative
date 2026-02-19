import { Tabs } from "expo-router";
import { CalendarCheck, Compass, UserCircle } from "lucide-react-native";
import React from "react";
import { Platform, Text, View } from "react-native";

interface TabIconProps {
    icon: React.ReactNode;
    label: string;
    focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
    return (
        <View className="items-center justify-center pt-2">
            {icon}
            <Text
                className={`text-[10px] mt-1 ${focused ? "text-emerald-500 font-bold" : "text-slate-400"
                    }`}
            >
                {label}
            </Text>
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
                    backgroundColor: "#FFFFFF",
                    borderTopWidth: 1,
                    borderTopColor: "#F1F5F9",
                    height: Platform.OS === "ios" ? 88 : 65,
                    paddingBottom: Platform.OS === "ios" ? 24 : 8,
                    elevation: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.05,
                    shadowRadius: 12,
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
                                    size={24}
                                    color={focused ? "#10B981" : "#94A3B8"}
                                    strokeWidth={focused ? 2.5 : 2}
                                />
                            }
                            label="Explorer"
                            focused={focused}
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
                                    size={24}
                                    color={focused ? "#10B981" : "#94A3B8"}
                                    strokeWidth={focused ? 2.5 : 2}
                                />
                            }
                            label="Mes Missions"
                            focused={focused}
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
                                    size={24}
                                    color={focused ? "#10B981" : "#94A3B8"}
                                    strokeWidth={focused ? 2.5 : 2}
                                />
                            }
                            label="Profil"
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
