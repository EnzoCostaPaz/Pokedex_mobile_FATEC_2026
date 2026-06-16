import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { loginUser, registerUser } from "@/services/authService";
import { setAuthToken } from "@/services/apiServer";
import { AuthSession } from "@/@types/api";

const STORAGE_KEY = "@pokedex:session";

type AuthContextData = {
    isAuthenticated: boolean;
    user: string | null;
    userId: string | null;
    token: string | null;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restaura a sessão salva ao abrir o app.
    useEffect(() => {
        async function restoreSession() {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const saved: AuthSession = JSON.parse(raw);
                    if (saved?.userId) {
                        setSession(saved);
                        setAuthToken(saved.token);
                    } else {
                        // Sessão antiga sem userId válido: descarta para forçar novo login.
                        await AsyncStorage.removeItem(STORAGE_KEY);
                    }
                }
            } catch (error) {
                console.error("Erro ao restaurar sessão:", error);
            } finally {
                setIsLoading(false);
            }
        }
        restoreSession();
    }, []);

    async function persistSession(newSession: AuthSession) {
        setSession(newSession);
        setAuthToken(newSession.token);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    }

    async function signIn(username: string, password: string) {
        const newSession = await loginUser(username, password);
        await persistSession(newSession);
    }

    async function register(username: string, password: string) {
        const newSession = await registerUser(username, password);
        // Se o registro já retornar uma sessão válida, autentica de imediato.
        if (newSession.userId || newSession.token) {
            await persistSession(newSession);
        }
    }

    async function signOut() {
        setSession(null);
        setAuthToken(null);
        await AsyncStorage.removeItem(STORAGE_KEY);
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!session,
                user: session?.username ?? null,
                userId: session?.userId ?? null,
                token: session?.token ?? null,
                isLoading,
                signIn,
                register,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
