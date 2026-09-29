import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useAuth } from "@/context/AuthContext"; // Adjust path to match your AuthContext location

const SERVER_URI = "https://jornal.rgmrabagardama.com.ng/api";

interface JournalEntry {
    _id: string;
    pnl: number;
    result?: string;
    // Add other fields if returned by your journal API
}

function Metric({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
}) {
    return (
        <View className="flex-1 rounded-2xl border border-border bg-surface p-4">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Ionicons name={icon} size={18} color="#2563EB" />
            </View>

            <Text className="mt-3 text-xs text-text-muted">{label}</Text>

            <Text className="mt-1 text-xl font-bold text-text-primary">
                {value}
            </Text>
        </View>
    );
}

export default function Analytics() {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [journals, setJournals] = useState<JournalEntry[]>([]);

    // Analytics state variables
    const [winRate, setWinRate] = useState("0%");
    const [profitFactor, setProfitFactor] = useState("0.00");
    const [totalTrades, setTotalTrades] = useState("0");
    const [winningCount, setWinningCount] = useState(0);
    const [losingCount, setLosingCount] = useState(0);
    const [bestTrade, setBestTrade] = useState("0.0R");

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            if (!token) return;

            try {
                setIsLoading(true);
                // Adjust endpoint if your backend has a dedicated analytics route, 
                // otherwise fetching all journals to compute analytics locally:
                const response = await fetch(`${SERVER_URI}/jornal/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("Analytics Journals Response:", data);

                // Handle array response or object wrapping an array (e.g. data.journals or data.success)
                const items: JournalEntry[] = Array.isArray(data)
                    ? data
                    : data.journals || data.data || [];

                setJournals(items);
                computeMetrics(items);
            } catch (error) {
                console.log("Error fetching analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [token]);

    const computeMetrics = (items: JournalEntry[]) => {
        const total = items.length;
        if (total === 0) {
            setWinRate("0%");
            setProfitFactor("0.00");
            setTotalTrades("0");
            setWinningCount(0);
            setLosingCount(0);
            setBestTrade("0.0R");
            return;
        }

        let wins = 0;
        let losses = 0;
        let grossProfit = 0;
        let grossLoss = 0;
        let maxPnl = -Infinity;

        items.forEach((item) => {
            const pnl = item.pnl || 0;
            if (pnl > 0) {
                wins++;
                grossProfit += pnl;
            } else if (pnl < 0) {
                losses++;
                grossLoss += Math.abs(pnl);
            }

            if (pnl > maxPnl) {
                maxPnl = pnl;
            }
        });

        // 1. Win Rate Calculation
        const calculatedWinRate = Math.round((wins / total) * 100);
        setWinRate(`${calculatedWinRate}%`);

        // 2. Profit Factor Calculation (Gross Profit / Gross Loss)
        const pFactor = grossLoss === 0 ? (grossProfit > 0 ? grossProfit.toFixed(2) : "0.00") : (grossProfit / grossLoss).toFixed(2);
        setProfitFactor(pFactor);

        // 3. Totals & Breakdown
        setTotalTrades(total.toString());
        setWinningCount(wins);
        setLosingCount(losses);
        setBestTrade(maxPnl === -Infinity ? "0.0R" : `+${maxPnl.toFixed(1)}R`);
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-3 text-xs text-text-muted">Loading analytics...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: wp(5),
                    paddingTop: hp(6),
                    paddingBottom: hp(5),
                }}
            >
                <Text className="text-2xl font-bold text-text-primary">
                    Analytics
                </Text>

                <Text className="mt-1 text-sm text-text-muted">
                    Understand your trading performance.
                </Text>

                <View className="mt-6 flex-row gap-3">
                    <Metric
                        label="Win Rate"
                        value={winRate}
                        icon="trophy-outline"
                    />

                    <Metric
                        label="Profit Factor"
                        value={profitFactor}
                        icon="trending-up-outline"
                    />
                </View>

                <View className="mt-3 flex-row gap-3">
                    <Metric
                        label="Avg. R"
                        value="+1.2R" // You can map this dynamically if your backend tracks R-multiples
                        icon="analytics-outline"
                    />

                    <Metric
                        label="Total Trades"
                        value={totalTrades}
                        icon="swap-horizontal-outline"
                    />
                </View>

                {/* Performance */}

                <View className="mt-7 rounded-2xl border border-border bg-surface p-5">
                    <Text className="text-lg font-bold text-text-primary">
                        Performance
                    </Text>

                    <View className="mt-6 items-center justify-center">
                        <View className="h-36 w-36 items-center justify-center rounded-full border-8 border-primary">
                            <Text className="text-3xl font-bold text-text-primary">
                                {winRate}
                            </Text>

                            <Text className="text-xs text-text-muted">
                                Win Rate
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Breakdown */}

                <View className="mt-5 rounded-2xl border border-border bg-surface p-5">
                    <Text className="text-lg font-bold text-text-primary">
                        Trade Breakdown
                    </Text>

                    <View className="mt-5">
                        <View className="mb-4 flex-row justify-between">
                            <Text className="text-sm text-text-muted">
                                Winning Trades
                            </Text>

                            <Text className="font-bold text-success">
                                {winningCount}
                            </Text>
                        </View>

                        <View className="mb-4 flex-row justify-between">
                            <Text className="text-sm text-text-muted">
                                Losing Trades
                            </Text>

                            <Text className="font-bold text-danger">
                                {losingCount}
                            </Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-sm text-text-muted">
                                Best Trade
                            </Text>

                            <Text className="font-bold text-text-primary">
                                {bestTrade}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}