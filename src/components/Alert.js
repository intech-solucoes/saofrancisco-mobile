import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal
} from 'react-native';
import { Button } from ".";
import { Variables } from '../styles';

export default class Alert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visivel: false,
            mensagem: ""
        };
    }

    fechar = async () => {
        await this.setState({ visivel: false });

        if(this.props.onClose)
            this.props.onClose();
    }

    mostrar = async (mensagem) => {
        await this.setState({ 
            mensagem: mensagem, 
            visivel: true
        });
    }

    render() {
    
        return (
            <Modal transparent={true}
                   animationType={"fade"}
                   visible={this.state.visivel}
                   onRequestClose={this.fechar}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text>{this.state.mensagem}</Text>
                        <Button title="Ok" onClick={this.fechar} style={Styles.modalButton} titleStyle={Styles.modalButtonText} />
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    modalContent: {
        margin: 20,
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});