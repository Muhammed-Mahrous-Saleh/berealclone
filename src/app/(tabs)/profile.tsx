import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
    const router = useRouter();
    const { signOut } = useAuth();
    const handleLogout = async () => {
        await signOut();
        router.replace("/(auth)/login");
    };
    const { user } = useAuth();
    return (
        <View style={styles.container}>
            <Text>Profile Screen.</Text>
            <Image
                style={{ width: 100, height: 100 }}
                source={{ uri: user?.profile_image_url }}
            />
            <Text>{user?.email}</Text>
            <Text>{user?.name}</Text>
            <Text>{user?.user_name}</Text>
            <TouchableOpacity onPress={handleLogout}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
