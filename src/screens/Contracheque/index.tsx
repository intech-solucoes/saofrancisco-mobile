import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler, AsyncStorage, FlatList, TouchableHighlight } from "react-native";
import { TextMask } from "react-native-masked-text";

import Styles, { Variables } from "../../styles";
import {Loader, Box } from "../../components";

import { ContrachequeService, PlanoService } from "@intechprev/prevsystem-service";
import { NavigationScreenProp } from 'react-navigation';

interface Props { 
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    plano: any;
    especies: Array<any>;
}

export class Contracheque extends Component<Props, State> {

    static navigationOptions = {
        title: "Contracheque"
    }

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            plano: null,
            especies: []
        }
    }

    componentDidMount = async () => {
        await this.setState({ loading: true });
        await this.carregarPlano();
        await this.buscarDatas();
        await this.setState({ loading: false });
    }

    carregarPlano = async () => {
        var cdPlano = await AsyncStorage.getItem("plano");
        var plano = await PlanoService.BuscarPorCodigo(cdPlano);
        await this.setState({ plano });
    }

    buscarDatas = async () => {
        var especies = await ContrachequeService.BuscarDatas(this.state.plano.CD_PLANO);
        await this.setState({ especies });
    }

    detalhar = (contracheque: any) => {
        this.props.navigation.navigate("ContrachequeDetalhe",
            {
                referencia: contracheque.DT_REFERENCIA,
                tipoFolha: contracheque.CD_TIPO_FOLHA
            });
    }

    render() {
        return (
            <ScrollView style={Styles.scrollContainer} contentContainerStyle={Styles.scrollContainerContent}>
                <Loader loading={this.state.loading} />

                {this.state.especies.length > 0 && 
                    <View>
                        {this.state.especies.map((especie: any, index: number) => {
                            return (
                                <Box key={index} titulo={especie.DS_ESPECIE}>

                                    {especie.Lista.map((contracheque: any, index2: number) => {
                                        return (
                                            <TouchableHighlight key={index2} underlayColor={Variables.colors.gray} style={{ padding: 15 }}
                                                onPress={() => this.detalhar(contracheque)}>

                                                <View style={{ alignContent: "center", flexDirection: "row" }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={[Styles.h3, { color: Variables.colors.primary }]}>{contracheque.DT_REFERENCIA}</Text>

                                                        {contracheque.IsAbonoAnual &&
                                                            <Text style={{ color: Variables.colors.green, padding: 5 }}>Abono Anual</Text>}
                                                    </View>

                                                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontSize: 11, marginRight: 10 }}>BRUTO:</Text>
                                                            <TextMask type={'money'} value={contracheque.VAL_BRUTO} style={{ fontSize: 11, color: Variables.colors.green, width: 80 }} />
                                                        </View>

                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontSize: 11, marginRight: 10 }}>DESCONTOS:</Text>
                                                            <TextMask type={'money'} value={contracheque.VAL_DESCONTOS} style={{ fontSize: 11, color: Variables.colors.red, width: 80 }} />
                                                        </View>

                                                        <View style={{ flexDirection: "row" }}>
                                                            <Text style={{ fontSize: 11, marginRight: 10 }}>LÍQUIDO:</Text>
                                                            <TextMask type={'money'} value={contracheque.VAL_LIQUIDO} style={{ fontSize: 11, color: Variables.colors.blue, width: 80 }} />
                                                        </View>
                                                    </View>


                                                </View>

                                            </TouchableHighlight>
                                        )
                                    })}

                                    {especie.Lista.length === 0 && 
                                        <Text>Nenhum contracheque disponível para este plano.</Text>
                                    }
                                </Box>
                            )
                        })}
                    </View>
                }
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
});