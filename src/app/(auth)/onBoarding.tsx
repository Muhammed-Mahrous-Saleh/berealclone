import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnBoarding() {
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState("");

    const handleComplete = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
    };
    const pickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Needed",
                "Please allow us to access your photos.",
            );
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
        }
        console.log(result);
    };
    return (
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Complete Your Profile</Text>
                    <Text style={styles.subtitle}>
                        Add your information to get started
                    </Text>
                </View>
                <View style={styles.form}>
                    <TouchableOpacity
                        style={styles.imageContainer}
                        disabled={isLoading}
                        onPress={pickImage}
                    >
                        <View style={styles.placeholderImage}>
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <Text style={styles.placeholderText}>+</Text>
                            )}
                        </View>
                        <View style={styles.editBadge}>
                            <Text style={styles.editText}>Edit</Text>
                        </View>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor={"#999"}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        editable={!isLoading}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="User Name"
                        placeholderTextColor={"#999"}
                        value={userName}
                        onChangeText={setUserName}
                        autoCapitalize="none"
                        autoComplete="username"
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleComplete}
                    >
                        {isLoading ? (
                            <ActivityIndicator size={24} color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>
                                Complete Profile
                            </Text>
                        )}
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
    header: {
        marginBottom: 32,
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
        alignItems: "center",
    },
    imageContainer: {
        marginBottom: 32,
        position: "relative",
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        backgroundColor: "#f5f5f5",
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderColor: "#e0e0e0",
        borderStyle: "dashed",
        marginInline: "auto",
    },
    placeholderText: {
        fontSize: 52,
        color: "#999",
    },
    editBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#000",
        padding: 8,
        borderRadius: 12,
    },
    editText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
    },
    input: {
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        width: "100%",
    },
    button: {
        backgroundColor: "#000",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        width: "100%",
        height: 55,
        justifyContent: "center",
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
