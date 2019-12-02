import React from "react";
import { SimuladorCodeprevService } from "@intechprev/prevsystem-service";
import { Alert, View, ScrollView, Text, Slider, TouchableWithoutFeedback } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from "moment";

import { PlanoService, FuncionarioService, FichaFechamentoService, FichaFinanceiraService } from "@intechprev/prevsystem-service";

import Styles, { Variables } from "../../styles";
import { CampoEstatico, Button, Box, TipoCampoEstatico } from "../../components";
import { Grid, Row, Col } from "native-base";

interface RendaMensal {
    Percentual: number;
    Renda: number;
    Renda8: number;
    StringTempoRecebimento: string;
}

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;

    idadeAtual: number;
    idadeAposentadoria: number;
    saldoProjetado5: number;
    saldoProjetado8: number;
    valorResgate5: number;
    valorResgate8: number;
    rendaMensal: Array<RendaMensal>;
}

export class Menor8 extends React.Component<Props, State> {
    static navigationOptions = {
        title: "Resultado"
    }

    state: State = {
        loading: false,

        idadeAtual: 0,
        idadeAposentadoria: 0,
        saldoProjetado5: 0,
        saldoProjetado8: 0,
        valorResgate5: 0,
        valorResgate8: 0,
        rendaMensal: []
    }

    componentWillMount = async () => {
        this.load();
        //this.props.navigation.addListener('willFocus', this.load);
    }

    load = async () => {
        try {
            await this.setState({ loading: true });

            var dados = {
                IdadeAposentadoria: this.props.navigation.getParam("idadeAposentadoria", "0"),
                PercentualContrib: this.props.navigation.getParam("percentualContrib", "0"),
                PercentualSaque: this.props.navigation.getParam("percentualAVista", "0"),
                Aporte: this.props.navigation.getParam("aporte", "0"),
                SaldoAcumulado: this.props.navigation.getParam("saldoAcumulado", "0"),
                SalarioContribuicao: this.props.navigation.getParam("salarioContribuicao", "0")
            };

            var dadosSimulacao = await SimuladorCodeprevService.Simular(dados);

            await this.setState({
                idadeAtual: parseInt(this.props.navigation.getParam("idadeAtual", "0")),
                idadeAposentadoria: parseInt(this.props.navigation.getParam("idadeAposentadoria", "0")),
                saldoProjetado5: dadosSimulacao.SaldoProjetado,
                saldoProjetado8: dadosSimulacao.SaldoProjetado8,
                valorResgate5: dadosSimulacao.Saque,
                valorResgate8: dadosSimulacao.Saque8,
                rendaMensal: dadosSimulacao.RendaMensal
            });
        } catch (err) {
            if (err.response) {
                Alert.alert(err.response.data);
            } else {
                Alert.alert(err);
            }
        } finally {
            await this.setState({ loading: false });
        }
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Spinner visible={this.state.loading} cancelable={true} />

                {!this.state.loading &&
                    <View>
                        <Box>
                            <Text style={Styles.h2}>
                                Importante!
                            </Text>
                            <Text style={[Styles.h5, { marginTop: 10 }]}>
                                Todos os valores desta simulação foram apurados considerando as informações por você fornecidas.
                                As rentabilidades e benefícios projetados são unicamente referências, não constituindo nenhuma garantia
                                por parte da Fundação São Francisco.
                            </Text>
                        </Box>

                        <Box>
                            <Text style={[Styles.h4, { marginBottom: 10 }]}>
                                Idade Atual
                            </Text>
                            <CampoEstatico valor={this.state.idadeAtual} style={{ color: Variables.colors.secondary }} />

                            <Text style={[Styles.h4, { marginBottom: 10 }]}>
                                Idade na Aposentadoria
                            </Text>
                            <CampoEstatico valor={this.state.idadeAposentadoria} style={{ color: Variables.colors.secondary }} />
                        </Box>

                        <Box>
                            <Text style={[Styles.h4]}>
                                Saldo Projetado Acumulado *
                            </Text>
                            <Text style={[Styles.h5, { marginBottom: 10 }]}>
                                *caso optar por {this.props.navigation.getParam("percentualContrib", "0")}% de contribuição)
                            </Text>
                            <CampoEstatico valor={this.state.saldoProjetado5} style={{ color: Variables.colors.secondary }}
                                tipo={TipoCampoEstatico.dinheiro} />

                            <Text style={[Styles.h4]}>
                                Valor do Resgate à Vista *
                            </Text>
                            <Text style={[Styles.h5, { marginBottom: 10 }]}>
                                *caso optar por {this.props.navigation.getParam("percentualContrib", "0")}% de contribuição)
                            </Text>
                            <CampoEstatico valor={this.state.valorResgate5} style={{ color: Variables.colors.secondary }}
                                tipo={TipoCampoEstatico.dinheiro} />
                        </Box>

