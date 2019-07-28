import { ViewStyle } from "react-native";

export default {
    container: {
        flex: 1,
    } as ViewStyle,
    header: {
        flex: 1,
        padding: 30,
        paddingTop: 50,
        alignItems: "center"
    } as ViewStyle,
    headerImage: {
        height: 130,
        width: 174
    },
    navSectionStyle: {
        paddingTop: 10
    } as ViewStyle,
    navItemStyle: {
        padding: 10,
        flex: 1, 
        flexDirection: 'row'
    } as ViewStyle,
    navIcon: {
        width: 26,
        height: 26,
        marginRight: 10
    },
    navText: {
        marginTop: 0
    } as ViewStyle,
    footerContainer: {
        padding: 20
    } as ViewStyle
};