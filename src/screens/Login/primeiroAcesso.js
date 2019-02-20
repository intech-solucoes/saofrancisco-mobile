import React, { Component } from 'react'
import { Text, View, TextInput } from "react-native";

import Styles, { Variables } from "../../styles";
import { Button, Loader, Alert } from "../../components";
import Container from "./container";
import loginStyles from "./styles";

import { UsuarioService } from "@intechprev/prevsystem-service";
import { TextInputMask } from 'react-native-masked-text';

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
            //cpf: "12178513727",
			//dataNascimento: "24/10/1988",
			cpf: "",
			dataNascimento: "",
            loading: false
        };

        this.alerta = React.createRef();
	}

    focusNextField = (id) => {
        this.inputs[id].focus();
    }

	enviar = async () => {
		try {
			await this.setState({ loading: true });

			var result = await UsuarioService.PrimeiroAcesso(this.state.cpf, this.state.dataNascimento);

			await this.setState({ loading: false });
			await this.alerta.current.mostrar(result.data);
				
		} catch(err) {
			await this.alerta.current.mostrar("Dados inválidos!");
		}
	}

	closeModal = () => {
		this.props.navigation.navigate('Login');
	}

	cancelar = async () => {
		this.props.navigation.pop();
	}
	
	render() {
		return (
			<Container subtitulo={"Primeiro acesso/Esqueci minha senha"}>
                <Loader loading={this.state.loading} />
				<Alert ref={this.alerta} onClose={this.closeModal} />
                
                <View style={loginStyles.content}>
					<Text style={{ marginBottom: 20, marginHorizontal: 10, color: Variables.colors.grayDark }}>Insira os dados abaixo para que possamos confirmar sua identidade. Logo após, uma nova senha será enviada para seu e-mail.</Text>

					<Text style={loginStyles.label}>CPF</Text>
					<TextInput name={"cpf"} style={Styles.textInput} placeholder="Digite aqui seu CPF" returnKeyType="next" blurOnSubmit={false} underlineColorAndroid="transparent"
						value={this.state.cpf}
						onSubmitEditing={() => { this.focusNextField('dataNascimento'); }} onChangeText={value => this.setState({ cpf: value })}
						ref={input => { this.inputs['cpf'] = input; }} />

					<Text style={loginStyles.label}>Data de Nascimento</Text>
					<TextInputMask name={"dataNascimento"} type={"datetime"} options={{ format: 'dd/MM/yyyy' }} style={Styles.textInput} placeholder="Digite aqui sua data de nascimento" returnKeyType="done"
						value={this.state.dataNascimento}
						refInput={input => { this.inputs['dataNascimento'] = input; }} onChangeText={value => this.setState({ dataNascimento: value })} />
					
					<View>
						<Button title="Enviar" onClick={this.enviar} style={loginStyles.loginButton} />
						<Button title="Cancelar" onClick={this.cancelar} light={true}
								style={{ backgroundColor: "transparent", marginTop: 5 }} titleStyle={[Styles.buttonLight, { fontSize: 14, color: Variables.colors.secondary }]} />
					</View>
				</View>
			</Container>
    	);
	}
}