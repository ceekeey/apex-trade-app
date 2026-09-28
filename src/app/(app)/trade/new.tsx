import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const directions = ["BUY", "SELL"];
const results = ["WIN", "LOSS", "BREAKEVEN"];

export default function NewTrade() {
    const router = useRouter();

    const [symbol, setSymbol] = useState("");
    const [market, setMarket] = useState("");
    const [direction, setDirection] = useState("BUY");
    const [result, setResult] = useState("WIN");
    const [pnl, setPnl] = useState("");
    const [rMultiple, setRMultiple] = useState("");
    const [notes, setNotes] = useState("");

    const canSave =
        symbol.trim().length > 0 &&
        market.trim().length > 0;

    const handleSave = () => {
        if (!canSave) return;

        // TODO:
        // Save trade to your state/backend here.

        router.replace("/(app)/(tabs)/trades");
    };

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingHorizontal: wp(5),
                    paddingTop: hp(6),
                    paddingBottom: hp(5),
                }}
            >
                {/* Header */}

                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mr-3 h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color="#334155"
                        />
                    </TouchableOpacity>

                    <View>
                        <Text className="text-2xl font-bold text-text-primary">
                            Add Trade
                        </Text>

                        <Text className="mt-1 text-xs text-text-muted">
                            Record your trade and review it later.
                        </Text>
                    </View>
                </View>

                {/* Trade Details */}

                <View className="mt-7 rounded-2xl border border-border bg-surface p-5">
                    <Text className="text-lg font-bold text-text-primary">
                        Trade Details
                    </Text>

                    {/* Symbol */}

                    <View className="mt-5">
                        <Text className="mb-2 text-xs font-semibold text-text-secondary">
                            Symbol
                        </Text>

                        <TextInput
                            value={symbol}
                            onChangeText={setSymbol}
                            placeholder="e.g. EURUSD"
                            placeholderTextColor="#94A3B8"
                            autoCapitalize="characters"
                            className="rounded-xl border border-border bg-surface-alt px-4 py-3.5 text-sm text-text-primary"
                        />
                    </View>

                    {/* Market */}

                    <View className="mt-4">
                        <Text className="mb-2 text-xs font-semibold text-text-secondary">
                            Market
                        </Text>

                        <TextInput
                            value={market}
                            onChangeText={setMarket}
                            placeholder="e.g. Forex"
                            placeholderTextColor="#94A3B8"
                            className="rounded-xl border border-border bg-surface-alt px-4 py-3.5 text-sm text-text-primary"
                        />
                    </View>

                    {/* Direction */}

                    <View className="mt-5">
                        <Text className="mb-2 text-xs font-semibold text-text-secondary">
                            Direction
                        </Text>

                        <View className="flex-row gap-3">
                            {directions.map((item) => {
                                const active = direction === item;

                                return (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => setDirection(item)}
                                        className={`flex - 1 items - center rounded - xl py - 3.5 ${active
                                            ? item === "BUY"
                                                ? "bg-success"
                                                : "bg-danger"
                                            : "border border-border bg-surface-alt"
                                            } `}
                                    >
                                        <Text
                                            className={`text - sm font - bold ${active
                                                ? "text-white"
                                                : "text-text-secondary"
                                                } `}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Result */}

                    <View className="mt-5">
                        <Text className="mb-2 text-xs font-semibold text-text-secondary">
                            Result
                        </Text>

                        <View className="flex-row gap-2">
                            {results.map((item) => {
                                const active = result === item;

                                return (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => setResult(item)}
                                        className={`flex - 1 items - center rounded - xl py - 3 ${active
                                            ? "bg-primary"
                                            : "border border-border bg-surface-alt"
                                            } `}
                                    >
                                        <Text
                                            className={`text - xs font - bold ${active
                                                ? "text-white"
                                                : "text-text-secondary"
                                                } `}
                                        >
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>

                {/* Performance */}

                <View className="mt-5 rounded-2xl border border-border bg-surface p-5">
                    <Text className="text-lg font-bold text-text-primary">
                        Performance
                    </Text>

                    <View className="mt-5 flex-row gap-3">
                        {/* P&L */}

                        <View className="flex-1">
                            <Text className="mb-2 text-xs font-semibold text-text-secondary">
                                P&L
                            </Text>

                            <TextInput
                                value={pnl}
                                onChangeText={setPnl}
                                placeholder="e.g. 120"
                                placeholderTextColor="#94A3B8"
                                keyboardType="decimal-pad"
                                className="rounded-xl border border-border bg-surface-alt px-4 py-3.5 text-sm text-text-primary"
                            />
                        </View>

                        {/* R Multiple */}

                        <View className="flex-1">
                            <Text className="mb-2 text-xs font-semibold text-text-secondary">
                                R Multiple
                            </Text>

                            <TextInput
                                value={rMultiple}
                                onChangeText={setRMultiple}
                                placeholder="e.g. 2.0R"
                                placeholderTextColor="#94A3B8"
                                keyboardType="decimal-pad"
                                className="rounded-xl border border-border bg-surface-alt px-4 py-3.5 text-sm text-text-primary"
                            />
                        </View>
                    </View>
                </View>

                {/* Notes */}

                <View className="mt-5 rounded-2xl border border-border bg-surface p-5">
                    <Text className="text-lg font-bold text-text-primary">
                        Notes
                    </Text>

                    <Text className="mt-1 text-xs text-text-muted">
                        What happened during this trade?
                    </Text>

                    <TextInput
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Entry reason, setup, emotions, mistakes, lessons..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        textAlignVertical="top"
                        className="mt-4 h-32 rounded-xl border border-border bg-surface-alt px-4 py-3.5 text-sm leading-5 text-text-primary"
                    />
                </View>

                {/* Actions */}

                <View className="mt-6 flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 items-center justify-center rounded-xl border border-border bg-surface"
                        style={{ height: hp(6.5) }}
                    >
                        <Text className="text-sm font-bold text-text-secondary">
                            Cancel
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={!canSave}
                        className={`flex - 1 items - center justify - center rounded - xl ${canSave ? "bg-primary" : "bg-primary/40"
                            } `}
                        style={{ height: hp(6.5) }}
                    >
                        <Text className="text-sm font-bold text-white">
                            Save Trade
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
