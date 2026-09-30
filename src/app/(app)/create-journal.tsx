import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const SERVER_URI = "https://jornal.rgmrabagardama.com.ng/api";

const PAIRS = [

    // Commodities / Crypto
    "ADAUSD", "BCHUSD", "BTCUSD", "DOGEUSD", "DOTUSD", "ETHUSD",
    "LINKUSD", "LTCUSD", "SOLUSD", "XAGEUR", "XAGUSD", "XAUUSD",
    "XCUUSD", "XPDUSD", "XPTUSD", "XRPUSD",

    // Volatility Indices
    "Volatility 10", "Volatility 10 (1s)", "Volatility 15 (1s)",
    "Volatility 25", "Volatility 25 (1s)", "Volatility 30 (1s)",
    "Volatility 50", "Volatility 50 (1s)", "Volatility 75",
    "Volatility 75 (1s)", "Volatility 90 (1s)", "Volatility 100",
    "Volatility 100 (1s)",

    // Jump Indices
    "Jump 10", "Jump 25", "Jump 50", "Jump 75", "Jump 100",

    // Boom / Crash
    "Boom 50", "Boom 150", "Boom 300", "Boom 500", "Boom 600",
    "Boom 900", "Boom 1000",
    "Crash 50", "Crash 150", "Crash 300", "Crash 500", "Crash 600",
    "Crash 900", "Crash 1000",

    // Forex
    "AUDCAD",
    "AUDCHF",
    "AUDJPY",
    "AUDNZD",
    "CADCHF",
    "CADJPY",
    "CHFJPY",
    "EURAUD",
    "EURCAD",
    "EURCHF",
    "EURGBP",
    "EURJPY",
    "EURNZD",
    "GBPAUD",
    "GBPCAD",
    "GBPCHF",
    "GBPJPY",
    "GBPNZD",
    "NZDCHF",
    "NZDJPY",

];

const MOODS = [
    {
        label: "Focused",
        value: "FOCUSED",
        icon: "eye-outline" as const,
    },
    {
        label: "Confident",
        value: "CONFIDENT",
        icon: "flash-outline" as const,
    },
    {
        label: "Calm",
        value: "CALM",
        icon: "leaf-outline" as const,
    },
    {
        label: "Uncertain",
        value: "UNCERTAIN",
        icon: "help-circle-outline" as const,
    },
    {
        label: "Fearful",
        value: "FEARFUL",
        icon: "alert-circle-outline" as const,
    },
    {
        label: "Greedy",
        value: "GREEDY",
        icon: "trending-up-outline" as const,
    },
];

type ScreenshotType = "4H" | "15M" | "5M";

interface TradingPlan {
    id: string;
    name: string;
}

// =========================
// EXTERNAL COMPONENTS (Prevents Keyboard Dismissal)
// =========================

const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
}: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    icon: keyof typeof Ionicons.glyphMap;
}) => {
    return (
        <View className="mb-4 flex-1">
            <Text className="mb-2 text-xs font-semibold text-slate-400">
                {label}
            </Text>

            <View className="flex-row items-center rounded-xl border border-slate-700 bg-slate-900 px-3">
                <Ionicons
                    name={icon}
                    size={18}
                    color="#94A3B8"
                />

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#64748B"
                    keyboardType="decimal-pad"
                    className="ml-2 flex-1 py-3 text-sm text-white"
                />
            </View>
        </View>
    );
};

const MoodButton = ({
    mood,
    selected,
    onPress,
}: {
    mood: (typeof MOODS)[number];
    selected: boolean;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className={`mb-3 mr-2 flex-row items-center rounded-xl border px-3 py-3 ${selected
                ? "border-blue-500 bg-blue-500/15"
                : "border-slate-700 bg-slate-900"
                }`}
        >
            <Ionicons
                name={mood.icon}
                size={17}
                color={selected ? "#60A5FA" : "#94A3B8"}
            />

            <Text
                className={`ml-2 text-xs font-medium ${selected ? "text-blue-400" : "text-slate-400"
                    }`}
            >
                {mood.label}
            </Text>
        </TouchableOpacity>
    );
};

