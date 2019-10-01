import React from "react";
import { Text, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";

import { Loader, Box, CampoEstatico } from "../../components";

import Styles, { Variables } from "../../styles";
import { PlanoService } from "@intechprev/prevsystem-service";
import { TipoCampoEstatico } from "../../components/CampoEstatico";

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    extrato: any;
}

export default class ExtratoSaldado extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            extrato: null
        }
    }

    componentDidMount = async() => {
        this.setState({ loading: true });

        var extrato = await PlanoService.ExtratoSaldado();
        console.warn(extrato);
        this.setState({ 
            loading: false,
            extrato
        });
    }

    render() {
        return (
            <View>
                <Loader loading={this.state.loading} {...this.props} />

                {this.state.extrato &&
                    <View>
                        <Box>
                            <Text style={Styles.h2}>Plano SALDADO</Text>
                        </Box>

                        <Box>
                            <Text style={Styles.h3}>Extrato Acumulado</Text>
                            <Text style={{ marginBottom: 10 }}>Última Atualização: {this.state.extrato.DataConversao.substring(3)}</Text>
                            <CampoEstatico titulo={"Saldo Resgatável*"} valor={this.state.extrato.ValorBruto} tipo={TipoCampoEstatico.dinheiro} />

                            <Text style={{ color: Variables.colors.red }}>* Haverá incidência de Imposto de Renda</Text>
                        </Box>
                    </View>
                }
            </View>
        );
    }
}