import { useRouter } from "expo-router";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
    const router = useRouter();
    return (
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Create an account</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>
                <View style={styles.form}>
                    <TextInput
                        placeholder="Email..."
                        placeholderTextColor={"#999"}
                        keyboardType="email-address"
                        autoComplete="email"
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Password..."
                        placeholderTextColor={"#999"}
                        autoComplete="password"
                        secureTextEntry
                        autoCapitalize="none"
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => {
                            router.push("./login");
                        }}
                    >
                        <Text style={styles.linkButtonText}>
                            Already have an account?{" "}
                            <Text style={styles.linkButtonTextBold}>
                                Sign in
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
        color: "#666",
    },
    form: {
        width: "100%",
    },
    input: {
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#000",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
    },
    linkButton: {
        marginTop: 24,
        alignItems: "center",
    },
    linkButtonText: {
        color: "#666",
        fontSize: 14,
    },
    linkButtonTextBold: {
        fontWeight: 600,
        color: "#000",
    },
});
