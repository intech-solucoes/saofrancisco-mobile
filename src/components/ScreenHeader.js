import React, { Component } from 'react';
import { Text, View, Platform, StatusBar, StyleSheet, ToolbarAndroid, TouchableOpacity } from "react-native";
import { Variables } from "../styles";
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';


export default class ScreenHeader extends Component {
    render() {
        var routeIndex = this.props.navigation.state.index;
        var route = this.props.navigation.state.routes[routeIndex];
        const { descriptors } = this.props;
        const descriptor = descriptors[route.key];

        var openDrawer = routeIndex === 0;

        const onLeftPress = () => {
            if(openDrawer)
                this.props.navigation.openDrawer();
            else
                this.props.navigation.pop();
        }

        return (
            
            <View>
                { Platform.OS === 'android' && Platform.Version >= 20 ?
                    <View style={{ height: 24, backgroundColor: Variables.colors.primary }} />
                    : null }
                
                
                    <Header style={{backgroundColor: Variables.colors.primary}}> 
                        

                        <Left>
                            { openDrawer ? 
                                    null : 
                                        <TouchableOpacity onPress={() => this.props.navigation.pop() } style={{ padding: 10 }}> 
                                            <Icon name="arrow-back" style={{ color: 'white' }} /> 
                                        </TouchableOpacity>
                            }  
                        </Left> 
                        <Body>
                            <Text style={{ color:"white", fontWeight: 'bold' }} >{descriptor.options.title}</Text>
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
