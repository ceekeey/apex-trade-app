import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const recentTrades = [
    {
        id: "1",
        symbol: "EURUSD",
        side: "BUY",
        result: "WIN",
        pnl: "+$120",
        r: "+2.0R",
    },
    {
        id: "2",
        symbol: "USDJPY",
        side: "SELL",
        result: "LOSS",
        pnl: "-$45",
        r: "-1.0R",
    },
    {
        id: "3",
        symbol: "GBPUSD",
        side: "BUY",
        result: "WIN",
        pnl: "+$85",
        r: "+1.5R",
    },
];

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
}) {
    return (
        <View
            className="flex-1 rounded-2xl border border-border bg-surface p-4"
            style={{ minHeight: hp(12) }}
        >
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Ionicons name={icon} size={18} color="#2563EB" />
            </View>

            <Text className="text-xs font-medium text-text-muted">
                {label}
            </Text>

            <Text className="mt-1 text-xl font-bold text-text-primary">
                {value}
            </Text>
        </View>
    );
}

export default function Dashboard() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: wp(5),
                    paddingTop: hp(6),
                    paddingBottom: hp(4),
                }}
            >
                {/* Header */}

                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-sm text-text-muted">
                            Good morning,
                        </Text>

                        <Text className="mt-1 text-2xl font-bold text-text-primary">
                            Trader 👋
                        </Text>

                        <Text className="mt-1 text-xs text-text-muted">
                            Monday, September 23
                        </Text>
                    </View>

                </View>

                {/* Today's Performance */}

                <View className="mt-7">
                    <Text className="text-lg font-bold text-text-primary">
                        Today's Performance
                    </Text>

                    <View className="mt-3 flex-row gap-3">
                        <StatCard
                            label="P&L"
                            value="+$280"
                            icon="trending-up-outline"
                        />

                        <StatCard
                            label="R Multiple"
                            value="+3.2R"
                            icon="analytics-outline"
                        />
                    </View>

                    <View className="mt-3 flex-row gap-3">
                        <StatCard
                            label="Win Rate"
                            value="57%"
                            icon="trophy-outline"
                        />

                        <StatCard
                            label="Trades"
                            value="7"
                            icon="swap-horizontal-outline"
                        />
                    </View>
                </View>

                {/* Trading Plan */}

                <View className="mt-7">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-text-primary">
                            Current Trading Plan
                        </Text>

                        <TouchableOpacity
                            onPress={() => router.push("/(app)/playbook")}
                        >
                            <Text className="text-xs font-semibold text-primary">
                                View plan
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-3 rounded-2xl border border-border bg-surface p-4">
                        <View className="flex-row items-center">
                            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <Ionicons
                                    name="compass-outline"
                                    size={20}
                                    color="#2563EB"
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="font-semibold text-text-primary">
                                    Follow the plan
                                </Text>

                                <Text className="mt-1 text-xs leading-5 text-text-muted">
                                    Wait for your 4H bias before looking for
                                    15M and 5M entries.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Recent Trades */}

                <View className="mt-7">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-text-primary">
                            Recent Trades
                        </Text>

                        <TouchableOpacity
                            onPress={() =>
                                router.push("/(app)/(tabs)/trades")
                            }
                        >
                            <Text className="text-xs font-semibold text-primary">
                                View all
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="mt-3">
                        {recentTrades.map((trade) => (
                            <TouchableOpacity
                                key={trade.id}
                                onPress={() =>
                                    router.push(`/(app)/trade/${trade.id}`)
                                }
                                className="mb-3 flex-row items-center rounded-2xl border border-border bg-surface p-4"
                            >
                                <View className="h-10 w-10 items-center justify-center rounded-xl bg-surface-alt">
                                    <Ionicons
                                        name={
                                            trade.side === "BUY"
                                                ? "arrow-up"
                                                : "arrow-down"
                                        }
                                        size={18}
                                        color={
                                            trade.side === "BUY"
                                                ? "#16A34A"
                                                : "#DC2626"
                                        }
                                    />
                                </View>

                                <View className="ml-3 flex-1">
                                    <Text className="font-bold text-text-primary">
                                        {trade.symbol}
                                    </Text>

                                    <Text className="mt-1 text-xs text-text-muted">
                                        {trade.side} • {trade.r}
                                    </Text>
                                </View>

                                <View className="items-end">
                                    <Text
                                        className={`font-bold ${trade.result === "WIN"
                                            ? "text-success"
                                            : "text-danger"
                                            }`}
                                    >
                                        {trade.pnl}
                                    </Text>

                                    <Text className="mt-1 text-xs text-text-muted">
                                        {trade.result}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
 
            </ScrollView>
        </View>
    );
}