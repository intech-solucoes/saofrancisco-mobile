import React from "react";
import { View, Text } from "react-native";
import { Variables } from "../styles";

interface Props {
    titulo?: string;
    subtitulo?: string;
    children: any;
}

export default class Box extends React.Component<Props> {
    render() {
        return (
            <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 5, margin: 5 }}>
                <View style={{ marginBottom: 5 }}>
                    {this.props.titulo && 
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                            {this.props.titulo}
                        </Text>
                    }

                    {this.props.subtitulo &&
                        <Text style={{ fontSize: 16, color: Variables.colors.secondary }}>
                            {this.props.subtitulo}
                        </Text>
                    }
                </View>

                <View style={{ marginVertical: 5 }}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}