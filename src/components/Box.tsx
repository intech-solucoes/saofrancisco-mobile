import React from "react";
import { View, Text } from "react-native";
import { Variables } from "../styles";

interface Props {
    titulo?: string;
    subtitulo?: string;
    children: any;
    style?: any;
}

export default class Box extends React.Component<Props> {
    render() {
        return (
            <View style={[
                {
                    padding: 10,
                    backgroundColor: '#FFF',
                    borderRadius: 5,
                    margin: 5
                },
                this.props.style
            ]}
            >
                {this.props.titulo &&
                    <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                            {this.props.titulo}
                        </Text>

                        {this.props.subtitulo &&
                            <Text style={{ fontSize: 16, color: Variables.colors.secondary }}>
                                {this.props.subtitulo}
                            </Text>
                        }
                    </View>
                }

                <View style={{
                    marginVertical: this.props.titulo ? 5 : 0
                }}
                >
                    {this.props.children}
                </View>
            </View>
        );
    }
}