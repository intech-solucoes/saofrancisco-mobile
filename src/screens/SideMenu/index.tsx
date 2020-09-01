import React, { Component } from 'react';
import { ScrollView, Text, View, Image, TouchableHighlight, AsyncStorage } from 'react-native';
import { NavigationActions, NavigationScreenProp } from 'react-navigation';
import Constants from 'expo-constants';

import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './index.style';
import { Variables } from '../../styles';

const MenuItem = (props: any) => {
    return (
        <TouchableHighlight onPress={props.onPress} underlayColor={Variables.colors.gray}>
            <View style={styles.navItemStyle}>
                <Icon name={props.icon} style={styles.navIcon} size={18} />
                <Text style={styles.navText}>
                    {props.title}
                </Text>
            </View>
        </TouchableHighlight>
    );
}

interface Props {
    navigation: NavigationScreenProp<any,any>;
}
interface State {
    loading: boolean;
    assistido: boolean;
    pensionista: boolean;
    cdPlano: string;
}

export class SideMenu extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            assistido: false,
            pensionista: false,
            cdPlano: ""
        }
    }

    componentDidMount = async () => {
        await this.carregarPlano();
    }
    
    navigateToScreen = (route: string) => () => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    carregarPlano = async () => {
        var assistido = await AsyncStorage.getItem("assistido");
        var pensionista = await AsyncStorage.getItem("pensionista");
        var cdPlano = await AsyncStorage.getItem("plano");

        await this.setState({ 
            assistido: assistido === "true",
            pensionista: pensionista === "true",
            cdPlano
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.header}>
                        <Image source={require("../../assets/logo.png")} style={styles.headerImage} />
                    </View>

                    <View style={styles.navSectionStyle}>

                    <MenuItem onPress={this.navigateToScreen('Home')} icon={'home'} title="Início" />
                        <MenuItem onPress={this.navigateToScreen('Dados')} icon={'user'} title="Seus Dados" />
                        
                        {(this.state.assistido || this.state.pensionista) && 
                            <MenuItem onPress={this.navigateToScreen('Contracheque')} icon={'closed-captioning'} title="Contracheque" />}
                        
                        {(!this.state.assistido && !this.state.pensionista) && 
                            <MenuItem onPress={this.navigateToScreen('Extrato')} icon={'file'} title="Extrato" />}

                        {this.state.cdPlano === "0002" && 
                            <MenuItem onPress={this.navigateToScreen('SimuladorCodeprev')} icon={'chart-bar'} title="Simulador de Benefícios" />
                        }

                        <MenuItem onPress={this.navigateToScreen('InformeRendimentos')} icon={'chart-pie'} title="Informe de Rendimentos" />
                        <MenuItem onPress={this.navigateToScreen('Mensagens')} icon={'envelope'} title="Mensagens" />
                        <MenuItem onPress={this.navigateToScreen('Relacionamento')} icon={'comment'} title="Relacionamento" />
                        <MenuItem onPress={this.navigateToScreen('TrocarSenha')} icon={'key'} title="Trocar Senha" />
                        <MenuItem onPress={this.navigateToScreen('Planos')} icon={'exchange-alt'} title="Selecionar Plano" />
                        <MenuItem onPress={this.navigateToScreen('Login')} icon={'sign-out-alt'} title="Sair" />
                    </View>

                    <View style={styles.footerContainer}>
                        <Text style={{ color: Variables.colors.grayDark }}>Versão {Constants.manifest.version}</Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}