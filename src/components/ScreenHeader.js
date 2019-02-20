import React, { Component } from 'react';
import { Text, View, Platform, StatusBar, TouchableOpacity } from "react-native";
import { Header, Left, Body, Right, Icon } from 'native-base';
import { Variables } from "../styles";

export default class ScreenHeader extends Component {
    render() {
        var routeIndex = this.props.navigation.state.index;
        var route = this.props.navigation.state.routes[routeIndex];
        const { descriptors } = this.props;
        const descriptor = descriptors[route.key];

        var openDrawer = routeIndex === 0;

        return (
            <View>
                { 
                    Platform.OS === 'android' && Platform.Version >= 20 ?
                    <View style={{ height: 24, backgroundColor: Variables.colors.primary }} />
                    : null 
                }

                <Header style={{backgroundColor: Variables.colors.primary}} noShadow={true}>
                    { 
                        openDrawer ? 
                        null : 
                        <Left>
                            <TouchableOpacity onPress={() => this.props.navigation.pop() } style={{ padding: 10 }}> 
                                <Icon name="arrow-back" style={{ color: 'white' }} /> 
                            </TouchableOpacity>
                        </Left>
                    }
                    <Body>
                        <Text style={{ color:"white", fontSize: 20, width: 200 }} >{descriptor.options.title}</Text>
                    </Body>
                    <Right>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer() } style={{ padding: 10 }}>
                            <Icon ios='ios-menu' android="md-menu" style={{ color: 'white' }} />
                        </TouchableOpacity>
                    </Right>
                </Header>  
                <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0.20)" animated />
            </View>
        );
    }
};