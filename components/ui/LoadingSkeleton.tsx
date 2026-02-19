import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface LoadingSkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    className?: string;
}

export default function LoadingSkeleton({
    width = "100%",
    height = 20,
    borderRadius = 8,
    className = "",
}: LoadingSkeletonProps) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            className={`bg-slate-200 ${className}`}
            style={{
                width: width as number,
                height,
                borderRadius,
                opacity,
            }}
        />
    );
}

export function MissionCardSkeleton() {
    return (
        <View className="bg-white rounded-2xl overflow-hidden mb-4 mx-4 shadow-sm">
            <LoadingSkeleton height={160} borderRadius={0} />
            <View className="p-4 gap-3">
                <LoadingSkeleton width="40%" height={14} />
                <LoadingSkeleton width="90%" height={18} />
                <LoadingSkeleton width="60%" height={14} />
                <View className="flex-row justify-between">
                    <LoadingSkeleton width="30%" height={14} />
                    <LoadingSkeleton width="25%" height={14} />
                </View>
            </View>
        </View>
    );
}
