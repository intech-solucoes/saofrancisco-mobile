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
	SideMenu
} from "./screens";

const MainStack = createStackNavigator({
	Home: Home,
	Dados: Dados,
	Contribuicao: Contribuicao
}, {
	navigationOptions: {
		header: (navigationOptions) => <ScreenHeader {...navigationOptions} />
	}
});

const MainDrawer = createDrawerNavigator({
	Main: MainStack
}, {
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