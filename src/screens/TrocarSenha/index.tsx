import React, { Component } from 'react';
import { View, Text, ScrollView, TextInput, AlertAndroid } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { UsuarioService } from "@intechprev/prevsystem-service";

import Styles, { Variables } from "../../styles";
import { Button, Alert, Box } from "../../components";

interface Props { }

interface State {
    senhaAntiga: string;
    senhaNova: string;
    senhaNovaConfirma: string;
    loading: boolean;
}

export class TrocarSenha extends Component<Props, State> {

    private inputs = [];

    static navigationOptions = {
        title: "Trocar Senha"
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            senhaAntiga: null,
            senhaNova: null,
            senhaNovaConfirma: null,
            loading: false
        };
    }

    enviar = async () => {
        try {
            await this.setState({ loading: true });

            if (this.state.senhaNova !== this.state.senhaNovaConfirma)
                //await this.alerta.current.mostrar("As senhas não coincidem!");
                await alert("As senhas não coincidem!");
            else {
                var data = await UsuarioService.TrocarSenha(this.state.senhaAntiga, this.state.senhaNova);

                await this.setState({ loading: false });
                //await this.alerta.current.mostrar(result);
                setTimeout(async () => {
                    await alert(data);
                }, 500);
            }
        } catch (err) {
            await this.setState({ loading: false });

            if (err.response) {
                //await this.alerta.current.mostrar(err.response.data);
                alert(err.response.data);
                //console.warn(err.response.data);
            }
            else {
                //await this.alerta.current.mostrar(err);
                alert(err);
                //console.warn(err);
            }
        }
    }

    focusNextField = (id: string) => {
        this.inputs[id].focus();
    };

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Spinner visible={this.state.loading} />

                <Box>
                    <Text>Senha Atual:</Text>
                    <TextInput style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"•••"}
                        ref={input => { this.inputs['senhaAntiga'] = input; }} returnKeyType="next" blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusNextField('dataNascimento'); }}
                        underlineColorAndroid="transparent" secureTextEntry={true}
                        value={this.state.senhaAntiga} onChangeText={value => this.setState({ senhaAntiga: value })} />

                    <Text>Nova Senha:</Text>
                    <TextInput style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"•••"}
                        ref={input => { this.inputs['senhaNova'] = input; }} returnKeyType="next" blurOnSubmit={false}
                        onSubmitEditing={() => { this.focusNextField('senhaNovaConfirma'); }}
                        underlineColorAndroid="transparent" secureTextEntry={true}
                        value={this.state.senhaNova} onChangeText={value => this.setState({ senhaNova: value })} />

                    <Text>Confirme a Nova Senha:</Text>
                    <TextInput style={[Styles.textInput, { padding: 0, marginBottom: 0 }]} placeholder={"•••"}
                        ref={input => { this.inputs['senhaNovaConfirma'] = input; }} returnKeyType="done" blurOnSubmit={true}
                        underlineColorAndroid="transparent" secureTextEntry={true}
                        value={this.state.senhaNovaConfirma} onChangeText={value => this.setState({ senhaNovaConfirma: value })} />

                    <Button title="Enviar" onClick={this.enviar} style={{ marginTop: 20 }} />
                </Box>
            </ScrollView>
        );
    }
}