import React from "react";
import { Text, View, Image, StatusBar, KeyboardAvoidingView, ScrollView } from "react-native";

import Styles, { Variables } from "../../styles";
import loginStyles from "./styles";

export default class Container extends React.Component {
    render() {
        return (
            <KeyboardAvoidingView style={[loginStyles.container]}>
                <ScrollView>

                    <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.20)" animated />

                    <View style={[loginStyles.header]}>
                        <Image source={require("../../assets/Logo.png")} style={loginStyles.logo} />
                    </View>

                    <View style={loginStyles.subtitulo}>
                        <Text style={loginStyles.subtituloTexto}>{this.props.subtitulo}</Text>
                    </View>

                    {this.props.children}
                </ScrollView>
                
            </KeyboardAvoidingView>
        );
    }
}
