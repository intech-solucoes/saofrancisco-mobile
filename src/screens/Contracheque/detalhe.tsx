import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler, AsyncStorage, FlatList, TouchableHighlight } from "react-native";
import { TextMask } from "react-native-masked-text";
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons';


import Styles, { Variables } from "../../styles";
import { CampoEstatico, Loader, Box } from "../../components";

import { FichaFinanceiraAssistidoService, PlanoService } from "@intechprev/prevsystem-service";
import { NavigationScreenProp } from 'react-navigation';
import { TipoCampoEstatico } from '../../components/CampoEstatico';

interface Props { 
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean,
    plano: any,
    contracheque: {
        Proventos: Array<any>,
        Descontos: Array<any>,
        Resumo: { 
            Bruto: any,
            Descontos: any,
            Liquido: any,
            DesTipoFolha: string
        }
    },
    dataReferencia: string
}

export class ContrachequeDetalhe extends Component<Props, State> {

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
                Resumo: {
                    Bruto: null,
                    Descontos: null,
                    Liquido: null,
                    DesTipoFolha: null
                }
            },
            dataReferencia: ""
        }
    }

    async componentDidMount() {
        await this.setState({ loading: true });

        await this.carregarPlano();
        await this.carregarContracheque();

        await this.setState({ loading: false });
    }

    carregarPlano = async () => {
        var cdPlano = await AsyncStorage.getItem("plano");
        var plano = await PlanoService.BuscarPorCodigo(cdPlano);
        await this.setState({ plano });
    }

    carregarContracheque = async () => {
        var referencia = this.props.navigation.getParam("referencia", "0");
        var tipoFolha = this.props.navigation.getParam("tipoFolha", "0");
        var contracheque = await FichaFinanceiraAssistidoService.BuscarPorPlanoReferenciaTipoFolha(this.state.plano.CD_PLANO, referencia, tipoFolha);
        await this.setState({ contracheque, dataReferencia: referencia });
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Loader loading={this.state.loading} />
                
                {!this.state.loading &&
                    <Box titulo={`Contracheque de ${this.state.dataReferencia.substring(3)}`}>
                        <View style={{ padding: 10 }}>

                            <View style={{ flexDirection: 'row', alignItems : 'center', flex: 1, marginBottom: 10 }}> 
                                <Icon name="ios-add-circle" size={30} color="#28a745" /> 
                                <Text style={[Styles.h2, { color: Variables.colors.green , marginLeft: 10 }]}> 
                                    RENDIMENTOS
                                </Text>
                            </View>

                            {this.state.contracheque.Proventos.map((rubrica, index) => {
                                return <CampoEstatico key={index} titulo={rubrica.DS_RUBRICA} tipo={TipoCampoEstatico.dinheiro} valor={rubrica.VALOR_MC} style={{ marginBottom: 0, color: Variables.colors.grayDarker }} />;
                            })}
                        </View>

                        <View style={{ padding: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems : 'center', flex: 1, marginBottom: 10 }}> 
                                <Icon name="ios-remove-circle" size={30} color="#dc3545" />   
                                <Text style={[Styles.h2, { color: Variables.colors.red, marginLeft: 10  }]}> 
                                    DESCONTOS
                                </Text>
                            </View>
                            {this.state.contracheque.Descontos.map((rubrica, index) => {
                                return <CampoEstatico key={index} titulo={rubrica.DS_RUBRICA} tipo={TipoCampoEstatico.dinheiro} valor={rubrica.VALOR_MC} style={{ marginBottom: 0, color: Variables.colors.grayDarker }} />;
                            })}
                        </View>

                    </Box>
                }
            </ScrollView>
        );
    }
};