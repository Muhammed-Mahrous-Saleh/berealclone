import { supabase } from "@/lib/supabase/client";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { ActivityIndicator, View } from "react-native";

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
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        setIsLoading(true);
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session?.user) {
                const profile = await fetchUserProfile(session.user.id);
                setUser(profile);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error checking session:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();
            if (error)
                throw {
                    error,
                    message: "Error while fetch user profile.",
                };
            if (!data) {
                throw {
                    error,
                    message: "User profile not found.",
                };
            }
            const authUser = await supabase.auth.getUser();
            if (!authUser.data.user) {
                throw {
                    error,
                    message: "User not authenticated.",
                };
            }
            return {
                id: data.id,
                name: data.name,
                user_name: data.user_name,
                profile_image_url: data.profile_image_url,
                onboarding_completed: data.onboarding_completed,
                email: authUser.data.user.email,
            };
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        if (data.user) {
            const profile = await fetchUserProfile(data.user.id);
            setUser(profile);
        }
    };

    const signUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        if (data.user) {
            const profile = await fetchUserProfile(data.user.id);
            setUser(profile);
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
        <AuthContext.Provider value={{ user, signIn, signUp, updateUser }}>
            {(isLoading && (
                <View>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            )) ||
                children}
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