                        <Box>
                            <Text style={[Styles.h4, { color: Variables.colors.red }]}>
                                Saldo Projetado Acumulado *
                            </Text>
                            <Text style={[Styles.h5, { marginBottom: 10, color: Variables.colors.red }]}>
                                *caso optar por 8% de contribuição)
                            </Text>
                            <CampoEstatico valor={this.state.saldoProjetado8} style={{ color: Variables.colors.red }}
                                tipo={TipoCampoEstatico.dinheiro} />

                            <Text style={[Styles.h4, { color: Variables.colors.red }]}>
                                Valor do Resgate à Vista *
                            </Text>
                            <Text style={[Styles.h5, { marginBottom: 10, color: Variables.colors.red }]}>
                                *caso optar por 8% de contribuição)
                            </Text>
                            <CampoEstatico valor={this.state.valorResgate8} style={{ color: Variables.colors.red }}
                                tipo={TipoCampoEstatico.dinheiro} />
                        </Box>

                        <Box titulo={"Renda Mensal Inicial"}>
                            <Text style={Styles.h5}>
                                Todos os valores desta simulação foram apurados considerando as informações por você fornecidas.
                                As rentabilidades e benefícios projetados são unicamente referências, não constituindo nenhuma garantia
                                por parte da Fundação São Francisco.
                            </Text>

                            <Grid style={{ marginTop: 20 }}>
                                <Row>
                                    <Col size={1}>
                                        <Text style={{ fontWeight: "bold" }}>Percentual</Text>
                                    </Col>
                                    <Col size={2}>
                                        <Text style={{ fontWeight: "bold" }}>Renda Mensal (contrib {this.props.navigation.getParam("percentualContrib", "0")}%)</Text>
                                    </Col>
                                    <Col size={2}>
                                        <Text style={{ fontWeight: "bold" }}>Renda Mensal (contrib 8%)</Text>
                                    </Col>
                                    <Col size={2}>
                                        <Text style={{ fontWeight: "bold" }}>Tempo de Recebimento (13 parcelas anuais)</Text>
                                    </Col>
                                </Row>

                                {this.state.rendaMensal.map((rendaMensal: RendaMensal, index: number) => {
                                    var usaBorda = index < this.state.rendaMensal.length;

                                    var borda = {};
                                    if (usaBorda)
                                        borda = { marginTop: 10, paddingTop: 10, borderTopColor: "#CCC", borderTopWidth: 1 };

                                    return (
                                        <Row key={index} style={borda}>
                                            <Col size={1}>
                                                <Text>{rendaMensal.Percentual}%</Text>
                                            </Col>
                                            <Col size={2}>
                                                <CampoEstatico valor={rendaMensal.Renda} tipo={TipoCampoEstatico.dinheiro} />
                                            </Col>
                                            <Col size={2}>
                                                <CampoEstatico valor={rendaMensal.Renda8} tipo={TipoCampoEstatico.dinheiro} />
                                            </Col>
                                            <Col size={2}>
                                                <Text>{rendaMensal.StringTempoRecebimento}</Text>
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </Grid>
                            <Button title="Nova Simulação" onClick={() => this.props.navigation.pop()} style={{ marginTop: 20, marginBottom: 20 }} />
                        </Box>
                    </View>
                }
            </ScrollView>
        );
    }
}