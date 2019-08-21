import { Alert } from "react-native";

export const AsyncAlert = async (texto) => new Promise((resolve) => {
    Alert.alert(
        'info',
        texto,
        [
            {
                text: 'Ok',
                onPress: () => {
                    resolve();
                },
            },
        ],
        { cancelable: true },
    );
});