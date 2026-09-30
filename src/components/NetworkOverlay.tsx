// components/NetworkOverlay.tsx
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

export function NetworkOverlay() {
    const [isConnected, setIsConnected] = useState<boolean | null>(true);

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener((state) => {
            // isConnected can be null initially, treat false/null carefully
            setIsConnected(state.isConnected ?? true);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (isConnected) return null;

    return (
        <Modal
            transparent
            animationType="fade"
            visible={!isConnected}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View className="items-center justify-center p-6 bg-slate-800 rounded-2xl mx-6 shadow-xl border border-slate-700">
                    <ActivityIndicator size="large" color="#EF4444" className="mb-4" />
                    <Text className="text-white text-lg font-bold text-center mb-2">
                        No Internet Connection
                    </Text>
                    <Text className="text-slate-400 text-sm text-center">
                        Please check your connection. App interactions are paused to prevent errors.
                    </Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill, // Fixed: changed absoluteFillObject to absoluteFill
        backgroundColor: "rgba(15, 23, 42, 0.92)", // Dark backdrop blocking interactions
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999, // Guarantees it sits above all UI elements
    },
});