import React from "react";
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import { FontAwesomeIcon } from 'expo-fontawesome';
import { faBars} from '@fortawesome/free-solid-svg-icons';

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
    ContrachequeDetalhe,
    InformeRendimentos,
    Mensagens,
    MensagemDetalhe,
    Relacionamento,
    TrocarSenha,
    PrimeiroAcesso
} from './screens';
import { TouchableOpacity } from 'react-native';

var MainStack = createStackNavigator({
    Login,
    Termos,
    TrocarSenhaPrimeiroAcesso,
    Planos,
    Home,
    Dados,
    Contracheque,
    ContrachequeDetalhe,
    InformeRendimentos,
    Mensagens,
    MensagemDetalhe,
    Relacionamento,
    TrocarSenha,
    PrimeiroAcesso
}, {
    initialRouteName: 'Login',
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
                <TouchableOpacity onPress={() => props.navigation.toggleDrawer() } style={{ padding: 10 }}>
                    <FontAwesomeIcon icon={faBars} style={{ color: 'white' }} />
                </TouchableOpacity>
            )
        }
    }
});

const MainDrawer = createDrawerNavigator({
    DrawerStack: MainStack
}, {
    drawerPosition: 'right', 
    contentComponent: SideMenu
} as any);

export default createAppContainer(MainDrawer);