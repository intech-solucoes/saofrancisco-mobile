import React from "react";
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation'
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
	SideMenu
} from "./screens";

import { ScreenHeader } from "./components"

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
		header: (navigationOptions) => <ScreenHeader {...navigationOptions} />
	}
});

const MainDrawer = createDrawerNavigator({
	DrawerStack: MainStack
}, {
	contentComponent: SideMenu,
	navigationOptions: {
		header: null
	}
});

const AppNavigator = createStackNavigator({
	Login: Login,
	// Planos: PlanosScreen,
	Main: MainDrawer
}, {
	initialRouteName: 'Login',
	headerMode: 'none'
});

export default createAppContainer(AppNavigator);