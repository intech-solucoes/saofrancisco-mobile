import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, TouchableHighlight, Image, ScrollView, AsyncStorage, Alert } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import Styles, { Variables } from "../../styles";
import TouchID from 'react-native-touch-id';

import { DadosPessoaisService } from "@intechprev/prevsystem-service";

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
        title: ""
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            plano: 1,
            planoBD: true,
            assistido: false,
            dados: {
                dadosPessoais: {}
            },
        }

        this.carregarDadosPessoais = this.carregarDadosPessoais.bind(this);
    }

    async carregarDadosPessoais() {
        var result = await DadosPessoaisService.Buscar();
        await this.setState({ dados: result.data });
    }

    async componentDidMount() {

        var digitalAccess = await AsyncStorage.getItem('digitalAccess');

        this.setState({ loading: true });

        await this.carregarPlano();
        await this.carregarDadosPessoais();

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

            console.warn(digitalAccess)

            if (digitalAccess == 'false') {

                Alert.alert(
                    'Leitor de Digital',
                    'Desejar logar utilizando sua digital?',
                    [
                        { text: 'Sim', onPress: () => AsyncStorage.setItem('digitalAccess', 'true') },
                        { text: 'Não', onPress: () => AsyncStorage.setItem('digitalAccess', 'false') },
                    ],
                    { cancelable: false }
                )
            }




        } catch (err) {
            if (err.name === "Touch ID Error") {
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
            <View style={{ padding: 5 }}>

                <View style={{ padding: 10 }}>
                    <Text style={[Styles.h4, styles.fontColor]}>Olá,</Text>
                    <Text style={[Styles.h3, styles.header, styles.fontColor]}>{this.state.dados.dadosPessoais.NOME_ENTID}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: '50%', padding: 10 }}>
                        <View style={{ height: 80, backgroundColor: '#CDCDF9', borderRadius: 10 }}>
                            <View style={{ height: '20%', alignItems: 'center', margin: 5 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}> SALDO ACUMULADO </Text>
                            </View>
                            <View style={{ height: '70%', alignItems: 'center', padding: 5 }}>
                                <Text style={{ color: '#9689FD', fontSize: 22, fontWeight: 'bold' }}> R$ 70.000</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ width: '50%', padding: 10 }}>
                        <View style={{ height: 80, backgroundColor: '#B3E9CA', borderRadius: 10 }}>
                            <View style={{ height: '20%', alignItems: 'center', margin: 5 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}> MINHA CONTRIBUIÇÃO </Text>
                            </View>
                            <View style={{ height: '70%', alignItems: 'center', padding: 10 }}>
                                <Text style={{ color: '#5BB97F', fontSize: 22, fontWeight: 'bold' }}> R$ 70.000</Text>
                            </View>
                        </View>

                    </View>


                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                    <View style={{ width: '50%', padding: 10 }}>
                        <View style={{ height: 80, backgroundColor: '#B5E1F3', borderRadius: 10 }}>
                            <View style={{ height: '20%', alignItems: 'center', margin: 5 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}> PATROCINADOR </Text>
                            </View>
                            <View style={{ height: '70%', alignItems: 'center', padding: 5 }}>
                                <Text style={{ color: '#7DC7E9', fontSize: 22, fontWeight: 'bold' }}> R$ 70.000</Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ width: '50%', padding: 10 }}>
                        <View style={{ height: 80, backgroundColor: '#F3CCD9', borderRadius: 10 }}>
                            <View style={{ height: '20%', alignItems: 'center', margin: 5 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}> RENDIMENTO </Text>
                            </View>
                            <View style={{ height: '70%', alignItems: 'center', padding: 10 }}>
                                <Text style={{ color: '#EA769A', fontSize: 22, fontWeight: 'bold' }}> R$ 70.000</Text>
                            </View>
                        </View>

                    </View>


                </View>

                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                    <View style={{ width: '100%', padding: 10 }}>
                        <View style={{ height: 80, backgroundColor: '#B3E9CA', padding: 10, borderRadius: 10 }}>
                            <View style={{ height: '20%', alignItems: 'center' }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}> SALÁRIO DE PARTICIPAÇÃO </Text>
                            </View>
                            <View style={{ height: '70%', alignItems: 'center', padding: 10 }}>
                                <Text style={{ color: '#5BB97F', fontSize: 22, fontWeight: 'bold' }}> R$ 70.000</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', padding: 10 }}>
                        <View style={{ height: 80, backgroundColor: '#B5E1F3', padding: 10, borderRadius: 10 }}>
                            <View style={{ height: '20%', alignItems: 'center' }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}> MINHA ULTIMA CONTRIBUIÇÃO </Text>
                            </View>
                            <View style={{ height: '70%', alignItems: 'center', padding: 10 }}>
                                <Text style={{ color: '#7FC8E9', fontSize: 22, fontWeight: 'bold' }}> R$ 70.000</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', padding: 10 }}>
                        <View style={{ height: 80, backgroundColor: '#F3CCD9', padding: 10, borderRadius: 10 }}>
                            <View style={{ height: '20%', alignItems: 'center' }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}> ULTIMA CONTRIB. PATROCINADORA </Text>
                            </View>
                            <View style={{ height: '70%', alignItems: 'center', padding: 10 }}>
                                <Text style={{ color: '#EA769A', fontSize: 22, fontWeight: 'bold' }}> R$ 70.000</Text>
                            </View>
                        </View>
                    </View>
                </View>




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
    },
    fontColor: {
        color: '#7C7C7C',
    }
});