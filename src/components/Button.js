import React, { Component } from "react";
import { Text, View, TouchableHighlight } from "react-native";
import PropTypes from "prop-types";

import { Variables } from "../styles";

export default class Button extends Component {

    static propTypes = {
        title: PropTypes.string,
        subtitle: PropTypes.string,
        onClick: PropTypes.func,
        style: PropTypes.any,
        titleStyle: PropTypes.any,
        subtitleStyle: PropTypes.any
    }

    render() {
        return (
            <TouchableHighlight style={[Styles.button, this.props.style]} onPress={this.props.onClick } underlayColor={Variables.colors.primaryDark}>
                <View>
                    {this.props.title && 
                        <View style={Styles.buttonView}>
                            <Text style={[Styles.buttonText, this.props.titleStyle]}>{this.props.title}</Text>

                            {this.props.subtitle &&
                                <Text style={[Styles.buttonText, this.props.subtitleStyle]}>{this.props.subtitle}</Text>}
                        </View>
                    }

                    {this.props.children}
                </View>
            </TouchableHighlight>
        );
    }

}