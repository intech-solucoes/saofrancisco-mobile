import React from "react";
import { Text, View, Image, StatusBar } from "react-native";
import VersionNumber from 'react-native-version-number';

import Styles, { Variables } from "../../styles";
import loginStyles from "./styles";

export default class Container extends React.Component {
    render() {
        return (
            <View style={loginStyles.container}>

                <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.20)" animated />

                <View style={[Styles.content, loginStyles.content]}>
                    <Image source={require("../../assets/Logo.png")} style={loginStyles.logo} />
                </View>

                <View style={loginStyles.footer}>
                    {this.props.children}
                </View>

                <Text style={{ marginBottom: 10, padding: 5, textAlign:"center", color: "#8F8E93" }}>
                    Versão {VersionNumber.appVersion}
                </Text>
                
            </View>
        );
    }
}
