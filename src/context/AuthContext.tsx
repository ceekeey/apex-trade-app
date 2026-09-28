import * as Burnt from "burnt";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

const SERVER_URI = "https://apextrade-api-9i8k.onrender.com/api";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check persisted session on boot
    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync("apex_token");
                const storedUser = await SecureStore.getItemAsync("apex_user");
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error("Failed to load session", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadStoredAuth();
    }, []);

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${SERVER_URI}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                Burnt.toast({
                    title: "Registration Failed",
                    preset: "error",
                    message: data.error || "Something went wrong.",
                });
                return false;
            }

            // Save to state & secure storage
            setToken(data.token);
            setUser(data.user);
            await SecureStore.setItemAsync("apex_token", data.token);
            await SecureStore.setItemAsync("apex_user", JSON.stringify(data.user));

            Burnt.toast({
                title: "Welcome!",
                preset: "done",
                message: "Account created successfully.",
            });
            return true;
        } catch (error) {
            Burnt.toast({
                title: "Network Error",
                preset: "error",
                message: "Unable to reach server. Check connection.",
            });
            return false;
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch(`${SERVER_URI}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                Burnt.toast({
                    title: "Login Failed",
                    preset: "error",
                    message: data.error || "Invalid credentials.",
                });
                return false;
            }

            // Save to state & secure storage
            setToken(data.token);
            setUser(data.user);
            await SecureStore.setItemAsync("apex_token", data.token);
            await SecureStore.setItemAsync("apex_user", JSON.stringify(data.user));

            Burnt.toast({
                title: "Welcome Back!",
                preset: "done",
                message: "Logged in successfully.",
            });
            return true;
        } catch (error) {
            Burnt.toast({
                title: "Network Error",
                preset: "error",
                message: "Unable to reach server. Check connection.",
            });
            return false;
        }
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        await SecureStore.deleteItemAsync("apex_token");
        await SecureStore.deleteItemAsync("apex_user");
        Burnt.toast({ title: "Logged out", preset: "done" });
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);