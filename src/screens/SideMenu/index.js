import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, Text, View, Image, TouchableHighlight, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import VersionNumber from 'react-native-version-number';

import styles from './index.style';
import { Variables } from '../../styles';

const MenuItem = (props) => {
    return (
        <TouchableHighlight onPress={props.onPress} underlayColor={Variables.colors.gray}>
            <View style={styles.navItemStyle}>
                <Image source={props.icon} style={styles.navIcon} />
                <Text style={styles.navText}>
                    {props.title}
                </Text>
            </View>
        </TouchableHighlight>
    );
}

class SideMenu extends Component {
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
        await this.carregarPlano();
    }
    
    navigateToScreen = (route) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    async carregarPlano() {
        var plano = await AsyncStorage.getItem("plano");
        var assistido = await AsyncStorage.getItem("assistido");
        var pensionista = await AsyncStorage.getItem("pensionista");
        var planoBD = plano === "1";

        this.setState({ 
            plano, 
            planoBD,
            assistido: assistido === "true",
            pensionista: pensionista === "true" 
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <Image source={require("../../assets/LogoNegativa.png")} style={styles.headerImage} />
                    </View>

                    <View style={styles.navSectionStyle}>

                        <MenuItem onPress={this.navigateToScreen('Login')} icon={require("../../assets/ic_home.png")} title="Início" />
                        <MenuItem onPress={this.navigateToScreen('Dados')} icon={require("../../assets/ic_dados.png")} title="Seus Dados" />

                        {!this.state.assistido && !this.state.pensionista &&
                            <MenuItem onPress={this.navigateToScreen('Contribuicao')} icon={require("../../assets/ic_contribuicao.png")} title="Sua Contribuição" />}
                        
                        {(this.state.assistido || this.state.pensionista) && 
                            <MenuItem onPress={this.navigateToScreen('Contracheque')} icon={require("../../assets/ic_contracheque.png")} title="Demonstrativo de Pagamento" />}
                        
                        {(this.state.assistido || this.state.pensionista) && 
                            <MenuItem onPress={this.navigateToScreen('Informe')} icon={require("../../assets/ic_contracheque.png")} title="Informe de Rendimentos" />}
                        
                        <MenuItem onPress={this.navigateToScreen('Emprestimo')} icon={require("../../assets/ic_emprestimo.png")} title="Empréstimo" />
                    
                        {(!this.state.assistido && !this.state.pensionista) && 
                            <MenuItem onPress={this.navigateToScreen('ExtratoAnos')} icon={require("../../assets/ic_contracheque.png")} title="Extrato de Contribuições" />}
                    
                        {(!this.state.planoBD && !this.state.pensionista) && 
                            <MenuItem onPress={this.navigateToScreen('Saldo')} icon={require("../../assets/ic_saldo.png")} title="Seu Saldo" />}

                        <MenuItem onPress={this.navigateToScreen('Relacionamento')} icon={require("../../assets/ic_chat.png")} title="Relacionamento" />
                        <MenuItem onPress={this.navigateToScreen('Planos')} icon={require("../../assets/ic_plano.png")} title="Selecionar Plano" />
                        <MenuItem onPress={this.navigateToScreen('Login')} icon={require("../../assets/ic_out.png")} title="Sair" />
                    </View>
                </ScrollView>

                <View style={styles.footerContainer}>
                    <Text>Versão {VersionNumber.appVersion}</Text>
                </View>
            </View>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

export default SideMenu;