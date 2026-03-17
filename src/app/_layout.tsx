import { Slot, useRouter } from "expo-router";
import "expo-router/entry";
import { useEffect } from "react";

export default function RootLayout() {
    const router = useRouter();
    let isAuth = true;
    useEffect(() => {
        if (!isAuth) {
            router.replace("./(auth)/login");
        } else {
            router.replace("./(tabs)");
        }
    });
    return <Slot />;
    {
        /* <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
            </Stack> */
    }
}
