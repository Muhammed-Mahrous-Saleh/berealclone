import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { uploadProfileImage } from "@/lib/supabase/storage";
import { Text } from "@react-navigation/elements";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
    const { user, updateUser, checkSession } = useAuth();
    const router = useRouter();

    const handleComplete = async () => {
        setIsLoading(true);

        try {
            if (!user) {
                throw { message: "User not found" };
            }
            if (!name || !userName) {
                throw { message: "Please fill in all fields." };
            } else if (userName.length < 3) {
                throw { message: "User name must be at least 3 characters." };
            }
            // check if user name already exists
            const { data: existingUser } = await supabase
                .from("profiles")
                .select("id")
                .eq("user_name", userName)
                .neq("id", user.id)
                .single();

            if (existingUser) {
                throw {
                    message:
                        "User name already taken, Please choose another one.",
                };
            }

            //  Upload profile img
            let profileImageUrl: string | undefined;
            if (profileImage) {
                try {
                    profileImageUrl = await uploadProfileImage(
                        user.id,
                        profileImage,
                    );
                } catch (error) {
                    throw { message: "Failed to upload profile image." };
                }
            }

            await updateUser({
                profile_image_url: profileImageUrl,
                name,
                user_name: userName,
                onboarding_completed: true,
            });
            await checkSession();
            router.replace("/(tabs)");
        } catch (error: { message: string } | any) {
            Alert.alert(
                "Error",
                error.message || "Failed to complete profile.",
            );
        } finally {
            setIsLoading(false);
        }
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
    };

    const takeAPhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Needed",
                "Please allow us to access your camera.",
            );
            return;
        }
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const showImagePicker = () => {
        Alert.alert("Select Profile Image", "Choose an option", [
            {
                text: "Camera",
                onPress: takeAPhoto,
            },
            {
                text: "Gallery",
                onPress: pickImage,
            },
            {
                text: "Cancel",
                style: "cancel",
            },
        ]);
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
                        onPress={showImagePicker}
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
