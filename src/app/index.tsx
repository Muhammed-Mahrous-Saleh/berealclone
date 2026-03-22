import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
    const { user } = useAuth();
    // check if the user is logged in
    if (!user) return <Redirect href="/(auth)/login" />;
    if (!user.onboarding_completed)
        return <Redirect href="/(auth)/onBoarding" />;
    return <Redirect href="/(tabs)" />;
}
