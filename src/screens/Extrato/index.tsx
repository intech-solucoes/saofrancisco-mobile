import React from "react";
import { Text, View, ScrollView, BackHandler, AsyncStorage, TextInput } from "react-native";

import Styles, { Variables } from "../../styles";
import { CampoEstatico, Button, Box, AsyncAlert, Loader } from "../../components";
import { FichaFechamentoService, PlanoService } from "@intechprev/prevsystem-service";
import { TextInputMask } from "react-native-masked-text";
import ExtratoCodeprev from "./ExtratoCodeprev";
import ExtratoSaldado from "./ExtratoSaldado";
import { NavigationScreenProp } from "react-navigation";

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    dataInicio: string;
    dataFim: string;
    cdPlano: string;
}

export class Extrato extends React.Component<Props, State> {

    static navigationOptions = {
        title: "Extrato"
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            dataInicio: "",
            dataFim: "",
            cdPlano: ""
        };
    }

    componentDidMount = async () => {
        this.setState({ loading: true });
        
        var cdPlano = await AsyncStorage.getItem("plano");
        var datasExtrato = await FichaFechamentoService.BuscarDatasExtrato(cdPlano);
        this.setState({
            dataInicio: datasExtrato.DataInicial.substring(3),
            dataFim: datasExtrato.DataFinal.substring(3),
            cdPlano
        });

        this.setState({ loading: false });
    }

    enviar = async () => {
        try {
            this.setState({ loading: true });

            var cdPlano = await AsyncStorage.getItem("plano");
            var resultado = await PlanoService.RelatorioExtratoPorPlanoReferencia(cdPlano, "01/" + this.state.dataInicio, "01/" + this.state.dataFim, true);
            
            this.setState({ 
                loading: false
            });

            setTimeout(async () => {
                await AsyncAlert(resultado);
            }, 500);
        }  catch(err) {
            this.setState({ loading: false });

            if(err.response) {
                await AsyncAlert(err.response.data);
            }
            else {
                await AsyncAlert(err);
            }
        }
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Loader loading={this.state.loading} {...this.props} />

                {this.state.dataFim !== "" && 
                    <View>
                        {this.state.cdPlano !== "0003" &&
                            <ExtratoCodeprev {...this.props} />
                        }

                        {this.state.cdPlano === "0003" &&
                            <ExtratoSaldado {...this.props} />
                        }

                        <Box>
                            <View style={{ marginBottom: 20, flex: 1 }}>
                                <Text style={{marginLeft: 10}}>Data de Início:</Text>
                                <TextInputMask type={"datetime"} options={{ format: 'MM/yyyy' }} style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} 
                                            placeholder={"00/0000"} underlineColorAndroid="transparent"
                                            value={this.state.dataInicio} onChangeText={value => this.setState({ dataInicio: value })} />
                            </View>

                            <View style={{ marginBottom: 30, flex: 1 }}>
                                <Text style={{ marginLeft: 10 }}>Data Fim:</Text>
                                <TextInputMask type={"datetime"} options={{ format: 'MM/yyyy' }} style={[Styles.textInput]} 
                                            placeholder={"00/0000"} underlineColorAndroid="transparent"
                                            value={this.state.dataFim} onChangeText={value => this.setState({ dataFim: value })} />
                            </View>

                            <Button title={"Enviar por E-mail"} onClick={this.enviar} />
                        </Box>
                    </View>
                }
            </ScrollView>
        );
    }
}