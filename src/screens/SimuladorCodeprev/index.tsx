import React from "react";
import { Alert, View, ScrollView, Text, Slider, TouchableWithoutFeedback } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from "moment";

import { PlanoService, FuncionarioService, FichaFechamentoService, FichaFinanceiraService } from "@intechprev/prevsystem-service";

import Styles, { Variables } from "../../styles";
import { CampoEstatico, Button, Box, TipoCampoEstatico } from "../../components";
import { FontAwesomeIcon } from "expo-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";


interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;

    saldoAcumulado: number;
    salarioContribuicao: number;
    dataUltimoSalario: string;
    percentualContrib: number;
    contribMensal: number;
    contribPatronal: number;
    idadeMinima: number;
    idadeMaxima: number;
    idadeAposentadoria: number;
    idadeAtual: number;
    percentualAVista: number;
    aporte: number;
    termoAceito: boolean;
}

export class SimuladorCodeprev extends React.Component<Props, State> {
    static navigationOptions = {
        title: "Simulador CODEPREV"
    }

    state: State = {
        loading: false,

        saldoAcumulado: 0,
        salarioContribuicao: 0,
        dataUltimoSalario: "00/0000",
        percentualContrib: 0,
        contribMensal: 0,
        contribPatronal: 0,
        idadeMinima: 58,
        idadeMaxima: 80,
        idadeAposentadoria: 0,
        idadeAtual: 0,
        percentualAVista: 0,
        aporte: 0,
        termoAceito: false
    }

