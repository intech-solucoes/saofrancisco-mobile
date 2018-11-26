import React from "react";
import { Text, View, ImageBackground, Image, TextInput, Switch, AsyncStorage, StatusBar } from "react-native";
//import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/FontAwesome5';
import VersionNumber from 'react-native-version-number';

import Styles, { Variables } from "../../styles";
import { Button } from "../../components";

import { UsuarioService } from "@intechprev/prevsystem-service";

const loginStyles = {
    container: {
        flex: 1,
        backgroundColor: "#E9E9E9"
    },
    content: {
        flex: 1,
        padding: 100,
        alignItems: "center"
    },
    logo: {
        height: 120,
        width: 120
    },
    footer: {
        padding: 15,
        margin: 20,
        marginBottom: 10,
        backgroundColor: "#FFF",
        borderRadius: 10
    },
    label: {
        color: Variables.colors.primary,
        marginLeft: 10,
    },
    labelRemeber: {
        color: Variables.colors.primary,
        marginTop: 3
    },
    remember: {
        flexDirection: "row",
        alignSelf: "flex-end"
    },
    loginFingerprint: {
        backgroundColor: Variables.colors.primary,
        marginRight: 0,
        flexDirection: "row",
        alignSelf: "flex-start"
    },
    loginButton: {
        marginTop: 10
    }
}

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
            modalVisible: false
        };
    }

    async componentDidMount() {
        var cpf = await AsyncStorage.getItem('cpfSalvo');

        if(cpf)
            await this.setState({ cpf, lembrar: true });
    }

    focusNextField = (id) => {
        this.inputs[id].focus();
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
            <View style={loginStyles.container}>

                <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.20)" animated />

                <View style={[Styles.content, loginStyles.content]}>
                    <Image source={require("../../assets/Logo.png")} style={loginStyles.logo} />
                </View>

                <View style={loginStyles.footer}>
                    <Text style={loginStyles.label}>CPF</Text>
                    <TextInput name={"cpf"} style={Styles.textInput} placeholder="Digite aqui seu CPF" returnKeyType="next" blurOnSubmit={false} underlineColorAndroid="transparent"
                        value={this.state.cpf}
                        onSubmitEditing={() => { this.focusNextField('senha'); }} onChangeText={value => this.setState({ cpf: value })}
                        ref={input => { this.inputs['cpf'] = input; }} />

                    <Text style={loginStyles.label}>Senha</Text>
                    <TextInput name={"senha"} style={Styles.textInput} placeholder="Digite aqui sua senha" returnKeyType="done" secureTextEntry={true}
                        value={this.state.senha}
                        ref={input => { this.inputs['senha'] = input; }} onChangeText={value => this.setState({ senha: value })} />
                    
                    <View style={loginStyles.remember}>
                        <Text style={loginStyles.labelRemeber}>Lembrar-me</Text>
                        <Switch value={this.state.lembrar} thumbColor={Variables.colors.primary} trackColor={Variables.colors.primaryLight}
                            onValueChange={value => this.setState({ lembrar: value })} />
                    </View>

                    <View>
                        <Button style={loginStyles.loginFingerprint}>
                            <Icon.Button name={"fingerprint"} style={{ backgroundColor: Variables.colors.primary, marginRight: 0 }} borderRadius={20} />
                        </Button>
                        <Button title="Entrar" onClick={this.login} style={loginStyles.loginButton} />
                    </View>
                </View>

                <Text style={{ marginBottom: 10, padding: 5, textAlign:"center", color: "#8F8E93" }}>
                    Versão {VersionNumber.appVersion}
                </Text>
                
            </View>
        );
    }
}