export default function CreateJournalScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const { token } = useAuth();

    const dateString =
        typeof params.date === "string"
            ? params.date
            : new Date().toISOString();

    // =========================
    // TRADE INFORMATION
    // =========================

    const [pair, setPair] = useState("");
    const [tradeType, setTradeType] =
        useState<"LONG" | "SHORT">("LONG");

    const [planId, setPlanId] = useState("");
    const [planName, setPlanName] = useState("");
    const [plansList, setPlansList] = useState<TradingPlan[]>([]);

    // =========================
    // EMOTIONS
    // =========================

    const [beforeMood, setBeforeMood] = useState("CONFIDENT");
    const [afterMood, setAfterMood] = useState("");

    // =========================
    // TRADE SETUP
    // =========================

    const [entry, setEntry] = useState("");
    const [stopLoss, setStopLoss] = useState("");
    const [takeProfit, setTakeProfit] = useState("");
    const [exitPrice, setExitPrice] = useState("");

    const [risk, setRisk] = useState("");
    const [lotSize, setLotSize] = useState("");

    // =========================
    // RESULT
    // =========================

    const [pnl, setPnl] = useState("");
    const [result, setResult] = useState<
        "Win" | "Loss" | "Break Even"
    >("Win");

    // =========================
    // NOTES
    // =========================

    const [notes, setNotes] = useState("");
    const [lesson, setLesson] = useState("");

    // =========================
    // UI STATE
    // =========================

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [pairModal, setPairModal] = useState(false);
    const [planModal, setPlanModal] = useState(false);

    const [screenshots, setScreenshots] = useState<
        Record<ScreenshotType, string | null>
    >({
        "4H": null,
        "15M": null,
        "5M": null,
    });

    const [imagePickerVisible, setImagePickerVisible] =
        useState(false);

    const [selectedTimeframe, setSelectedTimeframe] =
        useState<ScreenshotType | null>(null);

    // =========================
    // FETCH TRADING PLANS
    // =========================

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        if (!token) {
            console.log("Fetch plans skipped: no token");
            return;
        }

        try {
            const url = `${SERVER_URI}/plans/allplans`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            const responseText = await response.text();

            let data: any;

            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                return;
            }

            if (!response.ok) {
                return;
            }

            const plans = Array.isArray(data)
                ? data
                : data.plans ||
                data.data ||
                [];

            if (!Array.isArray(plans)) {
                return;
            }

            const formattedPlans: TradingPlan[] = plans
                .map((plan: any) => ({
                    id: plan._id || plan.id || "",
                    name: plan.name || plan.title || "Unnamed Plan",
                }))
                .filter((plan: TradingPlan) => plan.id && plan.name);

            setPlansList(formattedPlans);
        } catch (error) {
            console.log("Fetch plans network error:", error);
        }
    };

    // =========================
    // IMAGE PICKER
    // =========================

    const openImagePicker = (timeframe: ScreenshotType) => {
        setSelectedTimeframe(timeframe);
        setImagePickerVisible(true);
    };

    const takePhoto = async () => {
        try {
            const permission =
                await ImagePicker.requestCameraPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Camera Permission",
                    "Please allow camera access to take a chart screenshot."
                );
                return;
            }

            const result =
                await ImagePicker.launchCameraAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    quality: 0.8,
                    base64: true,
                });

            if (
                !result.canceled &&
                result.assets &&
                result.assets.length > 0 &&
                selectedTimeframe
            ) {
                const image = result.assets[0];

                let uri = image.uri;

                if (image.base64) {
                    uri = `data:${image.mimeType || "image/jpeg"};base64,${image.base64}`;
                }

                setScreenshots((previous) => ({
                    ...previous,
                    [selectedTimeframe]: uri,
                }));
            }
        } catch (error) {
            console.log("Camera error:", error);
        } finally {
            setImagePickerVisible(false);
        }
    };

    const pickFromGallery = async () => {
        try {
            const permission =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) {
                Alert.alert(
                    "Gallery Permission",
                    "Please allow gallery access to select a chart screenshot."
                );
                return;
            }

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    quality: 0.8,
                    base64: true,
                });

            if (
                !result.canceled &&
                result.assets &&
                result.assets.length > 0 &&
                selectedTimeframe
            ) {
                const image = result.assets[0];

                let uri = image.uri;

                if (image.base64) {
                    uri = `data:${image.mimeType || "image/jpeg"};base64,${image.base64}`;
                }

                setScreenshots((previous) => ({
                    ...previous,
                    [selectedTimeframe]: uri,
                }));
            }
        } catch (error) {
            console.log("Gallery error:", error);
        } finally {
            setImagePickerVisible(false);
        }
    };

    const removeScreenshot = (timeframe: ScreenshotType) => {
        setScreenshots((previous) => ({
            ...previous,
            [timeframe]: null,
        }));
    };

    // =========================
    // IMAGE PAYLOAD
    // =========================

    const formatImagePayload = (uri: string | null) => {
        if (!uri) return undefined;

        if (uri.startsWith("data:")) {
            const match = uri.match(/^data:(.*?);base64,(.*)$/);

            if (match) {
                return {
                    data: match[2],
                    mimeType: match[1],
                };
            }
        }

        return {
            data: uri,
            mimeType: "image/jpeg",
        };
    };

    // =========================
    // SAVE JOURNAL
    // =========================

    const saveJournal = async () => {
        if (!pair) {
            Alert.alert(
                "Pair Required",
                "Select the trading pair you traded."
            );
            return;
        }

        if (!token) {
            Alert.alert(
                "Authentication Error",
                "You must be logged in."
            );
            return;
        }

        const entryPrice = Number.parseFloat(entry);
        const stopLossPrice = Number.parseFloat(stopLoss);
        const takeProfitPrice = Number.parseFloat(takeProfit);
        const actualExitPrice = Number.parseFloat(exitPrice);
        const parsedLotSize = Number.parseFloat(lotSize);
        const parsedRisk = Number.parseFloat(risk);
        const parsedPnl = Number.parseFloat(pnl);

        const numericEntry = Number.isFinite(entryPrice) ? entryPrice : 0;
        const numericStopLoss = Number.isFinite(stopLossPrice) ? stopLossPrice : 0;
        const numericTakeProfit = Number.isFinite(takeProfitPrice) ? takeProfitPrice : 0;
        const numericExit = Number.isFinite(actualExitPrice) ? actualExitPrice : 0;
        const numericLotSize = Number.isFinite(parsedLotSize) ? parsedLotSize : 0;
        const numericRisk = Number.isFinite(parsedRisk) ? parsedRisk : 0;
        const numericPnl = Number.isFinite(parsedPnl) ? parsedPnl : 0;

        try {
            setIsSubmitting(true);

            const payload = {
                plan:
                    planId && !planId.startsWith("fallback_")
                        ? planId
                        : undefined,
                asset: pair,
                type: tradeType,
                entryPrice: numericEntry,
                stopLoss: numericStopLoss,
                takeProfit: numericTakeProfit,
                exitPrice: numericExit,
                lotSize: numericLotSize,
                risk: numericRisk,
                pnl: numericPnl,
                result,
                setup: planName || "General Setup",
                emotion: beforeMood || "CONFIDENT",
                afterEmotion: afterMood || undefined,
                notes:
                    notes +
                    (lesson ? `\nLesson/Takeaway: ${lesson}` : ""),
                highTimeFrameImage: formatImagePayload(screenshots["4H"]),
                mediumTimeFrameImage: formatImagePayload(screenshots["15M"]),
                lowTimeFrameImage: formatImagePayload(screenshots["5M"]),
                date: dateString
                    ? new Date(dateString).toISOString()
                    : new Date().toISOString(),
            };

            const response = await fetch(
                `${SERVER_URI}/jornal/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const responseText = await response.text();
            let resultJson: any;

            try {
                resultJson = JSON.parse(responseText);
            } catch (error) {
                Alert.alert(
                    "Server Error",
                    "Server returned an unexpected response format."
                );
                return;
            }

            if (response.ok && resultJson.success) {
                Alert.alert(
                    "Journal Saved",
                    "Your trading journal has been saved successfully.",
                    [
                        {
                            text: "Done",
                            onPress: () => router.back(),
                        },
                    ]
                );
            } else {
                Alert.alert(
                    "Error",
                    resultJson.error ||
                    resultJson.message ||
                    "Failed to save journal."
                );
            }
        } catch (error) {
            Alert.alert(
                "Network Error",
                "Unable to connect to server."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // =========================
    // SCREENSHOT CARD COMPONENT
    // =========================

    const ScreenshotCard = ({
        timeframe,
        title,
    }: {
        timeframe: ScreenshotType;
        title: string;
    }) => {
        const image = screenshots[timeframe];

        return (
            <View className="mb-4">
                <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-xs font-semibold text-slate-300">
                        {title}
                    </Text>

                    {image && (
                        <TouchableOpacity
                            onPress={() =>
                                removeScreenshot(timeframe)
                            }
                        >
                            <Ionicons
                                name="trash-outline"
                                size={17}
                                color="#EF4444"
                            />
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        openImagePicker(timeframe)
                    }
                    className="overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-900"
                >
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            className="h-52 w-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="h-36 items-center justify-center">
                            <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                                <Ionicons
                                    name="cloud-upload-outline"
                                    size={24}
                                    color="#60A5FA"
                                />
                            </View>

                            <Text className="text-sm font-medium text-white">
                                Add {timeframe} Chart
                            </Text>

                            <Text className="mt-1 text-xs text-slate-500">
                                Camera or gallery
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-950"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            {/* ================= HEADER ================= */}

            <View className="flex-row items-center justify-between border-b border-slate-800 px-5 pb-4 pt-14">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center rounded-full bg-slate-900"
                >
                    <Ionicons
                        name="arrow-back"
                        size={21}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <View className="items-center">
                    <Text className="text-lg font-bold text-white">
                        New Journal
                    </Text>

                    <Text className="mt-1 text-xs text-slate-500">
                        Record your trade
                    </Text>
                </View>

                <View className="w-10" />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets={true}
                keyboardDismissMode="interactive"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingBottom: 250,
                    paddingTop: 20,
                }}
            >
                {/* ================= MARKET PAIR ================= */}

                <Text className="text-xs font-semibold text-slate-400">
                    MARKET PAIR
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setPairModal(true)}
                    className="mt-2 flex-row items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-4"
                >
                    <View className="flex-row items-center">
                        <View className="h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                            <Ionicons
                                name="stats-chart-outline"
                                size={19}
                                color="#60A5FA"
                            />
                        </View>

                        <Text className="ml-3 text-sm font-semibold text-white">
                            {pair || "Select trading pair"}
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-down"
                        size={18}
                        color="#64748B"
                    />
                </TouchableOpacity>

                {/* ================= TRADING PLAN ================= */}

                <Text className="mt-6 text-xs font-semibold text-slate-400">
                    TRADING PLAN
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setPlanModal(true)}
                    className="mt-2 flex-row items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-4"
                >
                    <View className="flex-row items-center">
                        <View className="h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                            <Ionicons
                                name="layers-outline"
                                size={19}
                                color="#2DD4BF"
                            />
                        </View>

                        <Text className="ml-3 text-sm font-semibold text-white">
                            {planName || "Select trading plan"}
                        </Text>
                    </View>

                    <Ionicons
                        name="chevron-down"
                        size={18}
                        color="#64748B"
                    />
                </TouchableOpacity>

                {/* ================= BEFORE TRADE MOOD ================= */}

                <Text className="mt-7 text-xs font-semibold text-slate-400">
                    BEFORE TRADE MOOD
                </Text>

                <View className="mt-3 flex-row flex-wrap">
                    {MOODS.map((mood) => (
                        <MoodButton
                            key={mood.value}
                            mood={mood}
                            selected={
                                beforeMood === mood.value
                            }
                            onPress={() =>
                                setBeforeMood(mood.value)
                            }
                        />
                    ))}
                </View>

                {/* ================= TRADE SETUP ================= */}

                <View className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <View className="mb-4 flex-row items-center">
                        <Ionicons
                            name="create-outline"
                            size={20}
                            color="#60A5FA"
                        />

                        <Text className="ml-2 text-base font-bold text-white">
                            Trade Setup
                        </Text>
                    </View>

                    {/* DIRECTION */}

                    <Text className="text-xs font-semibold text-slate-400">
                        TRADE DIRECTION
                    </Text>

                    <View className="mt-3 flex-row gap-3">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                setTradeType("LONG")
                            }
                            className={`flex-1 flex-row items-center justify-center rounded-xl border py-3 ${tradeType === "LONG"
                                ? "border-emerald-500 bg-emerald-500/10"
                                : "border-slate-700 bg-slate-950"
                                }`}
                        >
                            <Ionicons
                                name="trending-up-outline"
                                size={18}
                                color={
                                    tradeType === "LONG"
                                        ? "#34D399"
                                        : "#64748B"
                                }
                            />

                            <Text
                                className={`ml-2 text-sm font-bold ${tradeType === "LONG"
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                                    }`}
                            >
                                LONG
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                setTradeType("SHORT")
                            }
                            className={`flex-1 flex-row items-center justify-center rounded-xl border py-3 ${tradeType === "SHORT"
                                ? "border-red-500 bg-red-500/10"
                                : "border-slate-700 bg-slate-950"
                                }`}
                        >
                            <Ionicons
                                name="trending-down-outline"
                                size={18}
                                color={
                                    tradeType === "SHORT"
                                        ? "#F87171"
                                        : "#64748B"
                                }
                            />

                            <Text
                                className={`ml-2 text-sm font-bold ${tradeType === "SHORT"
                                    ? "text-red-400"
                                    : "text-slate-500"
                                    }`}
                            >
                                SHORT
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* ENTRY / STOP LOSS */}

                    <View className="mt-5 flex-row gap-3">
                        <InputField
                            label="ENTRY PRICE"
                            value={entry}
                            onChangeText={setEntry}
                            placeholder="0.00000"
                            icon="log-in-outline"
                        />

                        <InputField
                            label="STOP LOSS"
                            value={stopLoss}
                            onChangeText={setStopLoss}
                            placeholder="0.00000"
                            icon="shield-outline"
                        />
                    </View>

                    {/* TAKE PROFIT / EXIT */}

                    <View className="flex-row gap-3">
                        <InputField
                            label="TAKE PROFIT"
                            value={takeProfit}
                            onChangeText={setTakeProfit}
                            placeholder="0.00000"
                            icon="flag-outline"
                        />

                        <InputField
                            label="EXIT PRICE"
                            value={exitPrice}
                            onChangeText={setExitPrice}
                            placeholder="0.00000"
                            icon="log-out-outline"
                        />
                    </View>

                    {/* LOT SIZE / RISK */}

                    <View className="flex-row gap-3">
                        <InputField
                            label="LOT SIZE"
                            value={lotSize}
                            onChangeText={setLotSize}
                            placeholder="0.00"
                            icon="resize-outline"
                        />

                        <InputField
                            label="RISK"
                            value={risk}
                            onChangeText={setRisk}
                            placeholder="0.00"
                            icon="warning-outline"
                        />
                    </View>
                </View>

                {/* ================= CHART SCREENSHOTS ================= */}

                <View className="mt-7">
                    <View className="mb-4">
                        <Text className="text-base font-bold text-white">
                            Chart Screenshots
                        </Text>

                        <Text className="mt-1 text-xs text-slate-500">
                            Add screenshots from your trade analysis.
                        </Text>
                    </View>

                    <ScreenshotCard
                        timeframe="4H"
                        title="4H / 1H — HIGHER TIMEFRAME"
                    />

                    <ScreenshotCard
                        timeframe="15M"
                        title="15M / 5M — MEDIUM TIMEFRAME"
                    />

                    <ScreenshotCard
                        timeframe="5M"
                        title="5M / 1M — ENTRY TIMEFRAME"
                    />
                </View>

                {/* ================= AFTER TRADE MOOD ================= */}

                <Text className="mt-5 text-xs font-semibold text-slate-400">
                    AFTER TRADE MOOD
                </Text>

                <View className="mt-3 flex-row flex-wrap">
                    {MOODS.map((mood) => (
                        <MoodButton
                            key={mood.value}
                            mood={mood}
                            selected={
                                afterMood === mood.value
                            }
                            onPress={() =>
                                setAfterMood(mood.value)
                            }
                        />
                    ))}
                </View>

                {/* ================= RESULT ================= */}

                <Text className="mt-5 text-xs font-semibold text-slate-400">
                    TRADE RESULT
                </Text>

                <View className="mt-3 flex-row gap-2">
                    {(
                        ["Win", "Loss", "Break Even"] as const
                    ).map((item) => {
                        const selected = result === item;

                        return (
                            <TouchableOpacity
                                key={item}
                                activeOpacity={0.8}
                                onPress={() =>
                                    setResult(item)
                                }
                                className={`flex-1 items-center rounded-xl border px-2 py-3 ${selected
                                    ? item === "Win"
                                        ? "border-emerald-500 bg-emerald-500/10"
                                        : item === "Loss"
                                            ? "border-red-500 bg-red-500/10"
                                            : "border-yellow-500 bg-yellow-500/10"
                                    : "border-slate-700 bg-slate-900"
                                    }`}
                            >
                                <Text
                                    className={`text-xs font-semibold ${selected
                                        ? item === "Win"
                                            ? "text-emerald-400"
                                            : item === "Loss"
                                                ? "text-red-400"
                                                : "text-yellow-400"
                                        : "text-slate-400"
                                        }`}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* ================= PNL ================= */}

                <View className="mt-5">
                    <InputField
                        label="P&L"
                        value={pnl}
                        onChangeText={setPnl}
                        placeholder="0.00"
                        icon="cash-outline"
                    />
                </View>

                {/* ================= NOTES ================= */}

                <View className="mt-2">
                    <Text className="mb-2 text-xs font-semibold text-slate-400">
                        NOTES
                    </Text>

                    <View className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="What happened during the trade?"
                            placeholderTextColor="#64748B"
                            multiline
                            textAlignVertical="top"
                            className="min-h-[110px] text-sm text-white"
                        />
                    </View>
                </View>

                {/* ================= LESSON ================= */}

                <View className="mt-5">
                    <Text className="mb-2 text-xs font-semibold text-slate-400">
                        LESSON / TAKEAWAY
                    </Text>

                    <View className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                        <TextInput
                            value={lesson}
                            onChangeText={setLesson}
                            placeholder="What did you learn from this trade?"
                            placeholderTextColor="#64748B"
                            multiline
                            textAlignVertical="top"
                            className="min-h-[100px] text-sm text-white"
                        />
                    </View>
                </View>

                {/* ================= SAVE ================= */}

                <TouchableOpacity
                    activeOpacity={0.85}
                    disabled={isSubmitting}
                    onPress={saveJournal}
                    className={`mt-7 flex-row items-center justify-center rounded-2xl py-4 ${isSubmitting ? "bg-blue-900" : "bg-blue-600"
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                            />

                            <Text className="ml-3 text-sm font-bold text-white">
                                Saving Journal...
                            </Text>
                        </>
                    ) : (
                        <>
                            <Ionicons
                                name="save-outline"
                                size={20}
                                color="#FFFFFF"
                            />

                            <Text className="ml-2 text-sm font-bold text-white">
                                Save Journal
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {/* ================================================= */}
            {/* PAIR MODAL */}
            {/* ================================================= */}

            <Modal
                visible={pairModal}
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setPairModal(false)
                }
            >
                <View className="flex-1 justify-end bg-black/70">
                    <View className="max-h-[80%] rounded-t-3xl bg-slate-950 px-5 pb-8 pt-5">
                        <View className="mb-5 flex-row items-center justify-between">
                            <Text className="text-lg font-bold text-white">
                                Select Pair
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    setPairModal(false)
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            {PAIRS.map((item) => {
                                const selected = pair === item;

                                return (
                                    <TouchableOpacity
                                        key={item}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setPair(item);
                                            setPairModal(false);
                                        }}
                                        className={`mb-2 flex-row items-center justify-between rounded-xl border px-4 py-4 ${selected
                                            ? "border-blue-500 bg-blue-500/10"
                                            : "border-slate-800 bg-slate-900"
                                            }`}
                                    >
                                        <View className="flex-row items-center">
                                            <Ionicons
                                                name="stats-chart-outline"
                                                size={18}
                                                color={
                                                    selected
                                                        ? "#60A5FA"
                                                        : "#64748B"
                                                }
                                            />

                                            <Text
                                                className={`ml-3 text-sm font-semibold ${selected
                                                    ? "text-blue-400"
                                                    : "text-white"
                                                    }`}
                                            >
                                                {item}
                                            </Text>
                                        </View>

                                        {selected && (
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={20}
                                                color="#60A5FA"
                                            />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ================================================= */}
            {/* PLAN MODAL */}
            {/* ================================================= */}

            <Modal
                visible={planModal}
                transparent
                animationType="slide"
                onRequestClose={() =>
                    setPlanModal(false)
                }
            >
                <View className="flex-1 justify-end bg-black/70">
                    <View className="max-h-[70%] rounded-t-3xl bg-slate-950 px-5 pb-8 pt-5">
                        <View className="mb-5 flex-row items-center justify-between">
                            <Text className="text-lg font-bold text-white">
                                Select Trading Plan
                            </Text>

                            <TouchableOpacity
                                onPress={() =>
                                    setPlanModal(false)
                                }
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            {plansList.length === 0 ? (
                                <View className="items-center py-10">
                                    <Ionicons
                                        name="layers-outline"
                                        size={35}
                                        color="#475569"
                                    />

                                    <Text className="mt-3 text-sm text-slate-500">
                                        No trading plans found.
                                    </Text>
                                </View>
                            ) : (
                                plansList.map((plan) => {
                                    const selected = planId === plan.id;

                                    return (
                                        <TouchableOpacity
                                            key={plan.id}
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                setPlanId(plan.id);
                                                setPlanName(plan.name);
                                                setPlanModal(false);
                                            }}
                                            className={`mb-2 flex-row items-center justify-between rounded-xl border px-4 py-4 ${selected
                                                ? "border-teal-500 bg-teal-500/10"
                                                : "border-slate-800 bg-slate-900"
                                                }`}
                                        >
                                            <View className="flex-row items-center">
                                                <Ionicons
                                                    name="layers-outline"
                                                    size={18}
                                                    color={
                                                        selected
                                                            ? "#2DD4BF"
                                                            : "#64748B"
                                                    }
                                                />

                                                <Text
                                                    className={`ml-3 text-sm font-semibold ${selected
                                                        ? "text-teal-400"
                                                        : "text-white"
                                                        }`}
                                                >
                                                    {plan.name}
                                                </Text>
                                            </View>

                                            {selected && (
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={20}
                                                    color="#2DD4BF"
                                                />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* ================================================= */}
            {/* IMAGE PICKER MODAL */}
            {/* ================================================= */}

            <Modal
                visible={imagePickerVisible}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setImagePickerVisible(false)
                }
            >
                <View className="flex-1 items-center justify-end bg-black/70">
                    <View className="w-full rounded-t-3xl bg-slate-950 px-5 pb-10 pt-6">
                        <View className="mb-6 flex-row items-center justify-between">
                            <View>
                                <Text className="text-lg font-bold text-white">
                                    Add Chart Screenshot
                                </Text>

                                <Text className="mt-1 text-xs text-slate-500">
                                    {selectedTimeframe
                                        ? `${selectedTimeframe} timeframe`
                                        : "Select an option"}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() =>
                                    setImagePickerVisible(false)
                                }
                                className="h-10 w-10 items-center justify-center rounded-full bg-slate-900"
                            >
                                <Ionicons
                                    name="close"
                                    size={21}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={takePhoto}
                            className="mb-3 flex-row items-center rounded-2xl border border-slate-800 bg-slate-900 p-4"
                        >
                            <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                                <Ionicons
                                    name="camera-outline"
                                    size={23}
                                    color="#60A5FA"
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="text-sm font-semibold text-white">
                                    Take Photo
                                </Text>

                                <Text className="mt-1 text-xs text-slate-500">
                                    Capture your chart using the camera
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color="#475569"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={pickFromGallery}
                            className="flex-row items-center rounded-2xl border border-slate-800 bg-slate-900 p-4"
                        >
                            <View className="h-11 w-11 items-center justify-center rounded-xl bg-teal-500/10">
                                <Ionicons
                                    name="images-outline"
                                    size={23}
                                    color="#2DD4BF"
                                />
                            </View>

                            <View className="ml-3 flex-1">
                                <Text className="text-sm font-semibold text-white">
                                    Choose from Gallery
                                </Text>

                                <Text className="mt-1 text-xs text-slate-500">
                                    Select an existing chart screenshot
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color="#475569"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}