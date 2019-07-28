import React from "react";
import { Text, View, Image, StatusBar, KeyboardAvoidingView, ScrollView } from "react-native";

import loginStyles from "./styles";

interface Props {
    subtitulo: string;
}

export default class Container extends React.Component<Props> {
    render() {
        return (
            <KeyboardAvoidingView style={[loginStyles.container]} behavior={"padding"}>
                <ScrollView>

                    <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.20)" animated />

                    <View style={loginStyles.header}>
                        <Image source={require("../../assets/logo.png")} style={loginStyles.logo} />
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