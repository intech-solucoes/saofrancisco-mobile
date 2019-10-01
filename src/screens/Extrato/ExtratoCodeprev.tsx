import React from "react";
import { Text, View } from "react-native";

import { Loader, Box, CampoEstatico } from "../../components";

import Styles, { Variables } from "../../styles";
import { PlanoService } from "@intechprev/prevsystem-service";
import { TipoCampoEstatico } from "../../components/CampoEstatico";
import { NavigationScreenProp } from "react-navigation";

interface Props {
    navigation: NavigationScreenProp<any, any>;
}

interface State {
    loading: boolean;
    extrato: any;
}

export default class ExtratoCodeprev extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            extrato: null
        }
    }

    componentDidMount = async() => {
        this.setState({ loading: true });

        var extrato = await PlanoService.ExtratoCodeprev();

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
                            <Text style={Styles.h2}>Plano CODEPREV</Text>
                        </Box>

                        <Box>
                            <Text style={Styles.h3}>Extrato Acumulado</Text>
                            <Text style={{ marginBottom: 10 }}>Último Fechamento: {this.state.extrato.Ultimofechamento}</Text>
                            <CampoEstatico titulo={"Quantidade de Cotas"} valor={this.state.extrato.QuantidadeCotas} />
                            <CampoEstatico titulo={"Cota Conversão"} valor={this.state.extrato.CotaConversao} />
                            <CampoEstatico titulo={"Valor Acumulado*"} valor={this.state.extrato.ValorAcumulado} tipo={TipoCampoEstatico.dinheiro} />

                            <Text style={{ color: Variables.colors.red }}>* Haverá incidência de Imposto de Renda</Text>
                        </Box>
                    </View>
                }
            </View>
        );
    }
}