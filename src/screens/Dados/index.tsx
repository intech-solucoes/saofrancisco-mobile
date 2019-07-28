import React, { Component } from 'react';
import { Text, View, ScrollView, BackHandler, AsyncStorage, Image } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

import Styles, { Variables } from "../../styles";
import { CampoEstatico, Button, Box } from "../../components";

import { DadosPessoaisService, PlanoService, FuncionarioService, ProcessoBeneficioService, DependenteService } from "@intechprev/prevsystem-service";

import ImagePicker from 'react-native-image-picker';
import { Grid, Row, Col } from 'react-native-easy-grid';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

interface Props {}

interface State {
    pensionista: boolean;
    loading: boolean;
    funcionario: any;
    dados: any;
    plano: any;
    dependentes: Array<any>;
}

export class Dados extends Component<Props, State> {
    static navigationOptions = {
        title: "Seus Dados"
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            funcionario: {},
            dados: {
                dadosPessoais: {}
            },
            plano: {
                ProcessoBeneficio: null
            },
            pensionista: false,
            dependentes: []
        }
    }

    componentDidMount = async () => {
        await this.setState({ loading: true });

        var pensionista = await AsyncStorage.getItem("pensionista");

        await this.setState({
            pensionista: pensionista === "true"
        });

        if (!this.state.pensionista) {
            await this.carregarDados();
            await this.carregarDependentes();
        }

        await this.carregarPlano();

        await this.setState({ loading: false });
    }

    carregarDados = async () => {
        var dados = await FuncionarioService.Buscar();
        await this.setState({ dados });
    }

    carregarPlano = async () => {
        var cdPlano = await AsyncStorage.getItem("plano");
        var plano = await PlanoService.BuscarPorCodigo(cdPlano);
        await this.setState({ plano });
    }

    carregarDependentes = async () => {
        var dependentes = await DependenteService.Buscar();
        await this.setState({ dependentes });
    }

    // teste = () => {
    //     ImagePicker.showImagePicker(options, (response) => {
    //         console.log('Response = ', response);

    //         if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //         } else if (response.error) {
    //             console.log('ImagePicker Error: ', response.error);
    //         } else if (response.customButton) {
    //             console.log('User tapped custom button: ', response.customButton);
    //         } else {
    //             const source = { uri: response.uri };

    //             // You can also display the image using data:
    //             // const source = { uri: 'data:image/jpeg;base64,' + response.data };


    //             this.setState({
    //                 avatarSource: source,
    //             });

    //         }
    //     });
    // }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Spinner visible={this.state.loading} cancelable={true} />

                {this.state.dados.DadosPessoais &&
                    <View>

                        {/* <Image source={this.state.avatarSource}  style={{height: 120, width: 120}}/> */}

                        <Box titulo={"Dados Pessoais"}>
                            <CampoEstatico titulo={"Nome"} valor={this.state.dados.DadosPessoais.NOME_ENTID} />
                            <CampoEstatico titulo="Empresa" valor={this.state.dados.NOME_EMPRESA} />
                            <CampoEstatico titulo="Matrícula" valor={this.state.funcionario.NUM_MATRICULA} />
                            <CampoEstatico titulo="Sexo" valor={this.state.dados.SEXO} />
                            <CampoEstatico titulo="Estado Civil" valor={this.state.dados.DS_ESTADO_CIVIL} />
                            <CampoEstatico titulo="RG" valor={this.state.dados.DadosPessoais.NU_IDENT} />
                            <CampoEstatico titulo="Órgão Emissor RG" valor={this.state.dados.DadosPessoais.ORG_EMIS_IDENT} />
                            <CampoEstatico titulo="Emissão RG" valor={this.state.dados.DadosPessoais.DT_EMIS_IDENT} />
                            <CampoEstatico titulo="CPF" valor={this.state.dados.CPF} />
                            <CampoEstatico titulo="Data de nascimento" valor={this.state.dados.DadosPessoais.DT_NASCIMENTO} />
                            <CampoEstatico titulo="Idade" valor={this.state.dados.IDADE} />
                            <CampoEstatico titulo="Data de Recadastro" valor={this.state.dados.Funcionario.DT_RECADASTRO} />
                            <CampoEstatico titulo="Nome do Pai" valor={this.state.dados.DadosPessoais.NOME_PAI} />
                            <CampoEstatico titulo="Nome da Mãe" valor={this.state.dados.DadosPessoais.NOME_MAE} />
                            <CampoEstatico titulo="E-mail" valor={this.state.dados.DadosPessoais.EMAIL_AUX} />
                        </Box>

                        {!this.state.pensionista &&
                            <Box titulo={"Dados Funcionais"}>
                                <CampoEstatico titulo={"Data de admissão"} valor={this.state.funcionario.DT_ADMISSAO} />
                                <CampoEstatico titulo={"Data de Inscrição no Plano"} valor={this.state.plano.DT_INSC_PLANO} />
                                <CampoEstatico titulo={"Tipo de Tributação"} valor={this.state.plano.TIPO_IRRF == "1" ? "PROGRESSIVA" : "REGRESSIVA"} semEspaco />

                                {this.state.plano.ProcessoBeneficio &&
                                    <View>
                                        <CampoEstatico titulo={"Data de Aposentadoria"} valor={this.state.plano.ProcessoBeneficio.DT_INICIO_FUND} />
                                        <CampoEstatico titulo={"Espécie de aposentadoria"} valor={this.state.plano.ProcessoBeneficio.DS_ESPECIE} semEspaco />
                                    </View>
                                }
                            </Box>
                        }

                        <Box titulo={"Endereço"}>
                            <CampoEstatico titulo="Endereço" valor={this.state.dados.Entidade.END_ENTID} />
                            <CampoEstatico titulo="Número" valor={this.state.dados.Entidade.NR_END_ENTID} />
                            <CampoEstatico titulo="Complemento" valor={this.state.dados.Entidade.COMP_END_ENTID} />
                            <CampoEstatico titulo="Bairro" valor={this.state.dados.Entidade.BAIRRO_ENTID} />
                            <CampoEstatico titulo="Cidade" valor={this.state.dados.Entidade.CID_ENTID} />
                            <CampoEstatico titulo="UF" valor={this.state.dados.Entidade.UF_ENTID} />
                            <CampoEstatico titulo="CEP" valor={this.state.dados.CEP} semEspaco />
                        </Box>

                        <Box titulo={"Dados Bancários"}>
                            <CampoEstatico titulo="Banco" valor={this.state.dados.Entidade.NUM_BANCO} />
                            <CampoEstatico titulo="Agência" valor={this.state.dados.Entidade.NUM_AGENCIA} />
                            <CampoEstatico titulo="Conta" valor={this.state.dados.Entidade.NUM_CONTA} semEspaco />
                        </Box>

                        {this.state.dependentes.length > 0 &&
                            <Box titulo={"Dependentes"}>
                                {
                                    this.state.dependentes.map((dependente: any, index: number) => { 
                                        var usaBorda = this.state.dependentes.length > 1 && index < this.state.dependentes.length;

                                        var borda = {};
                                        if(usaBorda)
                                            borda = { marginTop: 10, paddingTop: 10, borderBottomColor: "#CCC", borderBottomWidth: 1 };

                                        return (
                                            <View key={index} style={borda}>
                                                <CampoEstatico titulo="Nome" valor={dependente.NOME_DEP} />
                                                <CampoEstatico titulo="Sexo" valor={dependente.SEXO_DEP == "F" ? "FEMININO" : "MASCULINO"} />
                                                <CampoEstatico titulo="Data de Nascimento" valor={dependente.DT_NASC_DEP} />
                                                <CampoEstatico titulo="Grau de Parentesco" valor={dependente.DS_GRAU_PARENTESCO} />
                                                <CampoEstatico titulo="CPF" 
                                                                valor={
                                                                    typeof(dependente.CPF) !== 'undefined' || dependente.CPF === "" ? dependente.CPF : "-"
                                                                } />
                                            </View>
                                        );
                                    })
                                }
                            </Box>
                        }
                    </View>
                }
            </ScrollView>
        )
    }
};