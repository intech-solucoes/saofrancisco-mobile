import React, { Component } from 'react';
import { Text, View, ScrollView, BackHandler, AsyncStorage, TextInput } from "react-native";
import { TextMask, TextInputMask } from "react-native-masked-text";
import Spinner from 'react-native-loading-spinner-overlay';
import _ from "lodash";

import Styles, { Variables } from "../../styles";
import { CampoEstatico, Button, Box } from "../../components";

import { DadosPessoaisService, RelacionamentoService } from "@intechprev/prevsystem-service";
import { NavigationScreenProp } from 'react-navigation';

interface Props { 
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    email: string;
    assunto: string;
    mensagem: string;
    height: number;
    dados: any;
}

export class Relacionamento extends Component<Props, State> {

    static navigationOptions = {
        title: "Relacionamento"
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            email: "",
            assunto: "",
            mensagem: "",
            height: 0,
            dados: null
        };
    }

    componentDidMount = async () => {
        await this.setState({ loading: true });

        await this.carregarDadosPessoais();

        await this.setState({ loading: false });
    }

    carregarDadosPessoais = async () => {
        var dados = await DadosPessoaisService.Buscar();
        await this.setState({ dados, email: dados.dadosPessoais.EMAIL_AUX });
    }

    enviar = async () => {
        try {
            await this.setState({ loading: true });

            await RelacionamentoService.Enviar(this.state.email, this.state.assunto, this.state.mensagem);

            await this.setState({ loading: false });
            setTimeout(async () => {
                await alert("Sua mensagem foi enviada com sucesso!");
                await this.props.navigation.navigate('Home');
            }, 500);
        } catch(err) {
            if(err.response) {
                alert(err.response.data);
            } else {
                alert(err);
            }
            await this.setState({ loading: false });
        }
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Spinner visible={this.state.loading} />

                <Box>
                    <View style={{ padding: 10, marginBottom: 10, flex: 1 }}>
                        <Text>Seu E-mail:</Text>
                        <TextInput style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"Digite aqui seu e-mail"} keyboardType={"email-address"} underlineColorAndroid="transparent"
                                   value={this.state.email} onChangeText={value => this.setState({ email: value })} />
                    </View>

                    <View style={{ padding: 10, marginBottom: 10, flex: 1 }}>
                        <Text>Assunto:</Text>
                        <TextInput style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"Digite aqui o assunto"} underlineColorAndroid="transparent"
                                value={this.state.assunto} onChangeText={value => this.setState({ assunto: value })} />
                    </View>

                    <View style={{ padding: 10, marginBottom: 10, flex: 2 }}>
                        <Text>Mensagem:</Text>
                        <TextInput underlineColorAndroid="transparent" multiline
                                value={this.state.mensagem}
                                onChangeText={(text) => {
                                    this.setState({ mensagem: text })
                                }}
                                onContentSizeChange={(event) => {
                                    this.setState({ height: event.nativeEvent.contentSize.height })
                                }}
                                style={[Styles.textInput, { padding: 0, marginBottom: 0, marginTop: 10, height: Math.max(35, this.state.height) }]} />
                    </View>

                    <Button title={"Enviar"} style={{ flex: 1 }} onClick={this.enviar} />
                </Box>
            </ScrollView>
        );
    }
}
