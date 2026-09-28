import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

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
                        value="57%"
                        icon="trophy-outline"
                    />

                    <Metric
                        label="Profit Factor"
                        value="1.84"
                        icon="trending-up-outline"
                    />
                </View>

                <View className="mt-3 flex-row gap-3">
                    <Metric
                        label="Avg. R"
                        value="+1.2R"
                        icon="analytics-outline"
                    />

                    <Metric
                        label="Total Trades"
                        value="42"
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
                                57%
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
                                24
                            </Text>
                        </View>

                        <View className="mb-4 flex-row justify-between">
                            <Text className="text-sm text-text-muted">
                                Losing Trades
                            </Text>

                            <Text className="font-bold text-danger">
                                18
                            </Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-sm text-text-muted">
                                Best Trade
                            </Text>

                            <Text className="font-bold text-text-primary">
                                +4.2R
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}