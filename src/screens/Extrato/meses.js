import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler, AsyncStorage, FlatList, TouchableHighlight } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { TextMask } from "react-native-masked-text";

import Styles, { Variables } from "../../styles";
import { ScreenHeader, ElevatedView, Button } from "../../components";

import { FichaFinanceiraService } from "@intechprev/prevsystem-service";

export default class ExtratoMesesScreen extends Component {

    static navigationOptions = {
        title: "Extrato"
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            plano: 0,
            ano: 0,
            extrato: []
        }
    }

    async componentDidMount() {
        await this.setState({ loading: true });

        await this.carregarPlano();
        await this.carregarExtratoMeses();

        await this.setState({ loading: false });
    }

    async carregarPlano() {
        var plano = await AsyncStorage.getItem("plano");
        await this.setState({ plano });
    }

    async carregarExtratoMeses() {
        var ano = this.props.navigation.getParam("ano", "0");
        var result = await FichaFinanceiraService.BuscarResumoMesesPorPlanoAno(this.state.plano, ano);
        await this.setState({ extrato: result.data, ano });
    }

    detalhar = (item) => {
        this.props.navigation.navigate("ExtratoDetalhe", 
            { 
                ano: this.state.ano,
                mes: item.MES_REF
            })
    }

    render() {
        return (
            <View>
                <Spinner visible={this.state.loading} cancelable={true} />

                <ScrollView>
                    {this.state.extrato.map((item, index) => {
                        return (
                            <ElevatedView elevation={1} key={3} style={{ margin: 5, padding: 0 }}>
                                <TouchableHighlight underlayColor={Variables.colors.gray} style={{ padding: 15 }}
                                                    onPress={() => this.detalhar(item)}>
                                    
                                    <View style={{ alignContent: "center", flexDirection: "column" }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[Styles.h3, { color: Variables.colors.primary }]}>Referência: {item.MES_REF}/{this.state.ano}</Text>
                                        </View>
                                        
                                        <View style={{ alignContent: "center", flexDirection: "column" }}>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ fontSize: 11, marginRight: 5 }}>Contribuições Participante:</Text>
                                                    <TextMask type={'money'} value={item.CONTRIB_PARTICIPANTE} style={{ fontSize: 11, fontWeight: "bold" }} />
                                                </View>
                                                
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ fontSize: 11, marginRight: 5 }}>Contribuições Patrocinadora:</Text>
                                                    <TextMask type={'money'} value={item.CONTRIB_EMPRESA} style={{ fontSize: 11, fontWeight: "bold" }} />
                                                </View>
                                                
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ fontSize: 11, marginRight: 5 }}>Contribuições Total:</Text>
                                                    <TextMask type={'money'} value={item.TOTAL_CONTRIB} style={{ fontSize: 11, fontWeight: "bold" }} />
                                                </View>
                                                
                                                <View style={{ flexDirection: "row" }}>
                                                    <Text style={{ fontSize: 11, marginRight: 5 }}>Cotas Adquiridas:</Text>
                                                    <Text style={{ fontSize: 11, fontWeight: "bold" }}>{item.QTD_COTA}</Text>
                                                </View>
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