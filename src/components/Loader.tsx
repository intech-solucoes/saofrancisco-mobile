import React from 'react';
import {
    StyleSheet,
    View,
    Modal,
    ActivityIndicator
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import Button from './Button';

import Styles, { Variables } from "../styles";

interface Props {
    loading: boolean;
    navigation: NavigationScreenProp<any, any>;
}

export class Loader extends React.Component<Props> {
    cancel = () => {
        this.props.navigation.pop();
    }

    render() {
        return (
            <Modal transparent={true}
                animationType={'fade'}
                visible={this.props.loading}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator animating={this.props.loading} />
                        <Button title={"Cancelar"} onClick={this.cancel} style={[Styles.modalButton, { margin: 30 }]} titleStyle={Styles.modalButtonText} />
                    </View>
                </View>
            </Modal>
        );
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
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 130,
        width: 130,
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default Loader;