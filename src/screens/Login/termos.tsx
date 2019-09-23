import React from "react";
import { View, Text, AsyncStorage, KeyboardAvoidingView, StatusBar } from "react-native";
import { NavigationScreenProp, ScrollView } from "react-navigation";
import { LGPDService } from "@intechprev/prevsystem-service";

import Container from "./container";
import loginStyles from "./styles";
import { Button } from "../../components";
import Styles from "../../styles";

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    
}

export class Termos extends React.Component<Props, State> {
	
    static navigationOptions = {
		header: null
    }

    constructor(props: Props) {
        super(props);
    }

    aceitar = async () => {
        try {
            await LGPDService.Inserir(1);
            await this.props.navigation.navigate('TrocarSenhaPrimeiroAcesso');
        } catch(erro) {
            if(erro.response) {
                //await this.loginForm.current.mostrarErro(erro.response.data);
                //await this.setState({ erro: erro.response.data });
                alert(erro.response.data);
            } else {
                //await this.loginForm.current.mostrarErro(erro);
                alert("Ocorreu um erro ao processar sua requisição!");
                //await this.setState({ erro });
            }
        }
    }

    recusar = async () => {
        await alert("Sem o consentimento expresso no termo, o acesso ao Portal do Participante e à área restrita do Aplicativo Mobile não será permitido.");
        await AsyncStorage.removeItem("token");
        await this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <KeyboardAvoidingView style={[loginStyles.container]} behavior={"height"}>
                <ScrollView style={loginStyles.content}>
                    <StatusBar
                        animated={true}
                        translucent={false}
                        barStyle={'dark-content'}
                        backgroundColor={'#FFFFFF'}
                    />
                    <Text style={[Styles.h1, { marginVertical: 40 }]}>TERMOS</Text>
                    <Text style={[Styles.h3, { marginVertical: 10 }]}>TERMO DE CONSENTIMENTO E AUTORIZAÇÃO LIVRE, ESCLARECIDO E INEQUÍVOCO DE UTILIZAÇÃO DE DADOS PESSOAIS</Text>
                    <View>
                        <Text style={{ marginBottom: 10 }}>
                            Nos termos do presente termo de consentimento e autorização livre, esclarecido e inequívoco, e de acordo com o artigo 5°, XII, 
                            da Lei 13.709/18 – LEI GERAL DE PROTEÇÃO DE DADOS, manifesto minha livre, informada e inequívoca autorização, pelo qual concordo 
                            com o tratamento de meus dados pessoais, financeiros e cadastrais e, respectivamente, de meus dependentes, para que a 
                            FUNDAÇÃO SÃO FRANCISCO DE SEGURIDADE SOCIAL os utilize para o fim da prestação específica de administração do(s) 
                            meu(s) Plano(s) de Benefícios, dados estes que serão consultados e colhidos via Portal de Serviços contidos no sítio da Entidade, 
                            em área restrita, e/ou no aplicativo mobile disponível para download nas lojas Apple Store e Google Play.
                        </Text>

                        <Button title={"Li e concordo com o termo acima"} onClick={this.aceitar} style={loginStyles.loginButton} />
                        <Button title={"Agora não"} onClick={this.recusar} style={loginStyles.loginButtonLight} titleStyle={{ color: "#000" }} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}