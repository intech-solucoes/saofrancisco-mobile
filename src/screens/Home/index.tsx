import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, TouchableHighlight, Image, ScrollView, AsyncStorage, Alert } from "react-native";
import Styles, { Variables } from "../../styles";

import { DadosPessoaisService, PlanoService } from "@intechprev/prevsystem-service";
import { NavigationScreenProp } from 'react-navigation';
import { HomeAtivo } from './HomeAtivo';
import { HomeAssistido } from './HomeAssistido';
import { HomeAtivoSaldado } from './HomeAtivoSaldado';

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    plano: any;
    dados: any;
}

export class Home extends Component<Props, State> {

    static navigationOptions = {
        title: "Home"
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            plano: null,
            dados: {
                dadosPessoais: {}
            },
        }
    }

    async componentDidMount() {

        //var digitalAccess = await AsyncStorage.getItem('digitalAccess');

        this.setState({ loading: true });

        await this.carregarPlano();

        this.setState({ loading: false });


        try {
            // var biometryType = await TouchID.isSupported();

            // if (biometryType === 'TouchID') {
            //     // Touch ID is supported on iOS
            //     //alert("TouchID"); 
            // } else if (biometryType === 'FaceID') {
            //     // Face ID is supported on iOS
            //     //alert("FaceID");
            // } else if (biometryType === true) {
            //     // Touch ID is supported on Android
            //     //alert("Android");
            // }

            // await this.setState({
            //     touchIDAvailable: true
            // });

            //if (digitalAccess == 'false') {

            // Alert.alert(
            //     'Leitor de Digital',
            //     'Desejar logar utilizando sua digital?',
            //     [
            //         { text: 'Sim', onPress: () => AsyncStorage.setItem('digitalAccess', 'true') },
            //         { text: 'Não', onPress: () => AsyncStorage.setItem('digitalAccess', 'false') },
            //     ],
            //     { cancelable: false }
            // )
            //}
        } catch (err) {
            // if (err.name === "Touch ID Error") {
            //     await this.setState({
            //         touchIDAvailable: false
            //     });
            // } else {
            //     alert("Ocorreu um erro");
            // }
        }
    }

    navigateToScreen = async (route: any) => {
        await this.props.navigation.navigate(route);
    }

    carregarDadosPessoais = async () => {
        var result = await DadosPessoaisService.Buscar();
        await this.setState({ dados: result });
    }

    carregarPlano = async () => {
        var cdPlano = await AsyncStorage.getItem("plano");
        var plano = await PlanoService.BuscarPorCodigo(cdPlano);
        await this.setState({ plano });
    }

    render() {
        if(this.state.plano) {
            if(this.state.plano.CD_PLANO === "0003" && this.state.plano.CD_CATEGORIA === "1")
                return <HomeAtivoSaldado {...this.props} plano={this.state.plano} />
            else if(this.state.plano.CD_PLANO !== "0003" && this.state.plano.CD_CATEGORIA === "1")
                return <HomeAtivo {...this.props} plano={this.state.plano} />
            else if(this.state.plano.CD_CATEGORIA === "4")
                return <HomeAssistido {...this.props} plano={this.state.plano} />
        } else {
            return null;
        }
    }
};