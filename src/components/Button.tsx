import React from "react";
import { Text, View, TouchableHighlight } from "react-native";
import PropTypes from "prop-types";

import Styles, { Variables } from "../styles";

interface Props {
    title?: string;
    titleStyle?: any;

    subtitle?: string;
    subtitleStyle?: any;

    light?: boolean;
    style?: any;
    semEspaco?: boolean;
    desabilitado?: boolean;

    onClick: Function;
}

export default class Button extends React.Component<Props> {

    static propTypes = {
        title: PropTypes.string,
        subtitle: PropTypes.string,
        onClick: PropTypes.func,
        style: PropTypes.any,
        titleStyle: PropTypes.any,
        subtitleStyle: PropTypes.any,
        semEspaco: PropTypes.bool,
        desabilitado: PropTypes.bool
    }

    static defaultProps = {
        semEspaco: true,
        desabilitado: false,
        light: false
    }

    render() {
        var underlayColor = this.props.light ? "transparent" : Variables.colors.primaryDark;

        return (
            <TouchableHighlight
                onPress={() => this.props.onClick()} underlayColor={underlayColor} disabled={this.props.desabilitado}
                style={[
                    Styles.button,
                    {
                        marginBottom: this.props.semEspaco ? 0 : 15,
                        backgroundColor: (!this.props.light && this.props.desabilitado) ? Variables.colors.grayDark : Variables.colors.primary
                    },
                    this.props.style
                ]}
            >
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