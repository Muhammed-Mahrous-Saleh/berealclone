import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
    return (
        <View style={styles.container}>
            <Text>Edit src/app/index.tsx to edit this screen.</Text>
            <Image source={require("@/assets/images/expo-logo.png")} />
            <Link href="./about">Open about</Link>
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
