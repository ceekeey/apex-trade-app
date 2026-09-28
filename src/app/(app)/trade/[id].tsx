import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { trades } from "../../../lib/dummy";

export default function TradeDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const trade = trades.find((t) => t.id === id) || trades[0];

    const isWin = trade.result === "WIN";
    const isLoss = trade.result === "LOSS";

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

    const handleDelete = () => {
        Alert.alert(
            "Delete Trade",
            "Are you sure you want to delete this trade? This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () =>
                        router.replace("/(app)/(tabs)/trades"),
                },
            ]
        );
    };

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

                <TouchableOpacity
                    onPress={() =>
                        router.push(`/(app)/trade/new?id=${trade.id}`)
                    }
                    className="h-10 w-10 items-center justify-center rounded-full bg-primary/10"
                >
                    <Ionicons
                        name="create-outline"
                        size={20}
                        color="#2563EB"
                    />
                </TouchableOpacity>
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
                                {trade.symbol}
                            </Text>

                            <Text className="mt-1 text-sm text-text-muted">
                                {trade.date}
                            </Text>
                        </View>

                        <View
                            className={`rounded-full px-4 py-2 ${resultBg}`}
                        >
                            <Text
                                className={`text-sm font-bold ${resultColor}`}
                            >
                                {trade.result}
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
                                    {trade.pnl >= 0 ? "+" : "-"}$
                                    {Math.abs(trade.pnl)}
                                </Text>
                            </View>

                            <View className="flex-1 pl-5">
                                <Text className="text-sm text-text-muted">
                                    R Multiple
                                </Text>

                                <Text
                                    className={`mt-1 text-2xl font-bold ${resultColor}`}
                                >
                                    {trade.r > 0 ? "+" : ""}
                                    {trade.r}R
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
                                Symbol
                            </Text>

                            <Text className="font-semibold text-text-primary">
                                {trade.symbol}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
                            <Text className="text-sm text-text-muted">
                                Result
                            </Text>

                            <Text className={`font-semibold ${resultColor}`}>
                                {trade.result}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
                            <Text className="text-sm text-text-muted">
                                R Multiple
                            </Text>

                            <Text className="font-semibold text-text-primary">
                                {trade.r}R
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between px-4 py-4">
                            <Text className="text-sm text-text-muted">
                                Date
                            </Text>

                            <Text className="font-semibold text-text-primary">
                                {trade.date}
                            </Text>
                        </View>
                    </View>
                </View>

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

                {/* Actions */}
                <View className="mt-8 flex-row gap-3 px-4">
                    <TouchableOpacity
                        onPress={() =>
                            router.push(`/(app)/trade/new?id=${trade.id}`)
                        }
                        className="flex-1 flex-row items-center justify-center rounded-xl bg-primary py-4"
                    >
                        <Ionicons
                            name="create-outline"
                            size={19}
                            color="#FFFFFF"
                        />

                        <Text className="ml-2 font-bold text-white">
                            Edit Trade
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleDelete}
                        className="h-14 w-14 items-center justify-center rounded-xl border border-danger/20 bg-danger/10"
                    >
                        <Ionicons
                            name="trash-outline"
                            size={21}
                            color="#DC2626"
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}