import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
    const [showPreview, setShowPreview] = useState(false);
    const [description, setDescription] = useState("");
    const [realImage, setRealImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
            setRealImage(result.assets[0].uri);
            setShowPreview(true);
            setDescription("");
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
            setRealImage(result.assets[0].uri);
            setShowPreview(true);
            setDescription("");
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
    const handleCancel = () => {
        setRealImage("");
        setDescription("");
        setShowPreview(false);
    };
    const handlePost = () => {
        if (!realImage) return;
        try {
            setIsLoading(true);
            // uploadProfileImage(realImage, description);
            setRealImage("");
            setDescription("");
            setShowPreview(false);
        } catch (error) {
            console.error("Error on creating post:", error);
            Alert.alert("Error", "Failed to create post. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.container} edges={["bottom", "top"]}>
            <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
            <Modal visible={showPreview} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Preview Your Post</Text>
                        {realImage && (
                            <Image
                                style={styles.previewImage}
                                source={{ uri: realImage }}
                                contentFit="cover"
                            />
                        )}
                        <TextInput
                            style={styles.descriptionInput}
                            placeholder="Description"
                            placeholderTextColor={"#999"}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            maxLength={500}
                            textAlignVertical="top"
                            editable={!isLoading}
                        />
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    styles.cancelButton,
                                ]}
                                onPress={handleCancel}
                                disabled={isLoading}
                            >
                                <Text style={styles.cancelButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.postButton]}
                                onPress={handlePost}
                                disabled={isLoading}
                            >
                                <Text style={styles.postButtonText}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    fab: {
        position: "absolute",
        bottom: "5%",
        right: "7%",
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabText: {
        fontSize: 32,
        color: "#fff",
        fontWeight: "300",
        lineHeight: 32,
    },
    input: {
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
        width: "80%",
        marginInline: "auto",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalContent: {
        backgroundColor: "#fff",

        borderRadius: 16,
        padding: 20,
        width: "100%",
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    previewImage: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 12,
        marginBottom: 16,
    },
    descriptionInput: {
        width: "100%",
        minHeight: 80,
        maxHeight: 120,
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        color: "#000",
    },
    modalButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#f5f5f5",
    },
    cancelButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
    postButton: {
        backgroundColor: "#000",
    },
    postButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
