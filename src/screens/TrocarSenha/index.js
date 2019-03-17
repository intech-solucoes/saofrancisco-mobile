import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';

import Styles, { Variables } from "../../styles";
import { Button, Loader, Alert } from "../../components";

import { UsuarioService } from "@intechprev/prevsystem-service";

export default class TrocarSenha extends Component {

    static navigationOptions = {
        title: "Trocar Senha"
    }

    constructor(props) {
        super(props);

        // Armazena as referências dos inputs para fácil transição entre eles, como utilizar o tab no teclado
        this.inputs = {};

        this.state = {
            senhaAntiga: null,
            senhaNova: null,
            senhaNovaConfirma: null,
            erro: "",
            loading: false
        };

        this.alerta = React.createRef();
    }

    enviar = async () => {
        try {
            await this.setState({ loading: true });

            if (this.state.senhaNova !== this.state.senhaNovaConfirma)
                await this.alerta.current.mostrar("As senhas não coincidem!");
            else {
                var { data: result } = await UsuarioService.TrocarSenha(this.state.senhaAntiga, this.state.senhaNova);

                await this.alerta.current.mostrar(result);
            }
        } catch (err) {
            if (err.response)
                await this.alerta.current.mostrar(err.response.data);
            else
                await this.alerta.current.mostrar(err);
        } finally {
            await this.setState({ loading: false });
        }
    }

    render() {
        return (
            <View>
                <Loader loading={this.state.loading} />
                <Alert ref={this.alerta} />

                <ScrollView contentContainerStyle={Styles.scrollContainer}>
                    <Text>Senha Atual:</Text>
                    <TextInput name={"senhaAntiga"} style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"•••"}
                        ref={input => { this.inputs['senhaAntiga'] = input; }} returnKeyType="next" blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusNextField('dataNascimento'); }}
                        underlineColorAndroid="transparent" secureTextEntry={true}
                        value={this.state.senhaAntiga} onChangeText={value => this.setState({ senhaAntiga: value })} />

                    <Text>Nova Senha:</Text>
                    <TextInput name={"senhaNova"} style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"•••"}
                        ref={input => { this.inputs['senhaNova'] = input; }} returnKeyType="next" blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusNextField('senhaNovaConfirma'); }}
                        underlineColorAndroid="transparent" secureTextEntry={true}
                        value={this.state.senhaNova} onChangeText={value => this.setState({ senhaNova: value })} />

                    <Text>Confirme a Nova Senha:</Text>
                    <TextInput name={"senhaNovaConfirma"} style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"•••"}
                        ref={input => { this.inputs['senhaNovaConfirma'] = input; }} returnKeyType="done" blurOnSubmit={true}
                        underlineColorAndroid="transparent" secureTextEntry={true}
                        value={this.state.senhaNovaConfirma} onChangeText={value => this.setState({ senhaNovaConfirma: value })} />

                    <Button title="Enviar" onClick={this.enviar} style={{ marginTop: 20 }} />
                </ScrollView>
            </View>
        );
    }
}