import React, { Component } from 'react';
import { Text, View, ScrollView, BackHandler, AsyncStorage, Image } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';

import Styles, { Variables } from "../../styles";
import { ScreenHeader, ElevatedView, CampoEstatico, Button } from "../../components";

import { DadosPessoaisService, PlanoService, FuncionarioService, ProcessoBeneficioService } from "@intechprev/prevsystem-service";

import ImagePicker from 'react-native-image-picker';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };


export default class Dados extends Component {

    
    
    static navigationOptions = {
        title: "Seus Dados"
    }
    
    constructor(props) {
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
            assistido: {},
            pensionista: {}
        }
    }

    async componentDidMount() {
        await this.setState({ loading: true });

        var assistido = await AsyncStorage.getItem("assistido");
        var pensionista = await AsyncStorage.getItem("pensionista");

        await this.setState({ 
            assistido: assistido === "true",
            pensionista: pensionista === "true"
        });

        await this.carregarDadosPessoais();

        if(!this.state.pensionista)
            await this.carregarFuncionario();

        await this.carregarPlano();

        await this.setState({ loading: false });

    }

    async carregarDadosPessoais() {
        var result = await DadosPessoaisService.Buscar();
        await this.setState({ dados: result.data });

        //console.warn(result) 
    }

    async carregarFuncionario() {
        var result = await FuncionarioService.Buscar();
        await this.setState({ funcionario: result.data.funcionario });
    }

    async carregarPlano() {
        var plano = await AsyncStorage.getItem("plano");
        var result = await PlanoService.BuscarPorCodigo(plano);
        await this.setState({ plano: result.data });
    }


    teste = () => { 
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = { uri: response.uri };
          
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                

              this.setState({ 
                avatarSource: source, 
              });
              
            }
        }); 

        
    } 

    render() {
        return (
            <View>
                <Spinner visible={this.state.loading} cancelable={true} />

                {!this.state.loading &&
                    <ScrollView contentContainerStyle={Styles.scrollContainer}>

                        <Image source={this.state.avatarSource}  style={{height: 120, width: 120}}/>

                        <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10 }}>
                            <CampoEstatico titulo={"Nome"} valor={this.state.dados.dadosPessoais.NOME_ENTID} />
                        </ElevatedView>

                        <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10 }}>
                            <CampoEstatico titulo={"CPF"} valor={this.state.dados.CPF} />
                            <CampoEstatico titulo={"Data de Nascimento"} valor={this.state.dados.dadosPessoais.DT_NASCIMENTO} />
                            <CampoEstatico titulo={"Sexo"} valor={this.state.dados.SEXO} />
                        </ElevatedView>

                        {!this.state.pensionista &&
                            <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10 }}>
                                <CampoEstatico titulo={"Data de admissão"} valor={this.state.funcionario.DT_ADMISSAO} />
                                <CampoEstatico titulo={"Data de Inscrição no Plano"} valor={this.state.plano.DT_INSC_PLANO} />
                                <CampoEstatico titulo={"Tipo de Tributação"} valor={this.state.plano.TIPO_IRRF == "1" ? "PROGRESSIVA" : "REGRESSIVA"} />
                                
                                {this.state.plano.ProcessoBeneficio &&
                                    <View>
                                        <CampoEstatico titulo={"Data de Aposentadoria"} valor={this.state.plano.ProcessoBeneficio.DT_INICIO_FUND} />
                                        <CampoEstatico titulo={"Espécie de aposentadoria"} valor={this.state.plano.ProcessoBeneficio.DS_ESPECIE} />
                                    </View>
                                }
                            </ElevatedView>
                        }

                    <Button title="Entrar" onClick={this.teste}  />
                    </ScrollView>
                }

            

            
                
            </View>
        )
    }
};