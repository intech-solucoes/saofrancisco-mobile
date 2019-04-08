import React, { Component } from 'react';

import { Text, View, ScrollView, StyleSheet, BackHandler, AsyncStorage } from "react-native";
import Styles, { Variables } from "../../styles";
import { ElevatedView, CampoEstatico, Loader } from "../../components";

const styles = StyleSheet.create({ 
    line: { 
        borderBottomColor: Variables.colors.gray, 
        borderBottomWidth: 1, 
        marginBottom: 8, 
        marginTop: 8
    },
    message: {
        textAlign: "justify",
        lineHeight: 25,
        fontSize: 15
    }
})

export default class Mensagem extends Component {

    static navigationOptions = {
        title: "Mensagem"
    } 

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            mensagem: {}
        }
    }

    async componentDidMount() {
        try {
            await this.setState({ loading: true });
    
            await this.carregarMensagem();
            
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

    carregarMensagem = async () => { 
        var mensagem = this.props.navigation.getParam("mensagem", {});
        await this.setState({ mensagem: mensagem });
    } 

    render() {
        return (
            <View>
                <Loader loading={this.state.loading} />
                <ScrollView contentContainerStyle={Styles.scrollContainer}>
                    <ElevatedView elevation={3} style={{ padding: 10, marginBottom: 10, flex: 1 }}>

                        <View style={{flexDirection: 'row'}}>
                            <Text style={[Styles.h2, { marginBottom: 5 }]}>{this.state.mensagem.TXT_TITULO}</Text>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontWeight: "bold", marginBottom: 3}}>Data de Criação: </Text>
                            <Text>{this.state.mensagem.DTA_MENSAGEM}</Text>
                        </View>

                        <View style={styles.line} />

                        <Text style={styles.message}>{this.state.mensagem.TXT_CORPO}</Text>
                    </ElevatedView>
                </ScrollView>
            </View>
        );
    }
} 

