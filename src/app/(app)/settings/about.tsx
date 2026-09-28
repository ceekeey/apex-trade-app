import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function AboutScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: wp(5),
                    paddingTop: hp(6),
                    paddingBottom: hp(10),
                }}
            >
                {/* Header */}
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.8}
                        className="h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface"
                    >
                        <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
                    </TouchableOpacity>
                    <View className="ml-3">
                        <Text className="text-2xl font-bold text-text-primary">About Edgeva</Text>
                        <Text className="mt-0.5 text-xs text-text-muted">Secure Trading Protocol</Text>
                    </View>
                </View>

                {/* Logo & Version Card */}
                <View className="mt-8 items-center rounded-3xl border border-border bg-surface p-8 shadow-xl">
                    <View className="h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <Ionicons name="trending-up" size={36} color="#3B82F6" />
                    </View>
                    <Text className="text-xl font-extrabold text-text-primary">Trader's Edge</Text>
                    <Text className="mt-1 text-xs text-text-muted tracking-wider uppercase">Version 1.0.0 (Build 142)</Text>
                    <Text className="mt-4 text-center text-xs leading-5 text-text-secondary">
                        Designed for disciplined traders to record execution, analyze setups, and master trading psychology.
                    </Text>
                </View>

                {/* Links / Info List */}
                <View className="mt-6 rounded-3xl border border-border bg-surface px-4 py-2">
                    <AboutRow icon="globe-outline" title="Official Website" subtitle="https://tradersedge.io" />
                    <AboutRow icon="shield-checkmark-outline" title="Privacy Policy" subtitle="Read our data security terms" />
                    <AboutRow icon="document-text-outline" title="Terms of Service" subtitle="User agreement and guidelines" isLast />
                </View>

                {/* Footer copyright */}
                <View className="mt-8 items-center">
                    <Text className="text-[10px] font-semibold uppercase tracking-widest text-text-disabled">
                        © 2026 Trader's Edge Inc. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

function AboutRow({
    icon,
    title,
    subtitle,
    isLast = false,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    isLast?: boolean;
}) {
    return (
        <View className={`flex-row items-center py-4 ${!isLast ? "border-b border-border" : ""}`}>
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-alt border border-border">
                <Ionicons name={icon} size={18} color="#3B82F6" />
            </View>
            <View className="ml-3 flex-1">
                <Text className="font-semibold text-text-primary text-sm">{title}</Text>
                <Text className="mt-0.5 text-xs text-text-muted">{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
        </View>
    );
}