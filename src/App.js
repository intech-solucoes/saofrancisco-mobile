import React from "react";
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import { ScreenHeader } from "./components"

import {
	Login,
	PrimeiroAcesso, 
	Home,
	Planos,
	Dados,
	Contribuicao,
	SideMenu,
	Relacionamento,
	Saldo,
	Contracheque,
	ContrachequeDetalhe,
	InformeRendimentos,
	ExtratoAnos,
	ExtratoMeses,
	ExtratoDetalhe,
} from "./screens";

const MainStack = createStackNavigator({
	Home: Home,
	Dados: Dados,
	Contribuicao: Contribuicao,
	Relacionamento: Relacionamento,
	Saldo: Saldo,
	Contracheque : Contracheque,
	ContrachequeDetalhe : ContrachequeDetalhe,
	InformeRendimentos: InformeRendimentos,
	ExtratoAnos: ExtratoAnos,
	ExtratoMeses: ExtratoMeses,
	ExtratoDetalhe: ExtratoDetalhe,
}, { 
	navigationOptions: {
		header: (navigationOptions) => <ScreenHeader {...navigationOptions} />
	}
});

const MainDrawer = createDrawerNavigator({
	Main: MainStack
}, {
	drawerPosition: 'right', 
	contentComponent: SideMenu,
	navigationOptions: {
		header: null
	}
});

const AppNavigator = createStackNavigator({
	Login: Login,
	PrimeiroAcesso: PrimeiroAcesso, 
	Planos: Planos,
	Main: MainDrawer
}, {
	initialRouteName: 'Login',
	navigationOptions: {
		header: null
	}
});

export default class App extends React.Component {
	render() {
		return (
			<AppNavigator />
		);
	}
}