import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet, AsyncStorage, TouchableHighlight } from "react-native";

import Styles, { Variables } from "../../styles";
import { ElevatedView } from "../../components";
import { MensagemService } from "@intechprev/prevsystem-service";

const styles = StyleSheet.create({
    alertEmpty: {
        padding: 5,
        textAlignVertical: "center",
        fontSize: 18
    },
    messageTitle: {
        fontSize: 18
    }
})
export default class Mensagens extends Component {

    static navigationOptions = {
        title: "Mensagens"
    }
    
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            mensagens: []
        }
    }

    async componentDidMount() {
        try {
            await this.setState({ loading: true });

            var cdPlano = await AsyncStorage.getItem("plano");
            await this.setState({ cdPlano });

            var { data: mensagens } = await MensagemService.BuscarPorPlano(this.state.cdPlano);
            await this.setState({ mensagens: mensagens });
            
            await this.setState({ loading: false });
        } catch(err) {
            if(err.response)
                alert(err.response.data);
            else
                alert(err);
        } finally {
            await this.setState({ loading: false });
        }
    }

    acessarMensagem = (mensagem) => {
        this.props.navigation.navigate('Mensagem', {mensagem});
    }

    render() {
        return (
            <View>
                <ScrollView contentContainerStyle={Styles.scrollContainer}>

                        {this.state.mensagens.map((mensagem, index) => (
                                <View key={index}>
                                    <TouchableHighlight onPress={() => this.acessarMensagem(mensagem)} underlayColor={Variables.colors.gray}>
                                        <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10, flex: 1 }}>

                                            <View>
                                                <Text style={styles.messageTitle}>
                                                    {mensagem.TXT_TITULO}
                                                </Text>
                                                
                                                <Text style={{fontSize: 14}}>
                                                    {mensagem.DTA_MENSAGEM}
                                                </Text>

                                            </View>

                                        </ElevatedView>
                                    </TouchableHighlight>
                                </View>
                            )
                        )}
                        
                        {this.state.mensagens.length === 0 &&
                            <Text style={styles.alertEmpty}>Nenhuma mensagem enviada.</Text>
                        }

                </ScrollView>
            </View>
        );
    }
}
