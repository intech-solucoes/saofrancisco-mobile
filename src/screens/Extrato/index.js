import React, { Component } from "react";
import { Text, View, ScrollView, AsyncStorage } from "react-native";

import Styles, { Variables } from "../../styles";
import { CampoEstatico, Loader, Button, PopUp, Alert } from "../../components";

import { PlanoService, SalarioBaseService, FichaFechamentoPrevesService } from "@intechprev/prevsystem-service";
import { TextInputMask } from "react-native-masked-text";

export default class ExtratoAnosScreen extends Component {

    static navigationOptions = {
        title: "Seu Plano"
    }
    
    constructor(props) {
        super(props);

        // Armazena as referências dos inputs para fácil transição entre eles, como utilizar o tab no teclado
        this.inputs = [];

        this.state = { 
            loading: false,
            plano: {},
            salarioBase: {},
            saldo: {},
            cdPlano: null,
            cdEmpresa: null,
            dataInicial: null,
            dataFinal: null,
            possuiSeguro: false
        }

        this.alerta = React.createRef();
        this.modalParametros = React.createRef();
    }

    async componentDidMount() {
        try {
            await this.setState({ loading: true });

            var cdPlano = await AsyncStorage.getItem("plano");
            var cdEmpresa = await AsyncStorage.getItem("empresa");
            await this.setState({ cdPlano, cdEmpresa });

            await this.carregarPlano();

            var { data: salarioBase } = await SalarioBaseService.Buscar();
            //var { data: saldo } = await FichaFechamentoPrevesService.BuscarSaldoPorPlano(cdPlano);

            await this.setState({
                salarioBase
            });

            await this.setState({ loading: false });
        } catch(err) {
            if(err.response)
                alert(err.response.data);
            else
                alert(err);
        } finally {
            await this.setState({ loading: false });
        }
    }

    focusNextField = (id) => {
        this.inputs[id].focus();
    }

    carregarPlano = async () => {
        var { data: plano } = await PlanoService.BuscarPorCodigo(this.state.cdPlano);
        await this.setState({ plano });

        // var { data: possuiSeguro } = await PlanoService.PossuiCertificadoSeguro();
        // await this.setState({ possuiSeguro });
    }

    mostrarModalParametros = async () => {
        await this.modalParametros.current.mostrar();
    }

    enviarExtrato = async () => {
        try {
            await this.modalParametros.current.fechar();
            await this.setState({ loading: true });

            var { data: extratoResult } = await PlanoService.RelatorioExtratoPorPlanoEmpresaReferencia(this.state.cdPlano, this.state.cdEmpresa, this.state.dataInicial, this.state.dataFinal, true);
            await this.alerta.current.mostrar(extratoResult);
        } catch(err) {
            if(err.response)
                await this.alerta.current.mostrar(err.response.data);
            else
                await this.alerta.current.mostrar(err);
        } finally {
            await this.setState({ loading: false });
        }
    }

    enviarCertificadoParticipacao = async () => {
        try {
            await this.setState({ loading: true });

            var { data: certificadoResult } = await PlanoService.RelatorioCertificado(this.state.cdPlano, this.state.cdEmpresa, true);
            await this.alerta.current.mostrar(certificadoResult);
        } catch(err) {
            if(err.response)
                await this.alerta.current.mostrar(err.response.data);
            else
                await this.alerta.current.mostrar(err);
        } finally {
            await this.setState({ loading: false });
        }
    }

    enviarCertificadoSeguro = async () => {
        try {
            await this.setState({ loading: true });

            var { data: certificadoResult } = await PlanoService.RelatorioCertificadoSeguro(true);
            await this.alerta.current.mostrar(certificadoResult);
        } catch(err) {
            if(err.response)
                await this.alerta.current.mostrar(err.response.data);
            else
                await this.alerta.current.mostrar(err);
        } finally {
            await this.setState({ loading: false });
        }
    }

