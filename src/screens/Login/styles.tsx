import { Variables } from "../../styles";
import { ViewStyle } from "react-native";

export default {
    container: {
        backgroundColor: "#E9E9E9",
        flex: 1
    },
    header: {
        paddingHorizontal: 100,
        paddingVertical: 50,
        marginTop: 40,
        alignItems: "center"
    } as ViewStyle,
    subtitulo: {
        marginBottom: 30,
        alignItems: "center"
    } as ViewStyle,
    subtituloTexto: {
        color: "#939393",
        fontSize: 18
    },
    logo: {
        height: 90,
        width: 170
    },
    content: {
        padding: 15,
        margin: 20,
        marginBottom: 10,
        backgroundColor: "#FFF",
        borderRadius: 10
    },
    label: {
        color: Variables.colors.primary,
        marginLeft: 10,
        fontSize: 12
    },
    loginFingerprint: {
        backgroundColor: Variables.colors.primary,
        marginRight: 0,
        borderRadius: 30
    },
    remember: {
        
    },
    labelRemeber: {
        color: Variables.colors.primary,
        marginTop: 4
        
    },
    loginButton: {
        marginTop: 10
    }
}; 