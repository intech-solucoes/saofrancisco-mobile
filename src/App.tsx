import React from "react";
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Variables } from './styles';

import {
    SideMenu,
    Login,
    Termos,
    TrocarSenhaPrimeiroAcesso,
    Planos,
    Home,
    Dados,
    Contracheque,
    Extrato,
    ContrachequeDetalhe,
    SimuladorCodeprev,
    InformeRendimentos,
    Mensagens,
    MensagemDetalhe,
    Relacionamento,
    TrocarSenha,
    PrimeiroAcesso
} from './screens';
import { TouchableOpacity } from 'react-native';
import { Maior8 } from "./screens/SimuladorCodeprev/Maior8";
import { Menor8 } from "./screens/SimuladorCodeprev/Menor8";

var MainStack = createStackNavigator({
    Home,
    Dados,
    Contracheque,
    Extrato,
    ContrachequeDetalhe,
    SimuladorCodeprev,
    SimuladorCodeprevMaior8: {
        screen: Maior8
    },
    SimuladorCodeprevMenor8: {
        screen: Menor8
    },
    InformeRendimentos,
    Mensagens,
    MensagemDetalhe,
    Relacionamento,
    TrocarSenha
}, {
    headerBackTitleVisible: false,
    defaultNavigationOptions: (props: any) => {
        return {
            headerStyle: {
                backgroundColor: Variables.colors.primary,
                shadowOpacity: 0,
                shadowRadius: 0,
                shadowOffset: {
                    height: 0,
                    width: 0
                },
                elevation: 0
            },
            headerTintColor: '#fff',
            headerRight: (
                <TouchableOpacity onPress={() => props.navigation.toggleDrawer()} style={{ padding: 10 }}>
                    <Icon name={'bars'} style={{ color: 'white' }} size={20} />
                </TouchableOpacity>
            )
        }
    }
});

const MainDrawer = createDrawerNavigator({
    DrawerStack: MainStack
}, {
    drawerPosition: 'right',
    contentComponent: SideMenu,
	navigationOptions: {
		header: null
	}
} as any);

const AppNavigator = createStackNavigator({
    Login,
    Termos,
    TrocarSenhaPrimeiroAcesso,
    Planos,
    PrimeiroAcesso,
    MainDrawer
}, {
	initialRouteName: 'Login',
	navigationOptions: {
		header: null
	}
});

export default createAppContainer(AppNavigator);