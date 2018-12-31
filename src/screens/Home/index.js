import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, TouchableHighlight, Image, ScrollView, AsyncStorage, Alert } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import Styles, { Variables } from "../../styles";
import TouchID from 'react-native-touch-id';

const MenuItem = (props) => {
    return (
        <TouchableHighlight onPress={props.onPress} style={styles.menuItemContainer} underlayColor={Variables.colors.gray}>
            <View style={styles.menuItemInner}>
                <View style={styles.menuItemIconContainer}>
                    <Image source={props.icon} style={styles.menuItemIcon} />
                </View>

                <View style={styles.menuItemContent}>
                    <Text style={[Styles.h1, styles.menuItemContentTitle]}>{props.title}</Text>
                    <Text style={styles.menuItemContentSubtitle}>{props.subtitle}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

export default class Home extends Component {

    static navigationOptions = {
        title :  ""
    } 

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            plano: 1,
            planoBD: true,
            assistido: false
        }
    }

    async componentDidMount() {

        var digitalAccess = await AsyncStorage.getItem('digitalAccess');
        
        this.setState({ loading: true });
        
        await this.carregarPlano();

        this.setState({ loading: false });


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


            
            if(digitalAccess == 'false'){
                
                Alert.alert(
                    'Leitor de Digital',
                    'Desejar logar utilizando sua digital?',
                    [
                      {text: 'Sim', onPress: () => AsyncStorage.setItem('digitalAccess', 'true') }, 
                      {text: 'Não', onPress: () => AsyncStorage.setItem('digitalAccess', 'false') }, 
                    ],
                    { cancelable: false }
                ) 
            }
            

            
            
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

    navigateToScreen = (route) => {
        this.props.navigation.navigate(route);
    }

    carregarPlano = async () => {
        var plano = await AsyncStorage.getItem("plano");
        var assistido = await AsyncStorage.getItem("assistido");
        var planoBD = plano === "0001";

        await this.setState({ 
            plano, 
            planoBD,
            assistido: assistido === "true"
        });
    }

    logout = async () => {
        this.navigateToScreen("Login");
    }

    render() {
        return (
            <View>
                <Spinner visible={this.state.loading} cancelable={true} />
                
                <ScrollView contentContainerStyle={Styles.scrollContainer}>
                    <MenuItem onPress={() => this.navigateToScreen("Dados")} icon={require("../../assets/ic_dados.png")} title={"Dados Pessoais"} subtitle={"Confira seus dados cadastrais"}  />

                    {!this.state.assistido && !this.state.pensionista &&
                        <MenuItem onPress={() => this.navigateToScreen('Contribuicao')} icon={require("../../assets/ic_contribuicao.png")} title="Sua Contribuição" subtitle={"Visualize e entenda sua contribuição"} />}
                        
                    {(this.state.assistido || this.state.pensionista) && 
                        <MenuItem onPress={() => this.navigateToScreen('Contracheque')} icon={require("../../assets/ic_contracheque.png")} title="Demonstrativo de Pagamento" subtitle={"Consulte aqui seus contracheques"} />}
                    
                    {(this.state.assistido || this.state.pensionista) && 
                        <MenuItem onPress={() => this.navigateToScreen('InformeRendimentos')} icon={require("../../assets/ic_contracheque.png")} title="Informe de Rendimentos" subtitle={"Consulte aqui seus informes de rendimento"} />}
                    
                    <MenuItem onPress={() => this.navigateToScreen('Emprestimo')} icon={require("../../assets/ic_emprestimo.png")} title="Empréstimo" subtitle={"Consulte aqui seus empréstimos"} />
                
                    {(!this.state.assistido && !this.state.pensionista) && 
                        <MenuItem onPress={() => this.navigateToScreen('ExtratoAnos')} icon={require("../../assets/ic_contracheque.png")} title="Extrato de Contribuições" subtitle={"Visualize o extrato de suas contribuições"} />}
                
                    {(!this.state.planoBD && !this.state.pensionista) && 
                        <MenuItem onPress={() => this.navigateToScreen('Saldo')} icon={require("../../assets/ic_saldo.png")} title="Seu Saldo" subtitle={"Visualize seu saldo"} />}
                    
                    <MenuItem title={"Relacionamento"} subtitle={"Envie aqui suas mensagens com suas duvidas"} icon={require("../../assets/ic_chat.png")} onPress={() => this.navigateToScreen("Relacionamento")} />
                    <MenuItem title={"Selecionar Plano"} subtitle={"Escolha outro plano"} icon={require("../../assets/ic_plano.png")} onPress={() => this.navigateToScreen("Planos")} />
                    <MenuItem title={"Sair"} subtitle={"Sair do aplicativo"} icon={require("../../assets/ic_out.png")} onPress={() => this.logout()} />
                </ScrollView>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    menuItemContainer: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        marginBottom: 10,
        backgroundColor: "#FFF"
    },
    menuItemInner: {
        flexDirection: 'row'
    },
    menuItemIconContainer: {
        justifyContent: 'center', 
        alignItems: 'center'
    },
    menuItemIcon: {
        marginLeft: 10,
        marginRight: 20,
        width: 26,
        height: 26
    },
    menuItemContent: {
        flex: 1
    },
    menuItemContentTitle: {
        flex: 1
    },
    menuItemContentSubtitle: {
        flex: 2
    }
});