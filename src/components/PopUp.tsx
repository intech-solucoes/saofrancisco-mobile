import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal
} from 'react-native';

interface Props {
    onClose?: Function;
}

interface State {
    visivel: boolean;
}

export default class PopUp extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            visivel: false
        };
    }

    fechar = async () => {
        await this.setState({ visivel: false });

        if(this.props.onClose)
            this.props.onClose();
    }

    mostrar = async () => {
        await this.setState({ 
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
                        {this.props.children}
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