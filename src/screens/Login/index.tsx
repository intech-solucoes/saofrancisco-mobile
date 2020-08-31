import React from 'react';
import { View, Text, TextInput, Switch, AlertAndroid, AsyncStorage, StatusBar } from "react-native";

import { Button, Loader, Alert } from "../../components";

import Container from './container';
import Styles, { Variables } from '../../styles';
import Constants from 'expo-constants';

import loginStyles from "./styles";

import { UsuarioService, FuncionarioService, PlanoService, LGPDService } from "@intechprev/prevsystem-service";
import { NavigationScreenProp } from 'react-navigation';
import { TextInputMask } from 'react-native-masked-text';
import { Session } from "@intechprev/service";

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    touchIDAvailable: boolean;

    cpf: string;
    senha: string;
    lembrar: boolean;
    loginVisible: boolean;
    digitalAccess: boolean;
    modalVisible: boolean;
    w:string;
    h:string;
}

export class Login extends React.Component<Props, State> {

    private alerta = React.createRef<Alert>();

    private inputs = [];

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);

        // Cria o state do componente
        this.state = {
            //cpf: "18112463468",
            //cpf: "17366208787",
            //cpf: "22222222222",
            //senha: "123456",
            cpf: "",
            senha: "",
            lembrar: false,
            loading: false,
            modalVisible: false,
            touchIDAvailable: false,
            loginVisible: true,
            w: "auto",
            h: "auto",
            digitalAccess: false
        };
    }

    focusNextField = (id: string) => {
        this.inputs[id].focus();
    };

    fingerLogin = () => {
        // try {
        //   TouchID.authenticate('Use sua digital para se autenticar').then(success =>
        //     this.props.navigation.navigate('Home')
        //   )
        //     .catch(() => {
        //       this.setState({ digitalAccess: false })
        //       AsyncStorage.setItem('digitalAccess', 'false')
        //     })
        // } catch (err) {
        //   console.log(err);
        // }
    }

    firstAccess = async () => {
        this.props.navigation.navigate("PrimeiroAcesso");
    };

    login = async () => {
        this.setState({
            modalVisible: true
        });

        try {
            await this.setState({ loading: true });

            if (this.state.lembrar) {
                await AsyncStorage.setItem("cpfSalvo", this.state.cpf);
            }
            
            if (this.state.digitalAccess) {
                this.fingerLogin();
            }
            else {
                var login = await UsuarioService.Login(this.state.cpf, this.state.senha);
                
                await Session.setToken(login.AccessToken);
                await AsyncStorage.setItem("pensionista", login.Pensionista.toString());

                var funcionarioData = await FuncionarioService.Buscar();

                await AsyncStorage.setItem("fundacao", funcionarioData.Funcionario.CD_FUNDACAO);
                await AsyncStorage.setItem("empresa", funcionarioData.Funcionario.CD_EMPRESA);

                var termo = await LGPDService.Buscar();
                if(!termo) {
                    this.props.navigation.navigate("Termos");
                }
                else {
                    var dados = await FuncionarioService.Buscar();
                    
                    if(dados.Usuario.IND_PRIMEIRO_ACESSO === "S") {
                        this.props.navigation.navigate("TrocarSenhaPrimeiroAcesso");
                    } else {
                        this.props.navigation.navigate("Planos");
                    }
                }
            }
        } catch (ex) {
            if (ex.response) {
                await this.setState({ loading: false });
                await this.alerta.current.mostrar(ex.response.data);
                console.warn(ex.response.data);
            } else {
                await this.setState({ loading: false });
                await this.alerta.current.mostrar("Ocorreu um erro ao processar requisição!");
                console.warn(ex);
            }
        } finally {
            await this.setState({ loading: false });
        }
    };

    render() {
        return (
            <Container subtitulo={"Bem vindo ao aplicativo da São Francisco"}>
                <View>
                    <Loader loading={this.state.loading} {...this.props} />
                    <Alert ref={this.alerta} />

                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View>
                            <Text style={loginStyles.label}>CPF</Text>
                            <TextInput style={Styles.textInput} placeholder="Digite aqui seu CPF" returnKeyType="next" blurOnSubmit={false}
                                       value={this.state.cpf} keyboardType={'numeric'}
                                       onSubmitEditing={() => { this.focusNextField('senha'); }} onChangeText={value => this.setState({ cpf: value })}
                                       ref={input => { this.inputs['cpf'] = input; }} />
                        </View>
                        <View>
                            <Text style={loginStyles.label}>Lembrar-me</Text>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end' }}>
                                <Switch value={this.state.lembrar} thumbColor={Variables.colors.primary}
                                        onValueChange={value => this.setState({ lembrar: value })} style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} />
                            </View>
                        </View>
                    </View> */}

                    <View style={{ marginBottom: 40 }}>
                        <Text style={loginStyles.label}>CPF</Text>
                        <TextInputMask style={Styles.textInput} returnKeyType="next" blurOnSubmit={false} type={'cpf'}
                                    value={this.state.cpf} keyboardType={'numeric'}
                                    onSubmitEditing={() => { this.focusNextField('senha'); }} onChangeText={value => this.setState({ cpf: value })}
                                    ref={input => { this.inputs['cpf'] = input; }} />
                    </View>

                    {this.state.digitalAccess == false &&
                        <Text style={loginStyles.label}>Senha</Text>
                    }
                    {this.state.digitalAccess == false &&
                        <TextInput style={Styles.textInput} returnKeyType="done" secureTextEntry={true}
                                   value={this.state.senha}
                                   ref={input => { this.inputs['senha'] = input; }} onChangeText={value => this.setState({ senha: value })} />
                    }

                    <View>
                        <Button title="Entrar" onClick={this.login} style={loginStyles.loginButton} />
                        <Button title="Primeiro Acesso/Esqueci minha senha" onClick={this.firstAccess} light={true}
                                style={{ backgroundColor: "transparent", marginTop: 5 }} titleStyle={[Styles.buttonLight, { fontSize: 14, color: Variables.colors.secondary }]} />
                    </View>

                </View>

                <Text style={{ marginBottom: 10, padding: 5, textAlign: "center", color: "#8F8E93" }}>
                    Versão {Constants.manifest.version}
                </Text>
            </Container>
        );
    }
}