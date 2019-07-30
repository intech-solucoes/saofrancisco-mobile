import React from "react";
import { View, Text, AsyncStorage, TextInput } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { LGPDService, FuncionarioService, UsuarioService, PlanoService } from "@intechprev/prevsystem-service";

import Container from "./container";
import loginStyles from "./styles";
import { Button, Alert } from "../../components";
import Styles, { Variables } from "../../styles";
import { TextInputMask } from "react-native-masked-text";

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    nomeUsuario: string;
    senhaNova: string;
    confirmarSenha: string;
}

export class TrocarSenhaPrimeiroAcesso extends React.Component<Props, State> {

	private inputs = [];
	
    static navigationOptions = {
		header: null
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            nomeUsuario: "",
            senhaNova: "",
            confirmarSenha: ""
        }
    }

    componentDidMount = async () => {
        var dados = await FuncionarioService.Buscar();
        var nomeUsuario = dados.DadosPessoais.NOME_ENTID;

        await this.setState({
            nomeUsuario
        });
    }

    trocarSenha = async () => {
        // Valida se a nova senha tem 6 ou mais caracteres.
        if(this.state.senhaNova.length < 6) {
            await alert("A nova senha deve possuir no mínimo 6 caracteres.");
            return;
        }

        // Valida se os campos de nova senha e confirmação são iguais.
        if(this.state.senhaNova !== this.state.confirmarSenha) {
            await alert("As senhas não coincidem.");
            return;
        }

        try {
            await UsuarioService.TrocarSenhaPrimeiroAcesso(this.state.senhaNova);
            await alert("Senha alterada com sucesso!");
            
            var planos = await PlanoService.Buscar();
            if (planos.length > 1) 
                this.props.navigation.navigate("Planos");
            else {
                var plano = planos[0];
                await AsyncStorage.setItem("plano", plano.CD_PLANO.toString());
                await AsyncStorage.setItem("assistido", (plano.CD_CATEGORIA === "4").toString());

                this.props.navigation.navigate("Home");
            }
        } catch(err) {
            if(err.response)
                await alert(err.response.data);
            else
                await alert(err);
        }
    }

    focusNextField = (id) => {
        this.inputs[id].focus();
    }

    render() {
        return (
			<Container subtitulo={"Primeiro Acesso"}>
                <View style={loginStyles.content}>
                    <Text>Olá, {this.state.nomeUsuario},</Text>
                    <Text>Seja bem-vindo!</Text>
                    <Text>
                        Esse é o seu primeiro acesso ao Portal da Fundação São Francisco! Como você recebeu uma nova senha 
                        gerada automaticamente, será necessário que você crie uma nova senha, com no mínimo 6 caracteres.
                    </Text>
                    
                    <View style={loginStyles.content}>
                        <Text style={loginStyles.label}>Nova Senha</Text>
                        <TextInput style={Styles.textInput} placeholder="•••" returnKeyType="next" blurOnSubmit={false} underlineColorAndroid="transparent"
                            value={this.state.senhaNova} secureTextEntry={true}
                            onSubmitEditing={() => { this.focusNextField('confirmarSenha'); }} onChangeText={value => this.setState({ senhaNova: value })}
                            ref={input => { this.inputs['cpf'] = input; }} />

                        <Text style={loginStyles.label}>Confirme nova senha</Text>
                        <TextInput style={Styles.textInput} placeholder="•••" returnKeyType="done"
                            value={this.state.confirmarSenha} secureTextEntry={true}
                            onChangeText={value => this.setState({ confirmarSenha: value })}
                            ref={input => { this.inputs['confirmarSenha'] = input; }} />
                        
                        <View>
                            <Button title="Enviar" onClick={this.trocarSenha} style={loginStyles.loginButton} />
                        </View>
                    </View>
                </View>
            </Container>
        );
    }
}