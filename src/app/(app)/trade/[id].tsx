import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const SERVER_URI = "https://jornal.rgmrabagardama.com.ng/api";

export default function TradeDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { token } = useAuth();

    const [trade, setTrade] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTradeDetails = async () => {
            if (!token || !id) return;
            try {
                setIsLoading(true);
                const response = await fetch(`${SERVER_URI}/jornal/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    const foundTrade = result.data.find((item: any) => item._id === id);
                    if (foundTrade) {
                        setTrade(foundTrade);
                    } else {
                        Toast.show({
                            type: "error",
                            text1: "Trade Not Found",
                            text2: "Could not find details for this trade.",
                        });
                    }
                } else {
                    Toast.show({
                        type: "error",
                        text1: "Failed to load details",
                        text2: result.message || "Could not retrieve data.",
                    });
                }
            } catch (error) {
                Toast.show({
                    type: "error",
                    text1: "Network Error",
                    text2: "Unable to connect to server.",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTradeDetails();
    }, [token, id]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (!trade) {
        return (
            <View className="flex-1 items-center justify-center bg-background px-4">
                <Ionicons name="alert-circle-outline" size={48} color="#64748B" />
                <Text className="mt-2 text-base font-semibold text-text-primary">Trade details unavailable</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mt-4 rounded-xl bg-primary px-5 py-3"
                >
                    <Text className="font-bold text-white">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const pnlValue = trade.pnl || 0;
    const isWin = pnlValue > 0;
    const isLoss = pnlValue < 0;
    const resultText = isWin ? "WIN" : isLoss ? "LOSS" : "BREAKEVEN";

    const resultColor = isWin
        ? "text-success"
        : isLoss
            ? "text-danger"
            : "text-warning";

    const resultBg = isWin
        ? "bg-success/10"
        : isLoss
            ? "bg-danger/10"
            : "bg-warning/10";

    const formattedDate = trade.date ? trade.date.split("T")[0] : "N/A";

    // Helper function to extract base64 data URI string safely
    const getImageSource = (imageObj: any) => {
        if (!imageObj) return null;
        if (imageObj.data && imageObj.mimeType) {
            // Checks if data already contains the base64 prefix
            if (imageObj.data.startsWith("data:")) {
                return imageObj.data;
            }
            return `data:${imageObj.mimeType};base64,${imageObj.data}`;
        }
        return null;
    };

    const htfSource = getImageSource(trade.highTimeFramelmage);
    const mtfSource = getImageSource(trade.mediumTimeFramelmage);
    const ltfSource = getImageSource(trade.lowTimeFramelmage);

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-border bg-surface px-4 pb-4 pt-14">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-surface-alt"
                >
                    <Ionicons
                        name="arrow-back"
                        size={21}
                        color="#0F172A"
                    />
                </TouchableOpacity>

                <Text className="text-lg font-bold text-text-primary">
                    Trade Details
                </Text>

                <View className="h-10 w-10" />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Trade Header */}
                <View className="px-4 pt-5">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-2xl font-bold text-text-primary">
                                {trade.asset || "Trade"}
                            </Text>

                            <Text className="mt-1 text-sm text-text-muted">
                                {formattedDate}
                            </Text>
                        </View>

                        <View
                            className={`rounded-full px-4 py-2 ${resultBg}`}
                        >
                            <Text
                                className={`text-sm font-bold ${resultColor}`}
                            >
                                {resultText}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Performance */}
                <View className="mt-5 px-4">
                    <Text className="mb-3 text-base font-bold text-text-primary">
                        Performance
                    </Text>

                    <View className="rounded-2xl border border-border bg-surface p-4">
                        <View className="flex-row">
                            <View className="flex-1 border-r border-border">
                                <Text className="text-sm text-text-muted">
                                    P&L
                                </Text>

                                <Text
                                    className={`mt-1 text-2xl font-bold ${isWin
                                        ? "text-success"
                                        : isLoss
                                            ? "text-danger"
                                            : "text-warning"
                                        }`}
                                >
                                    {pnlValue >= 0 ? "+" : "-"}$
                                    {Math.abs(pnlValue).toFixed(2)}
                                </Text>
                            </View>

                            <View className="flex-1 pl-5">
                                <Text className="text-sm text-text-muted">
                                    Setup
                                </Text>

                                <Text
                                    className="mt-1 text-lg font-bold text-text-primary"
                                    numberOfLines={1}
                                >
                                    {trade.setup || trade.plan?.name || "General"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Trade Information */}
                <View className="mt-6 px-4">
                    <Text className="mb-3 text-base font-bold text-text-primary">
                        Trade Information
                    </Text>

                    <View className="rounded-2xl border border-border bg-surface">
                        <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
                            <Text className="text-sm text-text-muted">
                                Asset / Symbol
                            </Text>

                            <Text className="font-semibold text-text-primary">
                                {trade.asset || "N/A"}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
                            <Text className="text-sm text-text-muted">
                                Resulting PnL
                            </Text>

                            <Text className={`font-semibold ${resultColor}`}>
                                ${pnlValue.toFixed(2)}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
                            <Text className="text-sm text-text-muted">
                                Setup Type
                            </Text>

                            <Text className="font-semibold text-text-primary">
                                {trade.setup || "N/A"}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between px-4 py-4">
                            <Text className="text-sm text-text-muted">
                                Date Recorded
                            </Text>

                            <Text className="font-semibold text-text-primary">
                                {formattedDate}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Chart Images Section */}
                {(htfSource || mtfSource || ltfSource) && (
                    <View className="mt-6 px-4">
                        <Text className="mb-3 text-base font-bold text-text-primary">
                            Chart Analysis (Multi-Timeframe)
                        </Text>

                        {htfSource && (
                            <View className="mb-4">
                                <Text className="mb-2 text-xs font-semibold text-text-muted">High Timeframe (HTF)</Text>
                                <View className="overflow-hidden rounded-2xl border border-border bg-surface">
                                    <Image
                                        source={{ uri: htfSource }}
                                        style={{ width: "100%", height: 220 }}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                        )}

                        {mtfSource && (
                            <View className="mb-4">
                                <Text className="mb-2 text-xs font-semibold text-text-muted">Medium Timeframe (MTF)</Text>
                                <View className="overflow-hidden rounded-2xl border border-border bg-surface">
                                    <Image
                                        source={{ uri: mtfSource }}
                                        style={{ width: "100%", height: 220 }}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                        )}

                        {ltfSource && (
                            <View className="mb-4">
                                <Text className="mb-2 text-xs font-semibold text-text-muted">Low Timeframe (LTF)</Text>
                                <View className="overflow-hidden rounded-2xl border border-border bg-surface">
                                    <Image
                                        source={{ uri: ltfSource }}
                                        style={{ width: "100%", height: 220 }}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* Notes */}
                <View className="mt-6 px-4">
                    <Text className="mb-3 text-base font-bold text-text-primary">
                        Journal Notes
                    </Text>

                    <View className="rounded-2xl border border-border bg-surface p-4">
                        <Text className="leading-6 text-text-secondary">
                            {trade.notes || "No notes were added to this trade."}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}