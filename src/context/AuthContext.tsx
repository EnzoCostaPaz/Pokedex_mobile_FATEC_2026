import React, { createContext, useState, useContext } from "react";

type AuthContexData = {
    isAuthenticated: boolean;
    user: string | null;
    isLoading: boolean;
    signIn: (username: string) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContexData>({} as AuthContexData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState(false); 

    function signIn(username: string) {
        setIsAuthenticated(true);
        setUser(username);
    }

    function signOut() {
        setIsAuthenticated(false);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);