import { Variables } from "../../styles";
import { ViewStyle, TextStyle } from "react-native";

export default {
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1
    },
    header: {
        paddingHorizontal: 100,
        paddingVertical: 50,
        marginTop: 20,
        alignItems: "center"
    } as ViewStyle,
    subtitulo: {
        marginBottom: 30,
        alignItems: "center"
    } as ViewStyle,
    subtituloTexto: {
        color: "#939393",
        fontSize: 18,
        textAlign: "center"
    } as TextStyle,
    logo: {
        width: 300
    },
    content: {
        padding: 20,
        //margin: 20,
        marginBottom: 10,
        backgroundColor: "#FFF",
        borderRadius: 10
    },
    label: {
        color: Variables.colors.grayDark,
        marginLeft: 10,
        fontSize: 12,
        fontWeight: "bold"
    } as TextStyle,
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
        marginTop: 40,
        padding: 15,
        borderRadius: 40
    }
}; 