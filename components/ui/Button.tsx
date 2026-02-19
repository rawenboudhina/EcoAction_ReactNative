import React from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    type TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: "primary" | "secondary" | "outline" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const variantStyles = {
    primary: "bg-emerald-500 active:bg-emerald-600",
    secondary: "bg-slate-700 active:bg-slate-800",
    outline: "bg-transparent border-2 border-emerald-500",
    danger: "bg-red-500 active:bg-red-600",
};

const variantTextStyles = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-emerald-500",
    danger: "text-white",
};

const sizeStyles = {
    sm: "px-4 py-2 rounded-lg",
    md: "px-6 py-3.5 rounded-xl",
    lg: "px-8 py-4 rounded-2xl",
};

const sizeTextStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
};

export default function Button({
    title,
    variant = "primary",
    size = "md",
    isLoading = false,
    icon,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <TouchableOpacity
            className={`flex-row items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || isLoading ? "opacity-50" : ""
                }`}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator
                    color={variant === "outline" ? "#10B981" : "#FFFFFF"}
                    size="small"
                />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text
                        className={`font-bold ${variantTextStyles[variant]} ${sizeTextStyles[size]} ${icon ? "ml-2" : ""
                            }`}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}
