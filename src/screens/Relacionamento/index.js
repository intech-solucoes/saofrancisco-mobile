import React, { Component } from 'react';
import { Text, View, ScrollView, BackHandler, AsyncStorage, TextInput } from "react-native";
import { TextMask, TextInputMask } from "react-native-masked-text";
import Spinner from 'react-native-loading-spinner-overlay';
import _ from "lodash";

import Styles, { Variables } from "../../styles";
import { ScreenHeader, ElevatedView, CampoEstatico, Button } from "../../components";

import { DadosPessoaisService, RelacionamentoService } from "@intechprev/prevsystem-service";


export default class RelacionamentoScreen extends Component {

    static navigationOptions = {
        title: "Relacionamento"
    }

    constructor(props) {
        super(props);

        this.state = {
            dados: {},
            email: "",
            assunto: "",
            mensagem: "",
            height: 0
        };
    }

    async componentDidMount() {
        await this.setState({ loading: true });

        await this.carregarDadosPessoais();

        await this.setState({ loading: false });
    }

    async carregarDadosPessoais() {
        var result = await DadosPessoaisService.Buscar();
        await this.setState({ dados: result.data });
    }

    enviar = async () => {
        try {
            await this.setState({ loading: true });

            await RelacionamentoService.Enviar(this.state.email, this.state.assunto, this.state.mensagem);
            alert("Sua mensagem foi enviada com sucesso!");
            this.props.navigation.navigate('Home');

            await this.setState({ loading: false });
        } catch(err) {
            if(err.response) {
                alert(err.response.data);
            } else {
                alert(err);
            }
            console.warn(err);
            await this.setState({ loading: false });
        }
    }

    render() {
        return (
            <View>
                <Spinner visible={this.state.loading} />

                <ScrollView contentContainerStyle={[ Styles.scrollContainer ]}>
                    <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10, flex: 1 }}>
                        <Text>Seu E-mail:</Text>
                        <TextInput name={"email"} style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"Digite aqui seu e-mail"} keyboardType={"email-address"} underlineColorAndroid="transparent"
                                   value={this.state.email} onChangeText={value => this.setState({ email: value })} />
                    </ElevatedView>

                    <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10, flex: 1 }}>
                        <Text>Assunto:</Text>
                        <TextInput name={"assunto"} style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"Digite aqui o assunto"} underlineColorAndroid="transparent"
                                value={this.state.assunto} onChangeText={value => this.setState({ assunto: value })} />
                    </ElevatedView>

                    <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10, flex: 2 }}>
                        <Text>Mensagem:</Text>
                        <TextInput name={"mensagem"} underlineColorAndroid="transparent" multiline
                                value={this.state.mensagem}
                                onChangeText={(text) => {
                                    this.setState({ mensagem: text })
                                }}
                                onContentSizeChange={(event) => {
                                    this.setState({ height: event.nativeEvent.contentSize.height })
                                }}
                                style={[Styles.textInput, { padding: 0, marginBottom: 0, marginTop: 10, height: Math.max(35, this.state.height) }]} />
                    </ElevatedView>

                    <Button title={"Enviar"} style={{ flex: 1 }} onClick={this.enviar} />
                </ScrollView>
            </View>
        );
    }
}
