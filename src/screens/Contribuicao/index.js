import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler, AsyncStorage } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { TextMask } from "react-native-masked-text";
import _ from 'lodash';

import Styles, { Variables } from "../../styles";
import { ScreenHeader, ElevatedView, CampoEstatico } from "../../components";

import { FichaFinanceiraService } from "@intechprev/prevsystem-service";

const config = require("../../config.json");

const ViewRubricas = (props) => (
    <ElevatedView elevation={3} style={{ marginBottom: 10 }}>
        <Text style={[Styles.h2, { marginBottom: 10 }]}>
            {props.titulo}
        </Text>

        {props.lista.map((contrib, index) => {
            return <CampoEstatico key={index} titulo={contrib.DS_TIPO_CONTRIBUICAO} tipo={"dinheiro"} valor={contrib[props.campoValor]} />;
        })}
    </ElevatedView>
)

export default class ContribuicaoScreen extends Component {

    static navigationOptions = {
        title: "Sua Contribuição"
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            contribuicoes: [],
            mesReferencia: "",
            salario: {},
            plano: 1,
            planoBD: true,
            fundoIndividual: {},
            fundoPatronal: {},
            fundoAdm: 9,
            fundoRisco: 11,
            listaIndividual: [],
            listaPatronal: [],
            listaAdm: [],
            listaRisco: []
        }
    }

    async componentDidMount() {
        this.setState({ loading: true });
        
        await this.carregarPlano();
        await this.carregarContribuicao();
        await this.filtrarContribuicoes();

        this.setState({ loading: false });
    }

    async carregarPlano() {
        var plano = await AsyncStorage.getItem("plano");
        var planoBD = plano === "1";

        await this.setState({ 
            plano, 
            planoBD,
            fundoIndividual: planoBD ? 2 : 8,
            fundoPatronal: planoBD ? 1 : 7
        });
    }

    async carregarContribuicao() {
        var result = await FichaFinanceiraService.BuscarUltimaPorPlano(this.state.plano);
        var mesReferencia = `${result.data[0].MES_REF}/${result.data[0].ANO_REF}`;

        await this.setState({ 
            contribuicoes: result.data,
            mesReferencia: mesReferencia
        });
    }

    async filtrarContribuicoes() {
        var listaIndividual = _.filter(this.state.contribuicoes, (contrib) => contrib.CONTRIB_PARTICIPANTE > 0);
        var listaPatronal = _.filter(this.state.contribuicoes, (contrib) => contrib.CONTRIB_EMPRESA > 0);

        await this.setState({ 
            listaIndividual, 
            listaPatronal
        });
    }

    render() {
        return (
            <View>
                <Spinner visible={this.state.loading} cancelable={true} />

                {!this.state.loading && 
                    <ScrollView contentContainerStyle={Styles.scrollContainer}>
                        <ElevatedView elevation={3} style={styles.header}>
                            <View style={{marginBottom: 15}}>
                                <Text style={[Styles.h4, styles.headerText]}>
                                    Referência
                                </Text>
                                <Text style={[Styles.h2, styles.headerText]}>
                                    {this.state.mesReferencia}
                                </Text>
                            </View>
                        </ElevatedView>

                        <ViewRubricas titulo={"INDIVIDUAL"} lista={this.state.listaIndividual} campoValor={"CONTRIB_PARTICIPANTE"} />

                        {this.state.listaPatronal.length > 0 &&
                            <ViewRubricas titulo={"PATROCINADORA"} lista={this.state.listaPatronal} campoValor={"CONTRIB_EMPRESA"} />}
                    </ScrollView>
                }
            </View>
        )
    }
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: Variables.colors.secondary,
        padding: 10,
        marginBottom: 10
    },
    headerText: {
        color: "white"
    },
    rubrica: {
        marginVertical: 10
    },
    rubricaDes: {

    },
    rubricaValor: {
        color: Variables.colors.primary
    }
});