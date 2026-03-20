import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
    const { user } = useAuth();
    // check if the user is logged in
    if (!user) return <Redirect href="/(auth)/login" />;

    return <Redirect href="/(tabs)" />;
}
