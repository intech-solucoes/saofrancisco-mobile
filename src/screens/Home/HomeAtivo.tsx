import React, { Component } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Text, View, ScrollView } from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";

import Styles, { Variables } from "../../styles";

import { FichaFinanceiraService, FichaFechamentoService } from "@intechprev/prevsystem-service";
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
    ultimaContribuicao: any;
    saldos: any;
}

export class HomeAtivo extends Component<Props, State> {

    private alerta = React.createRef<Alert>();

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            ultimaContribuicao: null,
            saldos: null
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
        if(this.props.plano) {
            var ultimaContribuicao = await FichaFinanceiraService.BuscarUltimaExibicaoPorPlano(this.props.plano.CD_PLANO);
            var saldos = await FichaFechamentoService.BuscarSaldoPorPlano(this.props.plano.CD_PLANO);
            
            await this.setState({ 
                ultimaContribuicao, 
                saldos
            });
        }
    }

    render() {
        return (
            <View>
                {this.state.ultimaContribuicao &&
                    <Grid>
                        <Loader loading={this.state.loading} />
                        <Alert ref={this.alerta} />
                        
                        <Row>
                            <HomeCard titulo={this.props.plano.DS_PLANO} texto>
                                {this.props.plano.DS_CATEGORIA}
                            </HomeCard>
                        </Row>
                        
                        <Row>
                            <HomeCard titulo={"Contribuição Atual"} texto>
                                {this.state.ultimaContribuicao.Percentual}%
                            </HomeCard>
                        </Row>

                        <Row>
                            <HomeCard titulo={"Salário de Participação"} texto={false}>
                                <CampoEstatico valor={this.state.ultimaContribuicao.SRC} tipo={TipoCampoEstatico.dinheiro} 
                                               style={{ fontSize: 22, fontWeight: 'bold' }} semEspaco />
                            </HomeCard>
                        </Row>
                        
                        <Row>
                            <HomeCard titulo={"Data de Inscrição"} texto>
                                {this.props.plano.DT_INSC_PLANO}
                            </HomeCard>
                        </Row>
                        
                        <Row>
                            <HomeCard titulo={"Regime de Tributação"} texto>
                                {this.props.plano.TIPO_IRRF === "2" ? "Regressivo" : "Progressivo"}
                            </HomeCard>
                        </Row>

                        <Row>
                            <Col>
                                <Box titulo={"Sua Última Contribuição"} subtitulo={`Posição de ${this.state.ultimaContribuicao.DataReferencia.substring(3)}`}>
                                    <Grid>
                                        {this.state.ultimaContribuicao.Contribuicoes.map((contrib: any, index: number) => {
                                            var ultimo = index === this.state.ultimaContribuicao.Contribuicoes.length - 1;

                                            return (
                                                <Row key={index}>
                                                    <Col size={2}>
                                                        <Text style={{ fontWeight: ultimo ? "bold": "normal" }}>{contrib.Item1}</Text>
                                                    </Col>
                                                    <Col size={1}>
                                                        <CampoEstatico valor={contrib.Item2} tipo={TipoCampoEstatico.dinheiro} semEspaco 
                                                                       style={{ textAlign: 'right', fontWeight: ultimo ? "bold": "normal" }} />
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
                                <Box titulo={"Custeio"} subtitulo={`Posição de ${this.state.ultimaContribuicao.DataReferencia.substring(3)}`}>
                                    <Grid>
                                        {this.state.ultimaContribuicao.Descontos.map((desconto: any, index: number) => {
                                            var ultimo = index === this.state.ultimaContribuicao.Descontos.length - 1;

                                            return (
                                                <Row key={index}>
                                                    <Col size={2}>
                                                        <Text style={{ fontWeight: ultimo ? "bold": "normal" }}>{desconto.DS_AGRUPADOR_WEB}</Text>
                                                    </Col>
                                                    <Col size={1}>
                                                        <CampoEstatico valor={desconto.CONTRIB_PARTICIPANTE} tipo={TipoCampoEstatico.dinheiro} semEspaco 
                                                                       style={{ textAlign: "right", fontWeight: ultimo ? "bold": "normal" }} />
                                                    </Col>
                                                </Row>
                                            )
                                        })}

                                        <Row style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text>Valor Líquido (Contribuição Total - Custeio Total): </Text>
                                                <CampoEstatico valor={this.state.ultimaContribuicao.Liquido} tipo={TipoCampoEstatico.dinheiro} semEspaco
                                                               style={{ fontWeight: "bold" }} />
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Box>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Box titulo={"Seu Saldo"} subtitulo={`Posição de ${this.state.saldos.DT_FECHAMENTO.substring(3)}`}>
                                    <Grid>
                                        <Row>
                                            <Col size={2}>
                                                <Text>Minhas Contribuições (total):</Text>
                                            </Col>
                                            <Col size={1}>
                                                <CampoEstatico valor={this.state.saldos.VL_GRUPO1} tipo={TipoCampoEstatico.dinheiro} semEspaco 
                                                            style={{ textAlign: "right" }} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col size={2}>
                                                <Text>Contribuições Patronais (total):</Text>
                                            </Col>
                                            <Col size={1}>
                                                <CampoEstatico valor={this.state.saldos.VL_GRUPO2} tipo={TipoCampoEstatico.dinheiro} semEspaco 
                                                            style={{ textAlign: "right" }} />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col size={2}>
                                                <Text>Contribuições Totais:</Text>
                                            </Col>
                                            <Col size={1}>
                                                <CampoEstatico valor={this.state.saldos.VL_GRUPO1 + this.state.saldos.VL_GRUPO2} tipo={TipoCampoEstatico.dinheiro} semEspaco 
                                                            style={{ textAlign: "right" }} />
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: 10, paddingTop: 10, borderTopColor: "#CCC", borderTopWidth: 1 }}>
                                            <Col size={2}>
                                                <Text>Rendimento do Plano:</Text>
                                            </Col>
                                            <Col size={1}>
                                                <CampoEstatico valor={this.state.saldos.VL_ACUMULADO - (this.state.saldos.VL_GRUPO1 + this.state.saldos.VL_GRUPO2)} tipo={TipoCampoEstatico.dinheiro} semEspaco 
                                                            style={{ textAlign: "right" }} />
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: 10, padding: 5, backgroundColor: Variables.colors.secondary, borderRadius: 5 }}>
                                            <Col size={2}>
                                                <Text>Saldo Acumulado Atualizado:</Text>
                                            </Col>
                                            <Col size={1}>
                                                <CampoEstatico valor={this.state.saldos.VL_ACUMULADO} tipo={TipoCampoEstatico.dinheiro} semEspaco 
                                                            style={{ textAlign: "right" }} />
                                            </Col>
                                        </Row>

                                        <Row style={{ marginTop: 10 }}>
                                            <Col>
                                                <Text>Valor da cota em {this.state.saldos.DT_FECHAMENTO.substring(3)}:</Text>
                                                <Text>{this.state.saldos.VL_COTA}</Text>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Box>
                            </Col>
                        </Row>
                    </Grid>
                }
                
                {!this.state.ultimaContribuicao &&
                    <Text>Carregando...</Text>
                }
            </View>
        )
    }
};