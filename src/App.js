import React from "react";
import { Button, TouchableOpacity } from "react-native";
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation'
import IOSIcon from "react-native-vector-icons/Ionicons";

import {
	Login,
	// PlanosScreen,
	Home,
	// DadosScreen,
	// ContribuicaoScreen,
	// ContrachequeScreen,
	// ContrachequeDetalheScreen,
	// InformeScreen,
	// ExtratoAnosScreen,
	// ExtratoMesesScreen,
	// ExtratoDetalheScreen,
	// SaldoScreen,
	// EmprestimoScreen,
	// EmprestimoDetalheScreen,
	// RelacionamentoScreen,
} from "./screens";

import { ScreenHeader } from "./components"
import SideMenu from "./screens/SideMenu"; 

const MainStack = createStackNavigator({ 
	Home: Home,
	// Dados: DadosScreen,
	// Contribuicao: ContribuicaoScreen,
	// Contracheque: ContrachequeScreen,
	// ContrachequeDetalhe: ContrachequeDetalheScreen,
	// Informe: InformeScreen,
	// ExtratoAnos: ExtratoAnosScreen,
	// ExtratoMeses: ExtratoMesesScreen,
	// ExtratoDetalhe: ExtratoDetalheScreen,
	// Saldo: SaldoScreen,
	// Emprestimo: EmprestimoScreen,
	// EmprestimoDetalhe: EmprestimoDetalheScreen,
	// Relacionamento: RelacionamentoScreen
}, {
	navigationOptions: {
		header: null
		//header: (navigationOptions) => <ScreenHeader {...navigationOptions} />
		// headerRight: (
		// 	<Button
		// 	  onPress={() => alert('This is a button!')}
		// 	  title="Info"
		// 	/>
		// )
	}
});

const MainDrawer = createDrawerNavigator({
	DrawerStack: MainStack
}, {
	contentComponent: SideMenu,
	drawerPosition: 'right',
	navigationOptions: ({navigation}) => ({
		title: "Main",
		headerRight:(<TouchableOpacity onPress={() => navigation.toggleDrawer()}>
					  <IOSIcon name="ios-menu" size={30} />
					</TouchableOpacity>
		),
		headerStyle: { marginRight: 15 }
	  })
});

const RootStack = createStackNavigator({
	Login: Login,
	Main: MainDrawer, 
	Home: Home,
}, {
	initialRouteName: 'Login', 
	navigationOptions: {
		header: null
	}
});

export default createAppContainer(RootStack);