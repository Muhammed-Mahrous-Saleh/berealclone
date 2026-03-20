import { Redirect } from "expo-router";

export default function Index() {
    // You can also add logic here to check if the user is logged in
    // if (!isLoggedIn) return <Redirect href="/(auth)/login" />;

    return <Redirect href="/(tabs)" />;
}
