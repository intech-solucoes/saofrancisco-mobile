import React from "react";
import { ScrollView, Text, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";

import { Loader, Box, CampoEstatico } from "../../components";

import Styles, { Variables } from "../../styles";
import { PlanoService } from "@intechprev/prevsystem-service";
import { TipoCampoEstatico } from "../../components/CampoEstatico";

interface Props {}

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

        var extrato = await PlanoService.BuscarSaldado();

        this.setState({ 
            loading: false,
            extrato
        });
    }

    render() {
        return (
            <View>
                <Loader loading={this.state.loading} />

                {this.state.extrato &&
                    <View>
                        <Box>
                            <Text style={Styles.h2}>Plano SALDADO</Text>
                        </Box>

                        <Box>
                            <Text style={Styles.h3}>Extrato Acumulado</Text>
                            <Text style={{ marginBottom: 10 }}>Última Atualização: {this.state.extrato.DT_INIC_VALIDADE.substring(3)}</Text>
                            <CampoEstatico titulo={"Benefício Mensal Atualizado*"} valor={this.state.extrato.VL_BENEF_SALDADO_ATUAL} tipo={TipoCampoEstatico.dinheiro} />

                            <Text style={{ color: Variables.colors.red }}>* Haverá incidência de Imposto de Renda</Text>
                        </Box>
                    </View>
                }
            </View>
        );
    }
}