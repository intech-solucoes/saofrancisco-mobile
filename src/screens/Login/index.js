import React from "react";
import { Text, View, TextInput, Switch, AsyncStorage } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import TouchID from 'react-native-touch-id';

import Styles, { Variables } from "../../styles";
import { Button } from "../../components";
import Container from "./container";
import loginStyles from "./styles";

import { UsuarioService } from "@intechprev/prevsystem-service";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        // Armazena as referências dos inputs para fácil transição entre eles, como utilizar o tab no teclado
        this.inputs = {};

        // Cria o state do componente
        this.state = {
            // cpf: "05459185882",
            // senha: "S@besprev2018",
            cpf: "",
            senha: "",
            lembrar: false,
            loading: false,
            modalVisible: false,
            touchIDAvailable: false
        };
    }

    async componentDidMount() {
        var cpf = await AsyncStorage.getItem('cpfSalvo');

        if(cpf)
            await this.setState({ cpf, lembrar: true });

        try {
            var biometryType = await TouchID.isSupported();

            if (biometryType === 'TouchID') {
                // Touch ID is supported on iOS
                alert("TouchID");
            } else if (biometryType === 'FaceID') {
                // Face ID is supported on iOS
                alert("FaceID");
            } else if (biometryType === true) {
                // Touch ID is supported on Android
                alert("Android");
            }

            await this.setState({
                touchIDAvailable: true
            });
            
        } catch(err) {
            if(err.name === "Touch ID Error") {
                await this.setState({
                    touchIDAvailable: false
                });
            } else {
                alert("Ocorreu um erro");
            }
        }
    }

    focusNextField = (id) => {
        this.inputs[id].focus();
    }

    fingerLogin = () => { 
        try {
            TouchID.authenticate('Unlock with your fingerprint').then(success =>
                alert("Logado")
            );
        } catch(err) {
            console.warn(err);
        }
    }

    firstAccess = async () => {
        
    }

    login = async () => {

        this.setState({
            modalVisible: true
        });

        try {
            await this.setState({ loading: true });

            if(this.state.lembrar) {
                await AsyncStorage.setItem('cpfSalvo', this.state.cpf);
            }

            var result = await UsuarioService.Login(this.state.cpf, this.state.senha);
            await AsyncStorage.setItem('pensionista', result.data.pensionista.toString());
            await AsyncStorage.setItem('token', result.data.AccessToken);
            await this.setState({ loading: false });

            this.props.navigation.navigate('Planos');
        } catch (ex) {
            if(ex.response) {
                alert(ex.response.data);
                this.setState({ loading: false });
            } else {
                alert("Ocorreu um erro ao processar requisição!");
            }
        }
    }

    render() {
        return (
            <Container>
                <Text style={loginStyles.label}>CPF</Text>
                <TextInput name={"cpf"} style={Styles.textInput} placeholder="Digite aqui seu CPF" returnKeyType="next" blurOnSubmit={false} underlineColorAndroid="transparent"
                    value={this.state.cpf}
                    onSubmitEditing={() => { this.focusNextField('senha'); }} onChangeText={value => this.setState({ cpf: value })}
                    ref={input => { this.inputs['cpf'] = input; }} />

                <Text style={loginStyles.label}>Senha</Text>
                <TextInput name={"senha"} style={Styles.textInput} placeholder="Digite aqui sua senha" returnKeyType="done" secureTextEntry={true}
                    value={this.state.senha}
                    ref={input => { this.inputs['senha'] = input; }} onChangeText={value => this.setState({ senha: value })} />
                
                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <View style={{ width: 40 }}>
                        {this.state.touchIDAvailable &&
                            <Button style={loginStyles.loginFingerprint} onClick={this.fingerLogin}>
                                <Icon name={"fingerprint"} style={{ marginRight: 0 }} size={28} color={"#FFF"} borderRadius={10} />
                            </Button>
                        }
                    </View>
                    
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end' }}>
                        <Text style={loginStyles.labelRemeber}>Lembrar-me</Text>
                        <Switch value={this.state.lembrar} thumbColor={Variables.colors.primary}
                            onValueChange={value => this.setState({ lembrar: value })} />
                    </View>
                    
                </View>

                <View>
                    <Button title="Entrar" onClick={this.login} style={loginStyles.loginButton} />
                    <Button title="Primeiro Acesso/Esqueci minha senha" onClick={this.firstAccess} light={true}
                            style={{ backgroundColor: "transparent", marginTop: 5 }} titleStyle={[Styles.buttonLight, { fontSize: 14 }]} />
                </View>
            </Container>
        );
    }
}