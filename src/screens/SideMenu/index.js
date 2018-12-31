import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, Text, View, Image, TouchableHighlight, AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationActions } from 'react-navigation';
import VersionNumber from 'react-native-version-number';

import styles from './index.style';
import { Variables } from '../../styles';

const MenuItem = (props) => {
    return (
        <TouchableHighlight onPress={props.onPress} underlayColor={Variables.colors.gray}>
            <View style={styles.navItemStyle}>
                <Icon name={props.icon} style={styles.navIcon} size={20} />
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

                        <MenuItem onPress={this.navigateToScreen('Home')} icon={"home"} title="Início" />
                        <MenuItem onPress={this.navigateToScreen('Dados')} icon={"user"} title="Seus Dados" />
                        <MenuItem onPress={this.navigateToScreen('Contribuicao')} icon={"closed-captioning"} title="Sua Contribuição" />
                        
                        {(this.state.assistido || this.state.pensionista) && 
                            <MenuItem onPress={this.navigateToScreen('Contracheque')} icon={"closed-captioning"} title="Demonstrativo de Pagamento" />}
                        
                        {(this.state.assistido || this.state.pensionista) && 
                            <MenuItem onPress={this.navigateToScreen('InformeRendimentos')} icon={"chart-pie"} title="Informe de Rendimentos" />}
                    
                        {(!this.state.assistido && !this.state.pensionista) && 
                            <MenuItem onPress={this.navigateToScreen('ExtratoAnos')} icon={"file"} title="Extrato de Contribuições" />}

                        <MenuItem onPress={this.navigateToScreen('Relacionamento')} icon={"comment"} title="Relacionamento" />
                        <MenuItem onPress={this.navigateToScreen('Planos')} icon={"exchange-alt"} title="Selecionar Plano" />
                        <MenuItem onPress={this.navigateToScreen('Login')} icon={"door-open"} title="Sair" />
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