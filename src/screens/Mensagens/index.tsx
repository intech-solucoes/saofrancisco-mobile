import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { View, Grid, Row, Col } from "native-base";
import Spinner from 'react-native-loading-spinner-overlay';
import { AsyncStorage, Text, TouchableHighlight } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import { PlanoService, FuncionarioService, MensagemService } from "@intechprev/prevsystem-service";

import { Box, Alert } from "../../components";
import Styles, { Variables } from "../../styles";

interface Props { 
    navigation: NavigationScreenProp<any, any>;
}
interface State {
    loading: boolean;
    mensagens: Array<any>;
}

export class Mensagens extends React.Component<Props, State> {

    static navigationOptions = {
        title: "Mensagens"
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            mensagens: [],
            loading: false
        }
    }

    componentDidMount = async () => {
        await this.setState({ loading: true });
        var cdPlano = await AsyncStorage.getItem("plano");
        var plano = await PlanoService.BuscarPorCodigo(cdPlano);
        var funcionario = await FuncionarioService.Buscar();

        var mensagens = await MensagemService.BuscarPorFundacaoEmpresaPlano(funcionario.Funcionario.CD_FUNDACAO, funcionario.Funcionario.CD_EMPRESA, plano.CD_PLANO);

        await this.setState({ 
            mensagens, 
            loading: false 
        });
    }

    detalhar = (mensagem: any) => {
        this.props.navigation.navigate("MensagemDetalhe",
            {
                mensagem: JSON.stringify(mensagem)
            });
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Spinner visible={this.state.loading} cancelable={true} />

                {this.state.mensagens.length > 0 &&
                    <View>
                        <Box titulo={"Mensagens"}>
                            {this.state.mensagens.map((mensagem: any, index: number) => {
                                return (
                                    <TouchableHighlight key={index} underlayColor={Variables.colors.gray} style={{ padding: 10 }}
                                                        onPress={() => this.detalhar(mensagem)}>
                                        <View>
                                            <Grid>
                                                <Row>
                                                    <Col>
                                                        <Text style={{ color: Variables.colors.primary }}>{mensagem.DTA_MENSAGEM}</Text>
                                                    </Col>
                                                </Row>
                                                
                                                <Row>
                                                    <Col>
                                                        <Text>{mensagem.TXT_TITULO}</Text>
                                                    </Col>
                                                </Row>
                                            </Grid>
                                        </View>
                                    </TouchableHighlight>
                                )
                            })}
                        </Box>
                    </View>
                }

                {this.state.mensagens.length === 0 &&
                    <Box>
                        <Text>Nenhuma mensagem encontrada</Text>
                    </Box>
                }
            </ScrollView>
        );
    }
}