    render() {
        return (
            <View>
                <Loader loading={this.state.loading} />
                <Alert ref={this.alerta} />
                <PopUp ref={this.modalParametros}>
                    <Text style={[Styles.h3, { marginBottom: 15 }]}>Selecione o período em que o extrato será gerado:</Text>

                    <Text>Data Inicial</Text>
                    <TextInputMask name={"dataInicial"} style={Styles.textInput} placeholder="00/00/0000" returnKeyType="next" blurOnSubmit={false} underlineColorAndroid="transparent"
                        value={this.state.dataInicial} type={"datetime"} options={{ format: 'dd/MM/yyyy' }}
                        onSubmitEditing={() => { this.focusNextField('dataFinal'); }} onChangeText={value => this.setState({ dataInicial: value })}
                        refInput={input => { this.inputs['dataInicial'] = input; }} />

                    <Text>Data Final</Text>
                    <TextInputMask name={"dataFinal"} style={Styles.textInput} placeholder="00/00/0000" returnKeyType="next" blurOnSubmit={false} underlineColorAndroid="transparent"
                        value={this.state.dataFinal} type={"datetime"} options={{ format: 'dd/MM/yyyy' }}
                        onChangeText={value => this.setState({ dataFinal: value })}
                        refInput={input => { this.inputs['dataFinal'] = input; }} />

                    <Button title={"Enviar"} style={Styles.modalButton} titleStyle={Styles.modalButtonText} onClick={this.enviarExtrato} />
                </PopUp>

                <ScrollView contentContainerStyle={Styles.scrollContainer}>
                    <View>
                        <CampoEstatico titulo={"Plano"} valor={this.state.plano.DS_PLANO} />
                        <CampoEstatico titulo={"Data de Inscrição"} valor={this.state.plano.DT_INSC_PLANO} />
                        <CampoEstatico titulo={"Situação no Plano"} valor={this.state.plano.DS_SIT_PLANO} />
                        <CampoEstatico titulo={"Categoria"} valor={this.state.plano.DS_CATEGORIA} />
                        <CampoEstatico titulo={"Salário de Participação"} tipo={"dinheiro"} valor={this.state.salarioBase.VL_SALARIO} />

                        <Text style={[Styles.h2, { marginTop: 10, marginBottom: 10 }]}>Saldo</Text>
                        {this.state.cdPlano === "0001" &&
                            <View>
                                <CampoEstatico titulo={"Quantidade de Cotas Participante"} valor={this.state.saldo.CotasPartic} />

                                {this.state.saldo.CotasPatroc !== 0 &&
                                <CampoEstatico titulo={"Quantidade de Cotas Patrocinadora"} valor={this.state.saldo.CotasPatroc} />}

                                <CampoEstatico titulo={"Saldo Participante"} tipo={"dinheiro"} valor={this.state.saldo.SaldoPartic} />

                                {this.state.saldo.SaldoPatroc !== 0 &&
                                <CampoEstatico titulo={"Saldo Patrocinadora"} tipo={"dinheiro"} valor={this.state.saldo.SaldoPatroc} />}
                                
                                <CampoEstatico titulo={"Saldo Total"} tipo={"dinheiro"} valor={this.state.saldo.Total} />

                                <CampoEstatico titulo={"Data do Indice"} valor={this.state.saldo.DataIndice} />
                                <CampoEstatico titulo={"Valor do Indice"} valor={this.state.saldo.ValorIndice} />
                            </View>
                        }

                        {this.state.cdPlano === "0002" && 
                            <View>
                                <CampoEstatico titulo={"Quantidade de Cotas"} valor={this.state.saldo.CotasPartic} />
                                <CampoEstatico titulo={"Saldo"} tipo={"dinheiro"} valor={this.state.saldo.SaldoPartic} />

                                <CampoEstatico titulo={"Data do Indice"} valor={this.state.saldo.DataIndice} />
                                <CampoEstatico titulo={"Valor do Indice"} valor={this.state.saldo.ValorIndice} />
                            </View>
                        }

                        <Button title={"Enviar Extrato de Contribuições por e-mail"} style={{ flex: 1, marginTop: 20 }} semEspaco={false}
                                onClick={this.mostrarModalParametros} />
                        <Button title={"Enviar Certificado de Participação por e-mail"} style={{ flex: 1 }} semEspaco={false}
                                onClick={this.enviarCertificadoParticipacao} />
                        
                        {this.state.possuiSeguro && 
                            <Button title={"Enviar Certificado de Seguro por e-mail"} style={{ flex: 1 }} semEspaco={false}
                                    onClick={this.enviarCertificadoSeguro} />
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }

}