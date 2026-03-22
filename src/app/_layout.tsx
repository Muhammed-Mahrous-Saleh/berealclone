import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import "expo-router/entry";
import { useEffect } from "react";
import { StatusBar } from "react-native";

function RouteGuard() {
    const router = useRouter();
    const { user } = useAuth();
    const segments = useSegments();

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    useEffect(() => {
        if (!user) {
            if (!inAuthGroup) {
                router.replace("/(auth)/login");
            }
        } else {
            if (!inTabsGroup) {
                if (!user.onboarding_completed) {
                    router.replace("/(auth)/onBoarding");
                } else {
                    router.replace("/(tabs)");
                }
            }
        }
    }, [user, segments, router]);
    return (
        <>
            <StatusBar backgroundColor="black" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="index" />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RouteGuard />
        </AuthProvider>
    );
}
