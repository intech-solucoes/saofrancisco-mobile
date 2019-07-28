import React from "react";
import { Col } from "react-native-easy-grid";
import { View, Text } from "react-native";

interface Props {
    titulo?: string;
    children?: any;
    texto: boolean;
}

export default class HomeCard extends React.Component<Props> {

    render() {
        return (
            <Col style={{ margin: 5 }}>
                <View style={{ padding: 10, backgroundColor: '#FFF', borderRadius: 5 }}>
                    <View style={{ alignItems: 'center', marginBottom: 5 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                            {this.props.titulo}
                        </Text>
                    </View>

                    <View style={{ alignItems: 'center', marginVertical: 5 }}>
                        {this.props.texto &&
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                                {this.props.children}
                            </Text>
                        }

                        {!this.props.texto &&
                            this.props.children}
                    </View>
                </View>
            </Col>
        );
    }
}