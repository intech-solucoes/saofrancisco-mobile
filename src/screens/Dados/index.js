import React, { Component } from 'react';
import { Text, View, ScrollView, BackHandler, AsyncStorage } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

import Styles, { Variables } from "../../styles";
import { ScreenHeader, ElevatedView, CampoEstatico } from "../../components";

import { DadosPessoaisService, PlanoService, FuncionarioService, ProcessoBeneficioService } from "@intechprev/prevsystem-service";

// const config = require("../../config.json");
// const dadosPessoaisService  = new DadosPessoaisService(config);
// const planoService = new PlanoService(config);
// const funcionarioService = new FuncionarioService(config);

export default class Dados extends Component {

    static navigationOptions = {
        header : null
    }
    
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            funcionario: {},
            dados: {
                dadosPessoais: {}  
            },
            plano: {
                ProcessoBeneficio: null
            },
            assistido: {},
            pensionista: {}
        }
    }

    async componentDidMount() {
        await this.setState({ loading: true });

        var assistido = await AsyncStorage.getItem("assistido");
        var pensionista = await AsyncStorage.getItem("pensionista");

        await this.setState({ 
            assistido: assistido === "true",
            pensionista: pensionista === "true"
        });

        await this.carregarDadosPessoais();

        if(!this.state.pensionista)
            await this.carregarFuncionario();

        await this.carregarPlano();

        await this.setState({ loading: false });
    }

    async carregarDadosPessoais() {
        var result = await DadosPessoaisService.Buscar();
        await this.setState({ dados: result.data });

        //console.warn(result) 
    }

    async carregarFuncionario() {
        var result = await FuncionarioService.Buscar();
        await this.setState({ funcionario: result.data.funcionario });
    }

    async carregarPlano() {
        var plano = await AsyncStorage.getItem("plano");
        var result = await PlanoService.BuscarPorCodigo(plano);
        await this.setState({ plano: result.data });
    }

    render() {
        return (
            <View>
                {/* <Spinner visible={this.state.loading} cancelable={true} /> */}

                {!this.state.loading &&
                    <ScrollView contentContainerStyle={Styles.scrollContainer}>
                        <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10 }}>
                            <CampoEstatico titulo={"Nome"} valor={this.state.dados.dadosPessoais.NOME_ENTID} />
                        </ElevatedView>

                        <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10 }}>
                            <CampoEstatico titulo={"CPF"} valor={this.state.dados.CPF} />
                            <CampoEstatico titulo={"Data de Nascimento"} valor={this.state.dados.dadosPessoais.DT_NASCIMENTO} />
                            <CampoEstatico titulo={"Sexo"} valor={this.state.dados.SEXO} />
                        </ElevatedView>

                        {!this.state.pensionista &&
                            <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10 }}>
                                <CampoEstatico titulo={"Data de admissão"} valor={this.state.funcionario.DT_ADMISSAO} />
                                <CampoEstatico titulo={"Data de Inscrição no Plano"} valor={this.state.plano.DT_INSC_PLANO} />
                                <CampoEstatico titulo={"Tipo de Tributação"} valor={this.state.plano.TIPO_IRRF == "1" ? "PROGRESSIVA" : "REGRESSIVA"} />
                                
                                {this.state.plano.ProcessoBeneficio &&
                                    <View>
                                        <CampoEstatico titulo={"Data de Aposentadoria"} valor={this.state.plano.ProcessoBeneficio.DT_INICIO_FUND} />
                                        <CampoEstatico titulo={"Espécie de aposentadoria"} valor={this.state.plano.ProcessoBeneficio.DS_ESPECIE} />
                                    </View>
                                }
                            </ElevatedView>
                        }
                    </ScrollView>
                }
                
            </View>
        )
    }
};