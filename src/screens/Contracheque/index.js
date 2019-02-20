import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler, AsyncStorage, FlatList, TouchableHighlight } from "react-native";
import { TextMask } from "react-native-masked-text";

import Styles, { Variables } from "../../styles";
import { ScreenHeader, ElevatedView, Button, Loader } from "../../components";

import { FichaFinanceiraAssistidoService } from "@intechprev/prevsystem-service";

export default class Contracheque extends Component {

    static navigationOptions = {
        title: "Contracheque"
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            plano: 0,
            contracheques: []
        }
    }

    async componentDidMount() {
        await this.setState({ loading: true });

        await this.carregarPlano();
        await this.carregarContracheques();

        await this.setState({ loading: false });
    }

    async carregarPlano() {
        var plano = await AsyncStorage.getItem("plano");
        await this.setState({ plano });
    }

    async carregarContracheques() {
        var result = await FichaFinanceiraAssistidoService.BuscarDatasPorPlano(this.state.plano);
        await this.setState({ contracheques: result.data });
    }

    detalhar = (contracheque) => {
        this.props.navigation.navigate("ContrachequeDetalhe",
            {
                referencia: contracheque.DT_REFERENCIA,
                tipoFolha: contracheque.CD_TIPO_FOLHA
            })
    }

    render() {
        return (
            <View>
                <Loader loading={this.state.loading} />

                <ScrollView>
                    {this.state.contracheques.map((contracheque, index) => {
                        return (
                            <ElevatedView elevation={1} key={3} style={{ margin: 5, padding: 0 }}>
                                <TouchableHighlight underlayColor={Variables.colors.gray} style={{ padding: 15 }}
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
                                                <TextMask type={'money'} value={contracheque.VAL_BRUTO} style={{ fontSize: 11, color: Variables.colors.green, width: 60 }} />
                                            </View>

                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 11, marginRight: 10 }}>DESCONTOS:</Text>
                                                <TextMask type={'money'} value={contracheque.VAL_DESCONTOS} style={{ fontSize: 11, color: Variables.colors.red, width: 60 }} />
                                            </View>

                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 11, marginRight: 10 }}>LÍQUIDO:</Text>
                                                <TextMask type={'money'} value={contracheque.VAL_LIQUIDO} style={{ fontSize: 11, color: Variables.colors.blue, width: 60 }} />
                                            </View>
                                        </View>


                                    </View>

                                </TouchableHighlight>
                            </ElevatedView>
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
});