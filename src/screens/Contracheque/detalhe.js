import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler, AsyncStorage, FlatList, TouchableHighlight } from "react-native";
import { TextMask } from "react-native-masked-text";
import _ from 'lodash'

import Styles, { Variables } from "../../styles";
import { ElevatedView, CampoEstatico, Loader } from "../../components";

import { FichaFinanceiraAssistidoService } from "@intechprev/prevsystem-service";

export default class ContrachequeDetalhe extends Component {

    static navigationOptions = {
        title: "Contracheque"
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            plano: 0,
            contracheque: {
                Proventos: [],
                Descontos: [],
                Resumo: {}
            }
        }
    }

    async componentDidMount() {
        await this.setState({ loading: true });

        await this.carregarPlano();
        await this.carregarContracheque();

        await this.setState({ loading: false });
    }

    async carregarPlano() {
        var plano = await AsyncStorage.getItem("plano");
        await this.setState({ plano });
    }

    async carregarContracheque() {
        var referencia = this.props.navigation.getParam("referencia", "0");
        var tipoFolha = this.props.navigation.getParam("tipoFolha", "0");
        var result = await FichaFinanceiraAssistidoService.BuscarPorPlanoReferenciaTipoFolha(this.state.plano, referencia, tipoFolha);

        await this.setState({ contracheque: result.data });
    }

    render() {
        return (
            <View>
                <Loader loading={this.state.loading} />

                <ScrollView contentContainerStyle={Styles.scrollContainer}>

                    <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10 }}>
                        <CampoEstatico titulo={"Referência"} semEspaco={true} valor={this.state.contracheque.Resumo.Referencia} />
                    </ElevatedView>

                    <View style={{ padding: 10 }}>
                        <Text style={[Styles.h2, { color: Variables.colors.green, marginBottom: 10 }]}>
                            RENDIMENTOS
                        </Text>

                        {this.state.contracheque.Proventos.map((rubrica, index) => {
                            return <CampoEstatico key={index} titulo={rubrica.DS_RUBRICA} tipo={"dinheiro"} valor={rubrica.VALOR_MC} style={{ marginBottom: 0, color: Variables.colors.grayDarker }} />;
                        })}
                    </View>

                    <View style={{ padding: 10 }}>
                        <Text style={[Styles.h2, { color: Variables.colors.red, marginBottom: 10 }]}>
                            DESCONTOS
                        </Text>

                        {this.state.contracheque.Descontos.map((rubrica, index) => {
                            return <CampoEstatico key={index} titulo={rubrica.DS_RUBRICA} tipo={"dinheiro"} valor={rubrica.VALOR_MC} style={{ marginBottom: 0, color: Variables.colors.grayDarker }} />;
                        })}
                    </View>

                </ScrollView>
            </View>
        );
    }
};