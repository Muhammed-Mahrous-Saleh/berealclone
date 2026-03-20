import { supabase } from "@/lib/supabase/client";
import { createContext, ReactNode, useContext, useState } from "react";

export interface User {
    id: string;
    name?: string;
    email?: string;
    user_name?: string;
    profile_image_url?: string;
    onboarding_completed?: boolean;
}
interface AuthContextType {
    user: User | null;
    signUp: (email: string, password: string) => Promise<User | undefined>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const signIn = async (email: string, password: string) => {};

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        if (data.user) {
            setUser(data.user);
            return data.user;
        }
    };
    const updateUser = async (userData: Partial<User>) => {
        if (!user) return;

        try {
            const updateData: Partial<User> = {};
            if (userData.name !== undefined) updateData.name = userData.name;
            if (userData.user_name !== undefined)
                updateData.user_name = userData.user_name;
            if (userData.profile_image_url !== undefined)
                updateData.profile_image_url = userData.profile_image_url;
            if (userData.onboarding_completed !== undefined)
                updateData.onboarding_completed = userData.onboarding_completed;

            const { error } = await supabase
                .from("profiles")
                .update(updateData)
                .eq("id", user.id);
            if (error) throw error;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    };
    return (
        <AuthContext.Provider value={{ user, signUp, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};
