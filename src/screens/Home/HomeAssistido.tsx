import React, { Component } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Text, View, ScrollView } from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";

import Styles, { Variables } from "../../styles";

import { FichaFinanceiraService, FichaFechamentoService, PlanoService, FichaFinanceiraAssistidoService, ProcessoBeneficioService, CalendarioPagamentoService } from "@intechprev/prevsystem-service";
import _ from 'lodash';
import { Loader, Alert, CampoEstatico, Box } from '../../components';
import { TipoCampoEstatico } from '../../components/CampoEstatico';
import HomeCard from './HomeCard';

interface Props {
    navigation: NavigationScreenProp<any, any>;
    plano: any;
}

interface State {
    loading: boolean;
    ultimaFolha: any;
    dataAposentadoria: any;
    processoBeneficio: any;
    calendario: Array<any>;
}

export class HomeAssistido extends Component<Props, State> {

    private alerta = React.createRef<Alert>();

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            ultimaFolha: null,
            dataAposentadoria: null,
            processoBeneficio: null,
            calendario: null
        }
    }

    componentDidMount = async () => {
        this.setState({ loading: true });
        
        await this.carregarPlano();

        this.setState({ loading: false });
    }

    navigateToScreen = async (route: any) => {
        await this.props.navigation.navigate(route);
    }

    carregarPlano = async () => {
        var ultimaFolha = await FichaFinanceiraAssistidoService.BuscarUltimaPorPlano(this.props.plano.CD_PLANO);
        var processoBeneficio = await ProcessoBeneficioService.BuscarPorPlano(this.props.plano.CD_PLANO);
        var calendario = await CalendarioPagamentoService.BuscarPorPlano(this.props.plano.CD_PLANO);
        await this.setState({ ultimaFolha, processoBeneficio, calendario });
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                {this.props.plano && this.state.calendario &&
                    <Grid>
                        <Loader loading={this.state.loading} />
                        <Alert ref={this.alerta} />
                        
                        <Row>
                            <HomeCard titulo={this.props.plano.DS_PLANO} texto>
                                {this.props.plano.DS_CATEGORIA}
                            </HomeCard>
                        </Row>
                        
                        <Row>
                            <HomeCard titulo={"Situação"} texto>
                                {this.state.processoBeneficio.DS_ESPECIE}
                            </HomeCard>
                        </Row>

                        <Row>
                            <HomeCard titulo={"Data de Início do Benefício"} texto>
                                {this.state.processoBeneficio.DT_INICIO_FUND}
                            </HomeCard>
                        </Row>
                        
                        {this.state.processoBeneficio.SALDO_ATUAL > 0 &&
                            <View>
                                <Row>
                                    <HomeCard titulo={"Saldo de Conta Aplicável Atual - SCAA (em cotas)"} texto>
                                        {this.state.processoBeneficio.SALDO_ATUAL}
                                    </HomeCard>
                                </Row>
                                
                                <Row>
                                    <HomeCard titulo={"Renda - % SCAA"} texto>
                                        {this.state.processoBeneficio.VL_PARCELA_MENSAL}%
                                    </HomeCard>
                                </Row>
                                
                                <Row>
                                    <HomeCard titulo={"Provável Encerramento do Benefício"} texto>
                                        {this.state.processoBeneficio.DT_APOSENTADORIA}
                                    </HomeCard>
                                </Row>
                                
                                {this.props.plano.CD_PLANO !== "0001" && 
                                    <Row>
                                        <HomeCard titulo={"Regime de Tributação"} texto>
                                            {this.props.plano.TIPO_IRRF === "2" ? "Regressivo" : "Progressivo"}
                                        </HomeCard>
                                    </Row>
                                }
                            </View>
                        }
                        <Row>
                            <Col>
                                <Box titulo={`Contracheque de ${this.state.ultimaFolha.Resumo.Referencia.substring(3)}`} subtitulo={this.props.plano.CD_PLANO === "0002" && `Valor da cota: ${this.state.ultimaFolha.Resumo.Indice.VALOR_IND}`}>
                                    <Text>Valor Líquido: </Text>
                                    <CampoEstatico valor={this.state.ultimaFolha.Resumo.Liquido} tipo={TipoCampoEstatico.dinheiro} />

                                    <Grid>
                                        {this.state.ultimaFolha.Proventos.map((rubrica: any, index: number) => {
                                            var usaBorda = this.state.ultimaFolha.Proventos.length > 1 && index < this.state.ultimaFolha.Proventos.length;

                                            var borda = {};
                                            if(usaBorda)
                                                borda = { marginTop: 10, paddingTop: 10, borderBottomColor: "#CCC", borderBottomWidth: 1 };
                                                
                                            return (
                                                <Row key={index} style={borda}>
                                                    <Col>
                                                        <Row>
                                                            <Col>
                                                                <Text style={{ fontWeight: "bold" }}>{rubrica.DS_RUBRICA}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Text style={{ color: "#CCC" }}>{rubrica.DT_COMPETENCIA}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <CampoEstatico valor={rubrica.VALOR_MC} tipo={TipoCampoEstatico.dinheiro} semEspaco />
                                                            </Col>
                                                            <Col>
                                                                <Text style={{ color: Variables.colors.secondary, textAlign: "right" }}>Provento</Text>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            )
                                        })}

                                        {this.state.ultimaFolha.Descontos.map((rubrica: any, index: number) => {
                                            return (
                                                <Row key={index} style={{ marginTop: 10, paddingTop: 10, borderTopColor: "#CCC", borderTopWidth: 1 }}>
                                                    <Col>
                                                        <Row>
                                                            <Col>
                                                                <Text style={{ fontWeight: "bold" }}>{rubrica.DS_RUBRICA}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Text style={{ color: "#CCC" }}>{rubrica.DT_COMPETENCIA}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <CampoEstatico valor={rubrica.VALOR_MC} tipo={TipoCampoEstatico.dinheiro} semEspaco />
                                                            </Col>
                                                            <Col>
                                                                <Text style={{ color: Variables.colors.red, textAlign: "right" }}>Desconto</Text>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            )
                                        })}
                                    </Grid>
                                </Box>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Box titulo={"Calendário de Pagamento"}>
                                    <Grid>
                                        {this.state.calendario.map((data: any, index: number) => {
                                            var usaBorda = this.state.calendario.length > 1 && index < this.state.calendario.length - 1;

                                            var borda = {};
                                            if(usaBorda)
                                                borda = { marginTop: 10, paddingBottom: 10, borderBottomColor: "#CCC", borderBottomWidth: 1 };
                                            else
                                                borda = { marginTop: 10 }

                                            return (
                                                <Row key={index} style={borda}>
                                                    <Col size={2}>
                                                        <Text>{data.DES_MES}</Text>
                                                    </Col>
                                                    <Col size={1}>
                                                        <Text style={{ textAlign: "right" }}>{data.NUM_DIA}</Text>
                                                    </Col>
                                                </Row>
                                            )
                                        })}
                                    </Grid>
                                </Box>
                            </Col>
                        </Row>
                    </Grid>
                }
            </ScrollView>
        )
    }
};