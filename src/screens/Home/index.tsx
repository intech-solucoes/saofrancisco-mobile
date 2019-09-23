import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, TouchableHighlight, Image, ScrollView, AsyncStorage, Alert, StatusBar } from "react-native";
import Styles, { Variables } from "../../styles";

import { DadosPessoaisService, PlanoService, ProcessoBeneficioService } from "@intechprev/prevsystem-service";
import { NavigationScreenProp } from 'react-navigation';
import { HomeAtivo } from './HomeAtivo';
import { HomeAssistido } from './HomeAssistido';
import { HomeAtivoSaldado } from './HomeAtivoSaldado';
import { Box, DropDown } from '../../components';
import _ from 'lodash';

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    plano: any;
    dados: any;
    processosBeneficio: any;
    processo: any;
    especieAnoNumProcesso: string;
}

export class Home extends Component<Props, State> {
    public homeAssistido = React.createRef<HomeAssistido>();

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
            processosBeneficio: {},
            processo: {},
            especieAnoNumProcesso: "",
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

        if(plano.CD_CATEGORIA === "4") {
            var processosBeneficio = await ProcessoBeneficioService.BuscarPorPlano(cdPlano);
        
            var processo = processosBeneficio[0];
            var especieAnoNumProcesso = processo.CD_ESPECIE + processo.ANO_PROCESSO + processo.NUM_PROCESSO;
            
            await this.setState({
                processosBeneficio,
                processo,
                especieAnoNumProcesso
            });
        }
        
        await this.setState({ 
            plano
        });

        await this.setState({ plano });
    }

    carregarProcesso = async (processo: any) => {
        await this.homeAssistido.current.selecionarProcesso(processo);

        await this.setState({
            processo
        });
    }

    renderHome = () => {
        if(this.state.plano) {
            if(this.state.plano.CD_PLANO === "0003" && this.state.plano.CD_CATEGORIA === "1")
                return <HomeAtivoSaldado {...this.props} plano={this.state.plano} />;
            else if(this.state.plano.CD_PLANO !== "0003" && this.state.plano.CD_CATEGORIA === "1")
                return <HomeAtivo {...this.props} plano={this.state.plano} />;
            else if(this.state.plano.CD_CATEGORIA === "4")
                return <HomeAssistido ref={this.homeAssistido} {...this.props} plano={this.state.plano} />;
        }
        return <Text>Carregando...</Text>;
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <StatusBar
                    animated={true}
                    translucent={true}
                    barStyle={'light-content'}
                    backgroundColor={Variables.colors.primary}
                />
                
                <View>
                    {this.state.processosBeneficio.length > 1 &&
                        <Box titulo={"Selecione um processo de benefício:"}>
                            <DropDown titulo={"Selecione um processo"} valor={this.state.processo}
                                    itens={this.state.processosBeneficio} nomeMembro={"DS_PROCESSO"}
                                    onValueChange={(itemValue: any) => this.carregarProcesso(itemValue)} />
                        </Box>
                    }

                    {this.renderHome()}
                </View>
            </ScrollView>
        );
    }
};