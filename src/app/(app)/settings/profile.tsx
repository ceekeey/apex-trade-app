import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
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

export default function ProfileSettings() {
    const router = useRouter();

    const [name, setName] = useState("Alex Trader");
    const [email, setEmail] = useState("alex@tradersedge.io");
    const [bio, setBio] = useState("Focused on London Breakouts & XAUUSD setups.");
    const [avatar, setAvatar] = useState<string | null>(null);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission required", "Please allow access to your photos to change your profile picture.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        Alert.alert("Success", "Profile updated successfully.", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background"
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
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
                        activeOpacity={0.8}
                        className="h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface"
                    >
                        <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
                    </TouchableOpacity>
                    <View className="ml-3">
                        <Text className="text-2xl font-bold text-text-primary">Profile Settings</Text>
                        <Text className="mt-0.5 text-xs text-text-muted">Update your personal information</Text>
                    </View>
                </View>

                {/* Avatar Section */}
                <View className="mt-8 items-center">
                    <TouchableOpacity activeOpacity={0.85} onPress={pickImage} className="relative">
                        <View className="h-28 w-28 overflow-hidden rounded-full border-2 border-primary bg-surface items-center justify-center shadow-xl">
                            {avatar ? (
                                <Image source={{ uri: avatar }} className="h-full w-full" resizeMode="cover" />
                            ) : (
                                <Ionicons name="person" size={48} color="#3B82F6" />
                            )}
                        </View>
                        <View className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full bg-primary border-2 border-background">
                            <Ionicons name="camera" size={16} color="#FFFFFF" />
                        </View>
                    </TouchableOpacity>
                    <Text className="mt-3 text-xs font-semibold text-text-secondary">Tap to change avatar</Text>
                </View>

                {/* Form Fields */}
                <View className="mt-8">
                    <Text className="text-xs font-semibold text-text-secondary">FULL NAME</Text>
                    <View className="mt-2 flex-row items-center rounded-2xl border border-border bg-surface px-4">
                        <Ionicons name="person-outline" size={18} color="#64748B" />
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor="#64748B"
                            className="ml-3 flex-1 py-4 text-sm text-text-primary"
                        />
                    </View>

                    <Text className="mt-5 text-xs font-semibold text-text-secondary">EMAIL ADDRESS</Text>
                    <View className="mt-2 flex-row items-center rounded-2xl border border-border bg-surface px-4">
                        <Ionicons name="mail-outline" size={18} color="#64748B" />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor="#64748B"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="ml-3 flex-1 py-4 text-sm text-text-primary"
                        />
                    </View>

                    <Text className="mt-5 text-xs font-semibold text-text-secondary">TRADING BIO</Text>
                    <TextInput
                        value={bio}
                        onChangeText={setBio}
                        multiline
                        textAlignVertical="top"
                        placeholder="Describe your trading style..."
                        placeholderTextColor="#64748B"
                        className="mt-2 min-h-[100px] rounded-2xl border border-border bg-surface px-4 py-4 text-sm text-text-primary"
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleSave}
                    className="mt-8 flex-row items-center justify-center rounded-2xl bg-primary py-4 shadow-lg"
                >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                    <Text className="ml-2 text-sm font-bold text-white">Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}