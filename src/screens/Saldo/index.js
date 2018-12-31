import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler, AsyncStorage, FlatList, TouchableHighlight } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { TextMask } from "react-native-masked-text";

import Styles, { Variables } from "../../styles";
import { ScreenHeader, ElevatedView, Button } from "../../components";

import { FichaFinanceiraService, HistSaldoService } from "@intechprev/prevsystem-service";


export default class SaldoScreen extends Component {

    static navigationOptions = {
        title: "Seu Saldo"
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            plano: 0,
            assistido: {},
            saldo: []
        }
    }

    async componentDidMount() {
        await this.setState({ loading: true });

        await this.carregarPlano();
        await this.carregarSaldo();

        await this.setState({ loading: false });
    }

    async carregarPlano() {
        var plano = await AsyncStorage.getItem("plano");
        var assistido = await AsyncStorage.getItem("assistido");
        await this.setState({ 
            plano,
            assistido: assistido === "true"
        });
    }

    async carregarSaldo() {
        if(!this.state.assistido) {
            var result = await FichaFinanceiraService.BuscarUltimaPorPlano(this.state.plano);
            await this.setState({ saldo: result.data });
            console.warn(result)
        } else {
            var result = await HistSaldoService.BuscarPorPlano(this.state.plano);
            await this.setState({ saldo: result.data });
        }
    }

    render() {
        return (
            <View>
                <Spinner visible={this.state.loading} cancelable={true} />

                {!this.state.loading &&
                    <ScrollView>
                        <ElevatedView elevation={1} key={3} style={{ margin: 10, padding: 10 }}>

                            {!this.state.assistido && 
                                <View style={{ alignContent: "center", flexDirection: "column" }}>
                                
                                    <View style={{ flex: 1, alignItems: "center", marginBottom: 10 }}>
                                        <Text style={[Styles.h2, { color: Variables.colors.primary }]}>Saldo em {this.state.saldo.DataReferencia}</Text>
                                    </View>
                                    
                                    <View style={{ alignContent: "center", flexDirection: "column" }}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 13, marginRight: 5 }}>Cotas Participante:</Text>
                                                <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                                                    {this.state.saldo.QuantidadeCotasParticipante}
                                                </Text>
                                            </View>
                                            
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 13, marginRight: 5 }}>Valor em Reais:</Text>
                                                <TextMask type={'money'} value={this.state.saldo.ValorParticipante} style={{ fontSize: 13, fontWeight: "bold" }} />
                                            </View>
                                            
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 13, marginRight: 5 }}>Cotas Patrocinadora:</Text>
                                                <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                                                    {this.state.saldo.QuantidadeCotasPatrocinadora}
                                                </Text>
                                            </View>
                                            
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 13, marginRight: 5 }}>Valor em Reais:</Text>
                                                <TextMask type={'money'} value={this.state.saldo.ValorPatrocinadora} style={{ fontSize: 13, fontWeight: "bold" }} />
                                            </View>
                                        </View>
                                    </View>
                                
                                    <View style={{ flex: 1, marginTop: 10 }}>
                                        <Text style={[Styles.h3, { marginRight: 5 }]}>
                                            Total Constituído: 
                                        </Text>
                                        <TextMask type={'money'} value={this.state.saldo.ValorTotal} style={{ fontWeight: "bold", color: Variables.colors.primary }} />
                                    </View>
                                        
                                    
                                    <View style={{ flex: 1, marginTop: 10 }}>
                                        <Text style={[Styles.h3]}>
                                            Valor da cota em {this.state.saldo.DataCota}:
                                        </Text>
                                        <Text style={{ fontWeight: "bold", color: Variables.colors.primary }}>
                                            {this.state.saldo.ValorCota}
                                        </Text>
                                    </View>
                                </View>
                            }
                            
                            {this.state.assistido && 
                                
                                <View style={{ alignContent: "center", flexDirection: "column" }}>
                                
                                    <View style={{ flex: 1, alignItems: "center", marginBottom: 10 }}>
                                        <Text style={[Styles.h2, { color: Variables.colors.primary }]}>Saldo em {this.state.saldo.DT_REFERENCIA}</Text>
                                    </View>
                                    
                                    <View style={{ alignContent: "center", flexDirection: "column" }}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 13, marginRight: 5 }}>Cotas Participante:</Text>
                                                <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                                                    {this.state.saldo.TotalCotas}
                                                </Text>
                                            </View>
                                            
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 13, marginRight: 5 }}>Valor em Reais:</Text>
                                                <TextMask type={'money'} value={this.state.saldo.Valor} style={{ fontSize: 13, fontWeight: "bold" }} />
                                            </View>
                                            
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 13, marginRight: 5 }}>Parcela:</Text>
                                                <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                                                    {this.state.saldo.Parcela}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            }
                                
                        </ElevatedView>
                    </ScrollView>
                }
            </View>
        );
    }
};

const styles = StyleSheet.create({
});