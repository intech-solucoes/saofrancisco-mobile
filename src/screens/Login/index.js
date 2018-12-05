import React from "react";
import { Text, View, TextInput, Switch, AsyncStorage, StyleSheet, Alert, KeyboardAvoidingView, StatusBar, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import TouchID from 'react-native-touch-id';
import VersionNumber from 'react-native-version-number';

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
            //cpf: "15243362115",
            // senha: "S@besprev2018",
            cpf: "",
            senha: "",
            lembrar: false,
            leitorDigital: false,
            digitalAccess : false,
            loading: false,
            modalVisible: false,
            touchIDAvailable: false
        };
    }
 
    async componentDidMount() {
        
        var cpf = await AsyncStorage.getItem('cpfSalvo');
        var digitalAccess = await AsyncStorage.getItem('digitalAccess');

        
        if(cpf)
            await this.setState({ cpf, lembrar: true });

        if(digitalAccess == 'true'){
            await this.setState({ digitalAccess, leitorDigital: true });
        }   
            

        try {
            var biometryType = await TouchID.isSupported();

            if (biometryType === 'TouchID') { 
                // Touch ID is supported on iOS
                //alert("TouchID"); 
            } else if (biometryType === 'FaceID') {
                // Face ID is supported on iOS
                //alert("FaceID");
            } else if (biometryType === true) {
                // Touch ID is supported on Android
                //alert("Android");
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
            TouchID.authenticate('Use sua digital para se autenticar').then(success =>
                this.props.navigation.navigate('Main')
            )
            .catch(() => {
                this.setState({ digitalAccess: false })
            })
        } catch(err) {
            console.log(err);
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
            
            if(this.state.leitorDigital && this.state.digitalAccess){
                this.fingerLogin();
            } 
            else {
                var result = await UsuarioService.Login(this.state.cpf, this.state.senha);
                //console.warn(result)
                //await AsyncStorage.setItem('pensionista', result.data.pensionista.toString());
                await AsyncStorage.setItem('token', result.data.AccessToken);
                
                await AsyncStorage.setItem('digitalAccess', 'false');
                
                await this.setState({ loading: false });
                this.props.navigation.navigate('Main');  
            }

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
            
                
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> 
                            <View>
                            <Text style={loginStyles.label}>CPF</Text>
                            <TextInput name={"cpf"} style={Styles.textInput} placeholder="Digite aqui seu CPF" returnKeyType="next" blurOnSubmit={false} underlineColorAndroid="transparent"
                                value={this.state.cpf}
                                onSubmitEditing={() => { this.focusNextField('senha'); }} onChangeText={value => this.setState({ cpf: value })}
                                ref={input => { this.inputs['cpf'] = input; }} 
                            />
                            </View>
                            <View>
                                <Text style={loginStyles.label}>Lembrar-me</Text>
                                <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end' }}>
                                    <Switch value={this.state.lembrar} thumbColor={Variables.colors.primary}
                                        onValueChange={value => this.setState({ lembrar: value })} style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}/>
                                </View>
                            </View>
                        </View>  
                        
                        
                        { this.state.digitalAccess == false &&  
                            <Text style={loginStyles.label}>Senha</Text> 
                        } 
                        
                        { this.state.digitalAccess == false &&  
                        <TextInput name={"senha"} style={Styles.textInput} placeholder="Digite aqui sua senha" returnKeyType="done" secureTextEntry={true}
                            value={this.state.senha}
                            ref={input => { this.inputs['senha'] = input; }} onChangeText={value => this.setState({ senha: value })} />
                        }                    
                        
                        
                        
                        
                        
                        {/* <View style={{ flexDirection: "row", marginVertical: 10 }}>
                            
                            
                            {this.state.touchIDAvailable &&
                            <View style={{ flex: 1, flexDirection: "row" }}>  
                                <Text style={loginStyles.labelRemeber}>Leitor digital</Text>
                                <Switch value={this.state.leitorDigital} thumbColor={Variables.colors.primary}
                                        onValueChange={value => this.changeDigital( value )} style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}/>
                            </View>
                            }

                            <View style={{ width: 40 }}>
                                {this.state.touchIDAvailable &&
                                    <Button style={ loginStyles.loginFingerprint } onClick={this.fingerLogin}>
                                        <Icon name={"fingerprint"} style={{ marginRight: 0 }} size={28} color={this.state.leitorDigital ? Variables.colors.primary : '#CCCCCC'} borderRadius={10}/> 
                                    </Button>
                                } 
                            </View>

                        </View> */}

                        <View>
                            <Button title="Entrar" onClick={this.login} style={loginStyles.loginButton} />
                            <Button title="Primeiro Acesso/Esqueci minha senha" onClick={this.firstAccess} light={true}
                                    style={{ backgroundColor: "transparent", marginTop: 5 }} titleStyle={[Styles.buttonLight, { fontSize: 14 }]} />
                        </View>
                     
                </Container> 
            
            
            
             
        );
    }
}