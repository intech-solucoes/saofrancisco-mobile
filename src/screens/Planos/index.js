import React from "react";
import { View, Text, AsyncStorage, StatusBar } from 'react-native';
//import Spinner from 'react-native-loading-spinner-overlay';

import Styles, { Variables } from "../../styles";
import { Button } from "../../components";

import { DadosPessoaisService, PlanoService } from "@intechprev/prevsystem-service";


const styles = {
    header: {
        marginTop: 10,
        marginBottom: 10,
        fontWeight: "bold"
    },
    subheader: {
        marginBottom: 40
    },
    button: {
        marginBottom: 20,
        padding: 5
    },
    buttonText: {
        fontWeight: "bold"
    }
}

export default class PlanosScreen extends React.Component {

    static navigationOptions = {
        header : null
    }
    
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            dados: {
                dadosPessoais: {}
            },
            planos: []
        }

        this.selecionarPlano = this.selecionarPlano.bind(this);
        this.carregarDadosPessoais = this.carregarDadosPessoais.bind(this);
        this.carregarPlanos = this.carregarPlanos.bind(this);
    }

    async componentDidMount() {
        await this.setState({ loading: true });
        await this.carregarDadosPessoais();
        await this.carregarPlanos();
        await this.setState({ loading: false });
    }

    async carregarDadosPessoais() {
        var result = await DadosPessoaisService.Buscar();
        await this.setState({ dados: result.data });
    }

    async carregarPlanos() {
        var result = await PlanoService.Buscar();
        await this.setState({ planos: result.data });
    }

    async selecionarPlano(plano) {
        await AsyncStorage.setItem('plano', plano.CD_PLANO.toString());
        await AsyncStorage.setItem('assistido', (plano.DS_CATEGORIA === "ASSISTIDO").toString());
        this.props.navigation.navigate('Main');
    }

    render() { 
        return (
            <View style={[Styles.content, { paddingTop: 50 }]}>

                {/* <Spinner visible={this.state.loading} cancelable={true} /> */}

                {!this.state.loading &&
                    <View>
                        <Text style={Styles.h3}>Olá,</Text>
                        <Text style={[ Styles.h1, styles.header ]}>{this.state.dados.dadosPessoais.NOME_ENTID}</Text>
                        <Text style={styles.subheader}>Selecione um de seus planos contratados com a Sabesprev</Text>
        
                        {this.state.planos.map((plano, index) => (
                            <Button key={index} title={plano.DS_PLANO} subtitle={plano.DS_CATEGORIA} 
                                    style={[Styles.button, styles.button]} titleStyle={[Styles.h2, styles.buttonText]}
                                    onClick={() => this.selecionarPlano(plano)} />
                        ))}

                        {this.state.planos.length === 0 &&
                            <Text style={[ Styles.h1, { color: Variables.colors.red, textAlign: "center" }]}>Nenhum plano encontrado!</Text>}
                    </View>
                }
            </View>
        );
    }
}