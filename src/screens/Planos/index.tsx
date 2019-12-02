import React from "react";
import { View, Text, AsyncStorage, StatusBar, TextStyle } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationScreenProp } from "react-navigation";

import { DadosPessoaisService, PlanoService, UsuarioService, FuncionarioService } from "@intechprev/prevsystem-service";

import Styles, { Variables } from "../../styles";
import { Button } from "../../components";

const styles = {
    header: {
        marginTop: 10,
        marginBottom: 10,
        fontWeight: "bold"
    } as TextStyle,
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

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    planos: Array<any>;
    dados: any;
    matriculas: Array<any>;
    matriculaSelecionada: boolean;
}

export class Planos extends React.Component<Props, State> {

    static navigationOptions = {
        header : null
    }
    
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            dados: {
                dadosPessoais: { }
            },
            planos: [],
            matriculas: [],
            matriculaSelecionada: false
        }
    }

    componentDidMount = async () => {
        try {
            //await this.setState({ loading: true });

            await this.carregarDadosPessoais();
            var matriculas = await UsuarioService.BuscarMatriculas();

            if(matriculas.length > 1) {
                await this.setState({
                    matriculas,
                    matriculaSelecionada: false
                });
            } else {
                await this.setState({
                    matriculaSelecionada: true
                });

                await this.carregarPlanos();
            }

            //await this.setState({ loading: false });
        } catch(err) {
            //await this.setState({ loading: false });
            
            if(err.response) {
                console.warn(err.response.data);
            } else {
                console.warn(err);
            }
        }
    }

    selecionarMatricula = async (matricula: string) => {
        try {
            var funcionarioResult = await FuncionarioService.Buscar();
            await AsyncStorage.setItem("fundacao", funcionarioResult.Funcionario.CD_FUNDACAO);
            await AsyncStorage.setItem("empresa", funcionarioResult.Funcionario.CD_EMPRESA);

            var funcionarioLogin = await UsuarioService.SelecionarMatricula(matricula);
            await AsyncStorage.setItem("token", funcionarioLogin.AccessToken);
            await AsyncStorage.setItem("admin", funcionarioLogin.Admin);

            await this.setState({
                matriculaSelecionada: true
            });

            await this.carregarPlanos();
        } catch(err) {
            alert("Ocorreu um erro ao selecionar esta matrícula. Verifique sua situação no plano junto com a São Francisco.");
        }
    }

    carregarDadosPessoais = async () => {
        var dados = await DadosPessoaisService.Buscar();
        await this.setState({ dados });
    }

    carregarPlanos = async () => {
        var planos = await PlanoService.Buscar();
        await this.setState({ planos });
    }

    selecionarPlano = async (plano) => {
        await AsyncStorage.setItem('plano', plano.CD_PLANO.toString());
        await AsyncStorage.setItem('assistido', (plano.CD_CATEGORIA === "4").toString());
        await this.props.navigation.navigate('Home');
    }

    render() { 
        return (
            <View style={[Styles.content, { paddingTop: 50 }]}>
                <StatusBar
                    animated={true}
                    translucent={false}
                    barStyle={'dark-content'}
                    backgroundColor={'#FFFFFF'}
                />
                <Spinner visible={this.state.loading} cancelable={true} />

                {!this.state.loading &&
                    <View>
                        <Text style={Styles.h3}>Olá,</Text>
                        <Text style={[ Styles.h1, styles.header ]}>{this.state.dados.NOME_ENTID}</Text>
                        
                        {!this.state.matriculaSelecionada && 
                            <View>
                                <Text style={styles.subheader}>Selecione uma de suas matrículas da São Francisco</Text>
                                
                                <View>
                                    {this.state.matriculas.map((matricula, index) => (
                                        <View key={index} style={{ marginBottom: 20 }}>
                                            <Button title={matricula}
                                                    titleStyle={[Styles.h2, styles.buttonText]}
                                                    onClick={() => this.selecionarMatricula(matricula)} />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        }

                        {this.state.matriculaSelecionada && 
                            <View>
                                <Text style={styles.subheader}>Selecione um de seus planos contratados com a São Francisco</Text>
                                
                                <View>
                                    {this.state.planos.map((plano, index) => (
                                        <View key={index} style={{ marginBottom: 20 }}>
                                            <Button title={plano.DS_PLANO} subtitle={plano.DS_CATEGORIA} 
                                                    titleStyle={[Styles.h2, styles.buttonText]}
                                                    onClick={() => this.selecionarPlano(plano)} />
                                        </View>
                                    ))}

                                    {this.state.matriculas.length > 1 &&
                                        <View style={{ marginBottom: 20 }}>
                                            <Button title={"Trocar de Matrícula"} 
                                                    titleStyle={[Styles.h2, styles.buttonText]}
                                                    onClick={() => this.setState({ matriculaSelecionada: false })} />
                                        </View>
                                    }

                                    {this.state.planos.length === 0 &&
                                        <Text style={[ Styles.h1, { color: Variables.colors.red, textAlign: "center" }]}>Nenhum plano encontrado!</Text>}
                                </View>
                            </View>
                        }
                    </View>
                }
            </View>
        );
    }
}