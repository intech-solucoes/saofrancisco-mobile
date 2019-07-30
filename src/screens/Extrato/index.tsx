import React from "react";
import { Text, View, ScrollView, BackHandler, AsyncStorage, TextInput } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

import Styles, { Variables } from "../../styles";
import { CampoEstatico, Button, Box } from "../../components";
import { FichaFechamentoService, PlanoService } from "@intechprev/prevsystem-service";
import { TextInputMask } from "react-native-masked-text";

interface Props {}

interface State {
    loading: boolean;
    dataInicio: string;
    dataFim: string;
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
            dataFim: ""
        };
    }

    componentDidMount = async () => {
        await this.setState({ loading: true });
        
        var cdPlano = await AsyncStorage.getItem("plano");
        var datasExtrato = await FichaFechamentoService.BuscarDatasExtrato(cdPlano);
        await this.setState({
            dataInicio: datasExtrato.DataInicial.substring(3),
            dataFim: datasExtrato.DataFinal.substring(3),
        });

        await this.setState({ loading: false });
    }

    enviar = async () => {
        try {
            var cdPlano = await AsyncStorage.getItem("plano");
            var resultado = await PlanoService.RelatorioExtratoPorPlanoReferencia(cdPlano, "01/" + this.state.dataInicio, "01/" + this.state.dataFim, true);
            await alert(resultado);
        }  catch(err) {
            if(err.response)
                console.log(err.response.data);
            else
                console.log(err);
        }
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Spinner visible={this.state.loading} />

                <Box>
                    <View style={{ padding: 10, marginBottom: 10, flex: 1 }}>
                        <Text>Data de Início:</Text>
                        <TextInputMask type={"datetime"} options={{ format: 'MM/yyyy' }} style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} 
                                       placeholder={"00/0000"} underlineColorAndroid="transparent"
                                       value={this.state.dataInicio} onChangeText={value => this.setState({ dataInicio: value })} />
                    </View>

                    <View style={{ padding: 10, marginBottom: 10, flex: 1 }}>
                        <Text>Data Fim:</Text>
                        <TextInputMask type={"datetime"} options={{ format: 'MM/yyyy' }} style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} 
                                       placeholder={"00/0000"} underlineColorAndroid="transparent"
                                       value={this.state.dataFim} onChangeText={value => this.setState({ dataFim: value })} />
                    </View>

                    <Button title={"Enviar por E-mail"} onClick={this.enviar} />
                </Box>
            </ScrollView>
        );
    }
}