    componentDidMount = async () => {
        try {
            await this.setState({ loading: true });

            var planos = await PlanoService.Buscar();
            var dados = await FuncionarioService.Buscar();

            var plano = planos.filter((plano: any) => plano.CD_PLANO !== "0001")[0];
            var cdPlano = plano.CD_PLANO;
            var saldos = await FichaFechamentoService.BuscarSaldoPorPlano(cdPlano);
            var ultimaContribuicao = await FichaFinanceiraService.BuscarUltimaExibicaoPorPlano(cdPlano);

            var dataInscricao = moment(plano.DT_INSC_PLANO, "DD/MM/YYYY");
            var dataNascimento = moment(dados.DadosPessoais.DT_NASCIMENTO, "DD/MM/YYYY");

            var idadePlano = moment().diff(dataInscricao, "years");
            var idadeAtual = moment().diff(dataNascimento, "years");

            var idadeMinima = this.state.idadeMinima;
            var idadeMaxima = this.state.idadeMaxima;

            if (idadeAtual > 58 && idadePlano > 5)
                idadeMinima = idadeAtual;

            if (idadeAtual >= 80)
                idadeMaxima = 90;

            await this.setState({
                saldoAcumulado: saldos.VL_ACUMULADO,
                salarioContribuicao: ultimaContribuicao.SRC,
                dataUltimoSalario: ultimaContribuicao.DataReferencia.substring(3),
                percentualContrib: ultimaContribuicao.Percentual,
                idadeMinima,
                idadeMaxima,
                idadeAposentadoria: idadeMinima,
                idadeAtual
            });

            await this.calcularPercentual(ultimaContribuicao.Percentual);
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

    calcularPercentual = async (percentual: number) => {
        var percentualPatronal = percentual > 8 ? 8 : percentual;

        await this.setState({
            percentualContrib: percentual,
            contribMensal: this.state.salarioContribuicao / 100 * percentual,
            contribPatronal: this.state.salarioContribuicao / 100 * percentualPatronal
        });
    }

    continuar = async () => {
        if (this.state.percentualContrib >= 8)
            this.props.navigation.navigate("SimuladorCodeprevMaior8", this.state);
        else
            this.props.navigation.navigate("SimuladorCodeprevMenor8", this.state);
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Spinner visible={this.state.loading} cancelable={true} />

                {!this.state.loading &&
                    <View>
                        <Box>
                            <Text style={Styles.h2}>
                                Bem-vindo ao simulador de benefícios do plano CODEPREV!
                            </Text>
                            <Text style={[Styles.h5, { marginTop: 10 }]}>
                                O seu benefício será simulado com base no seu Saldo de Conta Aplicável acumulado
                                até o momento, com o acréscimo das suas contribuições futuras até a data da sua aposentadoria.
                            </Text>
                        </Box>

                        <Box>
                            <Text style={[Styles.h4, { marginBottom: 10 }]}>
                                Seu Saldo Acumulado Atualizado
                            </Text>
                            <CampoEstatico valor={this.state.saldoAcumulado} tipo={TipoCampoEstatico.dinheiro} style={{ color: Variables.colors.secondary }} />

                            <Text style={[Styles.h4, { marginBottom: 10 }]}>
                                Seu Último Salário de Contribuição (em {this.state.dataUltimoSalario})
                            </Text>
                            <CampoEstatico valor={this.state.salarioContribuicao} tipo={TipoCampoEstatico.dinheiro} style={{ color: Variables.colors.secondary }} semEspaco={true} />
                        </Box>

                        <Box>
                            <Text style={[Styles.h4, { marginBottom: 10 }]}>
                                Entre com o percentual de contribuição mensal desejado
                            </Text>
                            <Slider minimumValue={2} maximumValue={30} value={this.state.percentualContrib}
                                onValueChange={this.calcularPercentual} step={1} />
                            <Text style={{ textAlign: "center" }}>{this.state.percentualContrib}%</Text>

                            <CampoEstatico titulo={`Contribuição Mensal`} valor={this.state.contribMensal} tipo={TipoCampoEstatico.dinheiro} />
                            <CampoEstatico titulo={`Contribuição Patronal (paritária até 8%)`} valor={this.state.contribPatronal} tipo={TipoCampoEstatico.dinheiro} />
                        </Box>

                        <Box>
                            <Text style={[Styles.h4, { marginBottom: 10 }]}>
                                Com quantos anos você deseja se aposentar?
                            </Text>
                            <Slider minimumValue={this.state.idadeMinima} maximumValue={this.state.idadeMaxima} value={this.state.percentualContrib}
                                onValueChange={(val) => this.setState({ idadeAposentadoria: val })} step={1} />
                            <Text style={{ textAlign: "center" }}>{this.state.idadeAposentadoria} anos</Text>
                        </Box>

                        <Box>
                            <Text style={[Styles.h4, { marginBottom: 10 }]}>
                                Qual percentual do seu Saldo você deseja receber à vista na concessão do benefício?
                            </Text>
                            <Slider minimumValue={0} maximumValue={25} value={this.state.percentualAVista}
                                onValueChange={(val) => this.setState({ percentualAVista: val })} step={1} />
                            <Text style={{ textAlign: "center" }}>{this.state.percentualAVista}%</Text>
                        </Box>

                        <Box>
                            <Text style={[Styles.h4, { marginBottom: 10 }]}>
                                Deseja fazer um aporte de Contribuição Extraordinária?
                            </Text>
                            <Slider minimumValue={0} maximumValue={50000} value={this.state.aporte}
                                onValueChange={(val) => this.setState({ aporte: val })} step={1000} />
                            <CampoEstatico valor={this.state.aporte} tipo={TipoCampoEstatico.dinheiro} style={{ textAlign: "center" }} />
                        </Box>

                        <Box style={{ backgroundColor: Variables.colors.yellow, color: Variables.colors.yellowDark }}>
                            <Text style={[Styles.h4, { marginBottom: 10 }]}>
                                Esta é uma simulação de benefício considerando as informações do participante posicionada na data da realização do cálculo.{'\n'}
                                Os cálculos apresentados não são definitivos e resultam de projeções de caráter apenas ilustrativo, não gerando qualquer direito ao recebimento.{'\n'}
                                O presente cálculo poderá sofrer alterações quando da concessão definitiva do benefício.{'\n'}
                                Esta simulação observou as regras do Regulamento do Plano de Benefícios ao qual o participante está vinculado, vigentes na data da realização da presente simulação.
                            </Text>

                            <TouchableWithoutFeedback onPress={() => this.setState({ termoAceito: !this.state.termoAceito })}>
                                <View style={[
                                    {
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignContent: "center",
                                        alignItems: "center",
                                        alignSelf: "center",
                                        paddingHorizontal: 20,
                                        paddingVertical: 5,
                                        borderRadius: 3,
                                        backgroundColor: this.state.termoAceito ? Variables.colors.green : Variables.colors.red
                                    }
                                ]}
                                >
                                    <FontAwesomeIcon
                                        icon={this.state.termoAceito ? faCheck : faTimes}
                                        style={{ marginRight: 10 }}
                                        color={"#FFF"} size={16}
                                    />
                                    <Text style={{ color: "#FFF", fontSize: 16 }}>Li e entendi</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </Box>

                        <Button title="Simular" onClick={this.continuar} style={{ marginTop: 20, marginBottom: 20 }} desabilitado={!this.state.termoAceito} />
                    </View>
                }
            </ScrollView>
        );
    }
}