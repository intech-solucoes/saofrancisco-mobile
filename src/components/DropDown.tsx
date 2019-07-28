import React from 'react';
import { TouchableOpacity } from "react-native";
import { Picker, Icon, Header, Left, Right, Body, Title } from "native-base";
import _ from "lodash";
import Styles, { Variables } from '../styles';

interface Props {
    prefixo?: string;
    sufixo?: string;
    textoVazio?: string;
    titulo?: string;
    valor: any;
    valorVazio?: any;
    onValueChange?: any;
    itens: any;
}

export default class DropDown extends React.Component<Props> {

    render() {
        var prefixo = this.props.prefixo ? this.props.prefixo : " ";
        var sufixo = this.props.sufixo ? this.props.sufixo : " ";

        if(this.props.textoVazio) {
            return (
                <Picker
                    renderHeader={backAction =>
                        <Header style={{ backgroundColor: Variables.colors.primary }}>
                            <Left>
                                <TouchableOpacity onPress={backAction}>
                                    <Icon name="arrow-back" style={{ color: "#fff" }} />
                                </TouchableOpacity>
                            </Left>
                            <Body style={{ flex: 3 }}>
                                <Title style={{ color: "#fff" }}>{this.props.titulo}</Title>
                            </Body>
                            <Right />
                        </Header>}
                    mode="dialog"
                    style={Styles.textInput}
                    selectedValue={this.props.valor} 
                    onValueChange={this.props.onValueChange}
                >
                    <Picker.Item label={this.props.textoVazio} value={this.props.valorVazio} />
        
                    {this.props.itens.map((item, index) => {
                        if(typeof(item) === "string" || typeof(item) === "number")
                            return <Picker.Item key={index} label={prefixo + item.toString() + sufixo} value={item} />
                        else
                            return <Picker.Item key={index} label={prefixo + item.titulo + sufixo} value={item.valor} />
                    })}
                </Picker>
            );
        } else {
            return (
                <Picker
                    renderHeader={backAction =>
                        <Header style={{ backgroundColor: Variables.colors.primary }}>
                            <Left>
                                <TouchableOpacity onPress={backAction}>
                                    <Icon name="arrow-back" style={{ color: "#fff" }} />
                                </TouchableOpacity>
                            </Left>
                            <Body style={{ flex: 3 }}>
                                <Title style={{ color: "#fff" }}>{this.props.titulo}</Title>
                            </Body>
                            <Right />
                        </Header>}
                    mode="dialog"
                    style={Styles.textInput}
                    selectedValue={this.props.valor} 
                    onValueChange={this.props.onValueChange}
                >
                    {this.props.itens.map((item, index) => {
                        if(typeof(item) === "string" || typeof(item) === "number")
                            return <Picker.Item key={index} label={prefixo + item.toString() + sufixo} value={item} />
                        else
                            return <Picker.Item key={index} label={prefixo + item.titulo + sufixo} value={item.valor} />
                    })}
                </Picker>
            );
        }
    }
    
}