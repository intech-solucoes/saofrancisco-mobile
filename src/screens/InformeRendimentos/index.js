import React, { Component } from 'react';
import { Text, View, ScrollView, AsyncStorage, Picker } from "react-native";

import Styles, { Variables } from "../../styles";
import { ScreenHeader, ElevatedView, CampoEstatico, Loader } from "../../components";

import { PlanoService, InfoRendService } from "@intechprev/prevsystem-service";

export default class InformeRendimentos extends Component {
    static navigationOptions = {
        title: "Informe de Rendimentos"
    }
    
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            datas: [],
            referencia: {},
            informe: {},
            assistido: {},
        }
    }

    async componentDidMount() {
        await this.setState({ loading: true });

        await this.carregarPlano();
        await this.carregarDatas();

        if(this.state.datas.length > 0)
            await this.carregarInforme(this.state.datas[0]);

        await this.setState({ loading: false });
    }

    async carregarPlano() {
        var plano = await AsyncStorage.getItem("plano");
        var result = await PlanoService.BuscarPorCodigo(plano);
        await this.setState({ plano: result.data });
    }

    async carregarDatas() {
        var result = await InfoRendService.BuscarReferencias();
        await this.setState({ datas: result.data });
    }

    async carregarInforme(referencia) {
        await this.setState({ referencia: referencia });
        var result = await InfoRendService.BuscarPorReferencia(referencia);
        await this.setState({ informe: result.data });
    }

    render() {
        return (
            <View>
                <Loader loading={this.state.loading} />

                {!this.state.loading &&
                    <ScrollView contentContainerStyle={Styles.scrollContainer}>
                        {this.state.datas.length > 0 &&
                            <View>
                                <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 5 }}>
                                    <Text style={[Styles.h3, { marginBottom: 10 }]}>Selecione uma Referência:</Text>
                                    <Picker selectedValue={this.state.referencia}
                                            onValueChange={(itemValue, itemIndex) => this.carregarInforme(itemValue)}>

                                        {this.state.datas.map((data, index) => {
                                            return <Picker.Item key={index} label={data.toString()} value={data.toString()} />
                                        })}
                                    </Picker>
                                </ElevatedView>

                                <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10 }}>
                                    <CampoEstatico titulo={"Ano Calendário:"} valor={this.state.informe.ANO_CALENDARIO} />
                                    <CampoEstatico titulo={"Ano Exercício:"} valor={this.state.informe.ANO_EXERCICIO} />
                                </ElevatedView>
                                
                                {this.state.informe.Grupos.map((grupo, indexGrupo) => {
                                    return (
                                        <ElevatedView key={indexGrupo} elevation={3} style={{ padding: 10, marginBottom: 10 }}>
                                            <Text style={[Styles.h3, { marginBottom: 10 }]}>{grupo.DES_GRUPO}</Text>

                                            {grupo.Itens.map((item, index) => {
                                                return <CampoEstatico key={index} tipo={"dinheiro"} titulo={`${item.COD_LINHA} - ${item.DES_INFO_REND}`} valor={item.VAL_LINHA} />;
                                            })}
                                        </ElevatedView>
                                    );
                                })}
                            </View>
                        }

                        {this.state.datas.length === 0 &&
                            <ElevatedView elevation={1} style={{ padding: 10, marginBottom: 10 }}>
                                <Text style={{ color: Variables.colors.red, textAlign: "center" }}>Nenhum informe encontrado!</Text>
                            </ElevatedView>}
                            
                    </ScrollView>
                }
                
            </View>
        )
    }
}