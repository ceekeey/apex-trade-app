import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../context/AuthContext";
const SERVER_URI = "https://apextrade-api-9i8k.onrender.com/api";

type DayStatus = "WIN" | "LOSS" | "MIXED" | "OPEN" | "EMPTY";

type JournalDay = {
    date: number;
    status: DayStatus;
    pnl?: number;
    trades?: number;
};

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatCurrency = (value: number): string => {
    const abs = Math.abs(value);
    if (value > 0) return `+$${abs}`;
    if (value < 0) return `-$${abs}`;
    return "$0";
};

export default function Trades() {
    const router = useRouter();
    const { token } = useAuth();
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const [journalData, setJournalData] = useState<Record<string, JournalDay>>({});
    const [monthStats, setMonthStats] = useState({ totalTrades: 0, totalPnl: 0, winningDays: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Journal Entries from Backend API
    useEffect(() => {
        const fetchJournals = async () => {
            try {
                setIsLoading(true);
                // Updated endpoint from /journal/all to /jornal/all
                const response = await fetch(`${SERVER_URI}/jornal/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const result = await response.json();

                if (result.success) {
                    const entriesMap: Record<string, JournalDay> = {};

                    // Map backend response data array into calendar records
                    result.data.forEach((item: any) => {
                        const itemDate = new Date(item.date);
                        const key = formatDateKey(itemDate);

                        let status: DayStatus = "MIXED";
                        if (item.pnl > 0) status = "WIN";
                        else if (item.pnl < 0) status = "LOSS";

                        if (entriesMap[key]) {
                            entriesMap[key].pnl = (entriesMap[key].pnl || 0) + item.pnl;
                            entriesMap[key].trades = (entriesMap[key].trades || 0) + 1;
                        } else {
                            entriesMap[key] = {
                                date: itemDate.getDate(),
                                status,
                                pnl: item.pnl,
                                trades: 1,
                            };
                        }
                    });

                    setJournalData(entriesMap);

                    if (result.stats) {
                        setMonthStats({
                            totalTrades: result.stats.totalTrades || 0,
                            totalPnl: result.stats.totalPnl || 0,
                            winningDays: result.stats.winningTrades || 0,
                        });
                    }
                } else {
                    Toast.show({
                        type: "error",
                        text1: "Failed to load journals",
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

        fetchJournals();
    }, [currentMonth, currentYear]);
    const daysInMonth = useMemo(
        () => new Date(currentYear, currentMonth + 1, 0).getDate(),
        [currentMonth, currentYear]
    );

    const firstDayOfMonth = useMemo(() => {
        const day = new Date(currentYear, currentMonth, 1).getDay();
        return day === 0 ? 6 : day - 1;
    }, [currentMonth, currentYear]);

    const calendarDays = useMemo(() => {
        const cells: Array<number | null> = [];
        for (let index = 0; index < firstDayOfMonth; index += 1) {
            cells.push(null);
        }
        for (let day = 1; day <= daysInMonth; day += 1) {
            cells.push(day);
        }
        while (cells.length % 7 !== 0) {
            cells.push(null);
        }
        return cells;
    }, [daysInMonth, firstDayOfMonth]);

    const todayKey = formatDateKey(today);
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((year) => year - 1);
        } else {
            setCurrentMonth((month) => month - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((year) => year + 1);
        } else {
            setCurrentMonth((month) => month + 1);
        }
    };

    const goToToday = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    const openJournal = (day: number) => {
        const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        router.push({
            pathname: "/(app)/dailyjornal/[date]",
            params: { date },
        });
    };

    const getStatusStyle = (status?: DayStatus) => {
        switch (status) {
            case "WIN": return "bg-success";
            case "LOSS": return "bg-danger";
            case "MIXED": return "bg-primary";
            case "OPEN": return "bg-warning";
            default: return "bg-transparent";
        }
    };

    const getStatusTextStyle = (status?: DayStatus) => {
        switch (status) {
            case "WIN": return "text-success";
            case "LOSS": return "text-danger";
            case "MIXED": return "text-primary";
            case "OPEN": return "text-warning";
            default: return "text-text-muted";
        }
    };

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
                <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-4">
                        <Text className="text-3xl font-bold text-text-primary">Journal</Text>
                        <Text className="mt-1 text-sm text-text-muted">
                            Track your trading journey day by day.
                        </Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={goToToday}
                        className="flex-row items-center rounded-xl border border-border bg-surface px-3 py-2"
                    >
                        <Ionicons name="today-outline" size={16} color="#3B82F6" />
                        <Text className="ml-2 text-xs font-semibold text-text-primary">Today</Text>
                    </TouchableOpacity>
                </View>

                {/* Monthly Overview Card */}
                <View className="mt-6 rounded-3xl border border-border bg-surface p-5">
                    <Text className="text-[10px] font-semibold uppercase tracking-[1.5px] text-text-muted">
                        Monthly overview
                    </Text>

                    <View className="mt-2 flex-row items-center justify-between">
                        <Text className="text-xl font-bold text-text-primary">
                            {MONTHS[currentMonth]} {currentYear}
                        </Text>
                        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-surface-alt border border-border">
                            <Ionicons name="calendar-outline" size={21} color="#94A3B8" />
                        </View>
                    </View>

                    {isLoading ? (
                        <View className="py-8 items-center justify-center">
                            <ActivityIndicator size="small" color="#3B82F6" />
                        </View>
                    ) : (
                        <View className="mt-5 flex-row">
                            <View className="flex-1">
                                <Text className="text-[11px] text-text-muted">Trades</Text>
                                <Text className="mt-1 text-lg font-bold text-text-primary">
                                    {monthStats.totalTrades}
                                </Text>
                            </View>

                            <View className="flex-1 border-l border-border pl-4">
                                <Text className="text-[11px] text-text-muted">Winning days</Text>
                                <Text className="mt-1 text-lg font-bold text-success">
                                    {monthStats.winningDays}
                                </Text>
                            </View>

                            <View className="flex-1 border-l border-border pl-4">
                                <Text className="text-[11px] text-text-muted">P&amp;L</Text>
                                <Text
                                    className={`mt-1 text-lg font-bold ${monthStats.totalPnl >= 0 ? "text-success" : "text-danger"
                                        }`}
                                >
                                    {formatCurrency(monthStats.totalPnl)}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Month Navigator Controls */}
                <View className="mt-6 flex-row items-center justify-between">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={goToPreviousMonth}
                        className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface"
                    >
                        <Ionicons name="chevron-back" size={18} color="#CBD5E1" />
                    </TouchableOpacity>

                    <View className="items-center">
                        <Text className="text-base font-bold text-text-primary">{MONTHS[currentMonth]}</Text>
                        <Text className="mt-0.5 text-xs text-text-muted">{currentYear}</Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={goToNextMonth}
                        className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface"
                    >
                        <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                    </TouchableOpacity>
                </View>

                {/* Calendar Grid Container */}
                <View className="mt-5 overflow-hidden rounded-3xl border border-border bg-surface p-3">
                    <View className="mb-2 flex-row">
                        {WEEKDAYS.map((day) => (
                            <View key={day} className="flex-1 items-center py-2">
                                <Text className="text-[10px] font-bold tracking-[1.2px] text-text-muted">
                                    {day}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {isLoading ? (
                        <View className="py-20 items-center justify-center">
                            <ActivityIndicator size="large" color="#3B82F6" />
                        </View>
                    ) : (
                        <View className="flex-row flex-wrap">
                            {calendarDays.map((day, index) => {
                                if (day === null) {
                                    return (
                                        <View
                                            key={`empty-${index}`}
                                            style={{ width: `${100 / 7}%`, aspectRatio: 0.9 }}
                                        />
                                    );
                                }

                                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                const journalEntry = journalData[dateKey];
                                const isToday = dateKey === todayKey && isCurrentMonth;

                                return (
                                    <TouchableOpacity
                                        key={dateKey}
                                        activeOpacity={0.75}
                                        onPress={() => openJournal(day)}
                                        style={{ width: `${100 / 7}%`, aspectRatio: 0.9, padding: 4 }}
                                    >
                                        <View
                                            className={`flex-1 items-center justify-center rounded-2xl border ${isToday
                                                ? "border-primary bg-primary/10"
                                                : journalEntry
                                                    ? "border-border/50 bg-surface-alt"
                                                    : "border-transparent bg-transparent"
                                                }`}
                                        >
                                            <Text
                                                className={`text-sm font-semibold ${isToday
                                                    ? "text-primary font-bold"
                                                    : journalEntry
                                                        ? "text-text-primary"
                                                        : "text-text-secondary"
                                                    }`}
                                            >
                                                {day}
                                            </Text>

                                            {journalEntry && (
                                                <View className="mt-1 items-center">
                                                    <View
                                                        className={`h-1.5 w-1.5 rounded-full ${getStatusStyle(
                                                            journalEntry.status
                                                        )}`}
                                                    />
                                                    <Text
                                                        className={`mt-0.5 text-[9px] font-bold ${getStatusTextStyle(
                                                            journalEntry.status
                                                        )}`}
                                                    >
                                                        {journalEntry.status === "OPEN"
                                                            ? "Open"
                                                            : journalEntry.pnl !== undefined
                                                                ? formatCurrency(journalEntry.pnl)
                                                                : ""}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* Legend */}
                <View className="mt-5 flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2">
                    <View className="flex-row items-center">
                        <View className="h-2 w-2 rounded-full bg-success" />
                        <Text className="ml-2 text-xs text-text-muted">Profit</Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="h-2 w-2 rounded-full bg-danger" />
                        <Text className="ml-2 text-xs text-text-muted">Loss</Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="h-2 w-2 rounded-full bg-primary" />
                        <Text className="ml-2 text-xs text-text-muted">Mixed</Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="h-2 w-2 rounded-full bg-warning" />
                        <Text className="ml-2 text-xs text-text-muted">Open</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}