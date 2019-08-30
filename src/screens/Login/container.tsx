import React from "react";
import { Text, View, Image, StatusBar, KeyboardAvoidingView, ScrollView } from "react-native";

import loginStyles from "./styles";

interface Props {
    subtitulo: string;
}

export default class Container extends React.Component<Props> {
    render() {
        return (
            <KeyboardAvoidingView style={[loginStyles.container]} behavior={"height"}>
                <ScrollView style={loginStyles.content}>
                    <StatusBar
                        animated={true}
                        translucent={false}
                        barStyle={'dark-content'}
                        backgroundColor={'#FFFFFF'}
                    />

                    <View style={loginStyles.header}>
                        <Image source={require("../../assets/logo.png")} style={loginStyles.logo} resizeMode="contain" />
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