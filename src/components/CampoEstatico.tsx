import React from 'react';
import { Text, View, StyleSheet } from "react-native";
import { TextMask } from "react-native-masked-text";

import Styles, { Variables } from "../styles";

export enum TipoCampoEstatico {
    dinheiro,
    texto
}

interface Props {
    titulo?: string;
    subtitulo?: string;
    valor?: any;
    style?: any;
    tituloStyle?: any;
    subtituloStyle?: any;
    styleLabel?: any;
    tipo?: TipoCampoEstatico;
    semEspaco?: boolean;
}



export default class CampoEstatico extends React.Component<Props> {

    static defaultProps = {
        tipo: TipoCampoEstatico.texto
    }

    render() {
        return (
            <View style={{ marginBottom: this.props.semEspaco ? 0 : 15 }}>
                {this.props.titulo &&
                    <Text style={[Styles.h4, styles.label, this.props.styleLabel]}>{this.props.titulo}</Text>}

                {this.props.subtitulo &&
                    <Text style={[Styles.h5]}>{this.props.subtitulo}</Text>}

                {this.props.tipo === TipoCampoEstatico.dinheiro && 
                    <TextMask style={[styles.valor, this.props.style]} type={'money'} value={this.props.valor} />}

                {this.props.tipo === TipoCampoEstatico.texto &&
                    <Text style={[styles.valor]}>{this.props.valor}</Text>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    label: {
        //color: Variables.colors.grayLight
    },
    valor: {
        color: Variables.colors.grayDarker
    }
});