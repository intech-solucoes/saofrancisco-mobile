import React, { Component } from 'react';
import { Text, View, ScrollView, AsyncStorage, Picker } from "react-native";

import Styles, { Variables } from "../../styles";
import { CampoEstatico, Loader, Box, DropDown, Button, AsyncAlert } from "../../components";

import { PlanoService, InfoRendService } from "@intechprev/prevsystem-service";
import { TipoCampoEstatico } from '../../components/CampoEstatico';

interface Props {}

interface State {
    loading: boolean;
    datas: Array<any>,
    dataSelecionada: any,
    informe: {
        Grupos: any,
        ANO_CALENDARIO: string,
        ANO_EXERCICIO: string
    }
}

export class InformeRendimentos extends Component<Props, State> {
    static navigationOptions = {
        title: "Informe de Rendimentos"
    }
    
    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            datas: [],
            dataSelecionada: {},
            informe: {
                Grupos: [],
                ANO_CALENDARIO: "",
                ANO_EXERCICIO: ""
            }
        }
    }

    componentDidMount = async () => {
        await this.setState({ loading: true });

        var datas = await InfoRendService.BuscarReferencias();
            await this.setState({ datas });

        if(this.state.datas[0])
            this.selecionarAno(this.state.datas[0]);

        await this.setState({ loading: false });
    }

    selecionarAno = async (ano: string) => {
        await this.setState({ dataSelecionada: ano });
        var informe = await InfoRendService.BuscarPorReferencia(ano);
        await this.setState({ informe });
    }

    enviar = async () => {
        try {
            await this.setState({ loading: true });
            
            var resultado = await InfoRendService.Relatorio(this.state.dataSelecionada, true);
            
            await this.setState({ loading: false });
            
            setTimeout(async () => {
                await AsyncAlert(resultado);
            }, 500);
        }  catch(err) {
            await this.setState({ loading: false });

            if(err.response) {
                await AsyncAlert(err.response.data);
            }
            else {
                await AsyncAlert(err);
            }
        }
    }


    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Loader loading={this.state.loading} />

                {this.state.informe &&
                    <View>
                        {this.state.datas.length > 0 &&
                            <View>
                                <Box titulo={"Selecione uma Referência:"}>
                                    <DropDown titulo={"Selecione um ano"} valor={this.state.dataSelecionada}
                                              itens={this.state.datas}
                                              onValueChange={(itemValue: any) => this.selecionarAno(itemValue)} />
                                </Box>

                                <Box>
                                    <CampoEstatico titulo={"Ano Calendário:"} valor={this.state.informe.ANO_CALENDARIO} />
                                    <CampoEstatico titulo={"Ano Exercício:"} valor={this.state.informe.ANO_EXERCICIO} semEspaco />
                                </Box>
                                
                                <Box>
                                    {this.state.informe.Grupos.map((grupo, indexGrupo) => {
                                        return (
                                            <View key={indexGrupo} style={{ marginBottom: 10 }}>
                                                <Text style={[Styles.h3, { marginBottom: 10 }]}>{grupo.DES_GRUPO}</Text>

                                                {grupo.Itens.map((item, index) => {
                                                    return <CampoEstatico key={index} tipo={TipoCampoEstatico.dinheiro} titulo={`${item.COD_LINHA} - ${item.DES_INFO_REND}`} valor={item.VAL_LINHA} />;
                                                })}
                                            </View>
                                        );
                                    })}
                                    
                                    <Button title="Enviar por E-mail" onClick={this.enviar} />
                                </Box>
                            </View>
                        }

                        {this.state.datas.length === 0 &&
                            <Box>
                                <Text style={{ color: Variables.colors.red, textAlign: "center" }}>Nenhum informe encontrado!</Text>
                            </Box>}
                            
                    </View>
                }
                
            </ScrollView>
        )
    }
}