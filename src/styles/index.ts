import Variables from './Variables';
import { ViewStyle, TextStyle } from 'react-native';

export { Variables };

export default {
    content: {
        padding: 20
    },
    container: {
        //flex: 1
    },
    button: {
        alignItems: 'center',
        backgroundColor: Variables.colors.primary,
        padding: 5,
        borderRadius: 20
    },
    buttonLight: {
        alignItems: 'center',
        color: Variables.colors.primary,
        padding: 5,
        borderRadius: 20
    },
    buttonView: {
        alignItems: 'center',
    } as ViewStyle,
    buttonText: {
        color: "white",
        fontSize: 16
    },
    modalButton: {
        width: 100,
        marginTop: 15,
        borderWidth: 1,
        borderColor: Variables.colors.primary,
        backgroundColor: "#FFF"
    },
    modalButtonText: {
        color: Variables.colors.primary
    },
    textInput: {
        backgroundColor: "transparent",
        height: 40, 
        padding: 0,
        borderBottomWidth: 2,
        borderBottomColor: Variables.colors.primary,
        marginHorizontal: 10,
    },
    h1: {
        fontSize: 24
    },
    h2: {
        fontSize: 20
    },
    h3: {
        fontSize: 16
    },
    h4: {
        fontSize: 12
    },
    h5: {
        fontSize: 10
    },
    scrollContainer: {
        backgroundColor: "#E9E9E9",
    },
    scrollContainerContent: {
        padding: 10,
    }
}