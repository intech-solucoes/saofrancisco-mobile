import React, { Component } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Text, View, ScrollView } from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";

import Styles, { Variables } from "../../styles";

import { FichaFinanceiraService, FichaFechamentoService, PlanoService } from "@intechprev/prevsystem-service";
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
    plano: any;
}

export class HomeAtivoSaldado extends Component<Props, State> {

    private alerta = React.createRef<Alert>();

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            plano: null
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
            var plano = await PlanoService.BuscarSaldado();

            await this.setState({
                plano
            });
        }
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                {this.state.plano &&
                    <Grid>
                        <Loader loading={this.state.loading} />
                        <Alert ref={this.alerta} />
                        
                        <Row>
                            <Col>
                                <HomeCard titulo={"PLANO BD SALDADO"} texto>
                                    {this.state.plano.DS_SIT_PLANO}
                                </HomeCard>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HomeCard titulo={"Data Saldamento"} texto>
                                    {this.state.plano.DT_INSC_PLANO}
                                </HomeCard>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HomeCard titulo={"Valor Inicial do Saldamento"} texto={false}>
                                    <CampoEstatico valor={this.state.plano.VL_BENEF_SALDADO_INICIAL} tipo={TipoCampoEstatico.dinheiro} 
                                                   style={{ fontSize: 22, fontWeight: 'bold' }} semEspaco />
                                </HomeCard>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HomeCard titulo={`Valor Atualizado em ${this.state.plano.DT_INIC_VALIDADE.substring(3)}`} texto={false}>
                                    <CampoEstatico valor={this.state.plano.VL_BENEF_SALDADO_ATUAL} tipo={TipoCampoEstatico.dinheiro} 
                                                   style={{ fontSize: 22, fontWeight: 'bold' }} semEspaco />
                                </HomeCard>
                            </Col>
                        </Row>
                    </Grid>
                }

                {!this.state.plano &&
                    <Text>Carregando...</Text>
                }
            </ScrollView>
        )
    }
};