import React, { Component } from 'react'
import { Text, View, TextInput, Switch, AsyncStorage } from "react-native";

import Styles, { Variables } from "../../styles";
import { Button, Loader } from "../../components";
import Container from "./container";
import loginStyles from "./styles";

import { UsuarioService } from "@intechprev/prevsystem-service";

export default class PrimeiroAcesso extends Component {
    static navigationOptions = {
		header: null
    }
    
    constructor(props) { 
        super(props);

        // Armazena as referências dos inputs para fácil transição entre eles, como utilizar o tab no teclado
        this.inputs = {};

        // Cria o state do componente
        this.state = {
            cpf: "12178513727",
            dataNascimento: "24/10/1988",
            loading: false
        };
	}

	enviar = async () => {
		try {
			await this.setState({ enviarSenhaDesabilitado: true });

			var result = await UsuarioService.PrimeiroAcesso(this.state.cpf, this.state.dataNascimento);
			console.warn(result.data);
				
			await this.setState({ enviarSenhaDesabilitado: true });

			alert(result.data);
			this.props.navigation.navigate('Login');
		} catch(err) {
			if(err.response) {
				console.warn(err.response);
			} else {
				console.warn(err);
			}

			await this.setState({
				mensagemErro: "Dados inválidos!",
				enviarSenhaDesabilitado: false
			});
		}
	}
	
	render() {
		return (
			<Container>
                <Loader loading={this.state.loading} />
                
                <Text style={loginStyles.label}>CPF</Text>
                <TextInput name={"cpf"} style={Styles.textInput} placeholder="Digite aqui seu CPF" returnKeyType="next" blurOnSubmit={false} underlineColorAndroid="transparent"
                    value={this.state.cpf}
                    onSubmitEditing={() => { this.focusNextField('dataNascimento'); }} onChangeText={value => this.setState({ cpf: value })}
                    ref={input => { this.inputs['cpf'] = input; }} />

                <Text style={loginStyles.label}>Data de Nascimento</Text>
                <TextInput name={"dataNascimento"} style={Styles.textInput} placeholder="Digite aqui sua data de nascimento" returnKeyType="done"
                    value={this.state.dataNascimento}
                    ref={input => { this.inputs['dataNascimento'] = input; }} onChangeText={value => this.setState({ dataNascimento: value })} />
				
                <View>
                    <Button title="Enviar" onClick={this.enviar} style={loginStyles.loginButton} />
				</View>
			</Container>
    	);
	}
}